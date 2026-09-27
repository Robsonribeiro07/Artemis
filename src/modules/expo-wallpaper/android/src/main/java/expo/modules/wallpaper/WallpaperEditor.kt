package expo.modules.wallpaper

import android.app.Activity
import android.app.WallpaperManager
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build

/**
 * Abre o editor nativo do Android sem degradar desnecessariamente o wallpaper.
 *
 * Regra principal:
 * - se a imagem original já é válida, ela é passada diretamente ao editor;
 * - não reduzimos 1080x2400 para 921x2048;
 * - não convertemos WebP/PNG para JPEG sem necessidade;
 * - o próprio editor nativo fica responsável pelo enquadramento/crop.
 */
class WallpaperEditor(
    private val context: Context
) {

    fun open(
        activity: Activity,
        sourceUri: Uri
    ): Uri {
        requireSupportedAndroid()

        val wallpaperUri = prepareForEditor(sourceUri)
        validateWallpaperUri(wallpaperUri)
        openSystemWallpaperEditor(activity, wallpaperUri)

        return wallpaperUri
    }

    fun prepareForCurrentScreen(
        sourceUri: Uri
    ): Uri {
        requireSupportedAndroid()

        val uri = prepareForEditor(sourceUri)
        validateWallpaperUri(uri)
        return uri
    }

    private fun requireSupportedAndroid() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            throw Exception(
                "O editor nativo de wallpaper requer Android 4.4 ou superior."
            )
        }
    }

    /**
     * Valida a imagem, mas NÃO cria uma cópia redimensionada.
     *
     * Antes, uma imagem como 1080x2400 podia virar 921x2048 porque
     * displayMetrics.widthPixels/heightPixels eram usados como alvo.
     * Depois o Android precisava ampliar novamente essa cópia menor.
     *
     * Agora preservamos os pixels do arquivo original e deixamos o editor
     * nativo cuidar do crop/enquadramento.
     */
    private fun prepareForEditor(
        sourceUri: Uri
    ): Uri {
        if (sourceUri.scheme != "content") {
            throw Exception(
                "O wallpaper precisa usar uma URI content://."
            )
        }

        val mimeType = context.contentResolver.getType(sourceUri)

        if (mimeType == null || !mimeType.startsWith("image/")) {
            throw Exception(
                "O ContentProvider retornou MIME inválido para o wallpaper: " +
                    (mimeType ?: "null")
            )
        }

        val bounds = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }

        context.contentResolver.openInputStream(sourceUri).use { input ->
            if (input == null) {
                throw Exception("Não foi possível abrir a imagem.")
            }

            BitmapFactory.decodeStream(input, null, bounds)
        }

        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
            throw Exception(
                "Não foi possível identificar as dimensões da imagem."
            )
        }

        return sourceUri
    }

    private fun openSystemWallpaperEditor(
        activity: Activity,
        imageUri: Uri
    ) {
        val wallpaperManager = WallpaperManager.getInstance(context)

        val intent = try {
            wallpaperManager.getCropAndSetWallpaperIntent(imageUri)
        } catch (error: IllegalArgumentException) {
            createExplicitCropIntent(imageUri)
                ?: throw Exception(
                    "Não foi possível abrir o editor nativo de wallpaper: " +
                        (error.message ?: "nenhum editor compatível foi encontrado.")
                )
        }

        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        intent.clipData = ClipData.newRawUri("wallpaper", imageUri)

        try {
            activity.startActivity(intent)
        } catch (_: ActivityNotFoundException) {
            throw Exception(
                "Nenhum editor nativo de wallpaper está disponível neste aparelho."
            )
        } catch (_: SecurityException) {
            throw Exception(
                "O editor não recebeu permissão para ler o wallpaper preparado."
            )
        }
    }

    private fun createExplicitCropIntent(
        imageUri: Uri
    ): Intent? {
        val intent = Intent(
            WallpaperManager.ACTION_CROP_AND_SET_WALLPAPER
        ).apply {
            setDataAndType(imageUri, "image/*")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            clipData = ClipData.newRawUri("wallpaper", imageUri)
        }

        val activities = context.packageManager.queryIntentActivities(
            intent,
            0
        )

        return if (activities.isNotEmpty()) intent else null
    }

    private fun validateWallpaperUri(
        uri: Uri
    ) {
        if (uri.scheme != "content") {
            throw Exception(
                "O wallpaper preparado precisa usar uma URI content://."
            )
        }

        val mimeType = context.contentResolver.getType(uri)

        if (mimeType == null || !mimeType.startsWith("image/")) {
            throw Exception(
                "O ContentProvider retornou MIME inválido para o wallpaper: " +
                    (mimeType ?: "null")
            )
        }

        context.contentResolver.openInputStream(uri).use { input ->
            if (input == null) {
                throw Exception(
                    "Não foi possível ler o wallpaper preparado pelo ContentProvider."
                )
            }
        }
    }
}
