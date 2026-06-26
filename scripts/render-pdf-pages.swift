import AppKit
import PDFKit

func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data((message + "\n").utf8))
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
  fail("Usage: swift render-pdf-pages.swift <input.pdf> <output-dir> [page-count|page-list]")
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2], isDirectory: true)
let pageArgument = args.count >= 4 ? args[3] : "8"

guard let document = PDFDocument(url: inputURL) else {
  fail("Could not open PDF: \(inputURL.path)")
}

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)
let thumbsURL = outputURL.appendingPathComponent("thumbs", isDirectory: true)
try FileManager.default.createDirectory(at: thumbsURL, withIntermediateDirectories: true)

let pagesToRender: [Int]
if pageArgument.contains(",") {
  pagesToRender = pageArgument
    .split(separator: ",")
    .compactMap { Int($0.trimmingCharacters(in: .whitespacesAndNewlines)) }
    .filter { $0 >= 1 && $0 <= document.pageCount }
} else {
  let maxPages = Int(pageArgument) ?? 8
  pagesToRender = Array(1...min(maxPages, document.pageCount))
}

guard !pagesToRender.isEmpty else {
  fail("No valid pages to render.")
}

let targetWidth: CGFloat = 1800
let thumbWidth: CGFloat = 520

func jpegData(from image: NSImage, quality: CGFloat) -> Data? {
  guard
    let tiff = image.tiffRepresentation,
    let bitmap = NSBitmapImageRep(data: tiff)
  else {
    return nil
  }

  return bitmap.representation(using: .jpeg, properties: [.compressionFactor: quality])
}

func resizedImage(from image: NSImage, targetWidth: CGFloat) -> NSImage {
  let ratio = targetWidth / max(image.size.width, 1)
  let targetSize = NSSize(width: targetWidth, height: image.size.height * ratio)
  let resized = NSImage(size: targetSize)

  resized.lockFocus()
  NSGraphicsContext.current?.imageInterpolation = .high
  image.draw(in: NSRect(origin: .zero, size: targetSize), from: NSRect(origin: .zero, size: image.size), operation: .copy, fraction: 1)
  resized.unlockFocus()

  return resized
}

for pageNumber in pagesToRender {
  guard let page = document.page(at: pageNumber - 1) else { continue }

  let bounds = page.bounds(for: .mediaBox)
  let scale = targetWidth / max(bounds.width, 1)
  let imageSize = NSSize(width: bounds.width * scale, height: bounds.height * scale)

  let image = NSImage(size: imageSize)
  image.lockFocus()

  guard let context = NSGraphicsContext.current?.cgContext else {
    image.unlockFocus()
    fail("Could not create graphics context")
  }

  NSColor.white.setFill()
  NSBezierPath(rect: NSRect(origin: .zero, size: imageSize)).fill()

  context.saveGState()
  context.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: context)
  context.restoreGState()

  image.unlockFocus()

  guard let jpg = jpegData(from: image, quality: 0.86) else {
    fail("Could not encode page \(pageNumber)")
  }

  let filename = String(format: "page-%03d.jpg", pageNumber)
  try jpg.write(to: outputURL.appendingPathComponent(filename), options: .atomic)

  let thumbImage = resizedImage(from: image, targetWidth: thumbWidth)
  guard let thumbJpg = jpegData(from: thumbImage, quality: 0.78) else {
    fail("Could not encode thumbnail \(pageNumber)")
  }
  try thumbJpg.write(to: thumbsURL.appendingPathComponent(filename), options: .atomic)
}

print("Rendered \(pagesToRender.count) pages and thumbnails to \(outputURL.path)")
