# ThinkPPT 内容更新流程

ThinkPPT 现在按「平台 -> IP -> 年度/版本 -> PDF 页面」组织内容。新增内容时，优先以 IP 为入口，不按单份方案孤立展示。

## 1. 新增一个 IP

在 `App.tsx` 的 `annualData` 里新增一条 IP 数据：

- `platform`: 平台，例如 `小红书`、`抖音`、`快手`、`BILIBILI`
- `name`: IP 名称，例如 `慢人节`
- `type`: IP 类型，例如 `生活方式情绪 IP`
- `thesis`: 策划人读法，一句话讲清它为什么值得看
- `studyNotes`: 3 条左右的观察点
- `audience`: 适合参考的人群或品牌类型
- `framework`: 洞察、主题、策略、落地等策划路径
- `versions`: 这个 IP 下的不同年度或版本方案

如果 PDF 暂时还没处理，可以先让 `versions` 保持空数组，页面会显示「PDF 待接入」状态。

## 2. 把 PDF 转成页面图片

使用现有脚本把 PDF 转成高清页面图和缩略图：

```bash
swift scripts/render-pdf-pages.swift "原始PDF路径.pdf" public/scheme-pages/<platform>/<ip>/<version> 12
```

最后一个数字是要提取的页数。当前首页建议每个版本先提取 12 页，既能展示内容厚度，又不会让首屏过重。

脚本会输出：

- `page-001.jpg` 到 `page-012.jpg`：高清阅读图
- `thumbs/page-001.jpg` 到 `thumbs/page-012.jpg`：列表缩略图

前端缩略图只加载 `thumbs` 里的小图，用户打开全屏阅读时才看高清图。

## 3. 给 IP 添加一个版本

在对应 IP 的 `versions` 里加入一条：

```ts
{
  year: '2025 3.0',
  title: '小红书慢人节2025年长线IP规划',
  summary: '用于观察一个 IP 如何延展成年度资产。',
  dir: '/scheme-pages/xiaohongshu/manrenjie/2025-planning',
  pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
  labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构', '玩法', '资源', '传播', '收束'],
}
```

上线前运行：

```bash
npm run build
```

构建通过后推送到 GitHub，GitHub Actions 会继续部署到阿里云 OSS。

