package expo.modules.wallpaper

import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong

class DownloadProgressController(
  private val emit: (Map<String, Any?>) -> Unit
) {

  companion object {
    // 40ms = ~25 atualizações por segundo.
    private const val UPDATE_DELAY = 20L

    // 50 = 0,50%. São 200 passos até 100% (~8 segundos).
    private const val STEP = 67
  }

  private val target = AtomicInteger(0)
  private val visual = AtomicInteger(0)
  private val downloadedBytes = AtomicLong(0L)

  @Volatile
  private var running = false

  private var totalBytes = 0L
  private var status = "downloading"
  private var thread: Thread? = null

  fun start(
    totalBytes: Long,
    status: String,
    downloadedBytes: Long = 0L
  ) {
    stop()

    this.totalBytes = totalBytes
    this.status = status
    this.downloadedBytes.set(downloadedBytes)
    target.set(0)
    visual.set(0)
    running = true

    emitProgress(0)

    thread = Thread {
      while (running) {
        val current = visual.get()
        val wanted = target.get()

        if (current < wanted) {
          val next = minOf(current + STEP, wanted)
          visual.set(next)
          emitProgress(next)
        }

        try {
          Thread.sleep(UPDATE_DELAY)
        } catch (_: InterruptedException) {
          break
        }
      }
    }.apply {
      name = "ExpoWallpaperProgress"
      isDaemon = true
      start()
    }
  }

  fun update(
    downloadedBytes: Long,
    targetProgress: Int
  ) {
    this.downloadedBytes.set(downloadedBytes)
    target.set(targetProgress.coerceIn(0, 9_999))
  }

  fun complete(downloadedBytes: Long, waitForVisual: Boolean = true) {
    this.downloadedBytes.set(downloadedBytes)
    target.set(10_000)

    if (waitForVisual) {
      while (visual.get() < 10_000 && running) {
        Thread.sleep(UPDATE_DELAY)
      }
    }
  }

  fun stop() {
    running = false
    thread?.interrupt()
    thread?.join(500L)
    thread = null
  }

  private fun emitProgress(value: Int) {
    emit(
      mapOf(
        "progress" to (value / 100.0),
        "downloadedBytes" to downloadedBytes.get(),
        "totalBytes" to totalBytes,
        "status" to status
      )
    )
  }
}
