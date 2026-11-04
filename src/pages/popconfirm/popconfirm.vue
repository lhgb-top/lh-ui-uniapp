<template>
  <demo-page title="Popconfirm 气泡确认">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-popconfirm
          title="确定删除这条记录吗？"
          @confirm="onConfirm"
          @cancel="onCancel"
        >
          <lh-button type="danger">
            删除
          </lh-button>
        </lh-popconfirm>
      </view>
      <text
        v-if="action"
        class="demo-value"
      >最近操作：{{ action }}</text>
    </demo-block>

    <demo-block title="三种语气">
      <view class="demo-grid">
        <lh-popconfirm
          type="info"
          title="查看该记录的访问日志？"
        >
          <lh-button>信息</lh-button>
        </lh-popconfirm>
        <lh-popconfirm
          type="warning"
          title="该操作会通知所有成员。"
        >
          <lh-button type="warning">
            警告
          </lh-button>
        </lh-popconfirm>
        <lh-popconfirm
          type="danger"
          title="删除后不可恢复。"
        >
          <lh-button type="danger">
            危险
          </lh-button>
        </lh-popconfirm>
      </view>
    </demo-block>

    <demo-block title="自定义文案与方位">
      <view class="demo-row">
        <lh-popconfirm
          title="归档后可在回收站恢复。"
          confirm-text="归档"
          cancel-text="再想想"
          placement="right"
        >
          <lh-button>自定义文案</lh-button>
        </lh-popconfirm>
      </view>
      <view class="demo-row">
        <!-- hover 仅 H5 有悬停语义；小程序端自动降级为点击切换 -->
        <lh-popconfirm
          title="悬停即可确认。"
          trigger="hover"
          :show-after="0"
          placement="bottom"
        >
          <lh-button>悬停触发</lh-button>
        </lh-popconfirm>
      </view>
      <text class="demo-value">按钮文案默认取语言包 popconfirm.confirm / popconfirm.cancel</text>
    </demo-block>

    <demo-block title="受控显隐">
      <view class="demo-row">
        <lh-popconfirm
          v-model:visible="pcVisible"
          title="受控气泡，显隐由外部开关。"
          trigger="manual"
        >
          <lh-button @click="pcVisible = !pcVisible">
            {{ pcVisible ? '收起' : '外部开关' }}
          </lh-button>
        </lh-popconfirm>
      </view>
    </demo-block>

    <demo-block title="更多属性">
      <view class="demo-row">
        <lh-popconfirm
          title="确定删除这条记录吗？"
          confirm-button-type="primary"
        >
          <lh-button type="danger">
            默认带语气图标
          </lh-button>
        </lh-popconfirm>
      </view>
      <view class="demo-row">
        <lh-popconfirm
          title="该操作不可用。"
          disabled
        >
          <lh-button disabled>
            禁用
          </lh-button>
        </lh-popconfirm>
      </view>
      <view class="demo-row">
        <lh-popconfirm
          title="不展示语气图标。"
          :show-icon="false"
        >
          <lh-button>无图标</lh-button>
        </lh-popconfirm>
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const action = ref('')
function onConfirm() {
  action.value = '已确认'
}
function onCancel() {
  action.value = '已取消'
}

const pcVisible = ref(false)
</script>

<style>
.demo-row {
  width: 100%;
}
.demo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
