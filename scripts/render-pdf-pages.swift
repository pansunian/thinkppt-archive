import AppKit
import PDFKit

func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data((message + "\n").utf8))
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
  fail("Usage: swift render-pdf-pages.swift <input.pdf> <output-dir> [page-count]")
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2], isDirectory: true)
let maxPages = args.count >= 4 ? (Int(args[3]) ?? 8) : 8

guard let document = PDFDocument(url: inputURL) else {
  fail("Could not open PDF: \(inputURL.path)")
}

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

let pagesToRender = min(maxPages, document.pageCount)
let targetWidth: CGFloat = 1800

for pageNumber in 1...pagesToRender {
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

  guard
    let tiff = image.tiffRepresentation,
    let bitmap = NSBitmapImageRep(data: tiff),
    let jpg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.86])
  else {
    fail("Could not encode page \(pageNumber)")
  }

  let filename = String(format: "page-%03d.jpg", pageNumber)
  try jpg.write(to: outputURL.appendingPathComponent(filename), options: .atomic)
}

print("Rendered \(pagesToRender) pages to \(outputURL.path)")
