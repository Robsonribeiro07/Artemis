package expo.modules.wallpaper

import android.app.Activity
import android.app.WallpaperManager
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import android.os.Build
import java.io.File
import kotlin.math.roundToInt

class WallpaperEditor(
    private val context: Context
) {

    companion object {

        private const val OUTPUT_SUFFIX = "_screen_fit.jpg"

        private const val MAX_WIDTH = 1440
        private const val MAX_HEIGHT = 3200

        private const val JPEG_QUALITY = 95
    }

    /**
     * Prepara a imagem e aplica diretamente como wallpaper.
     *
     * Mantém a proporção da imagem.
     *
     * A imagem é cortada somente quando necessário
     * para preencher completamente a tela.
     */
    fun open(
        activity: Activity,
        sourceUri: Uri
    ): Uri {

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            throw Exception(
                "O Android 7.0 ou superior é necessário."
            )
        }

        val wallpaperUri =
            prepareScreenFitImage(sourceUri)

        applyWallpaper(
            wallpaperUri
        )

        return wallpaperUri
    }

    /**
     * ================================================================
     * PREPARAR IMAGEM
     * ================================================================
     */
    private fun prepareScreenFitImage(
        sourceUri: Uri
    ): Uri {

        val directory =
            File(
                context.filesDir,
                "wallpapers"
            )

        if (
            !directory.exists() &&
            !directory.mkdirs()
        ) {
            throw Exception(
                "Não foi possível criar o diretório de wallpapers."
            )
        }

        /*
         * ============================================================
         * TAMANHO REAL DA TELA
         * ============================================================
         */

        val metrics =
            context.resources.displayMetrics

        val screenWidth =
            metrics.widthPixels
                .coerceAtLeast(1)

        val screenHeight =
            metrics.heightPixels
                .coerceAtLeast(1)

        /*
         * Limita apenas telas absurdamente grandes.
         *
         * Não reduz uma tela normal.
         */

        val screenScale =
            minOf(
                MAX_WIDTH.toFloat() /
                    screenWidth.toFloat(),

                MAX_HEIGHT.toFloat() /
                    screenHeight.toFloat(),

                1f
            )

        val targetWidth =
            (
                screenWidth * screenScale
            )
                .roundToInt()
                .coerceAtLeast(1)

        val targetHeight =
            (
                screenHeight * screenScale
            )
                .roundToInt()
                .coerceAtLeast(1)

        /*
         * ============================================================
         * ID DO ARQUIVO
         * ============================================================
         */

        val outputId =
            sha256(
                sourceUri.toString() +
                    "_screen_fit_" +
                    targetWidth +
                    "x" +
                    targetHeight
            )

        val outputFile =
            File(
                directory,
                "$outputId$OUTPUT_SUFFIX"
            )

        /*
         * Reutiliza arquivo já preparado.
         */

        if (
            outputFile.exists() &&
            outputFile.length() > 0L
        ) {
            return WallpaperFileProvider.uri(
                context,
                outputFile
            )
        }

        /*
         * ============================================================
         * DESCOBRIR TAMANHO ORIGINAL
         * ============================================================
         */

        val bounds =
            BitmapFactory.Options().apply {
                inJustDecodeBounds = true
            }

        context.contentResolver
            .openInputStream(sourceUri)
            .use { input ->

                if (input == null) {
                    throw Exception(
                        "Não foi possível abrir a imagem."
                    )
                }

                BitmapFactory.decodeStream(
                    input,
                    null,
                    bounds
                )
            }

        val originalWidth =
            bounds.outWidth

        val originalHeight =
            bounds.outHeight

        if (
            originalWidth <= 0 ||
            originalHeight <= 0
        ) {
            throw Exception(
                "Não foi possível identificar as dimensões da imagem."
            )
        }

        /*
         * ============================================================
         * DECODIFICAR IMAGEM
         * ============================================================
         *
         * Para aplicação do wallpaper priorizamos qualidade.
         *
         * Não usamos inSampleSize para evitar upscale
         * de uma imagem previamente reduzida.
         */

        val options =
            BitmapFactory.Options().apply {
                inPreferredConfig =
                    Bitmap.Config.ARGB_8888
            }

        val sourceBitmap =
            context.contentResolver
                .openInputStream(sourceUri)
                .use { input ->

                    if (input == null) {
                        throw Exception(
                            "Não foi possível abrir a imagem."
                        )
                    }

                    BitmapFactory.decodeStream(
                        input,
                        null,
                        options
                    )
                }
                ?: throw Exception(
                    "Não foi possível decodificar a imagem."
                )

        try {

            /*
             * ========================================================
             * PREPARAR PARA A TELA
             * ========================================================
             */

            val fittedBitmap =
                createCenterCrop(
                    sourceBitmap,
                    targetWidth,
                    targetHeight
                )

            try {

                /*
                 * ====================================================
                 * SALVAR
                 * ====================================================
                 */

                outputFile
                    .outputStream()
                    .use { output ->

                        val success =
                            fittedBitmap.compress(
                                Bitmap.CompressFormat.JPEG,
                                JPEG_QUALITY,
                                output
                            )

                        if (!success) {
                            throw Exception(
                                "Não foi possível salvar o wallpaper."
                            )
                        }
                    }

            } catch (error: Exception) {

                try {
                    outputFile.delete()
                } catch (_: Exception) {
                }

                throw error

            } finally {

                if (
                    fittedBitmap !== sourceBitmap &&
                    !fittedBitmap.isRecycled
                ) {
                    fittedBitmap.recycle()
                }
            }

        } finally {

            if (!sourceBitmap.isRecycled) {
                sourceBitmap.recycle()
            }
        }

        /*
         * ============================================================
         * VALIDAR
         * ============================================================
         */

        if (
            !outputFile.exists() ||
            outputFile.length() <= 0L
        ) {
            throw Exception(
                "O wallpaper preparado não foi criado corretamente."
            )
        }

        /*
         * Verifica dimensões finais.
         */

        val finalBounds =
            BitmapFactory.Options().apply {
                inJustDecodeBounds = true
            }

        BitmapFactory.decodeFile(
            outputFile.absolutePath,
            finalBounds
        )

        if (
            finalBounds.outWidth != targetWidth ||
            finalBounds.outHeight != targetHeight
        ) {

            outputFile.delete()

            throw Exception(
                "Dimensões finais inválidas. " +
                    "Esperado ${targetWidth}x${targetHeight}, " +
                    "obtido ${finalBounds.outWidth}x${finalBounds.outHeight}."
            )
        }

        return WallpaperFileProvider.uri(
            context,
            outputFile
        )
    }

    /**
     * ================================================================
     * CENTER CROP
     * ================================================================
     *
     * Mantém a proporção.
     *
     * Preenche 100% da tela.
     *
     * Corta somente o excesso necessário.
     *
     * Não deforma a imagem.
     */
    private fun createCenterCrop(
        source: Bitmap,
        targetWidth: Int,
        targetHeight: Int
    ): Bitmap {

        val sourceWidth =
            source.width

        val sourceHeight =
            source.height

        if (
            sourceWidth == targetWidth &&
            sourceHeight == targetHeight
        ) {
            return source
        }

        /*
         * ============================================================
         * ESCALA
         * ============================================================
         *
         * Usamos MAX para garantir que os dois lados
         * preencham completamente o destino.
         */

        val scale =
            maxOf(
                targetWidth.toFloat() /
                    sourceWidth.toFloat(),

                targetHeight.toFloat() /
                    sourceHeight.toFloat()
            )

        val scaledWidth =
            (
                sourceWidth * scale
            )
                .roundToInt()
                .coerceAtLeast(targetWidth)

        val scaledHeight =
            (
                sourceHeight * scale
            )
                .roundToInt()
                .coerceAtLeast(targetHeight)

        /*
         * ============================================================
         * RESIZE
         * ============================================================
         */

        val scaled =
            Bitmap.createScaledBitmap(
                source,
                scaledWidth,
                scaledHeight,
                true
            )

        /*
         * ============================================================
         * CROP CENTRAL
         * ============================================================
         */

        val left =
            ((scaledWidth - targetWidth) / 2)
                .coerceAtLeast(0)

        val top =
            ((scaledHeight - targetHeight) / 2)
                .coerceAtLeast(0)

        val cropped =
            Bitmap.createBitmap(
                scaled,
                left,
                top,
                targetWidth,
                targetHeight
            )

        /*
         * scaled não é mais necessário.
         */

        if (
            cropped !== scaled &&
            !scaled.isRecycled
        ) {
            scaled.recycle()
        }

        return cropped
    }

    /**
     * ================================================================
     * APLICAR WALLPAPER
     * ================================================================
     */
    private fun applyWallpaper(
        uri: Uri
    ) {

        val wallpaperManager =
            WallpaperManager.getInstance(
                context
            )

        val resolver =
            context.contentResolver

        resolver
            .openInputStream(uri)
            .use { input ->

                if (input == null) {
                    throw Exception(
                        "Não foi possível abrir o wallpaper preparado."
                    )
                }

                if (
                    Build.VERSION.SDK_INT >=
                    Build.VERSION_CODES.N
                ) {

                    wallpaperManager.setStream(
                        input,
                        null,
                        true,
                        WallpaperManager.FLAG_SYSTEM or
                            WallpaperManager.FLAG_LOCK
                    )

                } else {

                    wallpaperManager.setStream(
                        input
                    )
                }
            }
    }

    /**
     * ================================================================
     * SHA-256
     * ================================================================
     */
    private fun sha256(
        value: String
    ): String {

        val digest =
            java.security.MessageDigest
                .getInstance("SHA-256")

        val bytes =
            digest.digest(
                value.toByteArray(
                    Charsets.UTF_8
                )
            )

        return bytes.joinToString("") {
            "%02x".format(it)
        }
    }
}