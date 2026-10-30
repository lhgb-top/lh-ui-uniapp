# Форма

Сбор данных и валидация. Логика валидации целиком состоит из чистых функций `@lh-ui/share`, нулевая зависимость от платформы, поведение одинаковое на обеих платформах.

## Базовое использование

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="Имя пользователя" prop="name">
      <lh-input v-model="form.name" placeholder="Введите имя пользователя" />
    </lh-form-item>
    <lh-form-item label="Эл. почта" prop="email">
      <lh-input v-model="form.email" placeholder="Введите эл. почту" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">Отправить</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: 'Введите имя пользователя', trigger: 'blur' }],
  email: [{ required: true, message: 'Введите эл. почту', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // Валидация пройдена, отправка
  }
}
</script>
```

## Form Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| model | Объект данных формы (обязательный) | `Record<string, unknown>` | — |
| rules | Правила валидации (ключи — имена prop) | `Record<string, LhFormRule[]>` | — |
| labelPosition | Положение метки | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | Ширина метки | `string \| number` | — |
| inline | Строчная раскладка | `boolean` | `false` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Form Methods (вызываются через ref)

::: warning Вызов через ref — только после onReady
На этапе `onLoad` дочерние компоненты ещё не созданы, `formRef.value` — undefined.
Клик по кнопке отправки естественным образом происходит после `onReady`, тут всё в порядке;
если нужно вызвать метод при инициализации страницы — поместите вызов в `onReady`.
:::

| Метод | Описание | Возвращает |
| --- | --- | --- |
| validate | Валидирует все поля | `Promise<boolean>` (true, если все проверки пройдены) |
| validateField | Валидирует отдельное поле | `Promise<boolean>` |

## FormItem Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| prop | Ключ поля (соответствует ключу в model и в rules) | `string` | — |
| label | Текст метки | `string` | — |
| required | Маркер обязательного поля (показывает звёздочку; реальная валидация определяется rules) | `boolean` | `false` |
| rules | Индивидуальные правила поля (сливаются с rules формы) | `LhFormRule[]>` | — |
| customClass | Пользовательский класс | `string` | — |

::: tip Отличия от версии для Vue3
- Триггер валидации: у контролов Mini Program нет семантики change, поэтому каждый контроль формы отображает события blur / input на триггеры валидации.
- Отправка формы: семантика формы в Mini Program иная, `validate` возвращает `Promise<boolean>` для ручной отправки,
  перехвата события `submit` как на web-стороне нет.
:::
