# Codex Handoff — Personal Academic Website (HCI Portfolio)

**日期**: 2026-05-30（**今晚午夜 24:00 暑研申请截止！**）
**网站**: https://gongjiaxuan.github.io
**编辑器**: https://gongjiaxuan.github.io/admin.html
**状态**: 暑期研究申请 + 个人网站建设 同步进行中

---

## 一、项目架构

```
E:\PHD_27\portfolio\           ← GitHub Pages 仓库根目录
│
├── index.html                  ← 主页（单页，读取 config.json 动态渲染）
├── project.html                ← 项目详情页（URL参数 ?id=0~7，含滚轮轮播图+视频）
├── admin.html                  ← 可视化 CMS 编辑器（左栏项目列表+右栏编辑区）
├── portfolio.js                ← 共享数据层（加载 config.json，供 index/project 使用）
├── config.json                 ← 全站数据源（hero/about/publications/projects/skills/news）
├── deploy.py                   ← 本地部署服务器（接收编辑器数据→写文件→git push）
│
├── images/                     ← 所有图片
│   ├── remembery.jpg, woodblock.jpg, textile.jpg, ...  ← 卡片缩略图
│   ├── dunhuang_hero.jpg       ← 新项目 hero
│   └── remembery/, woodblock/, textile/, listen/, huiyi/, museum/   ← 每个项目的详情图
│
├── videos/                     ← 所有视频（H.264/AAC MP4）
│   ├── remembery.mp4  (11MB)   ← REMEMBERY 阿尔兹海默APP交互演示
│   ├── textile.mp4    (4MB)    ← TEXTILE 2050 展览现场
│   ├── listen.mp4     (9MB)    ← LISTEN 概念演示
│   ├── huiyi.mp4      (0.2MB)  ← 会意AD 场景动画
│   ├── museum.mp4     (2.4MB)  ← 南艺美术馆 交互动效
│   └── dunhuang.mp4   (91MB)   ← 敦煌奇妙夜 完整演示
│
├── cv/                         ← CV 文件
│   └── CV_JiaxuanGong_HCI+.docx
│
└── .git/                       ← Git 仓库（remote: gongjiaxuan.github.io）
```

## 二、页面结构（主页 index.html）

代码行数：280 行。单页滚动，所有内容从 config.json 动态加载渲染。

```
┌──────────────────────────────────────┐
│ 顶栏导航: About · Research · Projects · CV │
├──────────────────────────────────────┤
│ HERO                                  │
│  [照片 160×200px 直角] 名字 + 一句话    │
│  社交图标: Email · Scholar · GitHub · CV│
├──────────────────────────────────────┤
│ ABOUT                                 │
│  三段 Bio（研究→成果→背景）+ 教育卡片  │
│  研究兴趣标签 + Summer 2026 高亮框     │
├──────────────────────────────────────┤
│ PUBLICATIONS（时间轴 + 渐变色竖线）     │
│  6 篇论文，按年份分组                  │
│  显示完整作者名，Jiaxuan 加粗，标注排名 │
├──────────────────────────────────────┤
│ PROJECTS（横向滚动卡片，左右箭头按钮）  │
│  8 个项目卡片，点击跳转 project.html   │
├──────────────────────────────────────┤
│ NEWS（4 条动态）                       │
├──────────────────────────────────────┤
│ SKILLS（四列）                        │
├──────────────────────────────────────┤
│ CV（下载按钮）                        │
├──────────────────────────────────────┤
│ FOOTER（旋转 3D 球体 + 彩虹粒子动画）   │
└──────────────────────────────────────┘
```

**渲染机制**: index.html 在页面加载时 `fetch('config.json')` → 解析 JSON → 用 JS 动态生成所有 HTML 内容。不再有硬编码内容。

## 三、项目详情页（project.html）

代码行数：213 行。

```
┌──────────────────────────────────────┐
│ ← Back 导航                   1 / 7  │
├──────────────────────────────────────┤
│ CAROUSEL（全宽轮播）                  │
│  滚轮左右切换 / 触摸滑动 / 点击箭头    │
│  底部圆点指示器 + 右上角进度          │
│  600ms debounce 防连跳                │
│  preventDefault 防止页面滚动          │
├──────────────────────────────────────┤
│ 项目标题 · 副标题 · 标签              │
│ 完整文字描述                          │
│ 工具列表                              │
├──────────────────────────────────────┤
│ PROCESS IMAGES（可选）                │
│  线框图/调研图/流程图的堆叠展示        │
│  点击进入 Lightbox 全屏               │
├──────────────────────────────────────┤
│ VIDEO（HTML5 播放器）                 │
├──────────────────────────────────────┤
│ ← Back · 上一个 · 下一个 →           │
└──────────────────────────────────────┘
```

