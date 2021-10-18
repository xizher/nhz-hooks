import { watchEffect, onScopeDispose } from 'vue'
import { Fn, makeDestructurable, makeInterval, Nullable } from '@nhz/utils'
import { get, MayBeRef } from '../base'

export function useInterval (callback: MayBeRef<Fn>, ms?: MayBeRef<number>) {
  let _stop: Nullable<Fn>
  const stop = () => _stop?.()

  watchEffect((onInvalidate) => {
    onInvalidate(() => stop())
    const _callback = get(callback)
    const _ms = get(ms)
    _stop = makeInterval(_callback, _ms)
  })
  onScopeDispose(() => stop())
  return makeDestructurable(
    { stop } as const,
    [stop] as const,
  )
}

export default useInterval
