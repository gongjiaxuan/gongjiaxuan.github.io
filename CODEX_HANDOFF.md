# Codex Handoff — HCI+ 暑研申请 + 作品集网站

**时间**: 2026-05-29 深夜
**紧迫度**: 极高 — 明天（5月30日）24:00 截止
**负责人**: Jiaxuan Gong (用户) + Claude + Codex

---

## 一、当前局势

Jiaxuan 正在申请 **HCI+ 2026 暑期研究项目** (Human-Centered Intelligence+)，由清华、港城大、港科广等联合主办。今晚必须完成所有材料提交。

### 用户背景（速览）
- 江南大学 MFA 设计科学 (GPA 89/100)，南艺 BFA 视觉传达 (GPA 88/100)
- TOEFL 106, GRE 333+4.0
- 6篇已发表论文 + 2篇在审 + 1篇planned manuscript
- 核心能力：混合方法 (SEM/SPSS/AMOS + 访谈/主题分析/PRISMA)，设计 (Figma, Blender, Unity, TouchDesigner, Arduino)，Python ML基础
- 设计项目：REMEMBERY (阿尔兹海默APP), TEXTILE 2050 (交互装置, 已展览), LISTEN (感官装置), 木上生画 (非遗iPad APP), 会意AD (沉浸式健康传播), 南艺美术馆 (UX redesign)

### 选定的导师
1. **Nan Gao** (南开) — LLM-mediated parent-child communication 项目 #1
2. **Yang Jiao** (清华) — AI智能眼镜无障碍导航 项目 #1
3. **Chun Yu** (清华) — 自进化个人AI助手 项目 #1

---

## 二、已完成 ✅

| 任务 | 文件/位置 | 状态 |
|------|----------|------|
| HCI+ 针对性 CV | `E:\PHD_27\01_个人材料\CV\CV_JiaxuanGong_HCI+.docx` | 已生成，需用户手动转PDF |
| CV 副本 | `E:\PHD_27\portfolio\cv\CV_JiaxuanGong_HCI+.docx` | 已拷贝 |
| 申请表文字 (14/15/17) | 英文版，针对三位导师定制 | 已写，见下方附录 |
| 跟进邮件模板 | 发往 hcixclub@gmail.com，主题 `[HCIX]` | 已写 |
| 项目图片处理 | `E:\PHD_27\portfolio\images\` 7张图，最大207KB | 已压缩 |
| 作品集 HTML 重写 | `E:\PHD_27\portfolio\index.html` | 已重写，含6个HCI项目卡片 + Modal弹窗 |
| 表单填写策略 | 导师 Nan Gao 主攻 + Yang Jiao 备选 | 已定 |

---

## 三、待完成 ⚠️

### P0: CV PDF
用户需要打开 `E:\PHD_27\01_个人材料\CV\CV_JiaxuanGong_HCI+.docx` → 另存为 PDF。这个 Codex 无法自动完成。

### P1: 部署网站到 GitHub Pages
Git 仓库已在 `E:\PHD_27\portfolio\`，remote 是 `https://github.com/gongjiaxuan/gongjiaxuan.github.io.git`。

```bash
cd E:\PHD_27\portfolio
git add -A
git commit -m "HCI+ application: restructured with 6 HCI projects and modal detail views"
git push origin main
```

### P2: 网站内容验证
部署后检查 `https://gongjiaxuan.github.io`:
- 6个项目卡片是否都有图片显示
- 点击卡片是否弹出 Modal（含大图 + 完整描述 + 左右箭头切换）
- CV 下载按钮是否可点击
- 手机端是否正常

### P3: 用户填表
打开 https://wj.qq.com/s2/26569312/valy/ 填写。

| # | 填写内容 |
|---|---------|
| 01 | Jiaxuan Gong |
| 02 | gongjiaxuan169@gmail.com |
| 03 | Jiangnan University (江南大学) |
| 04 | 在读硕士 |
| 05 | 2026 |
| 08 | TOEFL 106 (Home Edition), GRE 333 + 4.0 |
| 09 | 88/100 |
| 10 | 6月20日至9月20日，每周35小时 |
| 12 | 意向导师1: Nan Gao |
| 13 | 意向导师2: Yang Jiao |
| 14 | 个人技能150字英文版（见下方附录） |
| 15 | 期待收获100字英文版 |
| 16 | Nan Gao 01, Yang Jiao 01, Chun Yu 01 |
| 17 | 项目理解300字英文版 |
| 18 | 上传 CV PDF |
| 19 | 上传中文成绩单 |
| 21 | 上传作品集 PDF（可选） |
| 22 | 上传补充材料 PDF（可选） |