## 四、8 个设计项目

| # | 项目 | 类型 | 视频 | 状态 |
|---|------|------|------|------|
| 0 | REMEMBERY | 阿尔兹海默 APP 设计 | ✅ 11MB | 完整 |
| 1 | 木上生画 | 非遗 EdTech APP | ❌ | 图片有 |
| 2 | TEXTILE 2050 | 物理交互装置 | ✅ 4MB | 完整 |
| 3 | LISTEN | 多感官交互概念 | ✅ 9MB | 完整 |
| 4 | 会意AD | 沉浸式健康传播空间 | ✅ 0.2MB | 完整 |
| 5 | NUA Museum | 美术馆网站 UX 重设计 | ✅ 2.4MB | 完整 |
| 6 | (空项目) | - | - | 编辑器残留 |
| 7 | 敦煌奇妙夜 | 沉浸式交互装置 | ✅ 91MB | Hero+视频就位，缺 Process 图片 |

**设计素材源文件夹**: `E:\PHD_27\01_个人材料\设计项目\`（23 个子目录）

### 敦煌奇妙夜项目（新增）

**源文件夹**: `E:\PHD_27\01_个人材料\设计项目\敦煌奇妙夜\`
**内容**: 
- 设计方案.pptx (1.5GB — 含大量嵌入图片和视频)
- 设计说明.docx (含完整项目描述)
- 展板.ai (621MB)
- 敦煌奇妙夜组.mp4 (408MB — 已压缩到 91MB 部署)
- TouchDesigner 源文件 (.toe)
- 这个项目是手电筒交互 + 投影映射 + 3D 动画的沉浸式空间装置。访客用手电筒照亮石窟壁画，触发的区域会变为 3D 动画并播放音乐

**待补充**: Process 图片（建议从 PPT 中提取概念图、AIGC 参考图、3D 建模截图、空间布局图、TouchDesigner 节点图、展览现场照）

## 五、CMS 编辑器（admin.html）

代码行数：674 行。地址：`gongjiaxuan.github.io/admin.html`

### 界面
```
┌────────────┬──────────────────────────────┐
│ 项目列表    │  ✎ Edit  |  👁 Preview        │
│ (8个项目)  │                              │
│            │  编辑面板:                    │
│ ⚙ Settings │  Title / Subtitle / Tags     │
│            │  Description / Tools          │
│  + Add     │  Hero Image (上传+预览)       │
│            │  Card Thumbnail               │
│            │  Gallery Images (拖拽排序)     │
│            │  Process Images (上传)        │
│            │  Video (上传+播放预览)         │
│            │                              │
│            │  💾 Draft   🚀 Deploy         │
└────────────┴──────────────────────────────┘
```

### 编辑功能
| 功能 | 方式 |
|------|------|
| 文字编辑 | 直接输入框修改 |
| 标签 | 输入后按 Enter 添加 |
| 上传图片 | 点 Upload → 选文件 → 缩略图预览 → ✓ Add→Gallery |
| 拖拽排序 | 拖 ☰ 手柄 / 拖图片重排 |
| 设 Hero | 点画廊中任意图片 |
| 删除图片 | 悬停点 × |
| 上传视频 | 点 🎬 Upload → 选 MP4 → 预览 → ✓ Use |
| Process 图片 | 独立上传区（出现在详情页文字下方、视频上方） |

### 部署流程
```
1. 编辑器修改 → 点 💾 Draft (存本地浏览器)
2. 点 🚀 Deploy (发送数据到 localhost:8765)
3. 服务器写文件 + git commit + git push
4. 1.5秒后自动刷新页面（从线上拉最新）
```

### 部署服务器
**文件**: `E:\PHD_27\portfolio\deploy.py`
**启动**: Claude 已在后台启动（PID 403），监听 `localhost:8765`
**功能**: 接收 JSON POST → 写 config.json + 解码 base64 文件 → git add / commit / push

## 六、数据架构（config.json）

```json
{
  "site": { "name", "email", "scholar", "github", "photo", "cvPath" },
  "hero": { "line1", "line2" },
  "about": { "paragraphs": [...], "highlight" },
  "education": [{ "year", "degree", "school", "note" }],
  "interests": [...],
  "publications": [{ "year", "title", "authors": [...], "venue", "doi", "badge", "authorNote" }],
  "skills": [{ "name", "items" }],
  "news": [{ "date", "title", "detail" }],
  "projects": [{ "id", "title", "subtitle", "cardBlurb", "tags": [...], "description", "tools", "hero", "images": [...], "processImages": [...], "video": { "src", "poster" }, "layout", "cardImage" }]
}
```

## 七、已知问题 & 待改进

| # | 问题 | 状态 |
|---|------|------|
| 1 | 编辑器上传的视频可能不是 H.264 编码，浏览器播不了 | 需在 deploy.py 加自动转码 |
| 2 | 敦煌奇妙夜缺 Process 图片 | 用户后续通过编辑器上传 |
| 3 | 项目 6 是空占位项目 | 需在编辑器中删除或填充 |
| 4 | 个人照片是 SVG 占位符 | config.json 中 `photo` 字段指向 `images/photo.jpg`，但文件未上传 |
| 5 | 主页 News 位置在 Skills 上方 | 已按用户要求调整 |
| 6 | 编辑器加载时可能被 localStorage 旧草稿覆盖 | 点 🗑 按钮清除即可 |
| 7 | 编辑器需通过 HTTP 访问（不能 file://），因为 fetch config.json | 用 gongjiaxuan.github.io/admin.html 即可 |

## 八、文件编码与技术栈

- **所有文件**: UTF-8（无 BOM）
- **CSS**: 手写，无框架，CSS 变量定义颜色和间距
- **JS**: 原生 ES5（兼容性好），无依赖库（除了 admin.html 用 JSZip CDN）
- **字体**: Google Fonts — Inter（400/500/600/700）
- **图标**: 内联 SVG（Email · Scholar · GitHub · CV · 左右箭头）
- **部署**: GitHub Pages，main 分支自动发布

## 九、Codex 可以帮忙的方向

1. **排版布局**: 目前是单栏居中（720px max-width），是否有更好的信息架构？
2. **项目详情页**: 滚轮轮播 + Process 图片区 + 视频，是否需要其他布局选项？
3. **CSS 审美**: 配色、间距、字体大小权重是否合适？
4. **性能**: 91MB 敦煌视频太大了，是否需要进一步压缩或延迟加载？
5. **SEO**: 目前只有一个 meta description，是否需要结构化数据？
6. **移动端**: @media 只有 640px 断点，是否需要更多响应式优化？
7. **Homepage card 排序**: 项目在主页卡片的展示顺序由 config.json 中数组顺序决定

---

# ⚠️ HCI+ 2026 暑研申请（今晚截止！）

## 项目信息

| 项目 | 详情 |
|------|------|
| **全称** | Human-Centered Intelligence+ (HCI+) Summer Research Program 2026 |
| **主办** | 清华大学、香港城市大学、港科广、南开、上海交大、剑桥、普渡等 |
| **形式** | 远程线上，2026年6-9月 |
| **投入** | 至少3个月，每周≥30小时 |
| **录取** | 滚动录取，招满即止 |
| **截止** | **北京时间 5月30日 24:00** |
| **申请链接** | https://wj.qq.com/s2/26569312/valy/ |
| **咨询邮箱** | hcixclub@gmail.com（主题加 [HCIX]） |

## 选定导师

| 优先级 | 导师 | 学校 | 项目 |
|--------|------|------|------|
| **主攻** | Nan Gao | 南开大学 | #01 LLM-Mediated Parent-Child Communication |
| **备选** | Yang Jiao | 清华大学 | #01 AI Smart Glasses Accessible Navigation |
| **备选** | Chun Yu | 清华大学 | #01 Self-Evolving Personal AI Assistant |

### 导师匹配理由
- **Nan Gao**: 混合方法研究（定性访谈+问卷）是她的项目核心需求，Jiaxuan 的 qualitative+quantitative 双修背景完美匹配
- **Yang Jiao**: 项目明确要求 "Design + HCI + user study + system evaluation"，Jiaxuan 的 AR 原型开发经验（硕士论文）直接对口
- **Chun Yu**: 项目开放度高，明确说"不要求论文经验，全程指导"，愿意培养学生

## 最新 CV

**文件位置**: `E:\PHD_27\01_个人材料\CV\CV_JiaxuanGong_HCI+.docx`
**格式**: LaTeX → Overleaf 编译 → PDF
**LaTeX 代码**: 见本对话中最终版本（已在 Overleaf 编译通过）

**CV 关键内容**:
- Header: 邮箱 + 网站 + Scholar + 手机
- Research Interests: Human-AI Interaction, Accessible & Assistive Tech, Immersive Media (AR/VR), AI-Mediated Communication, UX & Technology Acceptance
- 教育: M.F.A. Design Science @ 江南大学 + B.F.A. Visual Communication Design @ 南艺
- 研究经历: 硕士论文 AR → VR Heritage → GenAI PRISMA → Human-AI Collaboration
- 论文: 5 篇已发表 + 1 篇 In Preparation（ACM 引用格式）
- 技能: User Research / Quantitative / Prototyping / Languages
- CV 已删除: 材料科学论文、专利、Under review 的低质量论文

**TOEFL**: 106 (Home Edition) | **GRE**: 333 + 4.0

## 申请表关键字段

| # | 字段 | 填写内容 |
|---|------|---------|
| 01 | 姓名 | Jiaxuan Gong |
| 02 | 邮箱 | gongjiaxuan169@gmail.com |
| 03 | 院校 | Jiangnan University (江南大学) |
| 04 | 学位 | 在读硕士 |
| 05 | 毕业 | 2026 |
| 08 | 英语 | TOEFL 106 (Home Edition), GRE 333 + 4.0 |
| 09 | GPA | 88/100 |
| 10 | 时间 | 6月20日至9月20日，每周35小时 |
| 12 | 导师1 | Nan Gao |
| 13 | 导师2 | Yang Jiao |
| 16 | 项目 | Nan Gao 01, Yang Jiao 01, Chun Yu 01 |

### 申请表第14项 — 个人技能（150字）

Research methods: Mixed-methods researcher — quantitative (SEM via SPSS/AMOS,
survey design N>500, ANN, hypothesis testing) and qualitative (semi-structured
interviews, thematic analysis, PRISMA systematic review, multi-dimensional
coding of 136 publications). Design & prototyping: User-centered design with
Figma, Unity3D, TouchDesigner, Arduino, Blender, Adobe Creative Suite. Build
interactive prototypes from concept to user evaluation. Programming: Python
(scikit-learn, data analysis), LaTeX. Publications: 6 peer-reviewed journal
papers (1 co-first author) in VR heritage, interactive art, LLM-user behavior,
and accessibility. Languages: TOEFL 106, GRE 333+4.0.

### 申请表第15项 — 期待收获（100字）

I aim to develop as a rigorous HCI researcher through hands-on experience
spanning problem formulation, prototype development, user study execution,
and academic writing. Under expert mentorship, I seek to deepen my
understanding of how human-centered design integrates with AI to address
real-world needs, strengthen my experimental design and qualitative analysis
skills, and learn the submission process for top-tier HCI venues. This
experience will bridge my design research training with the empirical rigor
of HCI science.

### 申请表第17项 — 项目理解（300字）

Nan Gao 01 — Parent-Child Communication: This project tackles how LLMs can
mediate emotionally charged interactions without being intrusive. Success
hinges on rigorous qualitative understanding of family dynamics and context-
sensitive intervention design. My interview and thematic analysis experience
prepares me for the fieldwork; my interface design background helps address
how AI nudges should be presented to minimize cognitive load in tense moments.
I am also drawn to the ethical dimension: ensuring AI supports rather than
replaces human judgment in intimate settings.

Yang Jiao 01 — AI Glasses for Visually Impaired: The evaluation framework
— measuring accuracy, response time, trust, and cognitive load — aligns with
my expertise in TAM-based user acceptance modeling and mixed-methods
evaluation. I am drawn to the hybrid human-AI collaboration model, as purely
automated solutions cannot handle complex social contexts. My prior work
designing for vulnerable populations reinforces my commitment to rigorous
user-centered evaluation.

Chun Yu 01 — Self-Evolving Personal AI Assistant: I am intrigued by human-AI
co-evolution: how can an assistant learn from daily interaction to genuinely
improve? My prototyping skills and user research experience position me to
contribute to both building and evaluating such a system. The project's
openness to student-driven direction appeals to me — intrinsic motivation
drives the best research.

## 申请待办

| 任务 | 状态 | 说明 |
|------|------|------|
| CV 转 PDF | ⚠️ 用户操作 | Word 打开 docx → 另存为 PDF |
| 成绩单 | ⚠️ 用户准备 | 中文成绩单扫描/拍照 |
| 填写 QQ 表单 | ⚠️ 用户操作 | https://wj.qq.com/s2/26569312/valy/ |
| 补充材料 PDF | 可选 | 发表论文首页+获奖证书，可选上传 |
| 发送跟进邮件 | ⚠️ 填表后 | 发到 hcixclub@gmail.com，主题含 [HCIX] |

### 跟进邮件模板

**收件**: hcixclub@gmail.com
**主题**: [HCIX] Application Follow-up — Jiaxuan Gong

Dear HCI+ Organizing Committee,

I have just submitted my application for the 2026 HCI+ Summer Research
Program. I am writing to express my strong interest in joining.

I am an M.F.A. candidate in Design Science at Jiangnan University (GPA
89/100), with a B.F.A. in Visual Communication Design. My research focuses
on mixed-methods HCI — combining survey-based quantitative modeling (SEM,
TAM) with qualitative user research (interviews, thematic analysis, PRISMA
systematic review). I have published 6 peer-reviewed journal papers and hold
a TOEFL score of 106 and GRE of 333+4.0.

I am particularly interested in working with:
- Prof. Nan Gao on LLM-mediated parent-child communication
- Prof. Yang Jiao on AI-powered accessible navigation for visually impaired users
- Prof. Chun Yu on self-evolving personal AI assistants

My portfolio and CV are available at gongjiaxuan.github.io.

Best regards,
Jiaxuan Gong
gongjiaxuan169@gmail.com

---

---

# 📱 HCI+ 暑研微信公众号文章

> ⚠️ 微信有反爬保护，WebFetch/Jina 会被拦截。必须用 **CDP 浏览器模式**（已连接 Chrome，Proxy 在 localhost:3456）才能查看原文。

| # | 标题 | URL |
|---|------|-----|
| 1 | **HCI+2026｜暑期研究项目面试启动+申请延长**（主文章，含申请条件、导师列表、项目内容） | `https://mp.weixin.qq.com/s/OPFYGTcyw3Y6pM_XvZZvDg` |
| 2 | **HCI+2026｜导师介绍**（18位导师完整Bio+研究方向） | `https://mp.weixin.qq.com/s?__biz=Mzg3ODYyNTcxNg==&mid=2247485506&idx=1&sn=0fb22684f60d3cce8abda5159e6719ab` |
| 3 | **HCI+2025 招募通知**（去年版本，可参考项目历史） | `http://mp.weixin.qq.com/s?__biz=Mzg3ODYyNTcxNg==&mid=2247485322&idx=1&sn=6da7edd82707991a01ca64cf6b2e69de` |

