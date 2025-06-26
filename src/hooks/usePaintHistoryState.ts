// https://github.com/uidotdev/usehooks/blob/main/index.js

import { Group } from 'fabric/*'
import { useCallback, useEffect, useReducer, useRef } from 'react'

export type Sticker = Group & { stickerId: string }

export type StickerTransform = {
  angle: number
  flipX: boolean
  flipY: boolean
  height: number
  left: number
  scaleX: number
  scaleY: number
  top: number
  width: number
  path: string
}

type PaintHistoryState = {
  colours: Record<string, string>
  stickers: Record<string, StickerTransform>
  activeStickerId?: string
}

export type PaintHistory = {
  present: PaintHistoryState
  past: PaintHistoryState[]
  addColour: (newPaintStep: Record<string, string>) => void
  modifySticker: (stickerId: string, transform: StickerTransform) => void
  removeSticker: (stickerId: string) => void
  undo: () => void
  canUndo: boolean
}

export const PAINT_ACTIONS_STORAGE_KEY = 'paint-actions'

type HistoryState = {
  past: PaintHistoryState[]
  present: PaintHistoryState[] | null
}

const EMPTY_USE_HISTORY_STATE: HistoryState = {
  past: [],
  present: null,
}

enum ActionType {
  UNDO = 'UNDO',
  ADD_COLOUR = 'ADD_COLOUR',
  MODIFY_STICKER = 'MODIFY_STICKER',
  REMOVE_STICKER = 'REMOVE_STICKER',
}

type Action =
  | { type: ActionType.UNDO }
  | { type: ActionType.ADD_COLOUR; newPaintStep: Record<string, string> }
  | { type: ActionType.MODIFY_STICKER; stickerId: string; transform: StickerTransform }
  | { type: ActionType.REMOVE_STICKER; stickerId: string }

function usePaintHistoryStateReducer(
  state: { past: PaintHistoryState[]; present: PaintHistoryState },
  action: Action,
): { past: PaintHistoryState[]; present: PaintHistoryState } {
  const { past, present } = state

  if (action.type === ActionType.UNDO) {
    const newPast = past.slice(0, past.length - 1)
    const newPresent = past[past.length - 1]
    return { past: newPast, present: newPresent }
  }

  if (action.type === ActionType.ADD_COLOUR) {
    const { newPaintStep } = action
    const newPast = [...past, present]
    const newPresent = { ...present, colours: { ...present?.colours, ...newPaintStep } }
    return { past: newPast, present: newPresent }
  }

  if (action.type === ActionType.MODIFY_STICKER) {
    const { stickerId, transform } = action
    const newPast = [...past, present]
    const newStickers = { ...present?.stickers, [stickerId]: transform }
    const newPresent = { ...present, stickers: newStickers, activeStickerId: stickerId }
    return { past: newPast, present: newPresent }
  }

  if (action.type === ActionType.REMOVE_STICKER) {
    const { stickerId } = action
    const newPast = [...past, present]
    const newStickers = Object.keys(present.stickers).reduce((acc, key) => {
      if (key !== stickerId) acc[key] = present.stickers[key]
      return acc
    }, {} as Record<string, StickerTransform>)
    const newPresent = { ...present, stickers: newStickers, activeStickerId: undefined }
    return { past: newPast, present: newPresent }
  }

  throw new Error('Unsupported action type')
}
export function usePaintHistoryState(initialPresent?: PaintHistoryState): PaintHistory {
  const savedState = localStorage.getItem(PAINT_ACTIONS_STORAGE_KEY)

  const [state, dispatch] = useReducer(usePaintHistoryStateReducer, {
    ...(savedState ? JSON.parse(savedState) : EMPTY_USE_HISTORY_STATE),
  })

  const canUndo = state.past.length !== 0

  const undo = useCallback(() => canUndo && dispatch({ type: ActionType.UNDO }), [canUndo])

  const modifySticker = useCallback((stickerId: string, transform: StickerTransform) => {
    dispatch({ type: ActionType.MODIFY_STICKER, stickerId, transform })
  }, [])
  const removeSticker = useCallback((stickerId: string) => dispatch({ type: ActionType.REMOVE_STICKER, stickerId }), [])

  const addColour = useCallback(
    (newPaintStep: Record<string, string>) => dispatch({ type: ActionType.ADD_COLOUR, newPaintStep }),
    [],
  )

  // Save state to local storage when it changes
  useEffect(() => {
    localStorage.setItem(PAINT_ACTIONS_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return { present: state.present, past: state.past, addColour, removeSticker, modifySticker, undo, canUndo }
}
