import { get, MayBeRef } from '../base'
import { ref, watchEffect, onScopeDispose } from 'vue'
import { makeDestructurable } from '@fssgis/utils'

export function useObjectUrl (obj: MayBeRef<unknown>) {
  const url = ref('')
  const destory = () => URL.revokeObjectURL(url.value)
  watchEffect(() => {
    destory()
    const _obj = get(obj)
    url.value = typeof _obj === 'object'
      ? URL.createObjectURL(new Blob([JSON.stringify(_obj)], { type: 'application/json' }))
      : URL.createObjectURL(new Blob([String(_obj)]))
  })
  onScopeDispose(() => destory())
  return makeDestructurable(
    { url, destory } as const,
    [url, destory] as const,
  )
}

export default useObjectUrl