## 用 CDP 查看微信文章的方法

```bash
# 1. 打开新 tab
curl -s -X POST --data-raw 'https://mp.weixin.qq.com/s/OPFYGTcyw3Y6pM_XvZZvDg' http://localhost:3456/new

# 2. 提取文章内容
curl -s -X POST "http://localhost:3456/eval?target=<从步骤1获取的targetId>" -d "document.querySelector('#js_content').innerText"
```

## 文章摘要（Claude 已抓取的核心信息）

**文章1 — 主文章内容**：
- 自5月7日报名以来已收到大量申请
- 面试由相关导师邮件通知，未进入面试不再另行通知
- **原截止5月20日，延长至5月30日**
- 项目时间：2026年6-9月（导师自定）
- 地点：远程线上
- 报名方式：在线申请表
- 申请条件：英语能力、CS/EE/IE专业背景、HCI/AI研究经历优先
- 导师按首字母A-Z排列（全文约18位导师+36个课题详情）

**文章2 — 导师介绍内容**：
- 项目由清华、港城大、港科广等多校HCI教授联合组织
- 专注以人为本的智能技术创新
- 每位参与者以小组形式加入导师项目
- 将有系列专题讲座和前沿课程
- 2026年招募远程实习生，至少3个月，每周30h+
- 学术顾问：史元春(清华)、赵盛东(港城大)
- 项目主席：易鑫(清华)
- 18位导师完整Bio（研究背景、获奖、论文发表）