---

## 四、关键技术细节

### 网站结构
```
E:\PHD_27\portfolio\
├── index.html          ← 单文件完整网站
├── images\             ← 7张压缩后的项目图片
│   ├── remembery.jpg   (59KB)
│   ├── woodblock.jpg   (143KB)
│   ├── textile.jpg     (136KB)
│   ├── textile_detail.jpg (175KB) ← Modal 用
│   ├── listen.jpg      (115KB)
│   ├── huiyi.jpg       (168KB)
│   └── museum.jpg      (207KB)
├── cv\
│   └── CV_JiaxuanGong_HCI+.docx
└── .git\               ← GitHub Pages 配置就绪
```

### 已知问题
- Hero 照片占位符未替换（仍显示 "Photo" 文字）
- Google Scholar 链接使用占位 URL
- CV 下载按钮指向 `cv/CV_JiaxuanGong_HCI+.pdf`（需用户手动转换后放入）
- REMEMBERY 展板图 (5MB) 太大未包含，用了样机图

---

## 五、申请表文字附录

### 14 — 个人技能 (150字)

Research methods: Mixed-methods researcher — quantitative (SEM via SPSS/AMOS,
survey design N>500, ANN, hypothesis testing) and qualitative (semi-structured
interviews, thematic analysis, PRISMA systematic review, multi-dimensional
coding of 136 publications). Design & prototyping: User-centered design with
Figma, Unity3D, TouchDesigner, Arduino, Blender, Adobe Creative Suite. Build
interactive prototypes from concept to user evaluation. Programming: Python
(scikit-learn, data analysis), LaTeX. Publications: 6 peer-reviewed journal
papers (1 co-first author) in VR heritage, interactive art, LLM-user behavior,
and accessibility. Languages: TOEFL 106, GRE 333+4.0.

### 15 — 期待收获 (100字)

I aim to develop as a rigorous HCI researcher through hands-on experience
spanning problem formulation, prototype development, user study execution,
and academic writing. Under expert mentorship, I seek to deepen my
understanding of how human-centered design integrates with AI to address
real-world needs, strengthen my experimental design and qualitative analysis
skills, and learn the submission process for top-tier HCI venues. This
experience will bridge my design research training with the empirical rigor
of HCI science.

### 17 — 项目理解 (300字)

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

### 邮件模板 (发送至 hcixclub@gmail.com，主题含 [HCIX])

Dear HCI+ Organizing Committee,

I have just submitted my application for the 2026 HCI+ Summer Research
Program (submitted on May 29). I am writing to express my strong interest
in joining the program.

I am an M.F.A. candidate in Design Science at Jiangnan University, with a
B.F.A. in Visual Communication Design. My research focuses on mixed-methods
HCI — combining survey-based quantitative modeling (SEM, TAM) with
qualitative user research (interviews, thematic analysis, PRISMA systematic
review). I have published 6 peer-reviewed journal papers and hold a TOEFL
score of 106 and GRE of 333+4.0.

I am particularly interested in working with:
- Prof. Nan Gao on LLM-mediated parent-child communication
- Prof. Yang Jiao on AI-powered accessible navigation for visually impaired users
- Prof. Chun Yu on self-evolving personal AI assistants

My CV and portfolio are available at gongjiaxuan.github.io. I would be
grateful for the opportunity to contribute to the HCI+ community this summer.

Best regards,
Jiaxuan Gong
gongjiaxuan169@gmail.com

---

## 六、Codex 可以立即执行的任务

1. **Git commit + push** — `cd E:\PHD_27\portfolio && git add -A && git commit -m "..." && git push`
2. **帮助用户填表** — 把第五部分的文字整理成可复制粘贴的格式
3. **验证网站** — 部署后检查 https://gongjiaxuan.github.io 是否正常
4. **补充材料建议** — 帮用户从设计项目文件夹选最佳图片做作品集 PDF
