package expo.modules.wallpaper

import android.content.Context
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

object WallpaperFileProvider {

    fun uri(
        context: Context,
        file: File
    ): Uri {
        val authority =
            "${context.packageName}.expo-wallpaper.fileprovider"

        return FileProvider.getUriForFile(
            context,
            authority,
            file
        )
    }
}