---

## 十、手动链接索引

| 用途 | 链接 |
|------|------|
| 网站 | https://gongjiaxuan.github.io |
| 编辑器 | https://gongjiaxuan.github.io/admin.html |
| Google Scholar | https://scholar.google.com/citations?user=FtQ2NOUAAAAJ |
| GitHub | https://github.com/gongjiaxuan |
| 暑研申请表 | https://wj.qq.com/s2/26569312/valy/ |
| 暑研咨询 | hcixclub@gmail.com |
| HCI+ 主文章 | https://mp.weixin.qq.com/s/OPFYGTcyw3Y6pM_XvZZvDg |
| HCI+ 导师介绍 | https://mp.weixin.qq.com/s?__biz=Mzg3ODYyNTcxNg==&mid=2247485506&idx=1&sn=0fb22684f60d3cce8abda5159e6719ab |
| CV Overleaf 代码 | 上文对话中已提供完整 LaTeX |
| 设计素材 | `E:\PHD_27\01_个人材料\设计项目\` |
| 硕士论文 | `E:\硕士学位论文最终精修\` |
| HCI 知识库 | `E:\PHD_27\02_研究方向\学术领域知识库_HCI研究全景_v2.md` |
| CV LaTeX | `E:\PHD_27\01_个人材料\CV\` |
