import AVFoundation
import Foundation
// Trae RCTPromiseResolveBlock / RCTPromiseRejectBlock (React-Core expone el
// módulo `React`); el KoruVideoTrim.m ya hace el #import equivalente.
import React

/**
 Recorta un MP4 con AVAssetExportSession. A diferencia de Android (donde se
 copian los samples y el corte se alinea al keyframe anterior), acá el corte es
 exacto al milisegundo porque el export re-encodea el rango pedido.
 */
@objc(KoruVideoTrim)
class KoruVideoTrim: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(trim:startMs:endMs:resolver:rejecter:)
  func trim(
    _ sourcePath: String,
    startMs: NSNumber,
    endMs: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let path = sourcePath.hasPrefix("file://")
      ? String(sourcePath.dropFirst("file://".count))
      : sourcePath

    guard FileManager.default.fileExists(atPath: path) else {
      reject("source_missing", "No existe el archivo de origen: \(path)", nil)
      return
    }

    let asset = AVURLAsset(url: URL(fileURLWithPath: path))
    guard
      let export = AVAssetExportSession(
        asset: asset,
        presetName: AVAssetExportPresetHighestQuality
      )
    else {
      reject("export_unavailable", "No se pudo crear la sesión de exportación", nil)
      return
    }

    let outputURL = URL(fileURLWithPath: NSTemporaryDirectory())
      .appendingPathComponent("koru-trim-\(UUID().uuidString).mp4")

    let start = CMTime(value: CMTimeValue(startMs.doubleValue.rounded()), timescale: 1000)
    let rawEnd = CMTime(value: CMTimeValue(endMs.doubleValue.rounded()), timescale: 1000)
    let end = CMTimeMinimum(rawEnd, asset.duration)

    guard CMTimeCompare(end, start) > 0 else {
      reject("empty_range", "El rango pedido está vacío", nil)
      return
    }

    export.outputURL = outputURL
    export.outputFileType = .mp4
    export.shouldOptimizeForNetworkUse = true
    export.timeRange = CMTimeRange(start: start, end: end)

    export.exportAsynchronously {
      switch export.status {
      case .completed:
        resolve(outputURL.path)
      case .cancelled:
        reject("trim_cancelled", "La exportación fue cancelada", export.error)
      default:
        reject(
          "trim_failed",
          export.error?.localizedDescription ?? "Error desconocido al recortar",
          export.error
        )
      }
    }
  }
}
