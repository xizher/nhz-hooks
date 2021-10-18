import { Ref, unref } from 'vue'

export type MayBeRef<T> = T | Ref<T>

export function get<T> (target: MayBeRef<T>) : T {
  return unref(target)
}
