import {
  mount
} from '@vue/test-utils'
import Idea from '@/components/Idea.vue'

describe('Idea', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Idea)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
