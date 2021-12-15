import { watchEffect, onScopeDispose } from 'vue'
import { Fn, makeDestructurable, makeEventListener, Nullable } from '@fssgis/utils'
import { get, MayBeRef } from '../base'

export function useListener (target: MayBeRef<Document | Element>, type: MayBeRef<string>, callback: MayBeRef<EventListenerOrEventListenerObject>) {
  let _stop: Nullable<Fn>
  const stop = () => _stop?.()

  watchEffect((onInvalidate) => {
    onInvalidate(() => stop())
    const _target = get(target)
    const _type = get(type)
    const _callback = get(callback)
    _stop = makeEventListener(_target, _type, _callback)
  })
  onScopeDispose(() => stop())
  return makeDestructurable(
    { stop } as const,
    [stop] as const,
  )
}

export default useListener
