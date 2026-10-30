# التثبيت

## المتطلبات

- يُثبَّت `@lh-ui/share` تلقائيًا (الاعتماد الوحيد في وقت التشغيل لهذا المسجل).
- مشروع uni-app على Vue3 (`@dcloudio/uni-app` 3.x).
- يتطلب برنامج WeChat المصغر **مكتبة أساسية ≥ 2.25.2** (root-portal)؛ والإصدارات الأقدم تتخفّض إلى تموضع fixed داخل الصفحة كحل احتياطي.

## الطريقة الأولى: الاستيراد عند الطلب عبر easycom (موصى به)

بعد التثبيت، أضف قاعدة easycom واحدة إلى `pages.json`:

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

ثم اكتب الوسم مباشرة في القالب، **دون الحاجة إلى import أو تسجيل**:

```vue
<template>
  <lh-button type="primary" @click="onTap">زر</lh-button>
</template>
```

::: warning تكوين easycom لا يُطبّق فورًا
تراعي uni-app أداء الترجمة، لذا **تعديل easycom في `pages.json` لا يشترط إعادة التحويل**. بعد تعديل القاعدة
يجب تغيير محتوى الصفحة (أو إعادة تشغيل خادوم التطوير) لكي تسري. هذا سلوك uni-app القائم وليس مشكلة في هذه المكتبة.
:::

## الطريقة الثانية: التسجيل الكامل

عند عدم استخدام easycom (مثلاً إذا أردت الاستيراد الكامل في مشروع H5)، استخدم `app.use`:

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## إدراج الأنماط

**يجب إدراج ناتجَي CSS في كلتا الطريقتين** (دون أي اعتماد على sass من جانب المستخدم، فقد نُقّيت الأنماط
في وقت البناء لتصبح CSS مكتفية بذاتها):

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // متغيّرات السمة (page { --lh-* } + page.dark للوضع الداكن)
import '@lh-ui/uniapp/src/icon/iconfont.css' // خط الأيقونات (يعتمد عليه مكوّن lh-icon)
```

::: tip لماذا ناتج وقت البناء وليس مصدر scss
مسارات `loadPaths` الخاصة بـ sass في مشاريع uni-app لا تشمل `node_modules`، فلا يمكن تحليل محدّدات
العارية مثل `@use '@lh-ui/share/...'`، وسيؤدي الإدراج المباشر إلى فشل التحويل حتمًا. لذلك يُخرج هذا المسجل
في وقت البناء CSS مكتفية بذاتها، وتُدرجها مكوّنات SFC عبر `<style src="./style.css">`. وهذا يعني أيضًا
**أن المستخدم لا يحتاج إلى تثبيت sass**.
:::

## الخدمات الحتمية تحتاج نقطة تركيب

لا يستطيع Message / Loading إنشاء عناصر DOM عبر JS داخل البرنامج المصغر، لذا يعتمدان **نمط نقطة التركيب**.
ضع مكوّن نقطة التركيب في الصفحة (أو المكوّن الجذر) التي تحتاجه:

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- محتوى الصفحة --></view>

    <!-- نقطة تركيب الخدمات الحتمية -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('تمت العملية بنجاح')
</script>
```

::: danger بدون نقطة تركيب يُعطى تحذير
إذا استدعيت `useLhMessage()` دون وجود `<lh-message />` في الصفحة، فسيُصدر `console.error` تحذيرًا
صريحًا في وقت التطوير، **دون تخفيض صامت**. هذا تصميم مقصود: فالتخفيض الصامت يحوّل «الاستدعاء الذي يبدو
ناجحًا لكن دون أي استجابة» إلى خطأ خفي.
:::

## TypeScript

تأتي المكتبة بأنواعها الخاصة، ولكل من Props المكوّنات والأحداث استنتاج أنواع كامل. وفي حالة easycom
تأتي أنواع وسوم القالب من نظام أنواع مكوّنات `uni-app` (إن لم يُهيّئ المشروع أنواع المكوّنات العامة،
فاستخدم `LhXxxProps` للتعليم الصريح).
