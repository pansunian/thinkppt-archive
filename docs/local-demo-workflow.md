# 本地 Demo 与正式同步流程

ThinkPPT 现在建议分成两个阶段：

1. 本地看 demo：只看前端定位、页面结构和视觉质感。
2. 正式同步：确认后再手动同步 Notion 数据、构建静态文件并上传 OSS。

## 本地看 Demo

启动本地预览：

```bash
npm run dev:demo
```

浏览器打开：

```text
http://127.0.0.1:5173/
```

本地 demo 会优先用当前前端和示例数据来检查页面气质，不需要每次等待 Notion 导出，也不会上传 OSS。

## 正式同步与部署

正式部署已经改成手动触发：

1. 打开 GitHub 仓库的 Actions。
2. 选择 `Deploy ThinkPPT to Aliyun OSS`。
3. 点击 `Run workflow`。

只有手动运行这个 workflow 时，才会：

- 拉取 Notion 数据
- 分批迁移 Notion 图片
- 构建静态站点
- 上传到阿里云 OSS

普通代码 push 不再自动同步 Notion，也不再自动部署。

## 推荐工作节奏

```text
本地改前端
  ↓
npm run dev:demo 看效果
  ↓
确认定位和页面结构
  ↓
再手动运行 GitHub Actions 正式同步
```

这样可以避免每次小改样式都触发 Notion 同步和 OSS 上传。
