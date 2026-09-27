package expo.modules.wallpaper

import android.content.Context
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

object WallpaperFileProvider {

    private const val AUTHORITY_SUFFIX =
        ".expo-wallpaper.fileprovider"

    fun authority(
        context: Context
    ): String {
        return "${context.packageName}$AUTHORITY_SUFFIX"
    }

    fun uri(
        context: Context,
        file: File
    ): Uri {
        return FileProvider.getUriForFile(
            context,
            authority(context),
            file
        )
    }
}