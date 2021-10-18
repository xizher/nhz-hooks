import whenTruly from './whenTruly'
import { ref, nextTick, effectScope } from 'vue'

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

test('whenTruly(): can run right with immediate', async () => {
  const value = ref(1)
  let trulyResult, count = 0
  whenTruly(value, val => {
    trulyResult = val
    count++
  })
  await nextTick()
  expect(trulyResult).toBe(1)
  expect(count).toBe(1)
})

test('whenTruly(): can run right with onScopeDispose', async () => {
  const value = ref()
  let trulyResult, count = 0
  const scope = effectScope()
  scope.run(() => {
    whenTruly(value, val => {
      trulyResult = val
      count++
    })
  })
  scope.stop()
  value.value = 2
  await nextTick()
  expect(count).toBe(0)
  const scope2 = effectScope()
  scope2.run(() => {
    whenTruly(value, val => {
      trulyResult = val
      count++
    })
  })
  expect(trulyResult).toBe(2)
  expect(count).toBe(1)
})
