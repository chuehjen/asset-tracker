var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker-current.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var CORS = {
  "Access-Control-Allow-Origin": "https://chuehjen.github.io",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-App-Key"
};
var FIELDS = ["year", "month", "rateUSD", "rateTWD", "binance", "firstrade", "wechat", "alipay", "wangshang", "gsyh", "zsyh", "fubang", "hangzhou", "beijing", "guangzhou", "alibonusrmb", "debt", "cathay", "cathaysec", "yuanta", "taishin"];
var PARSE_ALIASES = [
  ["cathaysec", [/国泰证券/i]],
  ["cathay", [/国泰/i]],
  ["taishin", [/台新/i]],
  ["yuanta", [/元大/i]],
  ["alibonusrmb", [/阿里奖金/i]],
  ["firstrade", [/first\s*trade/i, /finkstrade/i, /firstrade/i]],
  ["binance", [/binance/i]],
  ["wangshang", [/网商/i]],
  ["gsyh", [/工商/i]],
  ["zsyh", [/招商/i]],
  ["fubang", [/富邦/i]],
  ["hangzhou", [/杭州/i]],
  ["beijing", [/北京/i]],
  ["guangzhou", [/广州/i]],
  ["wechat", [/微信/i, /wechat/i]],
  ["alipay", [/支付宝/i, /alipay/i]],
  ["debt", [/借贷/i, /小黑/i]]
];
function parseAssetText(text) {
  const result = Object.fromEntries(FIELDS.map((field) => [field, 0]));
  let matched = false;
  for (const rawLine of String(text || "").split(/\r?\n|\u2028|\u2029/)) {
    const line = normalizeAssetLine(rawLine);
    if (!line) continue;
    for (const [field, patterns] of PARSE_ALIASES) {
      const match = patterns.map((pattern) => pattern.exec(line)).find(Boolean);
      if (!match) continue;
      const amount = parseAmountExpression(line.slice(match.index + match[0].length)) ?? parseAmountExpression(line);
      if (amount === null) continue;
      result[field] = amount;
      matched = true;
      break;
    }
  }
  return matched ? result : null;
}
__name(parseAssetText, "parseAssetText");
__name2(parseAssetText, "parseAssetText");
__name22(parseAssetText, "parseAssetText");
function normalizeAssetLine(line) {
  return String(line || "").replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 65248)).replace(/[＋]/g, "+").replace(/[－−]/g, "-").replace(/[，,]/g, "").replace(/[：:]/g, " ").trim();
}
__name(normalizeAssetLine, "normalizeAssetLine");
__name2(normalizeAssetLine, "normalizeAssetLine");
__name22(normalizeAssetLine, "normalizeAssetLine");
function parseAmountExpression(text) {
  const tokens = String(text || "").match(/[+-]?\s*\d+(?:\.\d+)?/g);
  if (!tokens) return null;
  return tokens.reduce((sum, token) => sum + Number(token.replace(/\s+/g, "")), 0);
}
__name(parseAmountExpression, "parseAmountExpression");
__name2(parseAmountExpression, "parseAmountExpression");
__name22(parseAmountExpression, "parseAmountExpression");
var RMB_FIELDS = ["wechat", "alipay", "wangshang", "gsyh", "zsyh", "fubang", "hangzhou", "beijing", "guangzhou", "alibonusrmb", "debt"];
var TWD_FIELDS = ["cathay", "cathaysec", "yuanta", "taishin"];
function numberValue(s, key) {
  return Number(s?.[key] || 0);
}
__name(numberValue, "numberValue");
__name2(numberValue, "numberValue");
__name22(numberValue, "numberValue");
function assetTotals(s) {
  const usdRaw = numberValue(s, "binance") + numberValue(s, "firstrade");
  const usd = usdRaw * numberValue(s, "rateUSD");
  const rmb = RMB_FIELDS.reduce((sum, key) => sum + numberValue(s, key), 0);
  const twdRaw = TWD_FIELDS.reduce((sum, key) => sum + numberValue(s, key), 0);
  const twd = twdRaw * numberValue(s, "rateTWD");
  return { usdRaw, usd, rmb, twdRaw, twd, total: usd + rmb + twd };
}
__name(assetTotals, "assetTotals");
__name2(assetTotals, "assetTotals");
__name22(assetTotals, "assetTotals");
function money(value) {
  return `\xA5${Math.round(value || 0).toLocaleString()}`;
}
__name(money, "money");
__name2(money, "money");
__name22(money, "money");
function pct(value, total) {
  return total > 0 ? `${(value / total * 100).toFixed(1)}%` : "0.0%";
}
__name(pct, "pct");
__name2(pct, "pct");
__name22(pct, "pct");
function localAssetAnalysis(current, previous) {
  const cur = assetTotals(current);
  const prev = previous ? assetTotals(previous) : null;
  const label = `${current?.year || ""}.${current?.month || ""}`;
  if (cur.total <= 0) {
    const prevText = prev && prev.total > 0 ? `\u4E0A\u4E00\u6761\u5FEB\u7167\u603B\u8D44\u4EA7\u7EA6 ${money(prev.total)}\uFF0C\u5F53\u524D\u4E3A\u7A7A\u4F1A\u8BA9\u5360\u6BD4\u548C\u8D70\u52BF\u56FE\u5931\u771F\u3002` : "";
    return `${label} \u8FD9\u6761\u5FEB\u7167\u76EE\u524D\u6CA1\u6709\u8D44\u4EA7\u91D1\u989D\uFF0C\u65E0\u6CD5\u505A\u7ED3\u6784\u5224\u65AD\u3002${prevText}\u5EFA\u8BAE\u5148\u786E\u8BA4\u662F\u5426\u8BEF\u5EFA\u4E86\u4E00\u6761\u7A7A\u5FEB\u7167\uFF1B\u5982\u679C\u8FD9\u662F\u65B0\u6708\u4EFD\uFF0C\u8BF7\u5148\u5F55\u5165\u5404\u8D26\u6237\u4F59\u989D\u540E\u518D\u770B\u89E3\u8BFB\u3002`;
  }
  const groups = [
    ["\u7F8E\u91D1\u8D44\u4EA7", cur.usd],
    ["\u4EBA\u6C11\u5E01\u8D44\u4EA7", cur.rmb],
    ["\u53F0\u5E01\u8D44\u4EA7", cur.twd]
  ].sort((a, b) => b[1] - a[1]);
  const change = prev ? cur.total - prev.total : null;
  const changeText = change === null ? "\u6682\u65E0\u4E0A\u4E00\u6761\u5FEB\u7167\u53EF\u6BD4\u8F83\u3002" : `\u8F83\u4E0A\u4E00\u6761\u5FEB\u7167${change >= 0 ? "\u589E\u52A0" : "\u51CF\u5C11"} ${money(Math.abs(change))}\u3002`;
  const suggestion = groups[0][1] / cur.total > 0.7 ? `\u5F53\u524D\u4E3B\u8981\u96C6\u4E2D\u5728${groups[0][0]}\uFF0C\u53EF\u4EE5\u7559\u610F\u5355\u4E00\u5E01\u79CD\u6216\u5E02\u573A\u7684\u6CE2\u52A8\u98CE\u9669\u3002` : "\u5E01\u79CD\u5206\u5E03\u76F8\u5BF9\u5206\u6563\uFF0C\u540E\u7EED\u91CD\u70B9\u770B\u73B0\u91D1\u6D41\u548C\u9AD8\u6CE2\u52A8\u8D26\u6237\u53D8\u5316\u3002";
  return `\u672C\u6708\u603B\u8D44\u4EA7\u7EA6 ${money(cur.total)}\uFF0C${groups[0][0]}\u5360\u6BD4\u6700\u9AD8\uFF0C\u4E3A ${pct(groups[0][1], cur.total)}\uFF1B\u4EBA\u6C11\u5E01 ${pct(cur.rmb, cur.total)}\uFF0C\u7F8E\u91D1 ${pct(cur.usd, cur.total)}\uFF0C\u53F0\u5E01 ${pct(cur.twd, cur.total)}\u3002${changeText}${suggestion}`;
}
__name(localAssetAnalysis, "localAssetAnalysis");
__name2(localAssetAnalysis, "localAssetAnalysis");
__name22(localAssetAnalysis, "localAssetAnalysis");
var worker_source_default = {
  async fetch(request, env) {
    const NOTION_TOKEN = env.NOTION_TOKEN;
    const DB_ID = env.DB_ID;
    const LONGCAT_KEY = env.LONGCAT_KEY;
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.headers.get("X-App-Key") !== env.APP_KEY) {
      return json({ error: "Unauthorized" }, 401);
    }
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === "/snapshots" && request.method === "GET") {
        const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const data = JSON.parse(await resp.text());
        if (!data.results) return json({ error: data }, 500);
        const snapshots = data.results.map(pageToSnapshot);
        snapshots.sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month));
        return json(snapshots);
      }
      if (path === "/snapshots" && request.method === "POST") {
        const body = await request.json();
        const resp = await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: { "Authorization": `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
          body: JSON.stringify({ parent: { database_id: DB_ID }, properties: snapshotToProps(body) })
        });
        const data = JSON.parse(await resp.text());
        return json(pageToSnapshot(data));
      }
      if (path.startsWith("/snapshots/") && request.method === "PATCH") {
        const id = path.replace("/snapshots/", "");
        const body = await request.json();
        const resp = await fetch(`https://api.notion.com/v1/pages/${id}`, {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
          body: JSON.stringify({ properties: snapshotToProps(body) })
        });
        const data = JSON.parse(await resp.text());
        return json(pageToSnapshot(data));
      }
      if (path.startsWith("/snapshots/") && request.method === "DELETE") {
        const id = path.replace("/snapshots/", "");
        const resp = await fetch(`https://api.notion.com/v1/pages/${id}`, {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${NOTION_TOKEN}`, "Notion-Version": "2026-03-11", "Content-Type": "application/json" },
          body: JSON.stringify({ in_trash: true })
        });
        const data = JSON.parse(await resp.text());
        if (!resp.ok) return json({ error: data }, resp.status);
        return json({ ok: true, id: data.id, in_trash: data.in_trash });
      }
      if (path === "/rates" && request.method === "GET") {
        const resp = await fetch("https://open.er-api.com/v6/latest/CNY");
        const data = await resp.json();
        if (!data.rates) return json({ error: "\u6C47\u7387\u62C9\u53D6\u5931\u8D25" }, 500);
        const usdToCny = 1 / data.rates.USD;
        const twdToCny = 1 / data.rates.TWD;
        return json({ rateUSD: parseFloat(usdToCny.toFixed(4)), rateTWD: parseFloat(twdToCny.toFixed(4)) });
      }
      if (path === "/parse" && request.method === "POST") {
        const { text } = await request.json();
        const localParsed = parseAssetText(text);
        if (localParsed) return json(localParsed);
        const prompt = `\u4F60\u662F\u4E00\u4E2A\u8D44\u4EA7\u6570\u636E\u89E3\u6790\u52A9\u624B\u3002\u7528\u6237\u4F1A\u7C98\u8D34\u4E00\u6BB5\u8D44\u4EA7\u5217\u8868\u6587\u672C\uFF0C\u8BF7\u5C06\u5176\u89E3\u6790\u4E3AJSON\u683C\u5F0F\u3002

\u8D26\u6237\u5B57\u6BB5\u5BF9\u5E94\u5173\u7CFB\uFF1A
- Binance \u2192 binance\uFF08USD\uFF09
- Firstrade/firstrade \u2192 firstrade\uFF08USD\uFF09
- \u5FAE\u4FE1/wechat \u2192 wechat\uFF08RMB\uFF09
- \u652F\u4ED8\u5B9D/alipay \u2192 alipay\uFF08RMB\uFF09
- \u7F51\u5546 \u2192 wangshang\uFF08RMB\uFF09
- \u5DE5\u5546 \u2192 gsyh\uFF08RMB\uFF09
- \u62DB\u5546 \u2192 zsyh\uFF08RMB\uFF09
- \u5BCC\u90A6 \u2192 fubang\uFF08RMB\uFF09
- \u676D\u5DDE \u2192 hangzhou\uFF08RMB\uFF09
- \u5317\u4EAC \u2192 beijing\uFF08RMB\uFF09
- \u5E7F\u5DDE \u2192 guangzhou\uFF08RMB\uFF09
- \u963F\u91CC\u5956\u91D1 \u2192 alibonusrmb\uFF08RMB\uFF09
- \u501F\u8D37/\u5C0F\u9ED1 \u2192 debt\uFF08RMB\uFF09
- \u56FD\u6CF0\uFF08\u975E\u8BC1\u5238\uFF09\u2192 cathay\uFF08TWD\uFF09
- \u56FD\u6CF0\u8BC1\u5238 \u2192 cathaysec\uFF08TWD\uFF09
- \u5143\u5927 \u2192 yuanta\uFF08TWD\uFF09
- \u53F0\u65B0 \u2192 taishin\uFF08TWD\uFF09

\u89C4\u5219\uFF1A
- \u5982\u679C\u6709\u52A0\u6CD5\uFF08\u5982 109275 + 384400\uFF09\uFF0C\u5408\u5E76\u6210\u4E00\u4E2A\u6570\u5B57\uFF08493675\uFF09
- \u5982\u679C\u6709\u51CF\u6CD5\uFF08\u5982 35509 - 68994\uFF09\uFF0C\u8BA1\u7B97\u51C0\u503C\uFF08-33485\uFF09
- \u7A7A\u767D\u6216\u672A\u63D0\u53CA\u7684\u8D26\u6237\u586B 0
- \u53EA\u8FD4\u56DEJSON\uFF0C\u4E0D\u8981\u4EFB\u4F55\u89E3\u91CA

\u8FD4\u56DE\u683C\u5F0F\uFF1A
{"binance":0,"firstrade":0,"wechat":0,"alipay":0,"wangshang":0,"gsyh":0,"zsyh":0,"fubang":0,"hangzhou":0,"beijing":0,"guangzhou":0,"alibonusrmb":0,"debt":0,"cathay":0,"cathaysec":0,"yuanta":0,"taishin":0}

\u7528\u6237\u8F93\u5165\uFF1A
${text}`;
        const resp = await fetch("https://api.longcat.chat/anthropic/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LONGCAT_KEY}`, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: "LongCat-Flash-Chat", max_tokens: 1e3, messages: [{ role: "user", content: prompt }] })
        });
        const data = await resp.json();
        const text2 = data.content?.[0]?.text || "";
        try {
          const parsed = JSON.parse(text2.replace(/```json|```/g, "").trim());
          return json(parsed);
        } catch (e) {
          return json({ error: "\u89E3\u6790\u5931\u8D25", status: resp.status, upstream: data.error || data, raw: text2 }, 500);
        }
      }
      if (path === "/analyze" && request.method === "POST") {
        const { current, previous } = await request.json();
        const fallbackAnalysis = localAssetAnalysis(current, previous);
        const cur = assetTotals(current);
        if (cur.total <= 0) return json({ analysis: fallbackAnalysis, source: "local" });
        const prev = previous ? assetTotals(previous) : null;
        const prompt = `\u4F60\u662F\u4E00\u4E2A\u4E2A\u4EBA\u8D44\u4EA7\u5206\u6790\u987E\u95EE\uFF0C\u8BF7\u7528\u7B80\u6D01\u7684\u4E2D\u6587\u5206\u6790\u4EE5\u4E0B\u6708\u5EA6\u8D44\u4EA7\u5FEB\u7167\uFF0C\u7ED9\u51FA\u4E13\u4E1A\u4F46\u6613\u61C2\u7684\u89E3\u8BFB\u3002

\u5F53\u6708\u8D44\u4EA7\uFF08${current.year}\u5E74${current.month}\u6708\uFF09\uFF1A
- \u603B\u8D44\u4EA7\uFF1A${money(cur.total)} RMB
- \u7F8E\u91D1\u8D44\u4EA7\uFF1A$${Math.round(cur.usdRaw).toLocaleString()} USD\uFF08\u6298RMB ${money(cur.usd)}\uFF0C\u5360\u6BD4${pct(cur.usd, cur.total)}\uFF09
- \u4EBA\u6C11\u5E01\u8D44\u4EA7\uFF1A${money(cur.rmb)}\uFF08\u5360\u6BD4${pct(cur.rmb, cur.total)}\uFF09
- \u53F0\u5E01\u8D44\u4EA7\uFF1ANT$${Math.round(cur.twdRaw).toLocaleString()}\uFF08\u6298RMB ${money(cur.twd)}\uFF0C\u5360\u6BD4${pct(cur.twd, cur.total)}\uFF09

\u4E3B\u8981\u8D26\u6237\uFF1A
- \u56FD\u6CF0\u8BC1\u5238\uFF1ANT$${current.cathaysec.toLocaleString()}
- \u5317\u4EAC\u8D26\u6237\uFF1A\xA5${current.beijing.toLocaleString()}
- \u963F\u91CC\u5956\u91D1\uFF1A\xA5${current.alibonusrmb.toLocaleString()}
- Firstrade\uFF1A$${current.firstrade.toLocaleString()}

${prev ? `\u4E0A\u6708\u603B\u8D44\u4EA7\uFF1A${money(prev.total)}\uFF0C\u672C\u6708\u53D8\u5316\uFF1A${cur.total >= prev.total ? "+" : "-"}${money(Math.abs(cur.total - prev.total))}` : "\uFF08\u65E0\u4E0A\u6708\u6570\u636E\uFF09"}

\u8BF7\u4ECE\u4EE5\u4E0B\u89D2\u5EA6\u5206\u6790\uFF08\u6BCF\u70B92-3\u53E5\uFF0C\u603B\u957F\u5EA6\u63A7\u5236\u5728200\u5B57\u4EE5\u5185\uFF09\uFF1A
1. \u8D44\u4EA7\u7ED3\u6784\u662F\u5426\u5065\u5EB7\uFF08\u5E01\u79CD\u5206\u6563\u5EA6\uFF09
2. \u672C\u6708\u6700\u5927\u53D8\u5316\u6765\u6E90
3. \u4E00\u4E2A\u5177\u4F53\u7684\u5C0F\u5EFA\u8BAE

\u76F4\u63A5\u8F93\u51FA\u5206\u6790\u5185\u5BB9\uFF0C\u4E0D\u8981\u6807\u9898\u548C\u5E8F\u53F7\u3002`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort("AI timeout"), 6e3);
        try {
          const resp = await fetch("https://api.longcat.chat/anthropic/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LONGCAT_KEY}`, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: "LongCat-Flash-Chat", max_tokens: 1e3, messages: [{ role: "user", content: prompt }] }),
            signal: controller.signal
          });
          const data = await resp.json();
          const analysis = data.content?.[0]?.text?.trim();
          return json({ analysis: analysis || fallbackAnalysis, source: analysis ? "ai" : "local" });
        } catch (e) {
          return json({ analysis: fallbackAnalysis, source: "local" });
        } finally {
          clearTimeout(timeout);
        }
      }
      return new Response("Not found", { status: 404, headers: CORS });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
__name(json, "json");
__name2(json, "json");
__name22(json, "json");
function pageToSnapshot(page) {
  const p = page.properties || {};
  const snap = { id: page.id };
  FIELDS.forEach((f) => {
    snap[f] = p[f]?.number ?? 0;
  });
  return snap;
}
__name(pageToSnapshot, "pageToSnapshot");
__name2(pageToSnapshot, "pageToSnapshot");
__name22(pageToSnapshot, "pageToSnapshot");
function snapshotToProps(snap) {
  const props = { Name: { title: [{ text: { content: `${snap.year}.${snap.month}` } }] } };
  FIELDS.forEach((f) => {
    if (snap[f] !== void 0) props[f] = { number: Number(snap[f]) };
  });
  return props;
}
__name(snapshotToProps, "snapshotToProps");
__name2(snapshotToProps, "snapshotToProps");
__name22(snapshotToProps, "snapshotToProps");
export {
  worker_source_default as default
};
//# sourceMappingURL=worker-current.js.map

