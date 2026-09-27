package expo.modules.wallpaper

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

data class WallpaperOptimizationResult(
    val file: File,
    val mimeType: String,
    val changed: Boolean,
    val originalWidth: Int,
    val originalHeight: Int,
    val finalWidth: Int,
    val finalHeight: Int
)

object WallpaperResizer {

    private const val TAG = "WallpaperResizer"

    private const val MAX_WIDTH = 1440
    private const val MAX_HEIGHT = 3200

    private const val JPEG_QUALITY = 95
    private const val PNG_QUALITY = 100
    private const val WEBP_QUALITY = 95

    fun optimize(
        inputFile: File,
        mimeType: String
    ): WallpaperOptimizationResult {

        if (!inputFile.exists() || inputFile.length() <= 0L) {
            throw Exception("Arquivo do wallpaper inválido.")
        }

        Log.d(
            TAG,
            "INICIANDO resize: ${inputFile.name} | " +
                "tamanho=${inputFile.length()} bytes | mime=$mimeType"
        )

        /*
         * ============================================================
         * DESCOBRIR DIMENSÕES
         * ============================================================
         */

        val bounds = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }

        BitmapFactory.decodeFile(
            inputFile.absolutePath,
            bounds
        )

        val originalWidth = bounds.outWidth
        val originalHeight = bounds.outHeight

        Log.d(
            TAG,
            "Dimensões originais: ${originalWidth}x${originalHeight}"
        )

        if (originalWidth <= 0 || originalHeight <= 0) {
            throw Exception(
                "Não foi possível identificar as dimensões do wallpaper."
            )
        }

        /*
         * ============================================================
         * VERIFICAR SE PRECISA REDIMENSIONAR
         * ============================================================
         */

        if (
            originalWidth <= MAX_WIDTH &&
            originalHeight <= MAX_HEIGHT
        ) {

            Log.d(
                TAG,
                "Resize NÃO necessário: " +
                    "${originalWidth}x${originalHeight} <= " +
                    "${MAX_WIDTH}x${MAX_HEIGHT}"
            )

            return WallpaperOptimizationResult(
                file = inputFile,
                mimeType = mimeType,
                changed = false,
                originalWidth = originalWidth,
                originalHeight = originalHeight,
                finalWidth = originalWidth,
                finalHeight = originalHeight
            )
        }

        /*
         * ============================================================
         * CALCULAR TAMANHO FINAL
         * ============================================================
         *
         * Mantém a proporção original.
         *
         * Nunca aumenta a imagem.
         */

        val scale = minOf(
            MAX_WIDTH.toFloat() / originalWidth,
            MAX_HEIGHT.toFloat() / originalHeight,
            1f
        )

        val targetWidth =
            (originalWidth * scale)
                .roundToInt()
                .coerceAtLeast(1)

        val targetHeight =
            (originalHeight * scale)
                .roundToInt()
                .coerceAtLeast(1)

        Log.d(
            TAG,
            "Resize: " +
                "${originalWidth}x${originalHeight} -> " +
                "${targetWidth}x${targetHeight}"
        )

        /*
         * ============================================================
         * DECODIFICAR ORIGINAL
         * ============================================================
         *
         * IMPORTANTE:
         *
         * Não usamos inSampleSize aqui.
         *
         * Isso evita:
         *
         * imagem grande
         *      ↓
         * imagem pequena
         *      ↓
         * upscale
         *      ↓
         * perda de qualidade
         */

        val options = BitmapFactory.Options().apply {
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }

        val decoded = BitmapFactory.decodeFile(
            inputFile.absolutePath,
            options
        ) ?: throw Exception(
            "Não foi possível decodificar o wallpaper."
        )

        Log.d(
            TAG,
            "Imagem decodificada: " +
                "${decoded.width}x${decoded.height}"
        )

        /*
         * ============================================================
         * RESIZE
         * ============================================================
         */

        val resized =
            if (
                decoded.width == targetWidth &&
                decoded.height == targetHeight
            ) {
                decoded
            } else {

                Bitmap.createScaledBitmap(
                    decoded,
                    targetWidth,
                    targetHeight,
                    true
                ).also {

                    if (it !== decoded) {
                        decoded.recycle()
                    }
                }
            }

