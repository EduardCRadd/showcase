import { Canvas, FabricObject } from 'fabric'
import React, { forwardRef, useEffect, useRef } from 'react'

const DEV_MODE = process.env.NODE_ENV === 'development'

declare global {
  var canvas: Canvas | undefined
}

FabricObject.prototype.objectCaching = false

const FabricCanvas = forwardRef<Canvas, { onLoad?(canvas: Canvas): void }>(({ onLoad }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvasComponent = canvasRef.current
    const canvas = new Canvas(canvasComponent)

    DEV_MODE && (window.canvas = canvas)

    if (typeof ref === 'function') {
      ref(canvas)
    } else if (typeof ref === 'object' && ref) {
      ref.current = canvas
    }

    // it is crucial `onLoad` is a dependency of this effect
    // to ensure the canvas is disposed and re-created if it changes
    onLoad?.(canvas)

    return () => {
      DEV_MODE && delete window.canvas

      if (typeof ref === 'function') {
        ref(null)
      } else if (typeof ref === 'object' && ref) {
        ref.current = null
      }

      canvasComponent.height = 0
      canvasComponent.width = 0

      // `dispose` is async
      // however it runs a sync DOM cleanup
      // its async part ensures rendering has completed
      // and should not affect react
      canvas.dispose()
    }
  }, [canvasRef, onLoad, ref])

  return <canvas ref={canvasRef} width="0" height="0" />
})

FabricCanvas.displayName = 'FabricCanvas'
export default FabricCanvas
