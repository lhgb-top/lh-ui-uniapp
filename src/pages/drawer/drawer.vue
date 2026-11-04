<template>
  <demo-page title="Drawer 抽屉">
    <demo-block title="基础用法">
      <lh-button
        type="primary"
        @click="basicVisible = true"
      >
        打开抽屉
      </lh-button>
      <lh-drawer
        v-model="basicVisible"
        title="订单详情"
      >
        <text class="drawer-text">这是右侧抽屉，默认从右侧滑入，宽度 30%。</text>
        <text class="drawer-text">遮罩与右上角关闭按钮都可以关掉它。</text>
      </lh-drawer>
    </demo-block>

    <demo-block title="四个方向">
      <view class="drawer-row">
        <lh-button @click="openDir('right')">
          right
        </lh-button>
        <lh-button @click="openDir('left')">
          left
        </lh-button>
        <lh-button @click="openDir('top')">
          top
        </lh-button>
        <lh-button @click="openDir('bottom')">
          bottom
        </lh-button>
      </view>
      <lh-drawer
        v-model="dirVisible"
        :title="`${direction} 抽屉`"
        :direction="direction"
        size="40%"
      >
        <text class="drawer-text">当前方向：{{ direction }}，尺寸 40%。</text>
      </lh-drawer>
    </demo-block>

    <demo-block title="自定义尺寸">
      <lh-button
        type="primary"
        @click="sizedVisible = true"
      >
        480px 宽抽屉
      </lh-button>
      <lh-drawer
        v-model="sizedVisible"
        title="筛选条件"
        :size="480"
      >
        <text class="drawer-text">size 传数字为 px，传字符串支持百分比。</text>
        <text class="drawer-text">左右方向作用于宽度，上下方向作用于高度。</text>
        <template #footer>
          <lh-button @click="sizedVisible = false">
            取消
          </lh-button>
          <lh-button
            type="primary"
            @click="sizedVisible = false"
          >
            应用筛选
          </lh-button>
        </template>
      </lh-drawer>
    </demo-block>

    <demo-block title="遮罩与行为开关">
      <lh-button
        type="primary"
        @click="lockVisible = true"
      >
        仅按钮关闭
      </lh-button>
      <lh-drawer
        v-model="lockVisible"
        title="仅按钮关闭"
        :mask-closable="false"
        :show-close="false"
        :close-on-esc="false"
      >
        <text class="drawer-text">遮罩点击与 Esc（H5）都不关闭，只能通过底部按钮关闭。</text>
        <template #footer>
          <lh-button
            type="primary"
            @click="lockVisible = false"
          >
            关闭
          </lh-button>
        </template>
      </lh-drawer>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhDrawerDirection } from '../../components/lh-drawer/types'

const basicVisible = ref(false)
const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
const sizedVisible = ref(false)
const lockVisible = ref(false)

function openDir(dir: LhDrawerDirection) {
  direction.value = dir
  dirVisible.value = true
}
</script>

<style>
.drawer-text {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #4a4a4a;
}
.drawer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
