import { watchEffect } from 'vue'
import { Fn, makeDestructurable, makeInterval, Nullable } from 'utils'
import { get, MayBeRef } from '../base'
import { tryOnBeforeUnmount } from '@vueuse/core'

export function useInterval (callback: MayBeRef<Fn>, ms?: MayBeRef<number>) {
  let _stop: Nullable<Fn>
  const stop = () => _stop?.()

  watchEffect(() => {
    stop()
    const _callback = get(callback)
    const _ms = get(ms)
    _stop = makeInterval(_callback, _ms)
  })
  tryOnBeforeUnmount(() => stop())
  return makeDestructurable(
    { stop } as const,
    [stop] as const,
  )
}

export default useInterval
