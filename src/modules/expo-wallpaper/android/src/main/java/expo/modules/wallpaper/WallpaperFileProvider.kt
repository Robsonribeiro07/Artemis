package expo.modules.wallpaper

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.MimeTypeMap
import androidx.core.content.FileProvider
import java.io.File

class WallpaperFileProvider : FileProvider() {

    override fun getType(uri: Uri): String? {
        return mimeTypeForUri(uri) ?: super.getType(uri)
    }


    private fun mimeTypeForUri(uri: Uri): String? {
        val path = uri.path ?: return null
        val extension = path.substringAfterLast('.', "").lowercase()
        return when (extension) {
            "jpg", "jpeg" -> "image/jpeg"
            "png" -> "image/png"
            "webp" -> "image/webp"
            "gif" -> "image/gif"
            "avif" -> "image/avif"
            "bmp" -> "image/bmp"
            else -> MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
        }
    }

    companion object {
        private const val AUTHORITY_SUFFIX = ".expo-wallpaper.fileprovider"

        fun authority(context: Context): String {
            return "${context.packageName}$AUTHORITY_SUFFIX"
        }

        fun uri(context: Context, file: File): Uri {
            return FileProvider.getUriForFile(
                context,
                authority(context),
                file
            )
        }
    }
}
