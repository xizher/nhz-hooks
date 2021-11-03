import { Fn } from '@fssgis/utils'
import { onScopeDispose } from 'vue'

export function useHandle (fn: Fn<Fn>) : Fn {
  const stop = fn()
  onScopeDispose(() => stop())
  return stop
}

export default useHandle
