# Shadowrocket 配置（改版）

个人用的小火箭配置，改自 Johnshall 的懒人配置（含策略组）。

## 来源

- 原版：[Johnshall / Shadowrocket-ADBlock-Rules-Forever](https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever) 的 `lazy_group.conf`
- 原版 md5：`77369703c14d8663bf2b9e015ad5bae5`（28,060 字节）

## 改了什么（相对原版）

1. **去广告**：`[Rule]` 最上面加了 2 行（blackmatrix7 Advertising.list + Cats-Team adrules.list，走 REJECT）。
2. **DNS**：`[General]` 的 DNS 块换成代理域名走节点侧 DoH（`#proxy`）、直连走国内 DoH、备用也不回落 `system`，`ipv6 = false`，劫持硬编码 DNS。
3. **AI 补全**：AI 表里加了 `DOMAIN-SUFFIX,midjourney.com,AI`。
4. **DeepSeek 特意没加进 AI 组**：按个人决定，DeepSeek 是国内服务、走直连。想让它也走美国节点，自己加一行 `DOMAIN-SUFFIX,deepseek.com,AI`。

## 用法

1. 小火箭 → 配置 → 右上角 `+` → 粘贴下面地址 → 下载 → 选“使用配置”：

```
https://raw.githubusercontent.com/saiyanmuse996/shadowrocket-config/main/lazy_group.conf
```

2. 配置 → 代理分组 → 点 `AI` → 选 `美国节点`，以后 AI 流量自动走美国节点。
3. 首页全局路由设为“配置”，断开重连一次。
4. 配置 → 规则 → 点“更新”，核条数：AI 表 99 行、China 表 3,765 行、Global 表 36,025 行、Advertising 表 792 行、Cats-Team 去广告 215,609 行。是 0 就是没拉下来，重新点更新。

机场订阅自己另加，本配置里不含任何订阅地址和账号信息。
