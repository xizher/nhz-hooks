import { Fn, isNullable, formatString } from '@fssgis/utils'
import { watch, reactive, toRef } from 'vue'

type ValidateMode = 'change' | 'submit'

type FromOptions<T> = {
  defaultValues?: Partial<T>
  validateMode?: ValidateMode
}

export type Errors = {
  [field: string]: string | undefined
}

export type RuleType<T = unknown> = (val: T) => Promise<void>

export function useForm <T extends object> ({
  defaultValues = {} as T,
  validateMode = 'change',
} : FromOptions<T> = {}) {
  const fieldValues = reactive(defaultValues) as T
  const errors = reactive<Errors>({})
  const validators : Record<string, RuleType[]> = {}

  const validateField = async (name: keyof T) => {
    try {
      const value = fieldValues[name as string]
      const rules = validators[name as string] ?? []
      for (const rule of rules) {
        await rule(value)
      }
      errors[name as string] = undefined
      return true
    } catch (e) {
      errors[name as string] = e
      return false
    }
  }

  const validateFields = async () => {
    let ret = true
    for (const name in fieldValues) {
      if (!await validateField(name)) {
        ret = false
      }
    }
    return ret
  }

  const makeField = <K extends keyof T> (name: K, rules: RuleType<T[K]>[] = []) => {
    validators[name as string] = rules
    // @ts-ignore
    fieldValues[name] ?? (fieldValues[name] = undefined)
    // @ts-ignore
    errors[name] ?? (errors[name] = undefined)
    const field = reactive({
      value: toRef(fieldValues, name),
      error: toRef(errors, name as string)
    }) as { value: T[keyof T], error: string }

    if (validateMode === 'change') {
      watch(() => field.value, () => validateField(name))
    }

    return field
  }

  const makeSubmit = (fn: (data: T) => void) : Fn<Promise<void>> => {
    return async () => {
      const result = await validateFields()
      if (result) {
        await fn(fieldValues)
      }
    }
  }


  return {
    fieldValues,
    makeSubmit,
    makeField,
    validateField,
    validateFields,
    errors,
    validators,
  }
}

RuleReqiured.errorMsg = 'required'
export function RuleReqiured (errorMsg = RuleReqiured.errorMsg) : RuleType {
  return val => new Promise<void>((resolve, reject) => {
    if (typeof val === 'string' && !val) {
      reject(errorMsg)
    } else if (isNullable(val)) {
      reject(errorMsg)
    }
    resolve()
  })
}

RuleMinLength.errorMsg = 'length must ≥ {0}'
export function RuleMinLength (num: number, errorMsg = formatString(RuleMinLength.errorMsg, num)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || String(val).length < num) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}

RuleMaxLength.errorMsg = 'length must ≤ {0}'
export function RuleMaxLength (num: number, errorMsg = formatString(RuleMaxLength.errorMsg, num)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || String(val).length > num) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}

RuleMax.errorMsg = 'number must ≤ {0}'
export function RuleMax (num: number, errorMsg = formatString(RuleMax.errorMsg, num)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || Number(val) > num) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}

RuleMin.errorMsg = 'number must ≥ {0}'
export function RuleMin (num: number, errorMsg = formatString(RuleMin.errorMsg, num)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || Number(val) < num) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}

RuleLengthRange.errorMsg = 'length must ≥ {0} and ≤ {1}'
export function RuleLengthRange (min: number, max: number, errorMsg = formatString(RuleLengthRange.errorMsg, min, max)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || String(val).length < min || String(val).length > max) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}

RuleRange.errorMsg = 'number must ≥ {0} and ≤ {1}'
export function RuleRange (min: number, max: number, errorMsg = formatString(RuleRange.errorMsg, min, max)) : RuleType {
  return val => new Promise((resolve, reject) => {
    if (isNullable(val) || Number(val) < min || Number(val) > max) {
      reject(errorMsg)
    } else {
      resolve()
    }
  })
}
