import { shallowRef, Ref, watch, ref } from 'vue'

type ValidatorItem<T = unknown> = (value: T) => true | string

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Validator = {
  Required: (target: any) => {
    if (typeof target === 'string') {
      if (target) {
        return true
      } else {
        return 'required'
      }
    }
  }
}
/* eslint-ensable @typescript-eslint/no-explicit-any */

export function useFormItem <T> (initialValue: T, options?: {
  rules?: Array<ValidatorItem<T>>
}) {
  const value = shallowRef(initialValue)
  const status : Ref<true | string> = ref(true)
  const rules = options?.rules ?? []
  watch(value, value => {
    status.value = true
    for (const validator of rules) {
      const result = validator(value)
      if (typeof result === 'string') {
        status.value = result
        break
      }
    }
  })
  return {
    value,
    status,
  }
}
