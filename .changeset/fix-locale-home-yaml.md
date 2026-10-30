---
'@lh-ui/uniapp': patch
---

修复文档站 fr 首页 frontmatter：一处 `details` 明文标量含「冒号+空格」（`pages.json : écrivez`），YAML 解析失败；给值加上双引号。
