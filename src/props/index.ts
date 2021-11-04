import { PropType } from 'vue'

export function makeObjectProp<T> (arg0: true) : { type: PropType<T>, required: true }
export function makeObjectProp<T> (arg0: T) : { type: PropType<T>, default () : T }
export function makeObjectProp<T> (arg0: T | true) : unknown {
  return {
    type: Object as PropType<T>,
    required: typeof arg0 === 'boolean' ? arg0 : undefined,
    default: typeof arg0 === 'boolean' ? undefined : () => arg0,
  }
}

export function makeArrayProp<T> (required: true) : { type: PropType<T[]>, required: true }
export function makeArrayProp<T> (required: false) : { type: PropType<T[]>, default () : T[] }
export function makeArrayProp<T> () : { type: T, default () : PropType<T[]> }
export function makeArrayProp<T> (required?: boolean) : unknown {
  return {
    type: Array as PropType<T[]>,
    required: required,
    default: required ? undefined : () => [],
  }
}
