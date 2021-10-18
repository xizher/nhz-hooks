import { watch, WatchSource, onScopeDispose, WatchStopHandle } from 'vue'
import { isNullable, Nullable } from '../../../utils/src'

export function whenTruly<T> (source: WatchSource<Nullable<T>>, callback: (source: T) => void) {
  let stop : Nullable<WatchStopHandle> = null
  stop = watch(source, val => {
    if (!isNullable(val)) {
      callback(val as T)
      stop?.()
    }
  }, { immediate: true })
  onScopeDispose(() => stop?.())
}

export default whenTruly
