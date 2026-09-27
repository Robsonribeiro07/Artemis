package expo.modules.wallpaper

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class WallpaperCache(
    private val context: Context
) {

    companion object {
        private const val WALLPAPER_DIRECTORY = "wallpapers"
        private const val INDEX_FILE = "index.json"
    }

    private val lock = Any()

    fun directory(): File =
        File(
            context.filesDir,
            WALLPAPER_DIRECTORY
        )

    /**
     * Busca pelo URL original.
     */
    fun find(
        imageUrl: String
    ): CachedWallpaper? = synchronized(lock) {

        val directory = directory()

        if (!directory.exists()) {
            return@synchronized null
        }

        val index = readIndex(directory)

        val items =
            index.optJSONArray("wallpapers")
                ?: JSONArray()

        for (position in 0 until items.length()) {

            val item =
                items.optJSONObject(position)
                    ?: continue

            if (
                item.optString("sourceUrl") != imageUrl
            ) {
                continue
            }

            val fileName =
                item.optString("fileName")

            if (fileName.isBlank()) {
                continue
            }

            val file =
                File(directory, fileName)

            if (
                !file.exists() ||
                file.length() <= 0L
            ) {
                continue
            }

            val uri =
                getSavedUri(
                    item,
                    file
                )

            if (
                item.optString("uri").isBlank()
            ) {
                item.put("uri", uri)

                upsertIndexLocked(
                    directory,
                    item
                )
            }

            return@synchronized createCachedWallpaper(
                item,
                file,
                uri
            )
        }

        null
    }

    /**
     * Busca através da URI content://.
     */
    fun findByUri(
        uriString: String
    ): CachedWallpaper? = synchronized(lock) {

        val directory = directory()

        if (!directory.exists()) {
            return@synchronized null
        }

        val index =
            readIndex(directory)

        val items =
            index.optJSONArray("wallpapers")
                ?: JSONArray()

        for (position in 0 until items.length()) {

            val item =
                items.optJSONObject(position)
                    ?: continue

            val fileName =
                item.optString("fileName")

            if (fileName.isBlank()) {
                continue
            }

            val file =
                File(directory, fileName)

            if (
                !file.exists() ||
                file.length() <= 0L
            ) {
                continue
            }

            val savedUri =
                getSavedUri(
                    item,
                    file
                )

            if (savedUri != uriString) {
                continue
            }

            return@synchronized createCachedWallpaper(
                item,
                file,
                savedUri
            )
        }

        null
    }

    /**
     * Garante que um wallpaper existente no cache
     * esteja otimizado.
     *
     * Serve para:
     *
     * - downloads novos
     * - wallpapers antigos
     * - Apply
     */
    fun ensureOptimized(
        imageUrl: String
    ): CachedWallpaper? = synchronized(lock) {

        val directory = directory()

        if (!directory.exists()) {
            return@synchronized null
        }

        val index =
            readIndex(directory)

        val items =
            index.optJSONArray("wallpapers")
                ?: JSONArray()

        for (position in 0 until items.length()) {

            val item =
                items.optJSONObject(position)
                    ?: continue

            if (
                item.optString("sourceUrl") != imageUrl
            ) {
                continue
            }

            val fileName =
                item.optString("fileName")

            if (fileName.isBlank()) {
                continue
            }

            val file =
                File(directory, fileName)

            if (
                !file.exists() ||
                file.length() <= 0L
            ) {
                continue
            }

            val mimeType =
                item.optString(
                    "mimeType",
                    "image/jpeg"
                )

            val alreadyOptimized =
                item.optBoolean(
                    "optimized",
                    false
                )

            if (!alreadyOptimized) {

                WallpaperResizer.optimize(
                    inputFile = file,
                    mimeType = mimeType
                )

                item.put(
                    "optimized",
                    true
                )

                item.put(
                    "fileName",
                    file.name
                )

                item.put(
                    "mimeType",
                    mimeType
                )

                val uri =
                    WallpaperFileProvider
                        .uri(
                            context,
                            file
                        )
                        .toString()

                item.put(
                    "uri",
                    uri
                )

                upsertIndexLocked(
                    directory,
                    item
                )
            }

            val uri =
                getSavedUri(
                    item,
                    file
                )

            return@synchronized createCachedWallpaper(
                item,
                file,
                uri
            )
        }

        null
    }

    /**
     * Garante otimização usando a URI salva.
     */
    fun ensureOptimizedByUri(
        uriString: String
    ): CachedWallpaper? = synchronized(lock) {

        val cached =
            findByUriInternal(uriString)
                ?: return@synchronized null

        ensureOptimizedInternal(
            cached
        )
    }

    fun list(): List<CachedWallpaper> =
        synchronized(lock) {

            val directory = directory()

            if (!directory.exists()) {
                return@synchronized emptyList()
            }

            val index =
                readIndex(directory)

            val items =
                index.optJSONArray("wallpapers")
                    ?: JSONArray()

            val result =
                mutableListOf<CachedWallpaper>()

            for (
                position in 0 until items.length()
            ) {

                val item =
                    items.optJSONObject(position)
                        ?: continue

                val fileName =
                    item.optString("fileName")

                if (fileName.isBlank()) {
                    continue
                }

                val file =
                    File(directory, fileName)

                if (
                    !file.exists() ||
                    file.length() <= 0L
                ) {
                    continue
                }

                result.add(
                    createCachedWallpaper(
                        item,
                        file,
                        getSavedUri(
                            item,
                            file
                        )
                    )
                )
            }

            result.sortedByDescending {
                it.createdAt
            }
        }

    fun save(
        id: String,
        sourceUrl: String,
        uri: String,
        fileName: String,
        mimeType: String,
        createdAt: Long,
        optimized: Boolean = false
    ) = synchronized(lock) {

        val directory =
            ensureDirectory()

        val metadata =
            JSONObject()
                .put("id", id)
                .put("sourceUrl", sourceUrl)
                .put("uri", uri)
                .put("fileName", fileName)
                .put("mimeType", mimeType)
                .put("createdAt", createdAt)
                .put("optimized", optimized)

        upsertIndexLocked(
            directory,
            metadata
        )
    }

    private fun ensureOptimizedInternal(
        cached: CachedWallpaper
    ): CachedWallpaper {

        val directory =
            directory()

        val index =
            readIndex(directory)

        val items =
            index.optJSONArray("wallpapers")
                ?: JSONArray()

        for (
            position in 0 until items.length()
        ) {

            val item =
                items.optJSONObject(position)
                    ?: continue

            if (
                item.optString("id") != cached.id
            ) {
                continue
            }

            val alreadyOptimized =
                item.optBoolean(
                    "optimized",
                    false
                )

            if (!alreadyOptimized) {

                val mimeType =
                    item.optString(
                        "mimeType",
                        "image/jpeg"
                    )

                WallpaperResizer.optimize(
                    inputFile = cached.file,
                    mimeType = mimeType
                )

                item.put(
                    "optimized",
                    true
                )

                item.put(
                    "uri",
                    WallpaperFileProvider
                        .uri(
                            context,
                            cached.file
                        )
                        .toString()
                )

                upsertIndexLocked(
                    directory,
                    item
                )
            }

            return createCachedWallpaper(
                item,
                cached.file,
                getSavedUri(
                    item,
                    cached.file
                )
            )
        }

        return cached
    }

    private fun findByUriInternal(
        uriString: String
    ): CachedWallpaper? {

        val directory = directory()

        if (!directory.exists()) {
            return null
        }

        val index =
            readIndex(directory)

        val items =
            index.optJSONArray("wallpapers")
                ?: JSONArray()

        for (
            position in 0 until items.length()
        ) {

            val item =
                items.optJSONObject(position)
                    ?: continue

            val fileName =
                item.optString("fileName")

            if (fileName.isBlank()) {
                continue
            }

            val file =
                File(directory, fileName)

            if (
                !file.exists() ||
                file.length() <= 0L
            ) {
                continue
            }

            val uri =
                getSavedUri(
                    item,
                    file
                )

            if (uri == uriString) {
                return createCachedWallpaper(
                    item,
                    file,
                    uri
                )
            }
        }

        return null
    }

    private fun createCachedWallpaper(
        item: JSONObject,
        file: File,
        uri: String
    ): CachedWallpaper {

        return CachedWallpaper(
            id = item.optString("id"),
            sourceUrl = item.optString("sourceUrl"),
            uri = uri,
            fileName = file.name,
            mimeType = item.optString(
                "mimeType",
                "image/jpeg"
            ),
            createdAt = item.optLong(
                "createdAt",
                file.lastModified()
            ),
            file = file,
            optimized = item.optBoolean(
                "optimized",
                false
            )
        )
    }

    private fun ensureDirectory(): File {

        val directory =
            directory()

        if (
            !directory.exists() &&
            !directory.mkdirs()
        ) {
            throw Exception(
                "Não foi possível criar o diretório de wallpapers."
            )
        }

        return directory
    }

    private fun getSavedUri(
        item: JSONObject,
        file: File
    ): String {

        val savedUri =
            item.optString("uri")

        if (savedUri.isNotBlank()) {
            return savedUri
        }

        return WallpaperFileProvider
            .uri(
                context,
                file
            )
            .toString()
    }

    private fun readIndex(
        directory: File
    ): JSONObject {

        val file =
            File(
                directory,
                INDEX_FILE
            )

        if (!file.exists()) {
            return JSONObject()
                .put(
                    "wallpapers",
                    JSONArray()
                )
        }

        return try {
            JSONObject(
                file.readText()
            )
        } catch (_: Exception) {
            JSONObject()
                .put(
                    "wallpapers",
                    JSONArray()
                )
        }
    }

    private fun upsertIndexLocked(
        directory: File,
        wallpaper: JSONObject
    ) {

        val index =
            readIndex(directory)

        val currentItems =
            index.optJSONArray(
                "wallpapers"
            ) ?: JSONArray()

        val newItems =
            JSONArray()

        val targetId =
            wallpaper.optString("id")

        for (
            position in 0 until currentItems.length()
        ) {

            val item =
                currentItems.optJSONObject(position)
                    ?: continue

            if (
                item.optString("id") ==
                targetId
            ) {
                continue
            }

            newItems.put(item)
        }

        newItems.put(wallpaper)

        val indexFile =
            File(
                directory,
                INDEX_FILE
            )

        val temporaryIndex =
            File(
                directory,
                ".$INDEX_FILE.part"
            )

        temporaryIndex.writeText(
            JSONObject()
                .put(
                    "wallpapers",
                    newItems
                )
                .toString()
        )

        if (indexFile.exists()) {
            indexFile.delete()
        }

        if (
            !temporaryIndex.renameTo(indexFile)
        ) {
            throw Exception(
                "Não foi possível salvar o índice dos wallpapers."
            )
        }
    }
}

data class CachedWallpaper(
    val id: String,
    val sourceUrl: String,
    val uri: String,
    val fileName: String,
    val mimeType: String,
    val createdAt: Long,
    val file: File,
    val optimized: Boolean
) {

    fun toMap(): Map<String, Any?> =
        mapOf(
            "id" to id,
            "sourceUrl" to sourceUrl,
            "uri" to uri,
            "fileName" to fileName,
            "mimeType" to mimeType,
            "createdAt" to createdAt,
            "optimized" to optimized
        )
}