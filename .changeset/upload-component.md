---
'@lh-ui/uniapp': minor
---

# 新增 Upload 上传组件

- 新增 `lh-upload` 组件：文件选择 + 上传，选择校验（accept / maxSize 默认 5MB /
  maxCount）与文件项状态机（ready → uploading → success / fail）全部消费
  share core 纯函数，上传本身不内置 HTTP 客户端，`request` prop 由使用方持有；
  事件 change / success / error（附失败文件与原因）/ remove（uid）；文件列表
  含进度条（role="progressbar"）、失败原因、移除按钮（aria-label 带文件名）。
- 【移植决策】API 严格对齐 plus 真源（multiple / drag / disabled / accept /
  maxSize / maxCount / request / sx），plus 没有的 action / headers / fileList /
  before-upload 等不新增，上传地址等配置经 request 函数由使用方持有；另按本仓
  惯例增加 `customClass`（样式隔离穿透）。
- 【uni-app 差异】选择走 adapter 的 `chooseLhFiles`（chooseMedia / chooseImage /
  chooseVideo 原生 API，小程序无 `<input type="file">`），产物是临时文件句柄
  `LhUniFile`（path / name / size / type），不是 DOM File；`request` 收
  `LhUniFile` 而非 File，配套 `createLhUploadRequest(action, config)` 生成
  request（小程序走 uni.uploadFile、H5 走 XHR + FormData，两端 multipart 语义
  对齐）；accept 只能映射媒体类型（image/* → 图片选择，video/* → 视频选择，
  混合或不限 → chooseMedia 混合模式），扩展名规则无法传入原生选择面板，
  由选择后的 share `isFileRejected` 兜底校验；chooseMedia 有存在性守卫
  （微信基础库 2.10+，不可用回退 chooseImage / chooseVideo）；拖拽上传与
  键盘激活（Enter / Space）仅 H5（条件编译裁剪，MP 包内无死代码）；用户取消
  （errMsg 含 cancel）静默，不写错误提示也不触发 error 事件；文档已登记
  「uploadFile 目标域名需在微信后台服务器域名登记」。
- 配套：`src/pages/upload` demo 页（基础用法 / 多选与数量大小限制 / accept 类型
  限制 / 视频上传 / 拖拽上传仅 H5 / 仅选择不上传 / 禁用）+ pages.json 路由 +
  首页列表（demo-pages 守卫三向对齐）、`tests/components/upload.spec.ts`
  （19 例：默认提示与按钮语义、drag 提示、触发区默认插槽、customClass / sx、
  chooseImage 选择与文件项渲染、multiple 时 count 参数、视频 accept 走
  chooseVideo、chooseMedia 优先与 mediaType 映射、maxSize 超限、maxCount 超限、
  扩展名规则兜底拒绝、取消选择静默、request 上传中进度条 → 成功、失败原因与
  error 事件、移除文件、禁用拦截点击与键盘、Enter 键盘激活、dragover 类名
  切换、H5 拖放落下走统一流程）、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」：选择走原生 API、accept
  仅映射媒体类型、request 收 LhUniFile、拖拽与键盘仅 H5、取消静默、域名登记）+
  `componentItems` 九语言 labels。
