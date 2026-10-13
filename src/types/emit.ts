/**
 * 组件 emit 的通用类型
 *
 * defineEmits 产出的是各事件重载的交集（intersection of call signatures），
 * 直接把它传给 `(event: T, ...args) => void` 形式的参数会因 strictFunctionTypes
 * 的参数逆变检查报「类型不兼容」。
 *
 * 这里改用方法签名（call signature）声明：方法参数走双变检查，可兼容任何事件重载，
 * 同时仍能在 logic 内部约束事件名（`emit('xxx')` 写错事件名会报错）。
 */
export type LhEmitFn<Events extends string = string> = {
  (event: Events, ...args: any[]): void
}
