/**
 * 演示工程全局暗色开关（模块级单例 + 本地存储持久化）
 *
 * 【为什么是模块级单例】uni-app 的 App.vue 模板不会渲染页面（页面各自独立挂载），
 * 无法在 App.vue 放一个 ConfigProvider 包住所有页面；各页面用 demo-page 包裹，
 * 共享同一个 dark ref，跨页切换时状态一致。
 *
 * 【存储】uni.getStorageSync / setStorageSync 在 H5 与微信小程序均可用；
 * 测试环境（jsdom 无 uni 全局）做了守卫，模块加载不会抛错。
 */
import { ref } from 'vue'

const STORAGE_KEY = 'lh-ui-demo-dark'

const dark = ref(false)

function safeGetStorage(): boolean {
  if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') return false
  try {
    return uni.getStorageSync(STORAGE_KEY) === true
  } catch {
    return false
  }
}

function safeSetStorage(value: boolean) {
  if (typeof uni === 'undefined' || typeof uni.setStorageSync !== 'function') return
  try {
    uni.setStorageSync(STORAGE_KEY, value)
  } catch {
    // 存储失败不影响演示
  }
}

// 模块加载时读一次持久化值
dark.value = safeGetStorage()

export function useLhDarkTheme() {
  function toggle() {
    dark.value = !dark.value
    safeSetStorage(dark.value)
  }

  return { dark, toggle }
}
