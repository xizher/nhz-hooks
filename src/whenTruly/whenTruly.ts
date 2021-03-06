import { watch, WatchSource, onScopeDispose, WatchStopHandle, getCurrentScope } from 'vue'
import { isNullable, Nullable } from '@fssgis/utils'

export function whenTruly<T> (source: WatchSource<Nullable<T>>, callback?: (source: T) => void) : Promise<T> {
  let stop : Nullable<WatchStopHandle> = null
  if (getCurrentScope()) {
    onScopeDispose(() => stop?.())
  }
  return new Promise(resolve => {
    stop = watch(source, val => {
      if (!isNullable(val)) {
        callback?.(val)
        stop?.()
        resolve(val)
      }
    }, { immediate: true })
  })
}

export default whenTruly
