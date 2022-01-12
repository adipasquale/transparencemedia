import path from 'path'

export default `${path.dirname(new URL(import.meta.url).pathname)}/../..`
