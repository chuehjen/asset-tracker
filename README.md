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
- 数据存储于 Notion Database，多设备同步

## 账户结构

| 类别 | 账户 |
|------|------|
| 美金 USD | Binance、Firstrade |
| 人民币 RMB | 微信、支付宝、网商、工商、招商、富邦、杭州、北京、广州、阿里奖金、借贷（小黑） |
| 台币 TWD | 国泰、国泰证券、元大、台新 |

## 技术架构

```
GitHub Pages（前端）→ Cloudflare Workers（CORS 代理）→ Notion API（数据存储）
```

- **前端**：原生 HTML / CSS / JS，Chart.js 图表，托管于 GitHub Pages
- **代理**：Cloudflare Workers，处理跨域请求并转发至 Notion API
- **存储**：Notion Database，每行为一个月度快照

## 如何更新数据

每月末打开网站，点右上角「＋ 录入」，填入各账户余额和当月汇率，保存即可。

## 本地开发

直接编辑 `index.html`，push 到 `main` 分支后 GitHub Pages 自动部署。

Cloudflare Worker 代码需在 [Cloudflare Dashboard](https://dash.cloudflare.com) 手动更新。
