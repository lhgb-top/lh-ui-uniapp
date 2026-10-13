<template>
  <demo-page title="Checkbox 多选">
    <demo-block title="单独使用">
      <lh-checkbox v-model="checked">水墨</lh-checkbox>
      <text class="demo-value">{{ checked ? '已选' : '未选' }}</text>
    </demo-block>

    <demo-block title="禁用与不确定">
      <lh-checkbox
        v-model="disabledChecked"
        disabled
      >
        禁用（已选）
      </lh-checkbox>
      <lh-checkbox
        v-model="disabledUnchecked"
        disabled
      >
        禁用（未选）
      </lh-checkbox>
      <lh-checkbox
        v-model="indeterminate"
        indeterminate
      >
        不确定
      </lh-checkbox>
    </demo-block>

    <demo-block title="多选组">
      <lh-checkbox-group v-model="group">
        <lh-checkbox value="ink">水墨</lh-checkbox>
        <lh-checkbox value="danqing">丹青</lh-checkbox>
        <lh-checkbox value="liubai">留白</lh-checkbox>
        <lh-checkbox value="cursive">飞白</lh-checkbox>
      </lh-checkbox-group>
      <text class="demo-value">已选：{{ group.length ? group.join('、') : '（无）' }}</text>
    </demo-block>

    <demo-block title="尺寸">
      <lh-checkbox-group
        v-model="group2"
        size="small"
      >
        <lh-checkbox value="a">小</lh-checkbox>
      </lh-checkbox-group>
      <lh-checkbox-group v-model="group3">
        <lh-checkbox value="a">中</lh-checkbox>
      </lh-checkbox-group>
      <lh-checkbox-group
        v-model="group4"
        size="large"
      >
        <lh-checkbox value="a">大</lh-checkbox>
      </lh-checkbox-group>
    </demo-block>

    <demo-block title="全选与反选">
      <lh-checkbox
        :model-value="allChecked"
        :indeterminate="halfChecked"
        @change="toggleAll"
      >
        全选
      </lh-checkbox>
      <lh-checkbox-group v-model="checkAllGroup">
        <lh-checkbox value="1">一</lh-checkbox>
        <lh-checkbox value="2">二</lh-checkbox>
        <lh-checkbox value="3">三</lh-checkbox>
      </lh-checkbox-group>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const checked = ref(true)
const disabledChecked = ref(true)
const disabledUnchecked = ref(false)
const indeterminate = ref(true)

const group = ref<string[]>(['ink'])
const group2 = ref<string[]>(['a'])
const group3 = ref<string[]>(['a'])
const group4 = ref<string[]>(['a'])

const checkAllGroup = ref<string[]>([])
const allChecked = computed(() => checkAllGroup.value.length === 3)
const halfChecked = computed(
  () => checkAllGroup.value.length > 0 && checkAllGroup.value.length < 3,
)

function toggleAll(value: boolean) {
  checkAllGroup.value = value ? ['1', '2', '3'] : []
}
</script>

<style>
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
</style>
