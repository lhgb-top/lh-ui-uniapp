<template>
  <demo-page title="Radio 单选">
    <demo-block title="单独使用">
      <lh-radio
        v-model="single"
        value="ink"
      >
        水墨
      </lh-radio>
      <text class="demo-value">{{ single }}</text>
    </demo-block>

    <demo-block title="单选组">
      <lh-radio-group v-model="group">
        <lh-radio value="ink">水墨</lh-radio>
        <lh-radio value="danqing">丹青</lh-radio>
        <lh-radio value="liubai">留白</lh-radio>
      </lh-radio-group>
      <text class="demo-value">已选：{{ group || '（无）' }}</text>
    </demo-block>

    <demo-block title="禁用">
      <lh-radio-group
        v-model="group2"
        disabled
      >
        <lh-radio value="a">禁用组 A</lh-radio>
        <lh-radio value="b">禁用组 B</lh-radio>
      </lh-radio-group>
      <lh-radio-group v-model="group3">
        <lh-radio value="a">可用</lh-radio>
        <lh-radio
          value="b"
          disabled
        >
          单项禁用
        </lh-radio>
      </lh-radio-group>
    </demo-block>

    <demo-block title="尺寸">
      <lh-radio-group
        v-model="group4"
        size="small"
      >
        <lh-radio value="a">小</lh-radio>
      </lh-radio-group>
      <lh-radio-group v-model="group5">
        <lh-radio value="a">中</lh-radio>
      </lh-radio-group>
      <lh-radio-group
        v-model="group6"
        size="large"
      >
        <lh-radio value="a">大</lh-radio>
      </lh-radio-group>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const single = ref('ink')
const group = ref('danqing')
const group2 = ref('a')
const group3 = ref('a')
const group4 = ref('a')
const group5 = ref('a')
const group6 = ref('a')
</script>

<style>
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
</style>
