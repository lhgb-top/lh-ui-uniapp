import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as index from '../../src/index'

/**
 * 注册表反向扫描：src/components/lh-* 下每个 SFC 必须在 src/index.ts 里被命名导出，
 * 否则 easycom 之外的按需引入路径（import { LhXxx } from '@lh-ui/uniapp'）会漏组件。
 */
describe('components registry', () => {
  it('asserts the exact ordered registry', () => {
    expect(index.lhComponents.map((c) => c.name)).toEqual([
      'LhConfigProvider',
      'LhIcon',
      'LhButton',
      'LhTag',
      'LhInput',
      'LhSwitch',
      'LhCheckbox',
      'LhCheckboxGroup',
      'LhRadio',
      'LhRadioGroup',
      'LhForm',
      'LhFormItem',
      'LhSelect',
      'LhTooltip',
      'LhDialog',
      'LhSpace',
      'LhDivider',
      'LhBadge',
      'LhSkeleton',
      'LhSkeletonItem',
      'LhAvatar',
      'LhEmpty',
      'LhCard',
      'LhProgress',
    ])
  })

  it('reverse-checks every SFC under src/components/lh-* is named-exported', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../../src/components')
    const dirs = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith('lh-'))
      .map((d) => d.name)
    const exported = new Set(Object.keys(index))

    for (const dirName of dirs) {
      const sfc = join(dir, dirName, `${dirName}.vue`)
      // easycom 硬约定：SFC 文件名必须等于标签名（否则自动引入失效）
      expect(existsSync(sfc), `缺少与目录同名的 SFC：${dirName}/${dirName}.vue`).toBe(true)

      const pascal = 'Lh' + dirName
        .slice(3)
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      expect(exported, `组件目录 ${dirName} 未在 src/index.ts 命名导出 ${pascal}`).toContain(pascal)
    }
  })
})
