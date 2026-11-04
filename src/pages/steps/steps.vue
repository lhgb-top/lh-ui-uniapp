<template>
  <demo-page title="Steps 步骤条">
    <demo-block title="基础用法">
      <lh-steps :current="current">
        <lh-step
          title="研墨"
          description="墨分五色"
        />
        <lh-step
          title="起稿"
          description="经营位置"
        />
        <lh-step
          title="落墨"
          description="骨法用笔"
        />
        <lh-step
          title="题款"
          description="画龙点睛"
        />
      </lh-steps>
      <view class="steps-demo-actions">
        <lh-button
          size="small"
          :disabled="current === 0"
          @click="current = Math.max(0, current - 1)"
        >
          上一步
        </lh-button>
        <lh-button
          size="small"
          type="primary"
          :disabled="current === 3"
          @click="current = Math.min(3, current + 1)"
        >
          下一步
        </lh-button>
      </view>
    </demo-block>

    <demo-block title="竖向步骤">
      <lh-steps
        :current="1"
        direction="vertical"
      >
        <lh-step
          title="提交订单"
          description="2026-10-01 10:00"
        />
        <lh-step
          title="付款成功"
          description="2026-10-01 10:05"
        />
        <lh-step
          title="商家发货"
          description="预计 10-03 送达"
        />
        <lh-step title="确认收货" />
      </lh-steps>
    </demo-block>

    <demo-block title="带图标">
      <lh-steps :current="1">
        <lh-step
          title="注册"
          icon="user"
        />
        <lh-step
          title="验证"
          icon="email"
        />
        <lh-step
          title="完成"
          icon="check"
        />
      </lh-steps>
    </demo-block>

    <demo-block title="自定义图标插槽">
      <lh-steps :current="2">
        <lh-step title="第一步">
          <template #icon>
            <text class="steps-demo-badge">壹</text>
          </template>
        </lh-step>
        <lh-step title="第二步">
          <template #icon>
            <text class="steps-demo-badge">贰</text>
          </template>
        </lh-step>
        <lh-step title="第三步">
          <template #icon>
            <text class="steps-demo-badge">叁</text>
          </template>
        </lh-step>
      </lh-steps>
    </demo-block>

    <demo-block title="可点击导航">
      <lh-steps
        :current="active"
        clickable
        @change="handleChange"
      >
        <lh-step title="第一步" />
        <lh-step title="第二步" />
        <lh-step title="第三步" />
      </lh-steps>
      <text class="steps-demo-tip">点击「已完成」或「进行中」的步骤可回退导航，等待中的步骤不可点。</text>
    </demo-block>

    <demo-block title="整体状态覆盖">
      <lh-steps
        :current="2"
        status="error"
      >
        <lh-step title="第一步" />
        <lh-step title="第二步" />
        <lh-step title="第三步" />
      </lh-steps>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const current = ref(1)
const active = ref(1)

function handleChange(index: number) {
  active.value = index
}
</script>

<style>
.steps-demo-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.steps-demo-tip {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
.steps-demo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #d8d3cc;
  border-radius: 50%;
  font-size: 13px;
  color: #8a8a8a;
  background-color: #faf6f0;
}
</style>
