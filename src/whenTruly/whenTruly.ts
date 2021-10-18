import { watch, WatchSource } from 'vue'
import { isNullable, Nullable } from '../../../utils/src'
import { tryOnBeforeUnmount } from '@vueuse/core'

export function whenTruly<T> (source: WatchSource<Nullable<T>>, callback: (source: T) => void) {
  const stop = watch(source, val => {
    if (!isNullable(val)) {
      callback(val as T)
      stop?.()
    }
  }, { immediate: true })
  tryOnBeforeUnmount(() => stop?.())
}

export default whenTruly
