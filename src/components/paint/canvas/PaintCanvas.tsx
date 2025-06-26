'use client'

import { useGSAP } from '@gsap/react'
import { useLocalStorage } from '@mantine/hooks'
import { DragGesture, PinchGesture } from '@use-gesture/vanilla'
import {
  Canvas,
  FabricObject,
  FabricObjectProps,
  Group,
  loadSVGFromURL,
  ObjectEvents,
  Point,
  SerializedObjectProps,
  TBBox,
  util,
} from 'fabric'
import { gsap } from 'gsap'
import { nanoid } from 'nanoid'
import NextImage from 'next/image'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

import binIcon from '@/assets/icons/bin.svg'
import pickersArrow from '@/assets/paint/pickers-arrow.svg'
import saveArrow from '@/assets/paint/save-arrow.svg'
import undoIcon from '@/assets/paint/undo.svg'
import zoomInIcon from '@/assets/paint/zoom-in.svg'
import zoomOutIcon from '@/assets/paint/zoom-out.svg'
import Button from '@/components/button/Button'
import PageTitle from '@/components/pageTitle/PageTitle'
import ColourPicker from '@/components/paint/pickers/ColourPicker'
import StickerPicker from '@/components/paint/pickers/StickerPicker'
import { StickerTransform, usePaintHistoryState } from '@/hooks/usePaintHistoryState'
import usePaintStore from '@/hooks/usePaintStore'
import { createPNG } from '@/utils/canvasToPng'

import FabricCanvas from './FabricCanvas'
import styles from './PaintCanvas.module.scss'

type Props = {
  transitionStatus: TransitionStatus
  goToReview: () => void
  showFallbackMessage: boolean
}

