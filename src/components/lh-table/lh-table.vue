<template>
  <!-- H5：表头 + 表体两个独立横向滚动容器，scrollLeft 双向同步（同 plus 结构） -->
  <!-- #ifdef H5 -->
  <view
    :class="tableClasses"
    :style="rootStyle"
    role="grid"
    :aria-rowcount="props.data.length"
    :aria-colcount="leafColumns.length"
  >
    <view
      :id="headerId"
      class="lh-table__header"
      :style="headerStyle"
    >
      <view
        v-for="(row, rowIndex) in headerRows"
        :key="rowIndex"
        class="lh-table__header-row"
        role="row"
      >
        <view
          v-for="cell in row"
          :key="cell.column.prop"
          role="columnheader"
          :class="headerCellClasses(cell)"
          :style="headerCellStyle(cell)"
          :aria-sort="ariaSort(cell.column)"
          :aria-colspan="cell.colspan > 1 ? cell.colspan : undefined"
          :aria-rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
        >
          <view
            v-if="cell.column.sortable"
            class="lh-table__sort-trigger"
            role="button"
            @click="toggleSort(cell.column)"
          >
            <text>{{ cell.column.label }}</text>
            <text
              class="lh-table__sort-icon"
              :class="{ 'lh-table__sort-icon--active': sortProp === cell.column.prop && sortOrder }"
              aria-hidden="true"
            >{{ sortIcon(cell.column) }}</text>
          </view>
          <text v-else>{{ cell.column.label }}</text>

          <!-- 筛选触发器（仅叶子列；--open 修饰类是 useLhPopper 的触发器选择器） -->
          <view
            v-if="cell.isLeaf && cell.column.filters?.length"
            class="lh-table__filter-trigger"
            :class="{ 'lh-table__filter-trigger--open': openFilterProp === cell.column.prop }"
            role="button"
            :aria-haspopup="true"
            :aria-expanded="openFilterProp === cell.column.prop"
            :aria-label="t('table.filterTitle', '筛选')"
            @click="toggleFilter(cell.column)"
          >
            <text
              class="lh-table__filter-icon"
              :class="{ 'lh-table__filter-icon--active': isColumnFiltered(cell.column.prop) }"
              aria-hidden="true"
            >⏚</text>
          </view>

          <!-- 列宽拖拽手柄（仅叶子列，H5 专属：mousedown 语义在 MP 不存在） -->
          <view
            v-if="cell.isLeaf && isResizable(cell.column)"
            class="lh-table__resize-handle"
            role="separator"
            aria-orientation="vertical"
            :aria-label="t('table.resizeLabel', '调整列宽')"
            @mousedown="onResizeStart($event, cell.column)"
            @keydown="onResizeKeydown($event, cell.column)"
          ></view>
        </view>
      </view>
    </view>

    <view
      :id="bodyId"
      class="lh-table__body"
      :style="bodyStyle"
    >
      <template v-if="props.data.length === 0">
        <view class="lh-table__empty">
          <slot name="empty">{{ t('table.empty', '暂无数据') }}</slot>
        </view>
      </template>
      <template v-else>
        <view
          class="lh-table__phantom"
          :style="{ height: `${totalHeight}px` }"
        >
          <view
            class="lh-table__window"
            :style="windowStyle"
          >
            <view
              v-for="(row, i) in visibleRows"
              :key="rowKeyOf(row, range.start + i)"
              class="lh-table__row"
              :class="{ 'lh-table__row--alt': props.stripe && i % 2 === 1 }"
              role="row"
              :style="{ ...gridRowStyle, ...rowStyle }"
              @click="emit('rowClick', row, range.start + i)"
              @keydown.enter.prevent="emit('rowClick', row, range.start + i)"
              @keydown.space.prevent="emit('rowClick', row, range.start + i)"
            >
              <view
                v-for="(column, colIndex) in leafColumns"
                :key="column.prop"
                role="gridcell"
                :class="bodyCellClasses(colIndex)"
                :style="cellStyle(colIndex)"
              >
                <slot
                  :name="column.slot"
                  :row="row"
                  :column="column"
                  :index="range.start + i"
                  :value="row[column.prop]"
                >{{ getCellValue(row, column) }}</slot>
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 筛选面板（H5 分支） -->
    <lh-root-portal>
      <view
        v-if="filterPanelColumn"
        class="lh-table__filter-mask"
        @click="closeFilter"
      ></view>
      <view
        v-if="filterPanelColumn"
        :id="filterPanelId"
        class="lh-table__filter-panel"
        :style="filterPanelStyle"
        role="group"
        :aria-label="t('table.filterTitle', '筛选')"
      >
        <view class="lh-table__filter-list">
          <view
            v-for="option in filterPanelColumn.filters"
            :key="String(option.value)"
            class="lh-table__filter-option"
            role="checkbox"
            :aria-checked="draftValues.includes(option.value)"
            @click="filterPanelColumn.filterMultiple !== false ? toggleDraftValue(option.value) : setDraftValue(option.value)"
          >
            <checkbox
              v-if="filterPanelColumn.filterMultiple !== false"
              :checked="draftValues.includes(option.value)"
            ></checkbox>
            <radio
              v-else
              :checked="draftValues.includes(option.value)"
            ></radio>
            <text>{{ option.text }}</text>
          </view>
        </view>
        <view class="lh-table__filter-actions">
          <view
            class="lh-table__filter-btn"
            role="button"
            @click="resetFilter"
          >
            <text>{{ t('table.filterReset', '重置') }}</text>
          </view>
          <view
            class="lh-table__filter-btn lh-table__filter-btn--primary"
            role="button"
            @click="confirmFilter"
          >
            <text>{{ t('table.filterConfirm', '确定') }}</text>
          </view>
        </view>
      </view>
    </lh-root-portal>
  </view>
  <!-- #endif -->

  <!-- MP：外层 scroll-view（scroll-x）整表横向滚动；表体内嵌 scroll-view（scroll-y） -->
  <!-- #ifndef H5 -->
  <scroll-view
    :class="tableClasses"
    :style="rootStyle"
    :scroll-x="true"
  >
    <view :style="mpInnerStyle">
      <view
        class="lh-table__header"
        :style="headerStyle"
      >
        <view
          v-for="(row, rowIndex) in headerRows"
          :key="rowIndex"
          class="lh-table__header-row"
        >
          <view
            v-for="cell in row"
            :key="cell.column.prop"
            :class="headerCellClasses(cell)"
            :style="headerCellStyle(cell)"
            :aria-colspan="cell.colspan > 1 ? cell.colspan : undefined"
            :aria-rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
          >
            <view
              v-if="cell.column.sortable"
              class="lh-table__sort-trigger"
              role="button"
              @click="toggleSort(cell.column)"
            >
              <text>{{ cell.column.label }}</text>
              <text
                class="lh-table__sort-icon"
                :class="{ 'lh-table__sort-icon--active': sortProp === cell.column.prop && sortOrder }"
                aria-hidden="true"
              >{{ sortIcon(cell.column) }}</text>
            </view>
            <text v-else>{{ cell.column.label }}</text>

            <view
              v-if="cell.isLeaf && cell.column.filters?.length"
              class="lh-table__filter-trigger"
              :class="{ 'lh-table__filter-trigger--open': openFilterProp === cell.column.prop }"
              role="button"
              :aria-haspopup="true"
              :aria-expanded="openFilterProp === cell.column.prop"
              :aria-label="t('table.filterTitle', '筛选')"
              @click="toggleFilter(cell.column)"
            >
              <text
                class="lh-table__filter-icon"
                :class="{ 'lh-table__filter-icon--active': isColumnFiltered(cell.column.prop) }"
                aria-hidden="true"
              >⏚</text>
            </view>
          </view>
        </view>
      </view>

      <scroll-view
        :id="bodyId"
        class="lh-table__body"
        :style="bodyStyle"
        :scroll-y="true"
        @scroll="onScroll"
      >
        <template v-if="props.data.length === 0">
          <view class="lh-table__empty">
            <slot name="empty">{{ t('table.empty', '暂无数据') }}</slot>
          </view>
        </template>
        <template v-else>
          <view
            class="lh-table__phantom"
            :style="{ height: `${totalHeight}px` }"
          >
            <view
              class="lh-table__window"
              :style="windowStyle"
            >
              <view
                v-for="(row, i) in visibleRows"
                :key="rowKeyOf(row, range.start + i)"
                class="lh-table__row"
                :class="{ 'lh-table__row--alt': props.stripe && i % 2 === 1 }"
                :style="{ ...gridRowStyle, ...rowStyle }"
                @click="emit('rowClick', row, range.start + i)"
              >
                <view
                  v-for="(column, colIndex) in leafColumns"
                  :key="column.prop"
                  :class="bodyCellClasses(colIndex)"
                  :style="cellStyle(colIndex)"
                >
                  <slot
                    :name="column.slot"
                    :row="row"
                    :column="column"
                    :index="range.start + i"
                    :value="row[column.prop]"
                  >{{ getCellValue(row, column) }}</slot>
                </view>
              </view>
            </view>
          </view>
        </template>
      </scroll-view>
    </view>

    <!-- 筛选面板（MP 分支） -->
    <lh-root-portal>
      <view
        v-if="filterPanelColumn"
        class="lh-table__filter-mask"
        @click="closeFilter"
      ></view>
      <view
        v-if="filterPanelColumn"
        :id="filterPanelId"
        class="lh-table__filter-panel"
        :style="filterPanelStyle"
        role="group"
        :aria-label="t('table.filterTitle', '筛选')"
      >
        <view class="lh-table__filter-list">
          <view
            v-for="option in filterPanelColumn.filters"
            :key="String(option.value)"
            class="lh-table__filter-option"
            role="checkbox"
            :aria-checked="draftValues.includes(option.value)"
            @click="filterPanelColumn.filterMultiple !== false ? toggleDraftValue(option.value) : setDraftValue(option.value)"
          >
            <checkbox
              v-if="filterPanelColumn.filterMultiple !== false"
              :checked="draftValues.includes(option.value)"
            ></checkbox>
            <radio
              v-else
              :checked="draftValues.includes(option.value)"
            ></radio>
            <text>{{ option.text }}</text>
          </view>
        </view>
        <view class="lh-table__filter-actions">
          <view
            class="lh-table__filter-btn"
            role="button"
            @click="resetFilter"
          >
            <text>{{ t('table.filterReset', '重置') }}</text>
          </view>
          <view
            class="lh-table__filter-btn lh-table__filter-btn--primary"
            role="button"
            @click="confirmFilter"
          >
            <text>{{ t('table.filterConfirm', '确定') }}</text>
          </view>
        </view>
      </view>
    </lh-root-portal>
  </scroll-view>
  <!-- #endif -->
