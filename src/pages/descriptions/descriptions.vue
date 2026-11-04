<template>
  <demo-page title="Descriptions 描述列表">
    <demo-block title="基础用法">
      <lh-descriptions
        title="藏品档案"
        :column="2"
        :items="baseItems"
      />
    </demo-block>

    <demo-block title="列数与跨列">
      <lh-descriptions
        :column="3"
        :items="spanItems"
      />
    </demo-block>

    <demo-block title="边框模式">
      <lh-descriptions
        :column="2"
        border
        :items="borderItems"
      />
    </demo-block>

    <demo-block title="自定义标题插槽">
      <lh-descriptions :column="2" :items="baseItems">
        <template #title>
          <text class="descriptions-demo-title">藏品档案（插槽标题）</text>
        </template>
      </lh-descriptions>
    </demo-block>

    <demo-block title="自定义内容（item-<index> 作用域插槽）">
      <lh-descriptions
        :column="2"
        :items="slotItems"
      >
        <template #item-1="{ item }">
          <lh-tag type="success">{{ item.value }}</lh-tag>
        </template>
      </lh-descriptions>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const baseItems = [
  { label: '名称', value: '青花缠枝莲纹瓶' },
  { label: '年代', value: '明永乐' },
  { label: '类别', value: '瓷器' },
  { label: '级别', value: '一级文物' },
]

const spanItems = [
  { label: '名称', value: '千里江山图', span: 2 },
  { label: '年代', value: '北宋' },
  { label: '作者', value: '王希孟' },
  { label: '材质', value: '绢本设色' },
  { label: '藏地', value: '北京故宫博物院' },
]

const borderItems = [
  { label: '名称', value: '兰亭序' },
  { label: '作者', value: '王羲之' },
  { label: '年代', value: '东晋' },
  { label: '书体', value: '行书' },
]

const slotItems = [
  { label: '状态', value: '进行中' },
  { label: '进度', value: '已鉴定' },
]
</script>

<style>
.descriptions-demo-title {
  font-size: 14px;
  color: #8a867d;
}
</style>