const PaintCanvas: FC<Props> = ({ transitionStatus, goToReview, showFallbackMessage }) => {
  const stencilId = usePaintStore((state) => state.stencilId)
  const setImageFile = usePaintStore((state) => state.setImageFile)
  const canvas = useRef<Canvas>(null)
  const stencil = useRef<Group>()
  const canvasSizeGuide = useRef<HTMLDivElement>(null)
  const [colour, setColour] = useState('#F5C242')
  const [isStencilReady, setIsStencilReady] = useState(false)
  const [selectedStickerId, setSelectedStickerId] = useState<string>()
  const isStickerSelected = !!selectedStickerId

  const { present, addColour, removeSticker, modifySticker, undo } = usePaintHistoryState()

  const [delBtnCoords, setDelBtnCoords] = useState<{ top: number; left: number } | undefined>()

  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage<boolean>({
    key: 'designer-onboarding',
    defaultValue: false,
    getInitialValueInEffect: false,
  })

  useGSAP(() => {
    gsap.set(['#canvas'], { opacity: 0 })
    gsap.set(['#title *', '#controls', '#pickers', '#save'], { opacity: 0, scale: 1.2 })
    gsap.set(['#pickers-arrow', '#save-arrow'], { opacity: 0, scale: 0 })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      if (!hasSeenOnboarding)
        gsap
          .timeline()
          .to(['#title *', '#canvas', '#controls', '#pickers'], {
            opacity: 1,
            scale: 1,
            stagger: 0.2,
          })
          .to('#pickers-arrow', {
            scale: window.innerWidth < 410 ? 0.9 : 1,
            opacity: 1,
            delay: 0.5,
          })
          .to('#pickers-arrow', {
            scale: 0,
            opacity: 0,
            delay: 2.5,
          })
          .to('#save', {
            scale: 1,
            opacity: 1,
            delay: 0.25,
          })
          .to('#save-arrow', {
            scale: window.innerWidth < 410 ? 0.9 : 1,
            opacity: 1,
            delay: 0.25,
          })
          .to('#save-arrow', {
            scale: 0,
            opacity: 0,
            delay: 3,
          })
          .call(() => {
            setHasSeenOnboarding(true)
          })
      else
        gsap.to(['#title *', '#canvas', '#controls', '#pickers', '#save'], {
          opacity: 1,
          scale: 1,
          stagger: 0.2,
        })
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#title *', '#canvas', '#controls', '#pickers', '#save'], {
        opacity: 0,
        stagger: -0.15,
        y: (i) => (i + 1) * 16,
      })
    }
  }, [transitionStatus, hasSeenOnboarding])

  //  ON MOUNT SET STORED HISTORY ACTIONS
  useEffect(() => {
    if (!stencil.current || !canvas.current || !isStencilReady) return

    stencil.current.forEachObject((object) => {
      if (!object.get('paintId')) return
      const id = object.get('paintId')

      object.set({ fill: present?.colours?.[id] ?? '#ffffff' })
    })

    canvas.current.renderAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStencilReady])

  useEffect(() => {
    if (!stencil.current || !canvas.current) return

    stencil.current.forEachObject((object) => {
      if (!object.get('paintId')) return
      const id = object.get('paintId')
      object.set({ fill: present?.colours?.[id] ?? '#ffffff' })
    })

    canvas.current.renderAll()
  }, [present?.colours])

  const setDelBtnCoordsFromTarget = (
    target: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>,
  ) => {
    const targetBounds = target.getBoundingRect()
    const targetTop = targetBounds.top
    const targetLeft = targetBounds.left
    const targetWidth = targetBounds.width
    const targetHeight = targetBounds.height
    const targetBottom = targetTop + targetHeight
    setDelBtnCoords({ top: targetBottom + 100, left: targetLeft + targetWidth / 2 })
  }

  const addSticker = useCallback(
    async (path: string, initialStickerId?: string, transform?: StickerTransform) => {
      const res = await loadSVGFromURL(path)
      const objects = res.objects.filter((obj) => obj !== null) as FabricObject[]
      const sticker = new Group(objects, { ...res.options })
      const stencilBounds = stencil.current!.getBoundingRect()
      sticker.scale(0.5)
      sticker.setX(util.getRandomInt(stencilBounds.left, stencilBounds.left + stencilBounds.width - sticker.width))
      sticker.setY(util.getRandomInt(stencilBounds.top, stencilBounds.top + stencilBounds.height - sticker.height))
      sticker.rotate(util.getRandomInt(-30, 30))
      sticker.set({
        perPixelTargetFind: true,
        borderDashArray: [4, 4],
        borderColor: 'white',
        cornerSize: 16,
        cornerColor: 'white',
        cornerStrokeColor: 'black',
        transparentCorners: false,
        cornerStyle: 'circle',
        padding: 16,
        shadow: { offsetX: 0, offsetY: 6, blur: 6, color: 'rgba(0,0,0,0.3)' },
      })

      transform && sticker.set(transform)

      const stickerId = initialStickerId ?? nanoid()
      sticker.set('stickerId', stickerId)

      const getTopLeftForBounds = (
        targetBounds: TBBox,
        stencilBounds: TBBox,
        actualTop: number,
        actualLeft: number,
      ): { top: number; left: number; shouldUpdate?: boolean } => {
        const targetTop = targetBounds.top
        const targetLeft = targetBounds.left
        const targetBottom = targetTop + targetBounds.height
        const targetRight = targetLeft + targetBounds.width

        const stencilTop = stencilBounds.top
        const stencilLeft = stencilBounds.left
        const stencilBottom = stencilBounds.top + stencilBounds.height
        const stencilRight = stencilBounds.left + stencilBounds.width

        let top = actualTop
        let left = actualLeft

        if (targetTop < stencilTop) top = Math.max(top, stencilTop + top - targetTop)
        if (targetLeft < stencilLeft) left = Math.max(left, stencilLeft + left - targetLeft)
        if (targetBottom > stencilBottom) top = Math.min(top, stencilBottom - targetBounds.height + top - targetTop)
        if (targetRight > stencilRight) left = Math.min(left, stencilRight - targetBounds.width + left - targetLeft)

        const shouldUpdate = top !== targetTop || left !== targetLeft

        return { top, left, shouldUpdate }
      }

      sticker.on('moving', (e) => {
        setDelBtnCoords(undefined)

        const { target } = e.transform
        target.setCoords()

        const targetBounds = target.getBoundingRect()
        const stencilBounds = stencil.current!.getBoundingRect()
        const { top, left } = getTopLeftForBounds(targetBounds, stencilBounds, target.top, target.left)

        target.top = top
        target.left = left
      })

      sticker.on('scaling', (e) => {
        setDelBtnCoords(undefined)

        const { target, corner } = e.transform
        const maxScale = 1.2
        const minScale = 0.3

        if (['mt', 'mb'].includes(corner)) {
          target.scaleY = Math.max(minScale, Math.min(maxScale, target.scaleY))
        } else if (['ml', 'mr'].includes(corner)) {
          target.scaleX = Math.max(minScale, Math.min(maxScale, target.scaleX))
        } else {
          target.scaleX = Math.max(minScale, Math.min(maxScale, target.scaleX))
          target.scaleY = Math.max(minScale, Math.min(maxScale, target.scaleY))
        }

        target.setCoords()
        const targetBounds = target.getBoundingRect()
        const stencilBounds = stencil.current!.getBoundingRect()

        const { top, left, shouldUpdate } = getTopLeftForBounds(targetBounds, stencilBounds, target.top, target.left)
        if (!shouldUpdate) return

        target.top = top
        target.left = left
      })

      sticker.on('rotating', (e) => {
        setDelBtnCoords(undefined)
      })

      sticker.on('modified', ({ target, transform }): void => {
        setDelBtnCoordsFromTarget(target)

        const { flipX, flipY, height, width, angle, left, top, scaleX, scaleY } = target
        modifySticker(stickerId, { angle, flipX, flipY, height, left, scaleX, scaleY, top, width, path })
      })

      sticker.on('selected', ({ e, target }): void => {
        setDelBtnCoordsFromTarget(target)
        setSelectedStickerId(stickerId)
      })

      sticker.on('deselected', () => {
        setDelBtnCoords(undefined)

        setSelectedStickerId(undefined)
      })

      // Add sticker to canvas
      canvas.current!.add(sticker)
      canvas.current!.setActiveObject(sticker)
      canvas.current!.renderAll()

      if (!initialStickerId) {
        const { angle, flipX, flipY, height, left, scaleX, scaleY, top, width } = sticker
        modifySticker(stickerId, { angle, flipX, flipY, height, left, scaleX, scaleY, top, width, path })
      }
    },
    [modifySticker],
  )

  useEffect(() => {
    if (!canvas.current || !present) return

    let stickersInCanvas: string[] = []

    // update or remove any stickers that are currently in canvas
    canvas.current.forEachObject((object) => {
      if (!object.get('stickerId')) return

      const stickerId = object.get('stickerId')
      if (!present.stickers?.[stickerId]) return canvas.current?.remove(object)

      object.set({ ...present.stickers[stickerId], minX: 100 })
      stickersInCanvas.push(stickerId)
    })

    canvas.current!.renderAll()

    // add any stickers that aren't currently in canvas
    const stickersNotInCanvas = present.stickers
      ? Object.keys(present.stickers).filter((stickerId) => !stickersInCanvas.includes(stickerId))
      : []

    stickersNotInCanvas.forEach((stickerId) => {
      const sticker = present.stickers[stickerId]
      addSticker(sticker.path, stickerId, sticker)
    })
  }, [addSticker, present])

  useEffect(() => {
    if (!isStencilReady) return
    if (isStickerSelected) return

    const handlePathClick = (object: FabricObject) => {
      if (object.get('fill') === 'black') return
      if (object.get('fill') === 'rgb(0,0,0)') return
      if (object.get('fill') === colour) return

      const objectId = object.get('paintId')
      if (!objectId) return console.warn('No paintId found on object')
      if (!colour) return console.warn('No colour selected')

      object.set({ paintId: objectId })
      addColour({ [objectId]: colour })
    }

    stencil.current?.forEachObject((object) => {
      let time = 0
      object.on('mousedown', () => (time = new Date().getTime()))
      object.on('mouseup', () => {
        const isClick = new Date().getTime() - time < 200
        isClick && handlePathClick(object)
      })
    })

    return () => {
      stencil.current?.forEachObject((object) => {
        // @ts-ignore
        object.off('mousedown')
        // @ts-ignore
        object.off('mouseup')
      })
    }
  }, [addColour, colour, isStencilReady, isStickerSelected])

  const resetPan = async (duration = 0.3) => {
    const x = -canvas.current!.viewportTransform[4]
    const y = -canvas.current!.viewportTransform[5]
    const currentPosition = { x, y }

    await gsap.to(currentPosition, {
      x: 0,
      y: 0,
      duration,
      onUpdateParams: [currentPosition],
      onUpdate: ({ x, y }) => {
        canvas.current!.absolutePan(new Point(x, y))
        canvas.current!.renderAll()
      },
    })
  }

  const setupTouchEvents = useCallback(async () => {
    if (!canvas.current) return
    const canvasElement = canvas.current.getSelectionElement()
    const canvasRect = canvasElement.getBoundingClientRect()
    const canvasLeft = canvasRect.left
    const canvasTop = canvasRect.top

    // Setup panning
    new DragGesture(canvasElement, (state) => {
      if (canvas.current!.getActiveObject()) return
      if (canvas.current!.getZoom() === 1) return resetPan()
      const [deltaX, deltaY] = state.delta
      const deltaPoint = new Point(deltaX, deltaY)
      canvas.current!.relativePan(deltaPoint)
    })

    // Setup pinch to zoom
    new PinchGesture(canvasElement, (state: any) => {
      if (!canvas.current) return
      const [originX, originY] = state.origin
      const x = originX - canvasLeft
      const y = originY - canvasTop
      const point = new Point(x, y)
      const deltaZoom = (state.movement[0] - 1) * 0.1
      let zoom = canvas.current.getZoom() + deltaZoom
      zoom = Math.min(2.5, Math.max(1, zoom))
      canvas.current.zoomToPoint(point, zoom)
      if (zoom === 1) resetPan()
    })
  }, [])

  const loadStencil = useCallback(async () => {
    const res = await loadSVGFromURL(process.env.BASE_PATH + `/paint/stencils/${stencilId}.svg`)
    const objects = res.objects.filter((obj) => obj !== null) as FabricObject[]
    objects.forEach((object) => {
      object.objectCaching = false
    })

    stencil.current = new Group(objects, { ...res.options, subTargetCheck: true })
    stencil.current.selectable = false

    // Scale and center the SVG
    const scaleX = (canvas.current!.width / stencil.current.width) * 0.8
    const scaleY = (canvas.current!.height / stencil.current.height) * 0.8
    const scaleToFit = Math.min(scaleX, scaleY)
    stencil.current.scale(scaleToFit)
    stencil.current.set({
      left: canvas.current!.width / 2,
      top: canvas.current!.height / 2 + canvas.current!.height * 0.025,
      originX: 'center',
      originY: 'center',
    })

    canvas.current!.add(stencil.current)
    canvas.current!.renderAll()

    // Add paintId to each object
    stencil.current.forEachObject((object, index) => {
      object.selectable = false
      object.perPixelTargetFind = true

      if (object.get('fill') === 'black') return
      if (object.get('fill') === 'rgb(0,0,0)') return

      object.set({ paintId: index + 1 })
    })

    setIsStencilReady(true)
  }, [stencilId])

  const onCanvasLoad = useCallback(
    (canvas: Canvas) => {
      if (!canvasSizeGuide.current) {
        console.error('Canvas size guide not found')
        return
      }

      const width = canvasSizeGuide.current.clientWidth
      const height = canvasSizeGuide.current.clientHeight
      canvas.setDimensions({ width, height })

      setupTouchEvents()
      loadStencil()
    },
    [loadStencil, setupTouchEvents],
  )

  const zoom = (delta: number) => {
    if (!canvas.current) return

    const zoom = canvas.current.getZoom()

    const zoomTargetObj = { zoom }
    const centerPoint = canvas.current.getCenterPoint()

    gsap.to(zoomTargetObj, {
      zoom: Math.min(2.5, Math.max(1, zoom + delta)),
      duration: 0.3,
      onUpdateParams: [zoomTargetObj],
      onUpdate: ({ zoom }) => {
        canvas.current!.zoomToPoint(centerPoint, zoom)
        zoom === 1 && resetPan()
      },
    })
  }

  const saveImage = async () => {
    // Deselect any objects
    if (canvas.current!.getActiveObject()) canvas.current!.discardActiveObject()

    // Reset zoom and pan
    const centerPoint = canvas.current!.getCenterPoint()
    canvas.current!.zoomToPoint(centerPoint, 1)
    resetPan(0)

    const canvasEl = canvas.current?.elements.lower.el
    if (!canvasEl) return

    createPNG(canvasEl, (blob) => {
      const file = new File([blob], 'paint-your-pint.png', { type: 'image/png' })
      setImageFile(file)
      goToReview()
    })
  }

  const deleteObject = () => {
    if (selectedStickerId) removeSticker(selectedStickerId)
  }

  if (showFallbackMessage)
    return (
      <div className={styles.fallbackMessage}>
        <p>Oh. Unfortunately, Paint Your Pint requires the latest iOS version. Please update now. Vamos!</p>
      </div>
    )

  return (
    <>
      <PageTitle className={styles.header} id="title" title="Paint your pint" subtitle="Customise your artwork" />

      <div id="canvas" ref={canvasSizeGuide} className={styles.canvasSizeGuide}>
        <FabricCanvas ref={canvas} onLoad={onCanvasLoad} />
      </div>

      <div id="pickers" className={styles.pickers}>
        <NextImage id="pickers-arrow" src={pickersArrow} alt="" className={styles.pickersArrow} />
        <ColourPicker colour={colour} setColour={setColour} />
        <div className={styles.divider} />
        <StickerPicker
          onStickerClick={addSticker}
          selectedStickers={present?.stickers ? Object.values(present.stickers).map((sticker) => sticker.path) : []}
        />
      </div>

      <div id="controls" className={styles.controls}>
        <div className={styles.zoom}>
          <NextImage
            src={zoomInIcon}
            alt="Zoom In"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              zoom(0.5)
            }}
          />
          <div className={styles.divider} />
          <NextImage
            src={zoomOutIcon}
            alt="Zoom Out"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              zoom(-0.5)
            }}
          />
        </div>

        <div className={styles.undo}>
          <NextImage src={undoIcon} alt="Undo" onClick={undo} />
        </div>
      </div>

      <div id="save" className={styles.save}>
        <NextImage id="save-arrow" src={saveArrow} alt="" className={styles.saveArrow} />
        <Button variant="primary" arrowRight onClick={saveImage}>
          Save
        </Button>
      </div>

      {!!delBtnCoords && (
        <button
          className={styles.delete}
          style={{ top: delBtnCoords?.top, left: delBtnCoords?.left }}
          onClick={deleteObject}>
          <NextImage src={binIcon} alt="Delete" width={20} height={20} />
        </button>
      )}
    </>
  )
}

export default PaintCanvas
