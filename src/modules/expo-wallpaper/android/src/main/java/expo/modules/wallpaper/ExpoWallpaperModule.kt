package expo.modules.wallpaper

import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWallpaperModule : Module() {

    override fun definition() =
        ModuleDefinition {

            Name("ExpoWallpaper")

            Events(
                "onDownloadProgress",
                "onDownloadComplete"
            )

            // ---------------------------------------------
            // DOWNLOAD
            // ---------------------------------------------

            AsyncFunction(
                "downloadWallpaper"
            ) { imageUrl: String ->

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                val cache =
                    WallpaperCache(context)

                var pendingComplete:
                    Map<String, Any?>? = null

                val downloader =
                    WallpaperDownloader(
                        context = context,
                        cache = cache
                    ) { event, payload ->

                        if (
                            event ==
                            "onDownloadComplete"
                        ) {
                            // Guarda o evento.
                            // Só enviaremos depois que o resize acabar.
                            pendingComplete = payload
                        } else {
                            sendEvent(
                                event,
                                payload
                            )
                        }
                    }

                // -----------------------------------------
                // Download
                // -----------------------------------------

                val result =
                    downloader.download(
                        imageUrl
                    )

                if (!result.success) {
                    throw Exception(
                        "Não foi possível baixar o wallpaper."
                    )
                }

                // -----------------------------------------
                // Resize / migração do cache
                // -----------------------------------------

                val optimized =
                    cache.ensureOptimized(
                        imageUrl
                    ) ?: throw Exception(
                        "O wallpaper foi baixado, mas não foi encontrado no cache."
                    )

                // -----------------------------------------
                // Agora sim download está concluído
                // -----------------------------------------

                sendEvent(
                    "onDownloadComplete",
                    mapOf(
                        "id" to optimized.id,
                        "sourceUrl" to optimized.sourceUrl,
                        "uri" to optimized.uri,
                        "fileName" to optimized.fileName,
                        "mimeType" to optimized.mimeType,
                        "downloadedBytes" to result.downloadedBytes,
                        "totalBytes" to result.totalBytes,
                        "fromCache" to result.fromCache,
                        "optimized" to optimized.optimized
                    )
                )

                // -----------------------------------------
                // Retorno
                // -----------------------------------------

                mapOf(
                    "success" to result.success,
                    "id" to optimized.id,
                    "sourceUrl" to optimized.sourceUrl,
                    "uri" to optimized.uri,
                    "fileName" to optimized.fileName,
                    "mimeType" to optimized.mimeType,
                    "downloadedBytes" to result.downloadedBytes,
                    "totalBytes" to result.totalBytes,
                    "fromCache" to result.fromCache,
                    "createdAt" to optimized.createdAt,
                    "optimized" to optimized.optimized
                )
            }

            // ---------------------------------------------
            // OPEN EDITOR
            // ---------------------------------------------

            AsyncFunction(
                "openWallpaperEditor"
            ) { uriString: String ->

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                val activity =
                    appContext.currentActivity
                        ?: throw Exception(
                            "Activity não disponível."
                        )

                val uri =
                    parseContentUri(uriString)

                val cache =
                    WallpaperCache(context)

                val cached =
                    cache.findByUri(
                        uriString
                    )

                val editorUri: Uri =
                    if (cached != null) {

                        cache.ensureOptimized(
                            cached.sourceUrl
                        )?.let {
                            Uri.parse(it.uri)
                        } ?: uri

                    } else {
                        uri
                    }

                WallpaperEditor(context)
                    .open(
                        activity,
                        editorUri
                    )
                    .toString()
            }

            // ---------------------------------------------
            // LIST
            // ---------------------------------------------

            AsyncFunction(
                "getDownloadedWallpapers"
            ) {

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                WallpaperCache(context)
                    .list()
                    .map {
                        it.toMap()
                    }
            }

            // ---------------------------------------------
            // GET
            // ---------------------------------------------

            AsyncFunction(
                "getDownloadedWallpaper"
            ) { imageUrl: String ->

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                WallpaperCache(context)
                    .ensureOptimized(
                        imageUrl
                    )
                    ?.toMap()
            }

            // ---------------------------------------------
            // EXISTS
            // ---------------------------------------------

            AsyncFunction(
                "isWallpaperDownloaded"
            ) { imageUrl: String ->

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                WallpaperCache(context)
                    .find(imageUrl) != null
            }

            // ---------------------------------------------
            // DOWNLOAD + APPLY
            // ---------------------------------------------

            AsyncFunction(
                "openWallpaperPicker"
            ) { imageUrl: String ->

                val context =
                    appContext.reactContext
                        ?: throw Exception(
                            "Contexto do React Native não disponível."
                        )

                val activity =
                    appContext.currentActivity
                        ?: throw Exception(
                            "Activity não disponível."
                        )

                val cache =
                    WallpaperCache(context)

                var pendingComplete:
                    Map<String, Any?>? = null

                val downloader =
                    WallpaperDownloader(
                        context = context,
                        cache = cache
                    ) { event, payload ->

                        if (
                            event ==
                            "onDownloadComplete"
                        ) {
                            pendingComplete = payload
                        } else {
                            sendEvent(
                                event,
                                payload
                            )
                        }
                    }

                // -----------------------------------------
                // Download
                // -----------------------------------------

                val result =
                    downloader.download(
                        imageUrl
                    )

                if (!result.success) {
                    throw Exception(
                        "Não foi possível baixar o wallpaper."
                    )
                }

                // -----------------------------------------
                // Garantir resize
                // -----------------------------------------

                val optimized =
                    cache.ensureOptimized(
                        imageUrl
                    ) ?: throw Exception(
                        "Wallpaper não encontrado no cache."
                    )

                // -----------------------------------------
                // URI final já otimizada
                // -----------------------------------------

                val editorUri =
                    Uri.parse(
                        optimized.uri
                    )

                // -----------------------------------------
                // Abre editor
                // -----------------------------------------

                val openedUri =
                    WallpaperEditor(context)
                        .open(
                            activity,
                            editorUri
                        )

                // -----------------------------------------
                // Evento somente agora
                // -----------------------------------------

                sendEvent(
                    "onDownloadComplete",
                    mapOf(
                        "id" to optimized.id,
                        "sourceUrl" to optimized.sourceUrl,
                        "uri" to optimized.uri,
                        "fileName" to optimized.fileName,
                        "mimeType" to optimized.mimeType,
                        "downloadedBytes" to result.downloadedBytes,
                        "totalBytes" to result.totalBytes,
                        "fromCache" to result.fromCache,
                        "optimized" to optimized.optimized
                    )
                )

                // -----------------------------------------
                // Retorno
                // -----------------------------------------

                mapOf(
                    "success" to result.success,
                    "id" to optimized.id,
                    "sourceUrl" to optimized.sourceUrl,
                    "uri" to optimized.uri,
                    "fileName" to optimized.fileName,
                    "mimeType" to optimized.mimeType,
                    "downloadedBytes" to result.downloadedBytes,
                    "totalBytes" to result.totalBytes,
                    "fromCache" to result.fromCache,
                    "createdAt" to optimized.createdAt,
                    "optimized" to optimized.optimized,
                    "editorUri" to openedUri.toString()
                )
            }
        }

    private fun parseContentUri(
        uriString: String
    ): Uri {

        val uri =
            Uri.parse(uriString)

        if (
            uri.scheme != "content"
        ) {
            throw Exception(
                "A URI do wallpaper precisa usar o esquema content://"
            )
        }

        return uri
    }
}