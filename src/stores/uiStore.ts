import { create } from 'zustand'
import { EventMode } from '@deskthing/types'

type KeyHandler = (code: string, eventMode: EventMode) => boolean // return true if handled

interface UIState {
  wheelRotation: number
  setWheelRotation: (indexOrUpdater: number | ((prev: number) => number)) => void

  // Button related functions
  buttonEventHandler: (code: string, eventMode?: EventMode) => void
  keyHandlers: Map<string, KeyHandler>
  registerKeyHandler: (id: string, handler: KeyHandler) => () => void
}

/**
 * UI store for managing button inputs and UI state.
 * Provides a system for registering custom key handlers.
 */
export const useUIStore = create<UIState>((set, get) => ({
  wheelRotation: 0,
  keyHandlers: new Map(),
  setWheelRotation: (indexOrUpdater) =>
    set((state) => ({
      wheelRotation:
        typeof indexOrUpdater === 'function' ? indexOrUpdater(state.wheelRotation) : indexOrUpdater
    })),
  buttonEventHandler: (code, eventMode) => {
    const keyHandlers = get().keyHandlers

    // Try registered handlers first
    for (const [, handler] of keyHandlers) {
      if (handler(code, eventMode)) {
        return // Handler consumed the event
      }
    }

    // Only handle press events
    if (eventMode && eventMode != EventMode.PressLong && eventMode != EventMode.PressShort) {
      return
    }

    // Default handlers for arrow keys
    switch (code) {
      case 'ArrowUp':
        set((state) => ({ wheelRotation: state.wheelRotation - 1 }))
        break
      case 'ArrowDown':
        set((state) => ({ wheelRotation: state.wheelRotation + 1 }))
        break
      case 'ArrowRight':
        set((state) => ({ wheelRotation: state.wheelRotation + 1 }))
        break
      case 'ArrowLeft':
        set((state) => ({ wheelRotation: state.wheelRotation - 1 }))
        break
      default:
        break
    }
  },
  registerKeyHandler: (id, handler) => {
    set((state) => {
      const newHandlers = new Map(state.keyHandlers)
      newHandlers.set(id, handler)
      return { keyHandlers: newHandlers }
    })
    return () => {
      set((state) => {
        const newHandlers = new Map(state.keyHandlers)
        newHandlers.delete(id)
        return { keyHandlers: newHandlers }
      })
    }
  }
}))
