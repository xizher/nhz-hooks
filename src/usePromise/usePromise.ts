import { Fn } from '@fssgis/utils'
import { get, MayBeRef } from '../base'
import { reactive, computed, toRefs, watch, ref } from 'vue'

export interface PromiseHook<T> {
  result: T
  loaded: boolean
  error: unknown
  success: boolean
}

export function usePromise <T> (promise: MayBeRef<Fn<Promise<T>> | Promise<T>>, initialValue: T) {
  promise = ref(promise)

  const state = reactive({
    result: initialValue,
    loaded: false,
    error: null,
    success: computed<boolean>(() => state.loaded && !state.error)
  }) as PromiseHook<T>
  const execute = async () => {
    state.loaded = false
    state.error = null
    const _promise = get(promise)
    const ret = (typeof _promise === 'function'
      ? _promise() : _promise)
      .then(res => state.result = res)
      .catch(err => state.error = err)
      .finally(() => state.loaded = true)
    return await ret
  }
  watch(promise, () => execute(), { immediate: true })
  return { ...toRefs(state), execute }
}

export default usePromise
