# ThinkPPT 阿里云 OSS + ESA 部署说明

这套部署方式用于替代 Vercel 前台托管：构建时把 Notion 数据导出成静态 JSON，网站文件上传到 OSS，访问流量通过 ESA 加速。

## 1. 本地环境

复制环境变量样例：

```bash
cp .env.aliyun.example .env.aliyun
```

填入：

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `NOTION_DB_AI_ID`
- `NOTION_PAGE_ABOUT_ID`
- `NOTION_PAGE_SUBSCRIBE_ID`
- `ALIYUN_OSS_BUCKET`
- `ALIYUN_OSS_ENDPOINT`

不要把 `.env.aliyun` 提交到 GitHub。

## 2. 构建静态站

```bash
set -a
source .env.aliyun
set +a
npm run build:aliyun
```

构建会生成：

- `dist/index.html`
- `dist/assets/*`
- `dist/data/databases/*.json`
- `dist/data/pages/*.json`
- `dist/data/content/*.json`
- `dist/data/media/*`

其中 `data/media` 是从 Notion 导出的图片副本，用来避免 Notion 临时图片链接过期。

## 3. 上传到 OSS

先在本机配置好 `ossutil` 的访问密钥和默认区域，然后执行：

```bash
npm run deploy:aliyun
```

或者一次性构建并上传：

```bash
npm run deploy:aliyun:all
```

如果你的 OSS 不是根目录托管，可以设置 `ALIYUN_OSS_PREFIX`，例如：

```bash
ALIYUN_OSS_PREFIX=thinkppt npm run deploy:aliyun
```

## 4. OSS 静态网站设置

在 OSS Bucket 中开启静态网站：

- 默认首页：`index.html`
- 默认 404 页面：`index.html`

ThinkPPT 目前是单页应用，这样刷新页面时不会掉到 OSS 的 404。

## 5. ESA 回源设置

在 ESA 中添加 `thinkppt.com` 和 `www.thinkppt.com`：

- 源站类型：域名
- 源站地址：`<bucket>.<endpoint>`，例如 `thinkppt.oss-cn-hangzhou.aliyuncs.com`
- 回源协议：HTTPS
- 回源 Host：同源站地址，或使用你在 OSS 绑定的自定义域名

DNS 侧把 `thinkppt.com` 和 `www.thinkppt.com` 的 CNAME 指向 ESA 给出的加速域名。

## 6. ESA 缓存规则建议

建议按路径分层：

- `/assets/*`：缓存 1 年，浏览器缓存 1 年
- `/data/media/*`：缓存 30 天到 1 年
- `/data/*`：缓存 5 到 30 分钟，更新后可手动刷新缓存
- `/index.html`：缓存 0 到 60 秒

每次重新上传后，如果想立即看到 Notion 最新内容，在 ESA 控制台刷新：

- `/index.html`
- `/data/*`

## 7. 迁移后的更新流程

以后 Notion 内容有变化时：

```bash
set -a
source .env.aliyun
set +a
npm run deploy:aliyun:all
```

然后在 ESA 刷新 `/data/*`。如果只改代码，也可以直接重新构建上传。
