package expo.modules.wallpaper

data class DownloadResult(
  val success: Boolean,
  val id: String,
  val sourceUrl: String,
  val uri: String,
  val fileName: String,
  val mimeType: String,
  val downloadedBytes: Long,
  val totalBytes: Long,
  val fromCache: Boolean,
  val createdAt: Long
) {
  fun toMap(): Map<String, Any?> = mapOf(
    "success" to success,
    "id" to id,
    "sourceUrl" to sourceUrl,
    "uri" to uri,
    "fileName" to fileName,
    "mimeType" to mimeType,
    "downloadedBytes" to downloadedBytes,
    "totalBytes" to totalBytes,
    "fromCache" to fromCache,
    "createdAt" to createdAt
  )

  fun toCompleteEvent(): Map<String, Any?> = mapOf(
    "id" to id,
    "sourceUrl" to sourceUrl,
    "uri" to uri,
    "fileName" to fileName,
    "mimeType" to mimeType,
    "downloadedBytes" to downloadedBytes,
    "totalBytes" to totalBytes,
    "fromCache" to fromCache
  )
}