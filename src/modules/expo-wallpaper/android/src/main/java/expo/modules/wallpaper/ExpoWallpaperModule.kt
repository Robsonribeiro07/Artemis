package expo.modules.wallpaper

import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWallpaperModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("ExpoWallpaper")

    Events(
      "onDownloadProgress",
      "onDownloadComplete"
    )

    AsyncFunction("downloadWallpaper") { imageUrl: String ->
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      WallpaperDownloader(
        context = context,
        cache = WallpaperCache(context)
      ) { event, payload ->
        sendEvent(event, payload)
      }.download(imageUrl).toMap()
    }

    AsyncFunction("openWallpaperEditor") { uriString: String ->
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      val activity = appContext.currentActivity
        ?: throw Exception("Activity não disponível.")

      val uri = parseContentUri(uriString)

      WallpaperEditor(context)
        .open(activity, uri)
        .toString()
    }

    AsyncFunction("getDownloadedWallpapers") {
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      WallpaperCache(context)
        .list()
        .map { it.toMap() }
    }

    AsyncFunction("getDownloadedWallpaper") { imageUrl: String ->
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      WallpaperCache(context)
        .find(imageUrl)
        ?.toMap()
    }

    AsyncFunction("isWallpaperDownloaded") { imageUrl: String ->
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      WallpaperCache(context)
        .find(imageUrl) != null
    }

    AsyncFunction("openWallpaperPicker") { imageUrl: String ->
      val context = appContext.reactContext
        ?: throw Exception("Contexto do React Native não disponível.")

      val activity = appContext.currentActivity
        ?: throw Exception("Activity não disponível.")

      val downloader = WallpaperDownloader(
        context = context,
        cache = WallpaperCache(context)
      ) { event, payload ->
        sendEvent(event, payload)
      }

      val result = downloader.download(imageUrl)

      val editorUri = WallpaperEditor(context)
        .open(
          activity,
          parseContentUri(result.uri)
        )

      mapOf(
        "success" to result.success,
        "id" to result.id,
        "sourceUrl" to result.sourceUrl,
        "uri" to result.uri,
        "fileName" to result.fileName,
        "mimeType" to result.mimeType,
        "downloadedBytes" to result.downloadedBytes,
        "totalBytes" to result.totalBytes,
        "fromCache" to result.fromCache,
        "createdAt" to result.createdAt,
        "editorUri" to editorUri.toString()
      )
    }
  }

  private fun parseContentUri(uriString: String): Uri {
    val uri = Uri.parse(uriString)

    if (uri.scheme != "content") {
      throw Exception(
        "A URI do wallpaper precisa usar o esquema content://"
      )
    }

    return uri
  }
}