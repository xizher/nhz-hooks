import { get } from '../base'
import makeToggle from './makeToggle'
import { ref } from 'vue'

test('makeToggle(): can run right with arg0 is boolean', () => {
  const [bool] = makeToggle(true)
  expect(get(bool)).toBe(true)
  const [bool2, toggle] = makeToggle(false)
  expect(get(bool2)).toBe(false)
  toggle()
  expect(get(bool2)).toBe(true)
  toggle()
  expect(get(bool2)).toBe(false)
  toggle(false)
  expect(get(bool2)).toBe(false)
})

test('makeToggle(): can run right with arg0 is Ref<boolean>', () => {
  const bool = ref(true)
  const toggle = makeToggle(bool)
  toggle()
  expect(get(bool)).toBe(false)
  toggle()
  expect(get(bool)).toBe(true)
  toggle(true)
  expect(get(bool)).toBe(true)
})
