import { Fn } from '@fssgis/utils'
import { get, MayBeRef } from '../base'
import { reactive, watchEffect, computed, toRefs } from 'vue'

export interface PromiseHook<T> {
  result: T
  loaded: boolean
  error: unknown
  success: boolean
}

export function usePromise <T> (promise: MayBeRef<Fn<Promise<T>> | Promise<T>>, initialValue: T) {
  const state = reactive({
    result: initialValue,
    loaded: false,
    error: null,
    success: computed<boolean>(() => state.loaded && !state.error)
  }) as PromiseHook<T>
  watchEffect(() => {
    const _promise = get(promise)
    if (typeof _promise === 'function') {
      _promise()
        .then(res => {
          state.result = res
          // state.loaded = true
        })
        .catch(err => {
          state.error = err
          // state.loaded = true
        })
        .finally(() => state.loaded = true) // sth. wrong
    } else {
      _promise
        .then(res => {
          state.result = res
          // state.loaded = true
        })
        .catch(err => {
          state.error = err
          // state.loaded = true
        })
        .finally(() => state.loaded = true)
    }
  })
  return toRefs(state)
}

export default usePromise
