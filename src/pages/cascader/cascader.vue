<template>
  <demo-page title="Cascader 级联选择器">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-cascader
          v-model="value1"
          :options="options"
        />
      </view>
      <text class="demo-value">当前值：{{ value1.length ? value1.join(' / ') : '（未选择）' }}</text>
      <text class="demo-value">面板为多列横向铺开，点击含子级的项展开下一列，点击叶节点选中</text>
    </demo-block>

    <demo-block title="多选模式">
      <view class="demo-row">
        <lh-cascader
          v-model="value2"
          :options="options"
          multiple
        />
      </view>
      <view class="demo-row">
        <!-- collapseTags 折叠标签：只显示首个已选项 + 计数 -->
        <lh-cascader
          v-model="value3"
          :options="cityOptions"
          multiple
          collapse-tags
        />
      </view>
      <text class="demo-value">多选已选：{{ value2.length }} 项 / 折叠标签已选：{{ value3.length }} 项</text>
    </demo-block>

    <demo-block title="禁用与只读">
      <view class="demo-row">
        <lh-cascader
          v-model="value4"
          :options="disabledOptions"
        />
      </view>
      <view class="demo-row">
        <lh-cascader
          v-model="value5"
          :options="options"
          disabled
        />
      </view>
      <view class="demo-row">
        <lh-cascader
          v-model="value6"
          :options="options"
          readonly
        />
      </view>
      <text class="demo-value">disabledOptions 的「指南」节点本身被禁用（选项级）；disabled 禁用整个选择器；readonly 只读不弹层</text>
    </demo-block>

    <demo-block title="路径显示与分隔符">
      <view class="demo-row">
        <lh-cascader
          v-model="cityValue"
          :options="cityOptions"
          placeholder="完整路径（默认）"
        />
      </view>
      <view class="demo-row">
        <lh-cascader
          v-model="cityValue"
          :options="cityOptions"
          :show-all-levels="false"
          placeholder="只显示末级"
        />
      </view>
      <view class="demo-row">
        <lh-cascader
          v-model="cityValue"
          :options="cityOptions"
          separator=" > "
          placeholder="分隔符 >"
        />
      </view>
      <text class="demo-value">已选值：{{ cityValue.join(separatorEcho) }}</text>
    </demo-block>

    <demo-block title="返回值与可选层级">
      <view class="demo-row">
        <!-- emitPath=false 时 v-model 只绑定末级值 -->
        <lh-cascader
          v-model="emitValue"
          :options="cityOptions"
          :emit-path="false"
          placeholder="仅返回末级值"
        />
      </view>
      <view class="demo-row">
        <!-- checkStrictly 任意层级可选（点击非叶节点直接选中） -->
        <lh-cascader
          v-model="strictValue"
          :options="cityOptions"
          check-strictly
          placeholder="任意层级可选"
        />
      </view>
      <text class="demo-value">emitPath=false 绑定值：{{ emitValue.join(' / ') }}；checkStrictly 绑定值：{{ strictValue.join(' / ') }}</text>
    </demo-block>

    <demo-block title="可过滤">
      <view class="demo-row">
        <lh-cascader
          v-model="filterValue"
          :options="cityOptions"
          filterable
          placeholder="输入关键字搜索"
        />
      </view>
      <text class="demo-value">过滤输入框在弹层内（MP 无触发器内输入聚焦语义），搜索结果按完整路径展示并高亮已选项</text>
    </demo-block>

    <demo-block title="字段别名">
      <view class="demo-row">
        <lh-cascader
          v-model="aliasValue"
          :options="aliasedOptions"
          :item-config="{ value: 'id', label: 'name', children: 'sub' }"
          placeholder="id / name / sub 建树"
        />
      </view>
      <text class="demo-value">itemConfig 声明别名后，路径回显同样走别名解析</text>
    </demo-block>

    <demo-block title="更多属性">
      <view class="demo-row">
        <lh-cascader
          v-model="placeholderValue"
          :options="options"
          placeholder="自定义占位符"
        />
      </view>
      <view class="demo-row">
        <lh-cascader
          v-model="noClearValue"
          :options="options"
          :clearable="false"
          placeholder="不可清除"
        />
      </view>
      <view class="demo-row">
        <!-- cascading 关闭后（MP 端无悬停语义，效果与 H5 关闭悬停展开一致）子级仅点击展开 -->
        <lh-cascader
          v-model="looseValue"
          :options="cityOptions"
          multiple
          :cascading="false"
          placeholder="父子不联动"
        />
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const value1 = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>([])
const value3 = ref<(string | number)[]>(['xihu', 'haishu'])
const value4 = ref<(string | number)[]>([])
const value5 = ref<(string | number)[]>([])
const value6 = ref<(string | number)[]>([])

const cityValue = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const separatorEcho = ' / '
const emitValue = ref<(string | number)[]>(['xihu'])
const strictValue = ref<(string | number)[]>(['zhejiang', 'hangzhou'])
const filterValue = ref<(string | number)[]>([])
const aliasValue = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const placeholderValue = ref<(string | number)[]>([])
const noClearValue = ref<(string | number)[]>([])
const looseValue = ref<(string | number)[]>(['xihu', 'binjiang'])

const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      {
        value: 'shejiguize',
        label: '设计规则',
      },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]

const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]

const cityOptions = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [{ value: 'haishu', label: '海曙区' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [{ value: 'xuanwu', label: '玄武区' }],
      },
    ],
  },
]

const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [
      {
        id: 'hangzhou',
        name: '杭州市',
        sub: [
          { id: 'xihu', name: '西湖区' },
          { id: 'binjiang', name: '滨江区' },
        ],
      },
      {
        id: 'ningbo',
        name: '宁波市',
        sub: [{ id: 'haishu', name: '海曙区' }],
      },
    ],
  },
]
</script>

<style>
.demo-row {
  width: 100%;
  margin-bottom: 8px;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
