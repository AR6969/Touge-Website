// macOS's native HDR-to-SDR conversion, before web encoding.
// https://developer.apple.com/av-foundation/Incorporating-HDR-video-with-Dolby-Vision-into-your-apps.pdf
import AVFoundation
import Foundation

guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: swift export-sdr-video.swift INPUT OUTPUT.mp4")
}
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let composition = AVMutableVideoComposition(propertiesOf: asset)
composition.colorPrimaries = AVVideoColorPrimaries_ITU_R_709_2
composition.colorTransferFunction = AVVideoTransferFunction_ITU_R_709_2
composition.colorYCbCrMatrix = AVVideoYCbCrMatrix_ITU_R_709_2
guard let export = AVAssetExportSession(asset: asset, presetName: AVAssetExportPreset1920x1080) else {
    fatalError("Cannot create SDR export")
}
export.videoComposition = composition
export.outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true
let finished = DispatchSemaphore(value: 0)
export.exportAsynchronously { finished.signal() }
finished.wait()
guard export.status == .completed else {
    fatalError("SDR export failed: \(String(describing: export.error))")
}
