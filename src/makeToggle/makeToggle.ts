import { isNullable } from '@fssgis/utils'
import { Ref, ref } from 'vue'

export function makeToggle (arg0: boolean) : [Ref<boolean>, (val?: boolean) => boolean]
export function makeToggle (arg0: Ref<boolean>) : (val?: boolean) => boolean
export function makeToggle (arg0: Ref<boolean> | boolean) {
  if (typeof arg0 === 'boolean') {
    const bool = ref(arg0)
    const toggle = (val?: boolean) => {
      if (isNullable(val)) {
        bool.value = !bool.value
      } else {
        bool.value = val
      }
    }
    return [bool, toggle]
  } else {
    const toggle = (val?: boolean) => {
      if (isNullable(val)) {
        arg0.value = !arg0.value
      } else {
        arg0.value = val
      }
    }
    return toggle
  }
}

export default makeToggle