        Log.d(
            TAG,
            "Bitmap final: " +
                "${resized.width}x${resized.height}"
        )

        /*
         * ============================================================
         * FORMATO
         * ============================================================
         */

        val format =
            when {
                mimeType.equals(
                    "image/png",
                    ignoreCase = true
                ) ->
                    Bitmap.CompressFormat.PNG

                mimeType.equals(
                    "image/webp",
                    ignoreCase = true
                ) ->
                    Bitmap.CompressFormat.WEBP

                else ->
                    Bitmap.CompressFormat.JPEG
            }

        val quality =
            when (format) {
                Bitmap.CompressFormat.PNG ->
                    PNG_QUALITY

                Bitmap.CompressFormat.WEBP ->
                    WEBP_QUALITY

                else ->
                    JPEG_QUALITY
            }

        /*
         * ============================================================
         * ARQUIVOS TEMPORÁRIOS
         * ============================================================
         */

        val tempFile = File(
            inputFile.parentFile,
            ".${inputFile.name}.resize.part"
        )

        val backupFile = File(
            inputFile.parentFile,
            ".${inputFile.name}.resize.backup"
        )

        try {

            FileOutputStream(tempFile).use { output ->

                val compressed = resized.compress(
                    format,
                    quality,
                    output
                )

                if (!compressed) {
                    throw Exception(
                        "Falha ao comprimir o wallpaper."
                    )
                }
            }

        } finally {

            if (!resized.isRecycled) {
                resized.recycle()
            }
        }

        /*
         * ============================================================
         * VALIDAR TEMPORÁRIO
         * ============================================================
         */

        if (
            !tempFile.exists() ||
            tempFile.length() <= 0L
        ) {

            tempFile.delete()

            throw Exception(
                "O arquivo otimizado não foi criado."
            )
        }

        Log.d(
            TAG,
            "Arquivo temporário criado: " +
                "${tempFile.length()} bytes"
        )

        /*
         * ============================================================
         * BACKUP
         * ============================================================
         */

        if (backupFile.exists()) {
            backupFile.delete()
        }

        if (!inputFile.renameTo(backupFile)) {

            tempFile.delete()

            throw Exception(
                "Não foi possível mover o arquivo original para backup."
            )
        }

        /*
         * ============================================================
         * SUBSTITUIR ORIGINAL
         * ============================================================
         */

        try {

            if (!tempFile.renameTo(inputFile)) {

                Log.e(
                    TAG,
                    "Não foi possível substituir o arquivo original."
                )

                backupFile.renameTo(inputFile)

                throw Exception(
                    "Não foi possível substituir o wallpaper original."
                )
            }

            /*
             * Backup não é mais necessário.
             */

            backupFile.delete()

        } catch (error: Exception) {

            if (
                !inputFile.exists() &&
                backupFile.exists()
            ) {
                backupFile.renameTo(inputFile)
            }

            tempFile.delete()

            throw error
        }

        /*
         * ============================================================
         * VALIDAR ARQUIVO FINAL
         * ============================================================
         */

        val finalBounds = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }

        BitmapFactory.decodeFile(
            inputFile.absolutePath,
            finalBounds
        )

        val finalWidth = finalBounds.outWidth
        val finalHeight = finalBounds.outHeight

        Log.d(
            TAG,
            "RESULTADO FINAL: " +
                "${finalWidth}x${finalHeight} | " +
                "arquivo=${inputFile.length()} bytes"
        )

        if (
            finalWidth != targetWidth ||
            finalHeight != targetHeight
        ) {

            throw Exception(
                "Resize falhou. Esperado " +
                    "${targetWidth}x${targetHeight}, " +
                    "obtido ${finalWidth}x${finalHeight}."
            )
        }

        return WallpaperOptimizationResult(
            file = inputFile,
            mimeType = mimeType,
            changed = true,
            originalWidth = originalWidth,
            originalHeight = originalHeight,
            finalWidth = finalWidth,
            finalHeight = finalHeight
        )
    }
}