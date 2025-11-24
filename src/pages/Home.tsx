import { useEffect, useState } from 'react'
import { useWebSocketStore } from '@src/stores/websocketStore'
import { useUIStore } from '@src/stores/uiStore'
import { useTimeStore } from '@src/stores/timeStore'
import { EventMode } from '@deskthing/types'
import {
  BUTTON_TOP_1,
  BUTTON_TOP_2,
  BUTTON_TOP_3,
  BUTTON_TOP_4,
  BUTTON_WHEEL_PRESS,
  BUTTON_BACK,
  BUTTON_MENU,
  DEGREES_PER_STEP
} from '@src/constants/deviceButtons'

export default function Home() {
  const { isConnected } = useWebSocketStore()
  const { wheelRotation, registerKeyHandler } = useUIStore()
  const { currentTimeFormatted } = useTimeStore()

  const [counter, setCounter] = useState(0)
  const [lastButton, setLastButton] = useState<string>('None')
  const [lastKeyCode, setLastKeyCode] = useState<string>('--')
  const [lastEventMode, setLastEventMode] = useState<string>('--')

  useEffect(() => {
    // Register a catch-all handler to debug ALL key presses
    const unregisterDebug = registerKeyHandler('debug-all', (code, eventMode) => {
      setLastKeyCode(code)
      setLastEventMode(
        eventMode === EventMode.PressShort
          ? 'Short'
          : eventMode === EventMode.PressLong
            ? 'Long'
            : String(eventMode)
      )
      return false // Don't consume, let other handlers process
    })

    // Register Top Button 1 to increment counter
    const unregisterBtn1 = registerKeyHandler(BUTTON_TOP_1, (code, eventMode) => {
      if (
        code === BUTTON_TOP_1 &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setCounter((prev) => prev + 1)
        setLastButton('Button 1 (+1)')
        return true
      }
      return false
    })

    // Register Top Button 2 to reset counter
    const unregisterBtn2 = registerKeyHandler(BUTTON_TOP_2, (code, eventMode) => {
      if (
        code === BUTTON_TOP_2 &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setCounter(0)
        setLastButton('Button 2 (Reset)')
        return true
      }
      return false
    })

    // Register Top Button 3
    const unregisterBtn3 = registerKeyHandler(BUTTON_TOP_3, (code, eventMode) => {
      if (
        code === BUTTON_TOP_3 &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('Button 3')
        return true
      }
      return false
    })

    // Register Top Button 4
    const unregisterBtn4 = registerKeyHandler(BUTTON_TOP_4, (code, eventMode) => {
      if (
        code === BUTTON_TOP_4 &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('Button 4')
        return true
      }
      return false
    })

    // Register Menu Button (top right M key)
    const unregisterMenu = registerKeyHandler(BUTTON_MENU, (code, eventMode) => {
      if (
        code === BUTTON_MENU &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('Menu Button (M)')
        return true
      }
      return false
    })

    // Register Wheel Press (Enter)
    const unregisterWheelPress = registerKeyHandler(BUTTON_WHEEL_PRESS, (code, eventMode) => {
      if (
        code === BUTTON_WHEEL_PRESS &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('Wheel Press (Enter)')
        return true
      }
      return false
    })

    // Register Back Button (Escape)
    const unregisterBack = registerKeyHandler(BUTTON_BACK, (code, eventMode) => {
      if (
        code === BUTTON_BACK &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('Back Button (Esc)')
        return true
      }
      return false
    })

    // Register arrow keys for tracking
    const unregisterUp = registerKeyHandler('ArrowUp', (code, eventMode) => {
      if (
        code === 'ArrowUp' &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('↑ Arrow Up')
        return false // Let default handler also process it
      }
      return false
    })
    const unregisterDown = registerKeyHandler('ArrowDown', (code, eventMode) => {
      if (
        code === 'ArrowDown' &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('↓ Arrow Down')
        return false
      }
      return false
    })
    const unregisterLeft = registerKeyHandler('ArrowLeft', (code, eventMode) => {
      if (
        code === 'ArrowLeft' &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('← Arrow Left')
        return false
      }
      return false
    })
    const unregisterRight = registerKeyHandler('ArrowRight', (code, eventMode) => {
      if (
        code === 'ArrowRight' &&
        (eventMode === EventMode.PressShort || eventMode === EventMode.PressLong)
      ) {
        setLastButton('→ Arrow Right')
        return false
      }
      return false
    })

    // Cleanup on unmount
    return () => {
      unregisterDebug()
      unregisterBtn1()
      unregisterBtn2()
      unregisterBtn3()
      unregisterBtn4()
      unregisterMenu()
      unregisterWheelPress()
      unregisterBack()
      unregisterUp()
      unregisterDown()
      unregisterLeft()
      unregisterRight()
    }
  }, [registerKeyHandler])

  return (
    <div className="w-[800px] h-[480px] bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="flex flex-col h-full gap-3 p-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">SamThing Client</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span className="text-xs text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <span className="ml-2 text-xs text-gray-400">|</span>
            <span className="ml-2 font-mono text-sm">{currentTimeFormatted || '--:--'}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid flex-1 grid-cols-2 gap-3">
          {/* Counter - Larger, left column */}
          <div className="flex flex-col p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <h2 className="mb-2 text-sm font-semibold text-gray-300">Counter</h2>
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="mb-3 font-bold text-7xl">{counter}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCounter((prev) => prev + 1)
                    setLastButton('Button 1 (+1)')
                  }}
                  className="px-4 py-2 text-sm transition bg-blue-600 rounded hover:bg-blue-700"
                >
                  +1 (Button 1)
                </button>
                <button
                  onClick={() => {
                    setCounter(0)
                    setLastButton('Button 2 (Reset)')
                  }}
                  className="px-4 py-2 text-sm transition bg-red-600 rounded hover:bg-red-700"
                >
                  Reset (Button 2)
                </button>
              </div>
            </div>
          </div>

          {/* Right column - stacked info */}
          <div className="flex flex-col gap-3">
            {/* Debug: Raw Key Codes */}
            <div className="flex-1 p-3 bg-gray-800 border border-yellow-600 rounded-lg">
              <h2 className="mb-2 text-sm font-semibold text-yellow-300">DEBUG: Raw Input</h2>
              <p className="text-xs text-gray-400">
                Code: <span className="font-mono text-yellow-400">{lastKeyCode}</span>
              </p>
              <p className="text-xs text-gray-400">
                Mode: <span className="font-mono text-yellow-400">{lastEventMode}</span>
              </p>
            </div>

            {/* Last Button */}
            <div className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <h2 className="mb-2 text-sm font-semibold text-gray-300">Last Button</h2>
              <p className="font-mono text-lg text-yellow-400 truncate">{lastButton}</p>
            </div>

            {/* Wheel Rotation */}
            <div className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <h2 className="mb-2 text-sm font-semibold text-gray-300">Wheel (Steps)</h2>
              <div className="flex items-baseline gap-2">
                <p className="font-mono text-3xl text-green-400">{wheelRotation}</p>
                <p className="text-sm text-gray-500">
                  ({Math.round(wheelRotation * DEGREES_PER_STEP)}°)
                </p>
              </div>
              <p className="mt-1 text-xs text-gray-500">18 steps = 360°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
