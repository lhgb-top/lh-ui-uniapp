<template>
  <demo-page title="Pagination 分页">
    <demo-block title="基础用法">
      <lh-pagination :total="120" />
    </demo-block>

    <demo-block title="总数与条数切换">
      <lh-pagination
        :total="480"
        show-total
        show-size-changer
      />
    </demo-block>

    <demo-block title="跳页">
      <lh-pagination
        :total="480"
        show-total
        show-jumper
      />
    </demo-block>

    <demo-block title="简洁模式">
      <lh-pagination
        :total="480"
        simple
        show-jumper
      />
    </demo-block>

    <demo-block title="受控用法">
      <lh-pagination
        v-model:current="page"
        :total="95"
      />
      <text class="demo-value">当前页：{{ page }}</text>
    </demo-block>

    <demo-block title="条数与禁用">
      <lh-pagination
        v-model:page-size="pageSize"
        :total="480"
        show-size-changer
        :page-sizes="[10, 20, 50, 100]"
      />
      <text class="demo-value">每页条数：{{ pageSize }}</text>
      <lh-pagination
        :total="480"
        disabled
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const page = ref(2)
const pageSize = ref(20)
</script>

<style>
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