</template>

<script lang="ts" setup>
import { LH_TABLE_ROW_HEIGHT } from '@lh-ui/share/core/table'
import { useLhTable } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTableProps } from './types'

defineOptions({
  name: 'LhTable',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTableProps>(), {
  data: () => [],
  columns: () => [],
  height: undefined,
  maxHeight: undefined,
  rowHeight: LH_TABLE_ROW_HEIGHT,
  stripe: false,
  border: false,
  size: 'default',
  rowKey: 'id',
  defaultSortProp: undefined,
  defaultSortOrder: undefined,
  sorter: undefined,
  resizable: false,
  defaultFilteredValues: () => ({}),
  filteredValues: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  sortChange: [payload: { prop: string; order: import('@lh-ui/share/core/table').LhTableSortOrder | undefined }]
  rowClick: [row: import('@lh-ui/share/core/table').LhTableRow, index: number]
  filterChange: [payload: { prop: string; values: (string | number)[] }]
  'update:filteredValues': [values: Record<string, (string | number)[]>]
  columnResize: [payload: { prop: string; width: number }]
}>()

const {
  bodyId,
  headerId,
  filterPanelId,
  t,
  headerRows,
  leafColumns,
  sortProp,
  sortOrder,
  toggleSort,
  ariaSort,
  sortIcon,
  openFilterProp,
  filterPanelColumn,
  draftValues,
  filterPanelStyle,
  toggleFilter,
  closeFilter,
  toggleDraftValue,
  setDraftValue,
  confirmFilter,
  resetFilter,
  isColumnFiltered,
  isResizable,
  onResizeStart,
  onResizeKeydown,
  getCellValue,
  range,
  totalHeight,
  visibleRows,
  windowStyle,
  rowStyle,
  onScroll,
  rootStyle,
  headerStyle,
  bodyStyle,
  gridRowStyle,
  headerCellStyle,
  headerCellClasses,
  bodyCellClasses,
  cellStyle,
  tableClasses,
  rowKeyOf,
  mpInnerStyle,
} = useLhTable(
  props,
  emit as LhEmitFn<
    | 'sortChange'
    | 'rowClick'
    | 'filterChange'
    | 'update:filteredValues'
    | 'columnResize'
  >,
)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物。
     - 斑马纹：share 的 :nth-child(even) 净化期登记为 H5-only（WXSS 不支持 nth），
       MP 端由模板按行索引补 --alt 类，色值用同一令牌（color-mix 在 WXSS 不安全，
       fallback 取纯色）。
     - 筛选面板：lh-root-portal 容器是 pointer-events:none，面板与遮罩需各自恢复
       （同 lh-popover 先例）。 -->
<style>
.lh-table--stripe .lh-table__row--alt {
  background-color: var(--lh-table-stripe-bg, #f5f0eb);
}

.lh-table__filter-panel {
  pointer-events: auto;
}

.lh-table__filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}
</style>
