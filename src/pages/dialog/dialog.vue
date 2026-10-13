<template>
  <demo-page title="Dialog 对话框">
    <demo-block title="居中弹层">
      <lh-button
        type="primary"
        @click="centerVisible = true"
      >
        居中对话框
      </lh-button>
      <lh-dialog
        v-model="centerVisible"
        title="提示"
        :close-on-click-modal="false"
      >
        <text class="dialog-text">这是一个居中对话框，点击遮罩不会关闭。</text>
        <template #footer>
          <lh-button @click="centerVisible = false">取消</lh-button>
          <lh-button
            type="primary"
            @click="centerVisible = false"
          >
            确定
          </lh-button>
        </template>
      </lh-dialog>
    </demo-block>

    <demo-block title="点击遮罩关闭">
      <lh-button
        type="primary"
        @click="modalVisible = true"
      >
        遮罩可关闭
      </lh-button>
      <lh-dialog
        v-model="modalVisible"
        title="提示"
        close-on-click-modal
      >
        <text class="dialog-text">点击遮罩即可关闭。</text>
      </lh-dialog>
    </demo-block>

    <demo-block title="底部弹层">
      <lh-button
        type="primary"
        @click="bottomVisible = true"
      >
        底部对话框
      </lh-button>
      <lh-dialog
        v-model="bottomVisible"
        title="底部弹层"
        position="bottom"
        close-on-click-modal
      >
        <text class="dialog-text">从底部升起，适配安全区域。</text>
      </lh-dialog>
    </demo-block>

    <demo-block title="全屏">
      <lh-button
        type="primary"
        @click="fullscreenVisible = true"
      >
        全屏对话框
      </lh-button>
      <lh-dialog
        v-model="fullscreenVisible"
        title="全屏"
        fullscreen
      >
        <text class="dialog-text">铺满整个页面。</text>
      </lh-dialog>
    </demo-block>

    <demo-block title="无标题">
      <lh-button
        type="primary"
        @click="plainVisible = true"
      >
        无标题对话框
      </lh-button>
      <lh-dialog
        v-model="plainVisible"
        close-on-click-modal
      >
        <text class="dialog-text">没有标题栏的简洁对话框。</text>
      </lh-dialog>
    </demo-block>

    <demo-block title="自定义宽度">
      <lh-button
        type="primary"
        @click="widthVisible = true"
      >
        70% 宽对话框
      </lh-button>
      <lh-dialog
        v-model="widthVisible"
        title="自定义宽度"
        width="70%"
      >
        <text class="dialog-text">宽度只作用于对话框本体，定位容器仍是全屏。</text>
      </lh-dialog>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const centerVisible = ref(false)
const modalVisible = ref(false)
const bottomVisible = ref(false)
const fullscreenVisible = ref(false)
const plainVisible = ref(false)
const widthVisible = ref(false)
</script>

<style>
.dialog-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4a4a4a;
}
</style>
