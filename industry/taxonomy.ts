// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  {
    "key": "technology",
    "tagColor": "turquoise",
    "label": "技术进展",
    "feedLabel": "技术进展",
    "section": "技术进展",
    "guide": "自动驾驶栈、感知预测规划、仿真、端到端、传感器与算力的实质更新；不把驾驶辅助直接称为无人驾驶。"
  },
  {
    "key": "deployment",
    "tagColor": "orange",
    "label": "项目规模",
    "feedLabel": "项目规模",
    "section": "项目规模",
    "guide": "披露车队数量、付费订单、里程、服务范围、成本与单车经济性；区分计划数、注册数和实际运营数。"
  },
  {
    "key": "industry",
    "tagColor": "turquoise",
    "label": "业界动态",
    "feedLabel": "业界动态",
    "section": "行业动态",
    "guide": "经营合作、事故调查、政策许可、重要人事与行业变化；不得把宣布或测试写成已商用。"
  },
  {
    "key": "funding",
    "tagColor": "orange",
    "label": "融资并购",
    "feedLabel": "融资并购",
    "section": "融资并购",
    "guide": "融资轮次、金额币种、投资方、估值、上市与并购；区分传闻、签约、交割和财报口径。"
  },
  {
    "key": "global",
    "tagColor": "turquoise",
    "label": "全球布局",
    "feedLabel": "全球布局",
    "section": "全球布局",
    "guide": "城市与国家扩张、市场准入、本地运营伙伴与机场场景；国内公司出海也归本类。"
  },
  {
    "key": "china",
    "tagColor": "orange",
    "label": "国内进展",
    "feedLabel": "国内进展",
    "section": "国内推进",
    "guide": "中国境内企业的城市试点、许可、商业运营推进与竞争节奏；数字规模为核心时归项目规模，融资为核心归融资。"
  },
  {
    "key": "paper",
    "tagColor": "turquoise",
    "label": "研究",
    "feedLabel": "研究",
    "section": "技术研究",
    "guide": "自动驾驶相关论文、技术报告、安全方法、公开数据与可复现实验。"
  },
  {
    "key": "tip",
    "tagColor": "orange",
    "label": "实践",
    "feedLabel": "实践",
    "section": "工程与体验",
    "guide": "有可复用方法的工程、安全运营、车队运维实践与真实乘坐体验。",
    "commentary": true
  },
  {
    "key": "opinion",
    "tagColor": "turquoise",
    "label": "观点",
    "feedLabel": "观点",
    "section": "行业观点",
    "guide": "基于事实的行业分析、访谈与商业判断，预测和事实分开。",
    "commentary": true
  }
] as const;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "technology", tag: "技术发布", unit: "项技术更新" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["robotaxi", "av", "ads", "odd", "l4", "lidar", "adas", "ceo", "ipo", "api"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = ["技术发布", "规模披露", "融资并购", "全球布局", "国内进展", "行业动态", "政策/监管", "安全/事故", "论文/研究", "开源/仓库", "教程/实践", "现象/趋势", "行业观点", "评测/基准", "产品更新", "其他"] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = ["感知", "预测/规划", "端到端", "仿真", "传感器", "数据/训练", "安全验证", "运营/车队", "单车经济性", "机场", "出海", "远程协助", "L4", "驾驶辅助", "视频", "图像", "中国", "美国", "欧洲", "中东"] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["Waymo", "Tesla", "Zoox", "Apollo Go", "Pony.ai", "WeRide", "AutoX", "滴滴自动驾驶", "Momenta", "如祺出行", "Uber", "Lyft", "Nuro", "Wayve", "Mobileye", "NVIDIA", "百度", "小鹏", "Aurora", "Motional"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {"融资": "融资并购", "并购": "融资并购", "扩城": "全球布局", "规模": "规模披露", "政策": "政策/监管", "监管": "政策/监管", "安全": "安全/事故", "开源": "开源/仓库", "论文": "论文/研究", "研究": "论文/研究", "观点": "行业观点", "教程": "教程/实践", "视频实测": "视频"};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  "waymo": {
    "name": "Waymo",
    "displayTag": "Waymo",
    "aliases": [
      "Waymo",
      "Google Self-Driving Car", "Waymo One", "Waymo Driver"
    ],
    "orgNames": [
      "Waymo"
    ]
  },
  "tesla": {
    "name": "Tesla",
    "displayTag": "Tesla",
    "aliases": [
      "Tesla",
      "特斯拉",
      "Cybercab",
      "Cybercab Engineering",
      "FSD"
    ],
    "orgNames": [
      "Tesla"
    ]
  },
  "zoox": {
    "name": "Zoox",
    "displayTag": "Zoox",
    "aliases": [
      "Zoox"
    ],
    "orgNames": [
      "Zoox"
    ]
  },
  "apollo-go": {
    "name": "Apollo Go",
    "displayTag": "Apollo Go",
    "aliases": [
      "Apollo Go",
      "萝卜快跑",
      "Baidu Apollo"
    ],
    "orgNames": [
      "Apollo Go"
    ]
  },
  "pony-ai": {
    "name": "Pony.ai",
    "displayTag": "Pony.ai",
    "aliases": [
      "Pony.ai",
      "Pony AI",
      "小马智行"
    ],
    "orgNames": [
      "Pony.ai"
    ]
  },
  "weride": {
    "name": "WeRide",
    "displayTag": "WeRide",
    "aliases": [
      "WeRide",
      "文远知行"
    ],
    "orgNames": [
      "WeRide"
    ]
  },
  "autox": {
    "name": "AutoX",
    "displayTag": "AutoX",
    "aliases": [
      "AutoX",
      "安途"
    ],
    "orgNames": [
      "AutoX"
    ]
  },
  "didi": {
    "name": "滴滴自动驾驶",
    "displayTag": "滴滴自动驾驶",
    "aliases": [
      "DiDi Autonomous Driving",
      "滴滴自动驾驶"
    ],
    "orgNames": [
      "滴滴自动驾驶"
    ]
  },
  "momenta": {
    "name": "Momenta",
    "displayTag": "Momenta",
    "aliases": [
      "Momenta",
      "魔门塔"
    ],
    "orgNames": [
      "Momenta"
    ]
  },
  "ontime": {
    "name": "如祺出行",
    "displayTag": "如祺出行",
    "aliases": [
      "如祺出行",
      "ON TIME"
    ],
    "orgNames": [
      "如祺出行"
    ]
  },
  "uber": {
    "name": "Uber",
    "displayTag": "Uber",
    "aliases": [
      "Uber",
      "优步"
    ],
    "orgNames": [
      "Uber"
    ]
  },
  "lyft": {
    "name": "Lyft",
    "displayTag": "Lyft",
    "aliases": [
      "Lyft"
    ],
    "orgNames": [
      "Lyft"
    ]
  },
  "nuro": {
    "name": "Nuro",
    "displayTag": "Nuro",
    "aliases": [
      "Nuro"
    ],
    "orgNames": [
      "Nuro"
    ]
  },
  "wayve": {
    "name": "Wayve",
    "displayTag": "Wayve",
    "aliases": [
      "Wayve"
    ],
    "orgNames": [
      "Wayve"
    ]
  },
  "mobileye": {
    "name": "Mobileye",
    "displayTag": "Mobileye",
    "aliases": [
      "Mobileye"
    ],
    "orgNames": [
      "Mobileye"
    ]
  },
  "nvidia": {
    "name": "NVIDIA",
    "displayTag": "NVIDIA",
    "aliases": [
      "NVIDIA",
      "英伟达"
    ],
    "orgNames": [
      "NVIDIA"
    ]
  },
  "baidu": {
    "name": "百度",
    "displayTag": "百度",
    "aliases": [
      "百度",
      "Baidu"
    ],
    "orgNames": [
      "百度"
    ]
  },
  "xpeng": {
    "name": "小鹏",
    "displayTag": "小鹏",
    "aliases": [
      "XPeng",
      "小鹏"
    ],
    "orgNames": [
      "小鹏"
    ]
  },
  "aurora": {
    "name": "Aurora",
    "displayTag": "Aurora",
    "aliases": [
      "Aurora Innovation"
    ],
    "orgNames": [
      "Aurora"
    ]
  },
  "motional": {
    "name": "Motional",
    "displayTag": "Motional",
    "aliases": [
      "Motional"
    ],
    "orgNames": [
      "Motional"
    ]
  }
};
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = Object.entries(ENTITIES).map(([id, e]) => ({ id, name: e.name, patterns: e.aliases.map((alias) => new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")) }));
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
 { entityId: "waymo", domains: ["waymo.com"] }, { entityId: "tesla", domains: ["tesla.com"] },
 { entityId: "zoox", domains: ["zoox.com"] }, { entityId: "pony-ai", domains: ["pony.ai"] },
 { entityId: "weride", domains: ["weride.ai"] }, { entityId: "apollo-go", domains: ["apollo.auto"] },
 { entityId: "nvidia", domains: ["nvidia.com"] }, { entityId: "uber", domains: ["uber.com"] },
];
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
