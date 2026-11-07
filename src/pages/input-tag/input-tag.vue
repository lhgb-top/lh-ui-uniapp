<template>
  <demo-page title="InputTag 标签输入">
    <demo-block title="基础用法">
      <lh-input-tag
        v-model="tags"
        placeholder="输入后按回车提交"
      />
      <text class="demo-text">当前标签：{{ tags.join('、') || '（空）' }}</text>
    </demo-block>

    <demo-block title="触发键（H5 键盘语义；MP 端走完成键）">
      <lh-input-tag
        v-model="spaceTags"
        trigger="space"
        placeholder="空格触发（仅 H5）"
      />
      <lh-input-tag
        v-model="commaTags"
        trigger="comma"
        placeholder="逗号触发（仅 H5）"
      />
    </demo-block>

    <demo-block title="上限与去重">
      <lh-input-tag
        v-model="maxTags"
        :max="3"
        placeholder="最多 3 个标签"
      />
      <lh-input-tag
        v-model="dupTags"
        allow-duplicate
        placeholder="允许重复"
      />
    </demo-block>

    <demo-block title="只读与禁用">
      <lh-input-tag
        v-model="readonlyTags"
        readonly
        placeholder="只读"
      />
      <lh-input-tag
        v-model="disabledTags"
        disabled
        placeholder="禁用"
      />
    </demo-block>

    <demo-block title="点删（MP 端主路径）">
      <lh-input-tag
        v-model="closeTags"
        placeholder="× 按钮点删双端可用"
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const tags = ref<string[]>(['水墨', '留白'])
const spaceTags = ref<string[]>([])
const commaTags = ref<string[]>([])
const maxTags = ref<string[]>(['一', '二'])
const dupTags = ref<string[]>([])
const readonlyTags = ref<string[]>(['固件', '驱动'])
const disabledTags = ref<string[]>(['只读视图'])
const closeTags = ref<string[]>(['点 × 删除我'])
</script>

<style>
.demo-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a8a8a;
}
</style>
