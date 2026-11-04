<template>
  <demo-page title="Transfer 穿梭框">
    <demo-block title="基础用法">
      <lh-transfer
        v-model="source"
        :data="items"
        @change="onChange"
      />
      <text class="transfer-demo-note">
        v-model 绑定左侧（源）键列表；勾选任意项后点 › / ‹ 按钮穿梭，change 事件回显方向。
      </text>
      <text class="transfer-demo-note">左侧键：{{ source.join(', ') || '（空）' }}</text>
      <text class="transfer-demo-note">change 事件：{{ lastChange || '（未触发）' }}</text>
    </demo-block>

    <demo-block title="过滤（搜索）">
      <lh-transfer v-model="sourceFilter" :data="items" />
      <text class="transfer-demo-note">
        每侧面板顶部内置搜索框（与 plus 一致，不可关闭），输入即按文案大小写不敏感过滤；
        过滤后无结果时显示空态文案。
      </text>
    </demo-block>

    <demo-block title="禁用">
      <lh-transfer v-model="sourceDisabled" :data="items" disabled />
      <text class="transfer-demo-note">
        disabled 禁用整个穿梭框：勾选、全选、搜索、穿梭按钮全链路拦截；
        数据项的 disabled 字段只禁用该项（丙不可勾选、不可移动）。
      </text>
    </demo-block>

    <demo-block title="空数据">
      <lh-transfer v-model="sourceEmpty" :data="[]" />
      <text class="transfer-demo-note">空态文案取语言包 transfer.empty（中文「暂无数据」）。</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

// 基础数据：丙是禁用项（不可勾选、不可移动）
const items: LhTransferItem[] = [
  { key: 'a', label: '甲' },
  { key: 'b', label: '乙' },
  { key: 'c', label: '丙', disabled: true },
  { key: 'd', label: '丁' },
]

const source = ref<Array<string | number>>(['a'])
const sourceFilter = ref<Array<string | number>>([])
const sourceDisabled = ref<Array<string | number>>(['a'])
const sourceEmpty = ref<Array<string | number>>([])

const lastChange = ref('')
function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  lastChange.value = `${direction} → [${keys.join(', ')}]`
}
</script>

<style>
.transfer-demo-note {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
.demo-page--dark .transfer-demo-note {
  color: #b5b1a8;
}
</style>
