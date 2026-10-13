<template>
  <demo-page title="Form 表单">
    <demo-block title="校验">
      <lh-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="72px"
      >
        <lh-form-item
          label="姓名"
          prop="name"
        >
          <lh-input
            v-model="model.name"
            placeholder="请输入姓名"
            style="width: 100%"
          />
        </lh-form-item>
        <lh-form-item
          label="邮箱"
          prop="email"
        >
          <lh-input
            v-model="model.email"
            placeholder="请输入邮箱"
            style="width: 100%"
          />
        </lh-form-item>
        <lh-form-item
          label="简介"
          prop="bio"
        >
          <lh-input
            v-model="model.bio"
            type="textarea"
            :rows="2"
            placeholder="选填，不超过 20 字"
            style="width: 100%"
          />
        </lh-form-item>
      </lh-form>
    </demo-block>

    <demo-block title="操作">
      <lh-button
        type="primary"
        @click="onValidate"
      >
        校验
      </lh-button>
      <lh-button @click="onReset">重置</lh-button>
      <text class="demo-value">结果：{{ result || '（未校验）' }}</text>
    </demo-block>

    <demo-block title="标签位置">
      <lh-form
        :model="model"
        label-position="top"
      >
        <lh-form-item label="姓名">
          <lh-input
            v-model="model.name"
            placeholder="top 标签"
            style="width: 100%"
          />
        </lh-form-item>
      </lh-form>
      <lh-form
        :model="model"
        label-position="left"
      >
        <lh-form-item label="姓名">
          <lh-input
            v-model="model.name"
            placeholder="left 标签"
            style="width: 100%"
          />
        </lh-form-item>
      </lh-form>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { useLhMessage } from '@/message'
import type { LhFormRule } from '../../components/lh-form/types'

const message = useLhMessage()

const model = ref({
  name: '',
  email: '',
  bio: '',
})

const rules: Record<string, LhFormRule[]> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
  bio: [{ max: 20, message: '简介不超过 20 字', trigger: 'blur' }],
}

const formRef = ref<{
  validate: () => Promise<boolean>
  resetFields: () => void
} | null>(null)
const result = ref('')

async function onValidate() {
  if (!formRef.value) return
  try {
    const valid = await formRef.value.validate()
    result.value = valid ? '通过' : '不通过'
    if (valid) message.success('校验通过')
  } catch {
    result.value = '不通过'
  }
}

function onReset() {
  formRef.value?.resetFields()
  result.value = ''
}
</script>

<style>
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
</style>
