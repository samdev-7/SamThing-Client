import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ClientConfigurations,
  ClientManifest,
  DEVICE_DESKTHING,
  DeviceToDeskthingData
} from '@deskthing/types'
import useWebSocketStore from './websocketStore'
import { defaultManifest } from '@src/constants/defaultManifest'
import { defaultPreferences } from '@src/constants/defaultPreferences'
import Logger from '@src/utils/Logger'

export interface SettingsState {
  manifest: ClientManifest
  preferences: ClientConfigurations
  flags: Record<string, boolean>
  updateManifest: (settings: Partial<ClientManifest>) => void
  updatePreferences: (preferences: Partial<ClientConfigurations>) => void
  checkFlag: (key: string) => boolean
  setFlag: (key: string, value: boolean) => void
}

/**
 * Settings store for client configuration and manifest.
 * Persists settings to localStorage.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      manifest: defaultManifest,
      preferences: defaultPreferences,
      flags: {},
      updateManifest: (newSettings) => {
        set((state) => {
          const combinedManifest = { ...state.manifest, ...newSettings }

          const updatePayload: DeviceToDeskthingData = {
            type: DEVICE_DESKTHING.MANIFEST,
            app: 'server',
            payload: combinedManifest
          }
          const send = useWebSocketStore.getState().send

          Logger.debug('Sending manifest update to server')

          send(updatePayload)

          return {
            manifest: combinedManifest
          }
        })
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      checkFlag: (key) => {
        return get().flags[key] || false
      },
      setFlag: (key, value) => {
        set((state) => ({
          flags: { ...state.flags, [key]: value }
        }))
      }
    }),
    {
      name: 'samthing-settings-storage',
      partialize: (state) => ({
        manifest: state.manifest,
        preferences: state.preferences,
        flags: state.flags
      }),
      onRehydrateStorage: () => (state) => {
        let manifestLoaded = false

        // Listen for manifestLoaded event from public/manifest-loader.js
        const handleManifestLoaded = () => {
          if (!manifestLoaded && window.manifest && state) {
            manifestLoaded = true
            console.log('Manifest loaded from window', window.manifest)
            state.updateManifest(window.manifest)
            document.removeEventListener('manifestLoaded', handleManifestLoaded)
          }
        }

        document.addEventListener('manifestLoaded', handleManifestLoaded)

        // Fallback timeout
        setTimeout(() => {
          if (!manifestLoaded && window.manifest && state) {
            manifestLoaded = true
            console.log('Manifest loaded via fallback', window.manifest)
            state.updateManifest(window.manifest)
            document.removeEventListener('manifestLoaded', handleManifestLoaded)
          }
        }, 500)
      }
    }
  )
)
