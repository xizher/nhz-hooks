import { ref, computed } from 'vue'
import { get } from '.'

test('get(): can run right with only value', () => {
  const value = 1
  expect(get(value)).toBe(1)
})

test('get(): can run right with ref value', () => {
  const value = ref(1)
  expect(get(value)).toBe(1)
})

test('get(): can run right with computed value', () => {
  const value = computed(() => 1)
  expect(get(value)).toBe(1)
})
