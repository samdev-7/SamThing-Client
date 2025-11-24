import { useEffect } from 'react'
import { EventMode } from '@deskthing/types'
import { useUIStore } from '@src/stores/uiStore'

/**
 * The `ButtonListener` component is responsible for handling keyboard and mouse wheel events.
 *
 * It sets up event listeners for `keydown`, `keyup`, and `wheel` events, and dispatches them
 * to the UI store's button event handler, which can be intercepted by registered key handlers.
 *
 * The component also manages the state of button presses, including handling long presses
 * and differentiating between short and long presses.
 */
export const ButtonListener = () => {
  const setWheelRotation = useUIStore((state) => state.setWheelRotation)
  const handleButton = useUIStore((state) => state.buttonEventHandler)

  useEffect(() => {
    const longPressTimeouts = new Map<string, number>()
    const buttonStates: { [key: string]: EventMode } = {}

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.code === 'Enter' || e.code === 'Escape') e.preventDefault()

      // Already fired long press; ignore further keydowns while held
      if (buttonStates[e.code] === EventMode.PressLong) return

      if (!longPressTimeouts.has(e.code)) {
        const timeout = window.setTimeout(() => {
          buttonStates[e.code] = EventMode.PressLong
          handleButton(e.code, EventMode.PressLong)
        }, 400)
        longPressTimeouts.set(e.code, timeout)
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.code === 'Enter' || e.code === 'Escape') e.preventDefault()

      if (buttonStates[e.code] !== EventMode.PressLong) {
        handleButton(e.code, EventMode.PressShort)
      }
      delete buttonStates[e.code]

      if (longPressTimeouts.has(e.code)) {
        clearTimeout(longPressTimeouts.get(e.code)!)
        longPressTimeouts.delete(e.code)
      }
    }

    const wheelHandler = (event: WheelEvent) => {
      if (event.defaultPrevented) return
      const { deltaX, deltaY } = event
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setWheelRotation((prev) => prev + (deltaX > 0 ? 1 : -1))
      } else {
        setWheelRotation((prev) => prev + (deltaY > 0 ? 1 : -1))
      }
    }

    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)
    window.addEventListener('wheel', wheelHandler, { passive: true })

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
      window.removeEventListener('keyup', keyUpHandler)
      window.removeEventListener('wheel', wheelHandler)
      longPressTimeouts.forEach((t) => clearTimeout(t))
    }
  }, [handleButton, setWheelRotation])

  return null
}
