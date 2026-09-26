package expo.modules.wallpaper

import android.content.Context
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

class WallpaperDownloader(
  private val context: Context,
  private val cache: WallpaperCache,
  private val emit: (String, Map<String, Any?>) -> Unit
) {

  companion object {
    private const val CONNECT_TIMEOUT = 15_000
    private const val READ_TIMEOUT = 30_000
    private const val BUFFER_SIZE = 16 * 1024
    private const val COMPLETION_DELAY = 500L
  }

  fun download(imageUrl: String): DownloadResult {
    val normalizedUrl = imageUrl.trim()
    validateUrl(normalizedUrl)

    val cached = cache.find(normalizedUrl)
    if (cached != null) return emitCached(cached, normalizedUrl)

    val url = URL(normalizedUrl)
    val directory = cache.directory()
    if (!directory.exists() && !directory.mkdirs()) {
      throw Exception("Não foi possível criar o diretório de wallpapers.")
    }

    val connection = try {
      url.openConnection() as HttpURLConnection
    } catch (error: Exception) {
      throw Exception("Não foi possível abrir a conexão: ${error.message}")
    }

    var temporaryFile: File? = null

    try {
      configure(connection)
      connection.connect()

      val responseCode = connection.responseCode
      if (responseCode !in 200..299) {
        throw Exception("Falha ao baixar imagem. HTTP $responseCode")
      }

      val contentType = connection.contentType
        ?.substringBefore(";")
        ?.trim()
        ?.lowercase()
        ?: throw Exception("A resposta não informou o tipo da imagem.")

      if (!contentType.startsWith("image/")) {
        throw Exception("A URL não retornou uma imagem. Content-Type: $contentType")
      }

      val extension = getExtension(contentType)
      val id = sha256(normalizedUrl)
      val fileName = "$id$extension"
      val finalFile = File(directory, fileName)
      temporaryFile = File(directory, ".$fileName.part")
      val totalBytes = connection.contentLengthLong
      val progress = DownloadProgressController { event ->
        emit("onDownloadProgress", event)
      }

      try {
        progress.start(totalBytes, "downloading")

        var downloaded = 0L
        connection.inputStream.use { input ->
          temporaryFile.outputStream().use { output ->
            val buffer = ByteArray(BUFFER_SIZE)

            while (true) {
              val bytesRead = input.read(buffer)
              if (bytesRead == -1) break

              output.write(buffer, 0, bytesRead)
              downloaded += bytesRead

              if (totalBytes > 0L) {
                val target = (downloaded * 10_000L / totalBytes)
                  .coerceIn(0L, 9_999L)
                  .toInt()
                progress.update(downloaded, target)
              } else {
                progress.update(downloaded, 0)
              }
            }

            output.flush()
          }
        }

        validateFile(temporaryFile)

        if (finalFile.exists()) finalFile.delete()
        if (!temporaryFile.renameTo(finalFile)) {
          throw Exception("Não foi possível finalizar o arquivo baixado.")
        }
        temporaryFile = null

        val imageUri = WallpaperFileProvider.uri(context, finalFile)
        val uriType = context.contentResolver.getType(imageUri)
        if (uriType == null || !uriType.startsWith("image/")) {
          throw Exception("MIME type inválido para wallpaper: $uriType")
        }

        val createdAt = System.currentTimeMillis()
        cache.save(
          id = id,
          sourceUrl = normalizedUrl,
          uri = imageUri.toString(),
          fileName = finalFile.name,
          mimeType = contentType,
          createdAt = createdAt
        )

        progress.complete(downloaded)
        Thread.sleep(COMPLETION_DELAY)
        progress.stop()

        val result = DownloadResult(
          success = true,
          id = id,
          sourceUrl = normalizedUrl,
          uri = imageUri.toString(),
          fileName = finalFile.name,
          mimeType = contentType,
          downloadedBytes = downloaded,
          totalBytes = totalBytes,
          fromCache = false,
          createdAt = createdAt
        )

        emit("onDownloadProgress", mapOf(
          "progress" to 100.0,
          "downloadedBytes" to downloaded,
          "totalBytes" to totalBytes,
          "status" to "completed"
        ))
        emit("onDownloadComplete", result.toCompleteEvent())

        return result
      } catch (error: Exception) {
        progress.stop()
        throw error
      }
    } catch (error: Exception) {
      emit("onDownloadProgress", mapOf(
        "progress" to 0.0,
        "downloadedBytes" to 0L,
        "totalBytes" to 0L,
        "status" to "error",
        "message" to (error.message ?: "Erro desconhecido.")
      ))
      throw error
    } finally {
      temporaryFile?.let {
        try { it.delete() } catch (_: Exception) {}
      }
      connection.disconnect()
    }
  }

  private fun emitCached(
    cached: CachedWallpaper,
    normalizedUrl: String
  ): DownloadResult {
    val size = cached.file.length()
    val progress = DownloadProgressController { event ->
      emit("onDownloadProgress", event)
    }

    try {
      progress.start(size, "cached", size)
      progress.complete(size)
      Thread.sleep(COMPLETION_DELAY)
    } finally {
      progress.stop()
    }

    val result = DownloadResult(
      success = true,
      id = cached.id,
      sourceUrl = normalizedUrl,
      uri = cached.uri,
      fileName = cached.fileName,
      mimeType = cached.mimeType,
      downloadedBytes = size,
      totalBytes = size,
      fromCache = true,
      createdAt = cached.createdAt
    )

    emit("onDownloadProgress", mapOf(
      "progress" to 100.0,
      "downloadedBytes" to size,
      "totalBytes" to size,
      "status" to "completed"
    ))
    emit("onDownloadComplete", result.toCompleteEvent())
    return result
  }

  private fun validateUrl(value: String) {
    if (value.isBlank()) throw Exception("A URL do wallpaper está vazia.")
    val url = try { URL(value) } catch (error: Exception) {
      throw Exception("URL inválida: ${error.message}")
    }
    if (url.protocol != "http" && url.protocol != "https") {
      throw Exception("A URL precisa começar com http:// ou https://.")
    }
  }

  private fun configure(connection: HttpURLConnection) {
    connection.connectTimeout = CONNECT_TIMEOUT
    connection.readTimeout = READ_TIMEOUT
    connection.requestMethod = "GET"
    connection.instanceFollowRedirects = true
    connection.useCaches = false
  }

  private fun validateFile(file: File) {
    if (!file.exists()) throw Exception("O arquivo temporário não foi criado.")
    if (file.length() <= 0L) throw Exception("O arquivo baixado está vazio.")
  }

  private fun getExtension(contentType: String): String = when (contentType) {
    "image/jpeg", "image/jpg" -> ".jpg"
    "image/png" -> ".png"
    "image/webp" -> ".webp"
    "image/gif" -> ".gif"
    "image/bmp" -> ".bmp"
    "image/avif" -> ".avif"
    "image/heic" -> ".heic"
    "image/heif" -> ".heif"
    else -> throw Exception("Formato de imagem não suportado: $contentType")
  }

  private fun sha256(value: String): String {
    val digest = MessageDigest.getInstance("SHA-256")
    val bytes = digest.digest(value.toByteArray(Charsets.UTF_8))
    return bytes.joinToString("") { "%02x".format(it) }
  }
}
