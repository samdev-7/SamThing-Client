/**
 * Handles incoming WebSocket data from the server.
 *
 * This is a minimal handler that processes basic server messages.
 * Add your own handlers here as needed.
 */

import { useSettingsStore, useWebSocketStore, useTimeStore } from '@src/stores'
import Logger from './Logger'
import {
  DESKTHING_DEVICE,
  DeskThingToDeviceCore,
  DEVICE_DESKTHING,
  DeviceToDeskthingData
} from '@deskthing/types'

type DeskThingToDevice<T extends DESKTHING_DEVICE> = Extract<DeskThingToDeviceCore, { type: T }>

type SocketHandler = {
  [T in DESKTHING_DEVICE]: (data: DeskThingToDevice<T>) => Promise<void> | void
}

const sendData = async (data: DeviceToDeskthingData) => {
  const send = useWebSocketStore.getState().send
  await send(data)
}

const handleGetManifest = async (data: DeskThingToDevice<DESKTHING_DEVICE.GET>) => {
  switch (data.request) {
    case 'manifest': {
      const manifest = useSettingsStore.getState().manifest

      const returnData: DeviceToDeskthingData = {
        type: DEVICE_DESKTHING.MANIFEST,
        app: 'server',
        payload: manifest
      }

      Logger.info('Sending manifest', returnData)
      await sendData(returnData)
      break
    }
    default:
      Logger.debug('Unknown request type: ', data.request)
  }
}

const HANDLE_ERROR = (data: DeskThingToDevice<DESKTHING_DEVICE.ERROR>) => {
  Logger.error('Received error', data.payload)
}

const HANDLE_PONG = (_data: DeskThingToDevice<DESKTHING_DEVICE.PONG>) => {
  // Heartbeat response - do nothing
}

const HANDLE_PING = (_data: DeskThingToDevice<DESKTHING_DEVICE.PING>) => {
  // Heartbeat request - do nothing
}

const HANDLE_HEARTBEAT = (_data: DeskThingToDevice<DESKTHING_DEVICE.HEARTBEAT>) => {
  // Heartbeat - do nothing
}

const HANDLE_CONFIG = (data: DeskThingToDevice<DESKTHING_DEVICE.CONFIG>) => {
  const updateConfig = useSettingsStore.getState().updatePreferences
  Logger.debug('Received config', data)
  updateConfig(data.payload)
}

const HANDLE_TIME = (data: DeskThingToDevice<DESKTHING_DEVICE.TIME>) => {
  const syncTime = useTimeStore.getState().syncTime

  if (typeof data.payload === 'string') return // not useful

  if (data.payload.utcTime && data.payload.timezoneOffset) {
    syncTime(data.payload.utcTime, data.payload.timezoneOffset)
  }
}

// Default handler for unimplemented message types
const HANDLE_DEFAULT = (data: DeskThingToDeviceCore) => {
  Logger.debug('Unhandled message type:', data.type)
}

const socketHandlers: SocketHandler = {
  [DESKTHING_DEVICE.GET]: handleGetManifest,
  [DESKTHING_DEVICE.ERROR]: HANDLE_ERROR,
  [DESKTHING_DEVICE.PONG]: HANDLE_PONG,
  [DESKTHING_DEVICE.PING]: HANDLE_PING,
  [DESKTHING_DEVICE.HEARTBEAT]: HANDLE_HEARTBEAT,
  [DESKTHING_DEVICE.CONFIG]: HANDLE_CONFIG,
  [DESKTHING_DEVICE.TIME]: HANDLE_TIME,
  // Minimal handlers for other message types
  [DESKTHING_DEVICE.GLOBAL_SETTINGS]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.MAPPINGS]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.SETTINGS]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.APPS]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.ICON]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.META_DATA]: HANDLE_DEFAULT,
  [DESKTHING_DEVICE.MUSIC]: HANDLE_DEFAULT
}

export const handleServerSocket = async (data: DeskThingToDeviceCore): Promise<void> => {
  const handler = socketHandlers[data.type]

  if (handler) {
    await handler(data as any)
  } else {
    Logger.debug('No handler for message type:', data.type)
  }
}
