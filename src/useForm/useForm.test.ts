import { formatString, isNullable } from '@fssgis/utils'
import { nextTick } from 'vue'
import { RuleMaxLength } from '.'
import { RuleMinLength, RuleReqiured, useForm, RuleMax, RuleMin } from './useForm'

test('useForm(): 字段值的状态同步', async () => {
  const { fieldValues, makeField } = useForm<{
    usr: string
    pwd: number
  }>({
    defaultValues: {
      pwd: 123
    }
  })
  const usr = makeField('usr')
  usr.value = 'test'
  expect(usr.value).toBe(fieldValues.usr)
})

test('useForm(): 字段值的默认值实现', async () => {
  const { fieldValues, makeField } = useForm<{
    usr: string
    pwd: number
  }>({
    defaultValues: { pwd: 123 }
  })
  const pwd = makeField('pwd')
  expect(pwd.value).toBe(123)
  expect(fieldValues.pwd).toBe(123)
  expect(fieldValues.usr).toBeUndefined()
})

test('useForm(): 表单提交的实现', async () => {
  const { makeSubmit, makeField } = useForm<{
    usr: string
    pwd: number
  }>({
    defaultValues: { pwd: 123 }
  })
  const usr = makeField('usr')
  usr.value = 'test'
  let sPwd, sUsr
  const submit = makeSubmit(data => {
    sPwd = data.pwd
    sUsr = data.usr
  })
  await submit()
  expect(sPwd).toBe(123)
  expect(sUsr).toBe('test')
})

test('useForm(): 表单提交时的验证实现', async () => {
  const { makeSubmit, makeField, errors } = useForm<{
    usr: string
    pwd: number
  }>({ validateMode: 'submit' })
  const usr = makeField('usr', [(val) => new Promise((res, rej) => {
    val ? res() : rej('require')
  })])
  const pwd = makeField('pwd', [
    (val) => new Promise((res, rej) => {
      isNullable(val) ? rej('require') : res()
    }),
    (val) => new Promise((res, rej) => {
      String(val).length < 6 ? rej('must >= 6') : res()
    }),
  ])
  let submitCount = 0
  const submit = makeSubmit(() => submitCount++)

  await submit()
  expect(errors['usr']).toBe('require')
  expect(pwd.error).toBe('require')
  expect(submitCount).toBe(0)
  usr.value = 'amy'
  pwd.value = 123
  await submit()
  expect(errors['usr']).toBeUndefined()
  expect(pwd.error).toBe('must >= 6')
  expect(submitCount).toBe(0)
  pwd.value = 123456
  await submit()
  expect(errors['usr']).toBeUndefined()
  expect(errors['pwf']).toBeUndefined()
  expect(submitCount).toBe(1)
})

test('useForm(): 字段变化时的表单验证实现', async () => {
  const { makeField, errors } = useForm<{
    usr: string
    pwd: number
  }>()
  const usr = makeField('usr', [(val) => new Promise((res, rej) => {
    val ? res() : rej('require')
  })])
  const pwd = makeField('pwd', [
    (val) => new Promise((res, rej) => {
      isNullable(val) ? rej('require') : res()
    }),
    (val) => new Promise((res, rej) => {
      String(val).length < 6 ? rej('must >= 6') : res()
    }),
  ])
  usr.value = 'amy'
  pwd.value = 123
  await nextTick()
  await nextTick()
  expect(errors['usr']).toBeUndefined()
  expect(pwd.error).toBe('must >= 6')
  usr.value = ''
  await nextTick()
  expect(usr.error).toBe('require')
  pwd.value = 123456
  usr.value = 'amy'
  await nextTick()
  expect(errors['usr']).toBeUndefined()
  expect(errors['pwf']).toBeUndefined()
})

test('useForm(): 规则【RuleReqiured】的实现', async () => {
  const { makeField, makeSubmit } = useForm<{
    usr: string
  }>()
  const usr = makeField('usr', [RuleReqiured()])
  const submit = makeSubmit(() => void 0)
  await submit()
  expect(usr.error).toBe(RuleReqiured.errorMsg)
  usr.value = '123'
  await nextTick()
  expect(usr.error).toBeUndefined()
  usr.value = ''
  await nextTick()
  expect(usr.error).toBe(RuleReqiured.errorMsg)
})

test('useForm(): 规则【RuleMinLength】的实现', async () => {
  const { makeField, makeSubmit } = useForm<{
    usr: string
  }>()
  const usr = makeField('usr', [RuleMinLength(3)])
  const submit = makeSubmit(() => void 0)
  await submit()
  expect(usr.error).toBe(formatString(RuleMinLength.errorMsg, 3))
  usr.value = '1234'
  await nextTick()
  expect(usr.error).toBeUndefined()
  usr.value = '1'
  await nextTick()
  expect(usr.error).toBe(formatString(RuleMinLength.errorMsg, 3))
})

test('useForm(): 规则【RuleMaxLength】的实现', async () => {
  const { makeField, makeSubmit } = useForm<{
    usr: string
  }>()
  const usr = makeField('usr', [RuleMaxLength(3)])
  const submit = makeSubmit(() => void 0)
  await submit()
  expect(usr.error).toBe(formatString(RuleMaxLength.errorMsg, 3))
  usr.value = '1'
  await nextTick()
  expect(usr.error).toBeUndefined()
  usr.value = '1234'
  await nextTick()
  expect(usr.error).toBe(formatString(RuleMaxLength.errorMsg, 3))
})

test('useForm(): 规则【RuleMax】的实现', async () => {
  const { makeField, makeSubmit } = useForm<{
    num: number
  }>()
  const num = makeField('num', [RuleMax(100)])
  const submit = makeSubmit(() => void 0)
  await submit()
  expect(num.error).toBe(formatString(RuleMax.errorMsg, 100))
  num.value = 0
  await nextTick()
  expect(num.error).toBeUndefined()
  num.value = 101
  await nextTick()
  expect(num.error).toBe(formatString(RuleMax.errorMsg, 100))
})


test('useForm(): 规则【RuleMin】的实现', async () => {
  const { makeField, makeSubmit } = useForm<{
    num: number
  }>()
  const num = makeField('num', [RuleMin(1)])
  const submit = makeSubmit(() => void 0)
  await submit()
  expect(num.error).toBe(formatString(RuleMin.errorMsg, 1))
  num.value = 1
  await nextTick()
  expect(num.error).toBeUndefined()
  num.value = 0
  await nextTick()
  expect(num.error).toBe(formatString(RuleMin.errorMsg, 1))
})
