import type { Messages } from "./en";

export const zh: Messages = {
  meta: {
    siteName: "TwoMode",
    tagline: "一个模型负责写，另一个负责审。你拿到的是经得起两边检验的答案。",
    homeDescription:
      "TwoMode 让两个 AI 模型处理同一个任务：一个产出结果，另一个依据锁定的验收标准审查，并且必须为每一条异议提供可复现的证据。使用你自己的 API 密钥，我们不在你的 token 上加价。",
  },
  nav: {
    product: "产品",
    pricing: "价格",
    docs: "文档",
    faq: "常见问题",
    signIn: "登录",
    getStarted: "开始使用",
    skipToContent: "跳到主要内容",
    changeLanguage: "切换语言",
    changeTheme: "切换主题",
  },
  home: {
    eyebrow: "自带密钥 · token 不加价",
    headline: "两个模型，一个站得住脚的答案",
    sub: "由你决定哪个模型干活、哪个模型审查。审查方不能凭感觉拦下工作，每一条异议都必须附上能真正跑起来的证据。",
    ctaPrimary: "免费开始",
    ctaSecondary: "了解运作方式",
    makerLabel: "执行方",
    checkerLabel: "审查方",
    makerRole: "产出结果并回应异议",
    checkerRole: "依据锁定的标准审查，并给出证据",
    howTitle: "为什么两个模型胜过一个",
    how: [
      {
        title: "动工之前先锁定验收标准",
        body: "最终的验收标准由审查方亲自撰写，因此它被自己的标准约束，无法在第三轮时临时改变要求。",
      },
      {
        title: "没有证据就不能拦下工作",
        body: "可以中止工作的异议必须附带一个真正失败的检查。写不出来，系统就自动降级，工作继续推进。",
      },
      {
        title: "已经了结的争论不会重来",
        body: "每条异议都有指纹。一旦被修复或被驳回，就不能换个说法再提一次——这正是循环不会无止境跑下去的原因。",
      },
      {
        title: "它总能停下来",
        body: "没有未决的阻塞项即为通过；连续两轮没有进展则判定为僵局，连同未解决的问题一起交回给你。",
      },
    ],
    tokensTitle: "为最省 token 而设计",
    tokensBody:
      "直接跑两个模型的开销是单次对话的二到四倍。提示缓存、只审查差异、结构化裁决和精简的问题账本把这个数字压了回来，而且每个答案的实际用量都会显示出来——因为那是你的账单，不是我们的。",
    tokensStat: "每个通过答案消耗的 token",
    tokensStatNote: "在用量面板中实时显示",
  },
  faq: {
    title: "常见问题",
    items: [
      {
        q: "审查模型会看到我另一家服务商的 API 密钥吗？",
        a: "不会。每家服务商都只用自己的密钥、从服务端经 TLS 单独调用。密钥不会出现在提示词里，不会被送往另一家服务商，保存之后也不会再返回浏览器。",
      },
      {
        q: "我的 API 密钥是怎么保存的？",
        a: "在写入数据库之前用 AES-256-GCM 加密。主密钥存放在 Workers secret 中，不会进入代码仓库。保存后只显示末四位，你可以随时吊销密钥并立即生效。",
      },
      {
        q: "TwoMode 收费吗？",
        a: "应用本身免费，你直接向模型服务商付费。我们不在你的 token 上加价，这也是我们无需查看你的用量来计费的原因。",
      },
      {
        q: "可以使用哪些模型？",
        a: "任何你的 Anthropic 密钥能访问的 Claude 模型，以及任何你的 Google 密钥能访问的 Gemini 模型。由你决定谁执行、谁审查，两个角色一键即可对调。",
      },
      {
        q: "如果审查模型宕机了会怎样？",
        a: "你仍然会拿到已完成的工作，并标注为未经审查，而不是看到一个错误页面。失败的调用只在服务商表明可重试时，才按指数退避重试。",
      },
      {
        q: "我可以删除我的数据吗？",
        a: "可以。你能在设置中把全部数据导出为 JSON 并删除账户；删除会在 30 天内完成，包括备份轮换。对话内容默认在 180 天后自动删除。",
      },
    ],
  },
  pricing: {
    title: "价格",
    lede: "只有一个方案，而且免费，因为你自带 API 密钥并直接向模型服务商付费。",
    planName: "自带密钥",
    price: "免费",
    priceNote: "另需支付你的服务商所收取的费用",
    features: [
      "不限对话数量",
      "你的密钥能访问的任何 Claude 与 Gemini 模型",
      "随时对调执行方与审查方",
      "token 用量与节省情况面板",
      "随时导出并删除你的数据",
    ],
    cta: "创建账户",
    honestyTitle: "为什么免费，说实话",
    honestyBody:
      "因为我们从不经手你的 token，无论你用得多频繁，我们的运行成本都只有每月几美元。如果哪天这一点变了，我们会在它变之前说明，而不是之后。",
  },
  footer: {
    product: "产品",
    legal: "法律条款",
    privacy: "隐私政策",
    terms: "服务条款",
    cookies: "Cookie",
    rights: "保留所有权利。",
    builtWith: "运行于 Cloudflare Workers。",
  },
  errors: {
    notFoundTitle: "页面不存在",
    notFoundBody: "链接可能已经过期，或者地址里有拼写错误。",
    genericTitle: "我们这边出了点问题",
    genericBody: "错误已被记录。重新加载通常有效；如果仍然不行，下面的参考编号能帮我们定位问题。",
    backHome: "返回首页",
    reference: "参考编号",
  },
};
