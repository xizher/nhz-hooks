import whenTruly from './whenTruly'
import { ref, nextTick } from 'vue'

test('whenTruly(): can run right', async () => {
  const value = ref()
  let trulyResult, count = 0
  whenTruly(value, val => {
    trulyResult = val
    count++
  })
  value.value = 2
  await nextTick()
  expect(trulyResult).toBe(2)
  value.value = 3
  await nextTick()
  expect(count).toBe(1)
})
