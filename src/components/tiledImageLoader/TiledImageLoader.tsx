'use client'

import React, { Dispatch, type FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import styles from './TiledImageLoader.module.scss'

const DEFAULT_TILE_SIZE = 292

type TiledImageLoaderProps = {
  tiledImagePath: string
  renderTileContent: (row: number, col: number) => JSX.Element | null
  cols: number
  rows: number
}

const TiledImageLoader: FC<TiledImageLoaderProps> = ({ tiledImagePath, renderTileContent, cols, rows }) => {
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const viewport = useMemo(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }

    const rect = containerRef.current?.getBoundingClientRect()
    return {
      width: rect?.width || window.innerWidth,
      height: rect?.height || window.innerHeight,
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2
    }
  }, [])

  const [tilesDistanceToViewport, setTilesDistanceToViewport] = useState<{ [key: string]: number }>({})
  const [loadedTiles, setLoadedTiles] = useState<{ [key: string]: boolean }>({})

  const tilesOrderedByDistance = useMemo(() => {
    return Object.entries(tilesDistanceToViewport)
      .sort((a, b) => a[1] - b[1])
      .map(([key]) => key)
  }, [tilesDistanceToViewport])

  useEffect(() => {
    const loadImage = (key: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = `${tiledImagePath}/row-${key.split('-')[0]}-column-${key.split('-')[1]}.webp`
        img.onload = () => {
          setLoadedTiles((prev) => ({ ...prev, [key]: true }))
          resolve()
        }
        img.onerror = reject
      })
    }

    const loadImagesSequentially = async () => {
      for (const key of tilesOrderedByDistance) {
        try {
          await loadImage(key)
        } catch (error) {
          console.error(`Failed to load image: ${key}`, error)
        }
      }
    }

    loadImagesSequentially()
  }, [tiledImagePath, tilesOrderedByDistance])

  return (
    <div className={styles.container} ref={containerRef}>
      <TransformWrapper
        initialScale={0.675}
        minScale={0.475}
        maxScale={1}
        centerOnInit
        centerZoomedOut
        limitToBounds
        disablePadding
        onInit={() => setIsReady(true)}
        panning={{
          velocityDisabled: true,
        }}
        pinch={{ step: 0.001 }}>
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}>
          <div
            className={styles.tileContainer}
            style={{
              width: `${cols * DEFAULT_TILE_SIZE}px`,
              height: `${rows * DEFAULT_TILE_SIZE}px`,
              gridTemplateColumns: `repeat(${cols - 1}, ${DEFAULT_TILE_SIZE}px) auto`,
              gridTemplateRows: `repeat(${rows - 1}, ${DEFAULT_TILE_SIZE}px) auto`,
            }}>
            {rows * cols
              ? Array.from({ length: rows * cols }).map((_, index) => {
                  const currentRow = Math.floor(index / cols) + 1
                  const currentCol = (index % cols) + 1

                  return (
                    <Tile
                      key={'cell-' + index}
                      index={index}
                      isReady={isReady}
                      tiledImagePath={tiledImagePath}
                      renderTileContent={renderTileContent}
                      currentRow={currentRow}
                      currentCol={currentCol}
                      viewport={viewport}
                      setTilesDistanceToViewport={setTilesDistanceToViewport}
                      shouldShowImage={loadedTiles[`${currentRow}-${currentCol}`]}
                      tileSize={DEFAULT_TILE_SIZE}
                    />
                  )
                })
              : null}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default TiledImageLoader

type TileProps = {
  isReady: boolean
  index: number
  tiledImagePath: string
  renderTileContent: (row: number, col: number) => JSX.Element | null
  currentRow: number
  currentCol: number
  viewport: {
    width: number
    height: number
  }
  setTilesDistanceToViewport: Dispatch<SetStateAction<{ [key: string]: number }>>
  shouldShowImage: boolean
  tileSize: number
}

const Tile: FC<TileProps> = ({
  tiledImagePath,
  isReady,
  index,
  renderTileContent,
  currentRow,
  currentCol,
  viewport,
  setTilesDistanceToViewport,
  shouldShowImage: shouldLoadImage = false,
  tileSize,
}) => {
  const tileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isReady) return

    if (tileRef.current) {
      const tileRect = tileRef.current.getBoundingClientRect()
      const tileMidX = tileRect.left + tileRect.width / 2
      const tileMidY = tileRect.top + tileRect.height / 2

      const viewportMidX = viewport.width / 2
      const viewportMidY = viewport.height / 2

      const distanceX = Math.abs(tileMidX - viewportMidX)
      const distanceY = Math.abs(tileMidY - viewportMidY)

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      setTilesDistanceToViewport((prev) => ({ ...prev, [`${currentRow}-${currentCol}`]: distance }))
    }
  }, [isReady, index, viewport, currentRow, currentCol, setTilesDistanceToViewport])

  return (
    <div
      id={`tile-${currentRow}-${currentCol}`}
      ref={tileRef}
      className={styles.tile}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: tileSize,
        maxHeight: tileSize,
      }}>
      {shouldLoadImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${tiledImagePath}/row-${currentRow}-column-${currentCol}.webp`}
          alt=""
          onLoad={() => {
            if (!tileRef.current) return
            tileRef.current.style.opacity = '1'
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
      {shouldLoadImage && <div className={styles.tileContent}>{renderTileContent(currentRow, currentCol)}</div>}
    </div>
  )
}
