package com.koru.videotrim

import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMetadataRetriever
import android.media.MediaMuxer
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.nio.ByteBuffer

/**
 * Recorta un MP4 copiando los samples originales con MediaExtractor +
 * MediaMuxer: no re-encodea, así que el recorte es instantáneo y no pierde
 * calidad. El costo es que el corte de entrada se alinea al keyframe anterior
 * a `startMs`, por lo que el clip puede arrancar un poco antes de lo pedido.
 */
class KoruVideoTrimModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = NAME

  @ReactMethod
  fun trim(sourcePath: String, startMs: Double, endMs: Double, promise: Promise) {
    // MediaMuxer escribe en disco: lo sacamos del hilo de módulos nativos.
    Thread { runTrim(sourcePath, startMs, endMs, promise) }.start()
  }

  private fun runTrim(sourcePath: String, startMs: Double, endMs: Double, promise: Promise) {
    val src = sourcePath.removePrefix("file://")
    if (!File(src).exists()) {
      promise.reject(ERR_SOURCE, "No existe el archivo de origen: $src")
      return
    }

    var extractor: MediaExtractor? = null
    var muxer: MediaMuxer? = null
    var muxerStarted = false
    val output = File(reactContext.cacheDir, "koru-trim-${System.nanoTime()}.mp4")

    try {
      extractor = MediaExtractor()
      extractor.setDataSource(src)

      // Mapeo track de origen -> track de destino, para copiar video y audio.
      val trackMap = HashMap<Int, Int>()
      var maxInputSize = 0
      muxer = MediaMuxer(output.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)

      for (i in 0 until extractor.trackCount) {
        val format = extractor.getTrackFormat(i)
        val mime = format.getString(MediaFormat.KEY_MIME) ?: continue
        if (!mime.startsWith("video/") && !mime.startsWith("audio/")) {
          continue
        }
        extractor.selectTrack(i)
        trackMap[i] = muxer.addTrack(format)
        if (format.containsKey(MediaFormat.KEY_MAX_INPUT_SIZE)) {
          maxInputSize = maxOf(maxInputSize, format.getInteger(MediaFormat.KEY_MAX_INPUT_SIZE))
        }
      }

      if (trackMap.isEmpty()) {
        promise.reject(ERR_TRACKS, "El archivo no tiene pistas de video ni de audio")
        return
      }
      if (maxInputSize <= 0) {
        maxInputSize = DEFAULT_BUFFER_SIZE
      }

      muxer.setOrientationHint(readRotation(src))
      muxer.start()
      muxerStarted = true

      val startUs = (startMs * 1000).toLong().coerceAtLeast(0L)
      val endUs = (endMs * 1000).toLong()
      extractor.seekTo(startUs, MediaExtractor.SEEK_TO_PREVIOUS_SYNC)

      val buffer = ByteBuffer.allocate(maxInputSize)
      val info = MediaCodec.BufferInfo()
      var firstPtsUs = -1L
      var samples = 0
      // Video y audio vienen intercalados y el audio suele ir adelantado: si
      // cortáramos con el primer sample fuera de rango, el video quedaría corto.
      // Cada pista termina por su cuenta y recién ahí se corta el loop.
      val finished = HashSet<Int>()

      while (finished.size < trackMap.size) {
        val size = extractor.readSampleData(buffer, 0)
        if (size < 0) {
          break
        }
        val srcTrack = extractor.sampleTrackIndex
        val ptsUs = extractor.sampleTime
        val destTrack = trackMap[srcTrack]

        if (destTrack == null || ptsUs < 0) {
          extractor.advance()
          continue
        }

        if (ptsUs > endUs) {
          finished.add(srcTrack)
          extractor.advance()
          continue
        }

        if (firstPtsUs < 0) {
          firstPtsUs = ptsUs
        }
        info.offset = 0
        info.size = size
        // Los timestamps se rebasan a 0 para que el clip arranque en su
        // propio origen y no herede el offset del video completo.
        info.presentationTimeUs = ptsUs - firstPtsUs
        // MediaExtractor.SAMPLE_FLAG_SYNC == MediaCodec.BUFFER_FLAG_KEY_FRAME.
        info.flags = extractor.sampleFlags
        muxer.writeSampleData(destTrack, buffer, info)
        samples++
        extractor.advance()
      }

      if (samples == 0) {
        promise.reject(ERR_EMPTY, "El rango pedido no contiene frames")
        return
      }

      muxer.stop()
      muxerStarted = false
      promise.resolve(output.absolutePath)
    } catch (e: Exception) {
      output.delete()
      promise.reject(ERR_FAILED, e.message, e)
    } finally {
      if (muxerStarted) {
        runCatching { muxer?.stop() }
      }
      runCatching { muxer?.release() }
      runCatching { extractor?.release() }
    }
  }

  private fun readRotation(path: String): Int {
    val retriever = MediaMetadataRetriever()
    return try {
      retriever.setDataSource(path)
      retriever
        .extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)
        ?.toIntOrNull() ?: 0
    } catch (e: Exception) {
      0
    } finally {
      runCatching { retriever.release() }
    }
  }

  companion object {
    const val NAME = "KoruVideoTrim"
    private const val DEFAULT_BUFFER_SIZE = 2 * 1024 * 1024
    private const val ERR_SOURCE = "source_missing"
    private const val ERR_TRACKS = "no_tracks"
    private const val ERR_EMPTY = "empty_range"
    private const val ERR_FAILED = "trim_failed"
  }
}
