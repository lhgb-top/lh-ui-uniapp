<template>
  <demo-page title="Input 输入框">
    <demo-block title="基础">
      <lh-input
        v-model="base"
        placeholder="请输入内容"
        style="width: 100%"
      />
      <text class="demo-value">值：{{ base || '（空）' }}</text>
    </demo-block>

    <demo-block title="类型">
      <lh-input
        v-model="text"
        type="text"
        placeholder="text"
        style="width: 100%"
      />
      <lh-input
        v-model="pwd"
        password
        placeholder="password"
        style="width: 100%"
      />
      <lh-input
        v-model="number"
        type="number"
        placeholder="number"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="带图标">
      <lh-input
        v-model="withIcon"
        prefix-icon="search"
        suffix-icon="eye"
        placeholder="前后图标"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="字数统计与清除">
      <lh-input
        v-model="limited"
        :maxlength="20"
        show-word-limit
        clearable
        placeholder="最多 20 字"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="尺寸">
      <lh-input
        v-model="s1"
        size="small"
        placeholder="small"
        style="width: 100%"
      />
      <lh-input
        v-model="s2"
        placeholder="medium"
        style="width: 100%"
      />
      <lh-input
        v-model="s3"
        size="large"
        placeholder="large"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="状态与禁用">
      <lh-input
        v-model="err"
        state="error"
        placeholder="错误状态"
        style="width: 100%"
      />
      <lh-input
        v-model="ok"
        state="success"
        placeholder="成功状态"
        style="width: 100%"
      />
      <lh-input
        v-model="disabled"
        disabled
        placeholder="禁用"
        style="width: 100%"
      />
      <lh-input
        v-model="readonly"
        readonly
        placeholder="只读"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="多行文本">
      <lh-input
        v-model="multi"
        type="textarea"
        :rows="3"
        :maxlength="100"
        show-word-limit
        placeholder="多行输入"
        style="width: 100%"
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const base = ref('')
const text = ref('')
const pwd = ref('')
const number = ref('')
const withIcon = ref('')
const limited = ref('')
const s1 = ref('')
const s2 = ref('')
const s3 = ref('')
const err = ref('')
const ok = ref('')
const disabled = ref('不可编辑')
const readonly = ref('只读内容')
const multi = ref('')
</script>

<style>
.demo-value {
  width: 100%;
  font-size: 12px;
  color: #8a867d;
}
</style>
