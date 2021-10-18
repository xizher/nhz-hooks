import { usePromise } from './usePromise'
import { nextTick } from 'vue'
import { get } from '../base'

test('usePromise(): can run right with promise object', async () => {
  const { result, loaded } = usePromise(Promise.resolve(1), 0)
  expect(get(result)).toBe(0)
  expect(get(loaded)).toBe(false)
  await nextTick()
  await nextTick()
  await nextTick()
  expect(get(loaded)).toBe(true)
  expect(get(result)).toBe(1)
})

test('usePromise(): can run right with promise function', async () => {
  const { result, success } = usePromise(() => Promise.resolve(1), 0)
  expect(get(result)).toBe(0)
  expect(get(success)).toBe(false)
  await nextTick()
  await nextTick()
  await nextTick()
  expect(get(success)).toBe(true)
  expect(get(result)).toBe(1)
})

test('usePromise(): can run right with reject and promise function', async () => {
  const { loaded, error, success } = usePromise(() => Promise.reject(1), 0)
  await nextTick()
  await nextTick()
  await nextTick()
  expect(get(loaded)).toBe(true)
  expect(get(success)).toBe(false)
  expect(get(error)).toBe(1)
})

test('usePromise(): can run right with reject and promise object', async () => {
  const { loaded, error, success } = usePromise(Promise.reject(1), 0)
  await nextTick()
  await nextTick()
  await nextTick()
  expect(get(loaded)).toBe(true)
  expect(get(success)).toBe(false)
  expect(get(error)).toBe(1)
})
