import { watchEffect } from 'vue'
import { Fn, makeDestructurable, makeTimeout, Nullable } from '@nhz/utils'
import { get, MayBeRef } from '../base'
import { tryOnBeforeUnmount } from '@vueuse/core'

export function useTimeout (callback: MayBeRef<Fn>, ms?: MayBeRef<number>) {
  let _stop: Nullable<Fn>
  const stop = () => _stop?.()

  watchEffect(() => {
    stop()
    const _callback = get(callback)
    const _ms = get(ms)
    _stop = makeTimeout(_callback, _ms)
  })
  tryOnBeforeUnmount(() => stop())
  return makeDestructurable(
    { stop } as const,
    [stop] as const,
  )
}

export default useTimeout
