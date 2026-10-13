<template>
  <demo-page title="Badge 徽标">
    <demo-block title="类型">
      <lh-badge
        v-for="t in types"
        :key="t"
        :type="t"
        :value="8"
        class="badge-item"
      >
        <lh-button size="small">{{ t }}</lh-button>
      </lh-badge>
    </demo-block>

    <demo-block title="数值处理">
      <lh-badge
        :value="200"
        :max="99"
        class="badge-item"
      >
        <lh-button size="small">超出 max</lh-button>
      </lh-badge>
      <lh-badge
        :value="0"
        show-zero
        class="badge-item"
      >
        <lh-button size="small">显示 0</lh-button>
      </lh-badge>
      <lh-badge
        :value="0"
        class="badge-item"
      >
        <lh-button size="small">隐藏 0</lh-button>
      </lh-badge>
      <lh-badge
        content="新"
        class="badge-item"
      >
        <lh-button size="small">自定义文案</lh-button>
      </lh-badge>
    </demo-block>

    <demo-block title="小红点">
      <lh-badge
        is-dot
        class="badge-item"
      >
        <lh-button size="small">消息</lh-button>
      </lh-badge>
    </demo-block>

    <demo-block title="尺寸与偏移">
      <lh-badge
        value="8"
        size="small"
        class="badge-item"
      >
        <lh-button size="small">小</lh-button>
      </lh-badge>
      <lh-badge
        value="8"
        class="badge-item"
      >
        <lh-button size="small">中</lh-button>
      </lh-badge>
      <lh-badge
        value="8"
        size="large"
        class="badge-item"
      >
        <lh-button size="small">大</lh-button>
      </lh-badge>
      <lh-badge
        value="8"
        :offset="[-4, 4]"
        class="badge-item"
      >
        <lh-button size="small">偏移</lh-button>
      </lh-badge>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhBadgeType } from '../../components/lh-badge/types'

const types: LhBadgeType[] = ['primary', 'success', 'warning', 'danger', 'info', 'default']
</script>

<style>
.badge-item {
  margin-right: 24px;
}
</style>
