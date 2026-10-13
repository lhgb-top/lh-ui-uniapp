import { describe, expect, it } from 'vitest'
import { mount } from '../mount'
import { nextTick } from 'vue'
import LhForm from '../../src/components/lh-form/lh-form.vue'
import LhFormItem from '../../src/components/lh-form-item/lh-form-item.vue'
import LhInput from '../../src/components/lh-input/lh-input.vue'
import type { LhFormRule } from '../../src/components/lh-form/types'

const rules: Record<string, LhFormRule[]> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

function mountForm(model: Record<string, unknown>) {
  return mount({
    components: { LhForm, LhFormItem, LhInput },
    data: () => ({ model, rules }),
    template: `<lh-form :model="model" :rules="rules">
      <lh-form-item label="姓名" prop="name">
        <lh-input v-model="model.name" />
      </lh-form-item>
    </lh-form>`,
  })
}

describe('LhForm', () => {
  it('renders form and item with label', () => {
    const wrapper = mountForm({ name: '' })
    expect(wrapper.find('.lh-form').exists()).toBe(true)
    expect(wrapper.find('.lh-form-item__label').text()).toBe('姓名')
  })

  it('marks required asterisk', () => {
    const wrapper = mount({
      components: { LhForm, LhFormItem },
      data: () => ({ model: {} }),
      template: `<lh-form :model="model">
        <lh-form-item label="姓名" required>
          <view />
        </lh-form-item>
      </lh-form>`,
    })
    expect(wrapper.find('.lh-form-item__required').exists()).toBe(true)
  })

  it('fails validation for empty required field and shows the message', async () => {
    const wrapper = mountForm({ name: '' })
    const form = wrapper.findComponent(LhForm)
    const valid = await form.vm.validate()
    expect(valid).toBe(false)
    await nextTick()
    expect(wrapper.find('.lh-form-item--error').exists()).toBe(true)
    expect(wrapper.find('.lh-form-item__error').text()).toBe('请输入姓名')
  })

  it('passes validation when the field is filled', async () => {
    const wrapper = mountForm({ name: '水墨' })
    const form = wrapper.findComponent(LhForm)
    const valid = await form.vm.validate()
    expect(valid).toBe(true)
    expect(wrapper.find('.lh-form-item--error').exists()).toBe(false)
  })

  it('validateField targets a single prop', async () => {
    const wrapper = mountForm({ name: '' })
    const form = wrapper.findComponent(LhForm)
    expect(await form.vm.validateField('name')).toBe(false)
    expect(await form.vm.validateField('absent')).toBe(true)
  })

  it('resets the field to its initial value and clears the error', async () => {
    const wrapper = mountForm({ name: '' })
    const form = wrapper.findComponent(LhForm)
    const model = wrapper.vm as unknown as { model: { name: string } }
    // 不填姓名直接校验 → 必填失败并报错
    expect(await form.vm.validate()).toBe(false)
    expect(wrapper.find('.lh-form-item__error').exists()).toBe(true)
    // 重置：值回到初始空串，错误文案清除（不重新校验）
    form.vm.resetField('name')
    await nextTick()
    expect(model.model.name).toBe('')
    expect(wrapper.find('.lh-form-item__error').exists()).toBe(false)
  })

  it('resetFields restores all registered fields to their initial values', async () => {
    const model = { name: '', email: 'ink@lh-ui.dev' }
    const wrapper = mount({
      components: { LhForm, LhFormItem, LhInput },
      data: () => ({ model, rules }),
      template: `<lh-form :model="model" :rules="rules">
        <lh-form-item label="姓名" prop="name">
          <lh-input v-model="model.name" />
        </lh-form-item>
        <lh-form-item label="邮箱" prop="email">
          <lh-input v-model="model.email" />
        </lh-form-item>
      </lh-form>`,
    })
    const form = wrapper.findComponent(LhForm)
    const m = wrapper.vm as unknown as { model: { name: string; email: string } }
    // 挂载后改掉 email（name 保持空触发必填失败）
    m.model.email = 'changed@lh-ui.dev'
    expect(await form.vm.validate()).toBe(false)
    form.vm.resetFields()
    await nextTick()
    // 重置 = 恢复挂载时的初始值（不是清空），并清除全部错误
    expect(m.model).toEqual({ name: '', email: 'ink@lh-ui.dev' })
    expect(wrapper.find('.lh-form-item__error').exists()).toBe(false)
  })

  it('applies label position class', () => {
    const wrapper = mount({
      components: { LhForm, LhFormItem },
      data: () => ({ model: {} }),
      template: `<lh-form :model="model" label-position="top">
        <lh-form-item label="姓名"><view /></lh-form-item>
      </lh-form>`,
    })
    expect(wrapper.find('.lh-form--label-top').exists()).toBe(true)
    expect(wrapper.find('.lh-form-item--label-top').exists()).toBe(true)
  })
})
