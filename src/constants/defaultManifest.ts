import { ClientConnectionMethod, ClientManifest, ClientPlatformIDs } from '@deskthing/types'

export const defaultManifest: ClientManifest = {
  name: 'SamThing',
  id: 'samthing',
  short_name: 'SamThing',
  description: 'A streamlined client for phone-like devices',
  context: {
    method: ClientConnectionMethod.Unknown,
    id: ClientPlatformIDs.Unknown,
    name: 'Unknown Connection Method',
    ip: '192.168.159.1',
    port: 8891
  },
  reactive: false,
  author: '',
  version: '0.0.1',
  compatibility: {
    server: '>=0.11.0',
    app: '>=0.10.0'
  },
  repository: ''
}
