import { watchEffect } from 'vue'
import { Fn, makeDestructurable, makeEventListener, Nullable } from 'utils'
import { get, MayBeRef } from '../base'
import { tryOnBeforeUnmount } from '@vueuse/core'

export function useListener (target: MayBeRef<Document | Element>, type: MayBeRef<string>, callback: MayBeRef<Fn>) {
  let _stop: Nullable<Fn>
  const stop = () => _stop?.()

  watchEffect(() => {
    stop()
    const _target = get(target)
    const _type = get(type)
    const _callback = get(callback)
    _stop = makeEventListener(_target, _type, _callback)
  })
  tryOnBeforeUnmount(() => stop())
  return makeDestructurable(
    { stop } as const,
    [stop] as const,
  )
}

export default useListener
