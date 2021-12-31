import { PropType } from 'vue'

export function makeObjectProp<T> (arg0: true) : { type: PropType<T>, required: true }
export function makeObjectProp<T> (arg0: T) : { type: PropType<T>, default () : T }
export function makeObjectProp<T> (arg0: T | true) : unknown {
  return {
    type: null as any as unknown as PropType<T>, // eslint-disable-line
    required: typeof arg0 === 'boolean' ? arg0 : undefined,
    default: typeof arg0 === 'boolean' ? undefined : () => arg0,
  }
}

export function makeArrayProp<T> (required: true) : { type: PropType<T[]>, required: true }
export function makeArrayProp<T> (required: false) : { type: PropType<T[]>, default () : T[] }
export function makeArrayProp<T> () : { type: PropType<T[]>, default () : T[] }
export function makeArrayProp<T> (required?: boolean) : unknown {
  return {
    type: null as any as unknown as PropType<T[]>, // eslint-disable-line
    required: required,
    default: required ? undefined : () => [],
  }
}

export function makeStringProp () : { type: StringConstructor, required: true }
export function makeStringProp (arg0: string) : { type: StringConstructor, default: string }
export function makeStringProp (arg0?: string) : unknown {
  return {
    type: String,
    required: arg0 === undefined,
    default: arg0,
  }
}

export function makeNumberProp () : { type: NumberConstructor, required: true }
export function makeNumberProp (arg0: number) : { type: NumberConstructor, default: number }
export function makeNumberProp (arg0?: number) : unknown {
  return {
    type: Number,
    required: arg0 === undefined,
    default: arg0,
  }
}

export function makeFunctionProp<T extends Function> (arg0: true) : { type: PropType<T>, required: true }
export function makeFunctionProp<T extends Function> (arg0: T) : { type: PropType<T>, default () : T }
export function makeFunctionProp<T extends Function> (arg0: T | true) : unknown {
  return {
    type: Function as PropType<T>,
    required: typeof arg0 === 'boolean' ? arg0 : undefined,
    default: typeof arg0 === 'boolean' ? undefined : () => arg0,
  }
}
