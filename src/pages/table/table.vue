<template>
  <demo-page title="Table 表格">
    <demo-block title="基础用法">
      <lh-table :data="rows" :columns="basicColumns" />
    </demo-block>

    <demo-block title="斑马纹与边框">
      <lh-table
        :data="rows"
        :columns="basicColumns"
        stripe
        border
      />
      <text class="demo-tip">MP 端斑马纹由模板按行索引补 --alt 类实现（share 的 nth-child 规则仅 H5）。</text>
    </demo-block>

    <demo-block title="排序">
      <lh-table
        :data="rows"
        :columns="sortableColumns"
        @sort-change="onSortChange"
      />
      <text class="demo-value">排序：{{ sortText }}</text>
    </demo-block>

    <demo-block title="筛选">
      <lh-table
        :data="rows"
        :columns="filterableColumns"
        @filter-change="onFilterChange"
      />
      <text class="demo-value">筛选：{{ filterText || '无' }}</text>
    </demo-block>

    <demo-block title="固定列（H5 专属）与横向滚动">
      <lh-table :data="rows" :columns="fixedColumns" />
      <text class="demo-tip">固定列依赖 position: sticky，WXSS 对表格单元格支持不可靠，MP 端整表横向滚动（单根滚动轴天然同步）。</text>
    </demo-block>

    <demo-block title="虚拟滚动（万行）">
      <lh-table
        :data="hugeRows"
        :columns="basicColumns"
        :height="360"
      />
      <text class="demo-value">共 {{ hugeRows.length }} 行，仅渲染可视窗口</text>
    </demo-block>

    <demo-block title="自定义单元格（具名作用域插槽）">
      <lh-table :data="rows" :columns="customColumns">
        <template #status="{ row }">
          <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </lh-tag>
        </template>
      </lh-table>
    </demo-block>

    <demo-block title="空数据">
      <lh-table :data="[]" :columns="basicColumns" />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhTableColumn } from '@/components/lh-table/types'

const rows = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    city: ['北京', '上海', '深圳', '杭州'][i % 4],
    status: i % 3 === 0 ? 'disabled' : 'active',
  })),
)

const hugeRows = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    city: ['北京', '上海', '深圳', '杭州'][i % 4],
    status: i % 3 === 0 ? 'disabled' : 'active',
  })),
)

const basicColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年龄', width: 100, align: 'right' },
  { prop: 'city', label: '城市', width: 120 },
]

const sortableColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140, sortable: true },
  { prop: 'age', label: '年龄', width: 120, sortable: true, align: 'right' },
  { prop: 'city', label: '城市', width: 140 },
]

const filterableColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140 },
  {
    prop: 'city',
    label: '城市',
    width: 140,
    filters: [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
      { text: '深圳', value: '深圳' },
    ],
  },
  { prop: 'age', label: '年龄', width: 100, align: 'right' },
]

const fixedColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 120, align: 'right' },
  { prop: 'city', label: '城市', width: 160 },
  { prop: 'status', label: '状态', width: 120, fixed: 'right' },
]

const customColumns: LhTableColumn[] = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'status', label: '状态', width: 140, slot: 'status' },
]

const lastSort = ref<{ prop: string; order?: string } | null>(null)
const sortText = computed(() =>
  lastSort.value?.order ? `${lastSort.value.prop} ${lastSort.value.order}` : '无',
)

function onSortChange(payload: { prop: string; order?: string }): void {
  lastSort.value = payload.order ? payload : null
}

const lastFilter = ref<{ prop: string; values: (string | number)[] } | null>(null)
const filterText = computed(() =>
  lastFilter.value ? `${lastFilter.value.prop}: ${lastFilter.value.values.join('、')}` : '',
)

function onFilterChange(payload: { prop: string; values: (string | number)[] }): void {
  lastFilter.value = payload
}
</script>

<style>
.demo-tip {
  display: block;
  margin-top: 8px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 12px;
}
</style>
