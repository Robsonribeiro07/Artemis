package expo.modules.wallpaper

import android.app.Activity
import android.app.WallpaperManager
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.util.Log
import java.io.File

class WallpaperEditor(
  private val context: Context
) {

  companion object {
    private const val TAG = "ExpoWallpaperEditor"
    private const val EDITOR_SUFFIX = "_editor.jpg"
  }

  fun open(activity: Activity, sourceUri: Uri): Uri {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      throw Exception("O editor de wallpaper exige Android 7.0 ou superior.")
    }

    val editorUri = prepareUri(sourceUri)
    val resolver = context.contentResolver
    val mimeType = resolver.getType(editorUri) ?: "image/jpeg"

    if (!mimeType.startsWith("image/")) {
      throw Exception("MIME inválido para o editor: $mimeType")
    }

    val intent = createIntent(editorUri, mimeType)

    val resolverInfo = intent.resolveActivity(context.packageManager)
      ?: throw Exception(
        "Nenhum editor de wallpaper compatível foi encontrado. MIME: $mimeType"
      )

    val packageName = resolverInfo.packageName

    try {
      context.grantUriPermission(
        packageName,
        editorUri,
        Intent.FLAG_GRANT_READ_URI_PERMISSION
      )

      context.grantUriPermission(
        packageName,
        editorUri,
        Intent.FLAG_GRANT_WRITE_URI_PERMISSION
      )
    } catch (error: Exception) {
      Log.w(
        TAG,
        "Não foi possível conceder permissão explícita.",
        error
      )
    }

    try {
      activity.startActivity(intent)
    } catch (error: Exception) {
      throw Exception(
        "Não foi possível abrir o editor de wallpaper: ${error.message}"
      )
    }

    return editorUri
  }

  private fun prepareUri(sourceUri: Uri): Uri {
    val sourceMimeType = context.contentResolver.getType(sourceUri)

    if (
      sourceMimeType == "image/jpeg" ||
      sourceMimeType == "image/jpg"
    ) {
      return sourceUri
    }

    val directory = File(context.filesDir, "wallpapers")

    if (!directory.exists() && !directory.mkdirs()) {
      throw Exception(
        "Não foi possível criar o diretório de wallpapers."
      )
    }

    val editorId = sha256(sourceUri.toString())
    val editorFile = File(
      directory,
      "$editorId$EDITOR_SUFFIX"
    )

    if (
      editorFile.exists() &&
      editorFile.length() > 0L
    ) {
      val existingUri =
        WallpaperFileProvider.uri(
          context,
          editorFile
        )

      if (
        context.contentResolver.getType(existingUri) ==
        "image/jpeg"
      ) {
        return existingUri
      }

      try {
        editorFile.delete()
      } catch (_: Exception) {
      }
    }

    val bitmap =
      context.contentResolver
        .openInputStream(sourceUri)
        .use { input ->
          if (input == null) {
            throw Exception(
              "Não foi possível abrir a URI do wallpaper."
            )
          }

          BitmapFactory.decodeStream(input)
        }
        ?: throw Exception(
          "Não foi possível decodificar a imagem do wallpaper."
        )

    try {
      editorFile.outputStream().use { output ->
        if (
          !bitmap.compress(
            Bitmap.CompressFormat.JPEG,
            95,
            output
          )
        ) {
          throw Exception(
            "Não foi possível converter a imagem para JPEG."
          )
        }
      }
    } catch (error: Exception) {
      try {
        editorFile.delete()
      } catch (_: Exception) {
      }

      throw error
    } finally {
      bitmap.recycle()
    }

    if (
      !editorFile.exists() ||
      editorFile.length() <= 0L
    ) {
      throw Exception(
        "O JPEG preparado para o editor não foi criado corretamente."
      )
    }

    val editorUri =
      WallpaperFileProvider.uri(
        context,
        editorFile
      )

    val editorMimeType =
      context.contentResolver.getType(editorUri)

    if (editorMimeType != "image/jpeg") {
      try {
        editorFile.delete()
      } catch (_: Exception) {
      }

      throw Exception(
        "O FileProvider retornou MIME inválido para o JPEG: $editorMimeType"
      )
    }

    return editorUri
  }

  private fun createIntent(
    uri: Uri,
    mimeType: String
  ): Intent {
    return try {
      WallpaperManager
        .getInstance(context)
        .getCropAndSetWallpaperIntent(uri)
        .apply {
          configureIntent(
            this,
            uri,
            mimeType
          )
        }
    } catch (error: Exception) {
      Log.e(
        TAG,
        "getCropAndSetWallpaperIntent falhou.",
        error
      )

      Intent(
        WallpaperManager.ACTION_CROP_AND_SET_WALLPAPER
      ).apply {
        configureIntent(
          this,
          uri,
          mimeType
        )

        val activities =
          context.packageManager.queryIntentActivities(
            this,
            0
          )

        if (activities.isEmpty()) {
          throw Exception(
            "O Android não encontrou um editor de wallpaper compatível. " +
              "MIME: $mimeType. " +
              "Erro original: ${error.message}"
          )
        }
      }
    }
  }

  private fun configureIntent(
    intent: Intent,
    uri: Uri,
    mimeType: String
  ) {
    intent.setDataAndType(
      uri,
      mimeType
    )

    intent.addFlags(
      Intent.FLAG_GRANT_READ_URI_PERMISSION
    )

    intent.addFlags(
      Intent.FLAG_GRANT_WRITE_URI_PERMISSION
    )

    intent.addFlags(
      Intent.FLAG_ACTIVITY_NEW_TASK
    )

    intent.clipData =
      ClipData.newRawUri(
        "wallpaper",
        uri
      )
  }

  private fun sha256(value: String): String {
    val digest =
      java.security.MessageDigest.getInstance(
        "SHA-256"
      )

    val bytes =
      digest.digest(
        value.toByteArray(
          Charsets.UTF_8
        )
      )

    return bytes.joinToString("") {
      "%02x".format(it)
    }
  }
}