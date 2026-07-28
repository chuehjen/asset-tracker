# Asset Tracker 资产快照

个人月度资产追踪工具，支持三币种（台币 TWD / 人民币 RMB / 美金 USD）记录与折算，数据云端存储于 Notion。

**线上地址：** https://chuehjen.github.io/asset-tracker/

---

## 功能

- 月度资产快照记录，支持按月切换查看
- 三大类资产：台币（TWD）、人民币（RMB）、美金（USD）
- 总资产折算成三种货币显示，附环比涨跌
- 各账户占总资产比例及进度条可视化
- 总资产走势折线图 + 大类占比圆环图
- AI 自然语言解析录入与资产解读
- 删除月度快照（移入 Notion 垃圾箱，可恢复）
- 数据存储于 Notion Database，多设备同步
- 访问密码保护（`X-App-Key`），未持有密码无法读写数据

## 账户结构

| 类别 | 账户 |
|------|------|
| 美金 USD | Binance、Firstrade |
| 人民币 RMB | 微信、支付宝、网商、工商、招商、富邦、杭州、北京、广州、阿里奖金、借贷（小黑） |
| 台币 TWD | 国泰、国泰证券、元大、台新 |

## 技术架构

```
GitHub Pages（前端）→ Cloudflare Workers（CORS 代理 + 密码鉴权）→ Notion API（数据存储）
```

- **前端**：原生 HTML / CSS / JS，Chart.js 图表，托管于 GitHub Pages
- **代理**：Cloudflare Workers，处理跨域请求、密码鉴权并转发至 Notion API
- **存储**：Notion Database，每行为一个月度快照

## 如何更新数据

每月末打开网站，点右上角「＋ 录入」，填入各账户余额和当月汇率，保存即可。

## 访问密码

接口通过 `X-App-Key` 请求头做鉴权，密码存放在 Cloudflare Worker 的 `APP_KEY` Secret 中：

```bash
wrangler secret put APP_KEY
```

网页首次打开时会弹窗要求输入访问密码，输入后会缓存在浏览器 `localStorage` 中，之后无需再次输入；请求若返回 401（密码错误或未缓存）会自动清空本地缓存并重新弹窗一次。

如果忘记密码或需要更换密码：

1. 重新执行 `wrangler secret put APP_KEY` 设置新密码并 `wrangler deploy`。
2. 在浏览器里清空该网站的 `localStorage`（或直接打开无痕窗口 / 换一台设备）访问网站，即可让浏览器重新弹窗输入新密码。

## 本地开发

直接编辑 `index.html`，push 到 `main` 分支后 GitHub Pages 自动部署。

Cloudflare Worker 代码在 `worker.js`，配置在 `wrangler.toml`。敏感信息不要写入代码，使用 Cloudflare Secrets：

```bash
wrangler secret put NOTION_TOKEN
wrangler secret put DB_ID
wrangler secret put LONGCAT_KEY
wrangler secret put APP_KEY
wrangler deploy
```
