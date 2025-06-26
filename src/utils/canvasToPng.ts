const findBoundingBox = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const data = imageData.data

  let minX = ctx.canvas.width
  let minY = ctx.canvas.height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      const alpha = data[(y * ctx.canvas.width + x) * 4 + 3]
      if (alpha > 0) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

const getImageDataUrl = (imageData: ImageData): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unable to get 2D context')

  canvas.width = imageData.width
  canvas.height = imageData.height

  ctx.putImageData(imageData, 0, 0)

  return canvas.toDataURL('image/png')
}

export const createPNG = (canvas: HTMLCanvasElement, callback: (blob: Blob) => void) => {
  // Convert canvas content to PNG
  const dataUrl = canvas.toDataURL('image/png')

  // Create a new image object to load the data URL
  const img = new Image()
  img.src = dataUrl

  // Ensure the image is loaded before processing
  img.onload = () => {
    // Create a temporary canvas to crop and resize
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    // Set the temporary canvas size to match the image size
    tempCanvas.width = img.width
    tempCanvas.height = img.height

    // Draw the image on the temporary canvas
    tempCtx.drawImage(img, 0, 0)

    // Find the bounding box of the drawing
    const boundingBox = findBoundingBox(tempCtx)

    // Calculate the cropping dimensions
    const cropWidth = boundingBox.width
    const cropHeight = boundingBox.height

    // Crop the image
    const croppedImage = tempCtx.getImageData(boundingBox.x, boundingBox.y, cropWidth, cropHeight)

    // Create a new Image element to display the cropped image
    const croppedImgElement = new Image()

    // Set the source of the new Image element to the cropped image data
    croppedImgElement.src = getImageDataUrl(croppedImage)

    // After loading the image, set its width and height
    croppedImgElement.onload = () => {
      // Create a new canvas for the cropped image
      const croppedCanvas = document.createElement('canvas')
      const croppedCtx = croppedCanvas.getContext('2d')
      if (!croppedCtx) return

      // Resize the cropped canvas
      croppedCanvas.width = 468
      croppedCanvas.height = 1018

      // Draw the cropped image onto the resized canvas
      croppedCtx.drawImage(croppedImgElement, 0, 0, 468, 1018)

      // Convert the resized canvas to a Blob
      croppedCanvas.toBlob((blob) => {
        // Use the created Blob for further operations (e.g., setting state)
        if (blob) {
          // Invoke the callback function with the created Blob
          callback(blob)
        } else {
          console.error('Failed to create Blob.')
        }
      }, 'image/png')
    }
  }
}
