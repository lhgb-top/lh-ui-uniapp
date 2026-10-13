<template>
  <demo-page title="Tooltip 提示">
    <demo-block title="click 触发（全端）">
      <view class="demo-row">
        <lh-tooltip
          content="水墨是国画的根基，以墨色浓淡变化造型"
          placement="top"
        >
          <lh-button>点我（上方）</lh-button>
        </lh-tooltip>
      </view>
      <view class="demo-row">
        <lh-tooltip
          content="丹青泛指绘画，石青石绿为其代表色"
          placement="bottom"
        >
          <lh-button>点我（下方）</lh-button>
        </lh-tooltip>
      </view>
    </demo-block>

    <demo-block title="最大宽度">
      <lh-tooltip
        content="这是一段很长的提示文案，用于演示 maxWidth 自动换行能力，文案越长换行越明显。"
        :max-width="240"
        placement="bottom"
      >
        <lh-button>长文案换行</lh-button>
      </lh-tooltip>
    </demo-block>

    <demo-block title="延迟（hover 生效）">
      <!-- 延迟只用于防误触的 hover/focus，click 立即响应——与 plus 仓 useLhTrigger 语义一致；
           用 click 演示延迟会让人觉得功能失效，故此处用 hover 触发 -->
      <lh-tooltip
        content="显示前有 500ms 延迟"
        placement="top"
        trigger="hover"
        :show-delay="500"
        :hide-delay="300"
      >
        <lh-button>悬停后 500ms 出现</lh-button>
      </lh-tooltip>
    </demo-block>

    <demo-block title="禁用">
      <lh-tooltip
        content="这条提示不会出现"
        placement="top"
        disabled
      >
        <lh-button>禁用提示</lh-button>
      </lh-tooltip>
    </demo-block>

    <demo-block title="hover 触发（仅 H5 生效）">
      <!-- #ifdef H5 -->
      <lh-tooltip
        content="hover 触发只在 H5 端有效，小程序无 hover 语义"
        placement="top"
        trigger="hover"
      >
        <lh-button>悬停我</lh-button>
      </lh-tooltip>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <text class="demo-value">小程序端无 hover，请用 click 触发</text>
      <!-- #endif -->
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.demo-row {
  width: 100%;
}
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
</style>
