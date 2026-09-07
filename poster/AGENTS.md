# 海报生成器 · 协作交接

> 给**任何**接手的人或 agent（Claude / Codex / Kimi / 你自己）。
> 不假设你有什么工具，只假设你能编辑文件、开浏览器、用 git。

**线上** https://gongjiaxuan.github.io/poster/
**源码** `poster/index.html` —— **单文件**，无框架、无构建、无依赖。改它就是改全部。
**作者** Jiaxuan Gong ｜ 定位：一个**可玩性很高、随便做做就好看的海报生成器**。审美第一位。

---

## 一、开工前必做的两件事

最新海报代码已经由 Claude 合并并上线，当前工作区是：

```text
E:\PHD_27\portfolio
```

在这个目录开工，并先同步主分支：

```bash
git pull --rebase origin main
```

`E:\PHD_27\portfolio_poster_collab` 停在较早版本，不要从那里继续。主工作区有用户尚未
提交的 CV、图片和视频；只提交自己改过的 `poster/` 文件，不要顺手暂存其他目录。

然后在浏览器里打开 **`poster/index.html?selftest=1`** ——
它会跑一遍全部不变量，在页面上印出 `自检 25 / 25 全部通过`。

**收工前再跑一次。** 只要不是 25/25，就是你改坏了东西。整页耗时约 4–10 秒。

> 直接双击打开 `file://` 就能跑。要本地服务器的话：
> `python -m http.server 8000`，然后开 `http://localhost:8000/poster/?selftest=1`

---

## 二、绝对不能破坏的东西

这个工具的全部价值在于——**你怎么乱拖都出不了丑东西**。
下面这些是引擎里写死的工艺约束。它们看起来像"限制"，其实是这个产品本身。
**删掉任何一条，它就退化成又一个随便拖拖的画图玩具。**

| 约束 | 具体值 | 在哪 |
|---|---|---|
| 切线角度 | 只能是 0° / 90° / ±7~12°，中间那段读作"手滑" | `snapTilt` |
| 切线位置 | 小色域占 28–36%（或 64–72%），禁止对半切 | `snapPos` |
| 两支墨明度差 | ΔL\* ≥ 30，甜区 40–70 | `shuffleState` 的兜底循环 |
| 覆盖率 | 只能是 0（裸纸）或当前纸张的稳定区间（3–95%） | `PAPER_STOCKS` / `snapCov` |
| 网屏锚点 | 锚定在**纸坐标系**。形怎么转怎么挪，网点相位都不动 | `screenFill` / `screenSheet` |
| 网屏角度 | 每块版一个：**深墨 75° / 浅墨 45°**，按 L\* 自动分配。两块版同角度会重合成一个点阵，叠印区糊成脏平涂 | `plateAngle` |
| 网点半径 | r = p·√(a/π)，含网点扩张 a+0.24·sin(πa)，色阶裁 10–85% | `inkR` |
| 器物比例 | 来自馆藏实测（Met / 故宫），不是画出来的 | `PROF` / `ASPECT` |
| 器物剪影 | 必须完整在边距内。几何形才允许出血裁切 | `clampEl` |
| 标题 | 一律实地墨，绝不上网点；必须在边距内 | `drawTitle` / `clampTitle` |
| 候选多样性 | 六个方案用最远点采样挑出，最小可分辨距离 ≥ 0.9 | `propose` |
| 变奏的量 | 三条带按实测标定：抖一下 0.40–1.02、近亲 1.02–1.62、死区 <0.29。**`feat()` 一改就必须重新标定**（方法写在 `VARY_BAND` 上面） | `VARY_BAND` / `proposeVary` |
| 锁 | 用户手动锁死的维度，变奏**永远不许放开**它 | `applyLocks` / `proposeVary` |
| 文字最小字号 | 是墨/纸 ΔL\* 的函数不是常数：`1.0+6.0·max(0,(35−ΔL*)/35)` %H | `minCapPx` |
| 文字间隙 | 两块文字的纵向净间隙必须 ≤1.0×小cap 或 ≥2.4×大cap。中间那段直接读作"没排好" | `placeOnce` |
| 竖排字距 | 汉字 pitch/size = **1.10**、拉丁正立堆叠 = **1.30**。⚠️ `textMetrics` 里"装不下就缩"那一步必须用**同一个**值，否则缩完照样出边距 | `textMetrics` |
| 文字必须看得见 | 判据不看颜色算式，直接画两遍比像素。叠印那一遍在文字之后，必须补画一次 | 自检"文字真的印在纸上" |

**改这些之前先想清楚为什么。** 每一条背后都有实测或一手出处（见 §六）。

---

## 三、代码地图

单文件，从上到下大致是：

```
<style>              CSS。.sheet 的四层阴影 = 纸的物理，别删
<div class="stage">  画布 + 提示 + 候选托盘 + 历史缩略图
<div class="panel">  右侧全部控件
<script>
  ├─ PAIRS/LIB/PAPERS/PAPER_STOCKS   色板、纸张与可印区间
  ├─ PROF / ASPECT / VNAME           六件器物的馆藏实测剖面
  ├─ mkCut / snapPos / snapTilt      切线的合法化
  ├─ profSegs / profInto / shapeInto / elInto      形的路径
  ├─ 旋成体：curLathe / latheMask / latheToShape / drawLathe
  ├─ 抠图：otsu / morph / traceSub / rdpClosed / extract / useImage
  ├─ 颜色：hex2lch / lch2hex / Lstar / mixInk / applyInks
  ├─ 元素：addEl / delEl / hitEl / elPath / elBBox / clampEl / snapAngle
  ├─ 纸张：buildPaperSurface / drawPaperSurface
  ├─ 网屏：screenFill / inkR          ← 印刷物理都在这
  ├─ draw()                          唯一的渲染入口
  ├─ shuffleState / propose / feat    候选生成与多样性
  ├─ selfTest()                      ?selftest=1 触发
```

**状态**全在一个对象 `S` 里，坐标一律是 0–1 的比例（所以换画幅不用改任何东西）：

```js
S = {
  ex:   {t,d,v,k,b,date},        // 展览命题，b 是影响生成器的标记
  cut:  {x1,y1,x2,y2},           // 切线
  paper, stock, tex,              // 纸色 + 纸种 + 纹理强度
  inkA, covA, inkB, covB,         // 两支墨 + 覆盖率
  a, b,                          // 由上面算出来的两块色（别直接改，改完调 applyInks()）
  els: [{k,x,y,s,r,fill,rep,cu,lat}],// k=0..5 几何；k=12 自定义；器物另带 lat
  si:   0,                       // 选中第几个
  texts:[{text,x,y,size,font,dir,role}], // 可编辑文字；dir=h/v，role=title/custom
  ti:   0,                       // 选中第几行文字
  cust: {loops,asp,pts,src},     // 当前上传图片抠出的形
  dot                             // 网屏粗细
}
```

---

## 四、协作规矩（防止两个 agent 打架）

1. 在 `E:\PHD_27\portfolio` 开工，先运行
   `git pull --rebase origin main`；收工运行 `git push origin main`。
   别攒一大堆再推，只暂存自己修改的 `poster/` 文件。
2. **每次收工在 `poster/WORKLOG.md` 顶部追加一条**：日期、你是谁、改了什么、自检结果。
   下一个人靠它知道现在到哪了。
3. **一次只做一件事，做完就提交。** 这个文件 120KB，冲突起来很难合。
4. 提交信息写清楚改了哪个模块，例如 `poster: 文字改成可增删的数组`。
5. **大改动写成补丁脚本**（见 `补丁链/` 的做法：一个 `.mjs`，用字符串替换改 HTML，
   跑一次就完成）。这样出错能回滚，也方便别人看懂你改了什么。
6. 如果你要改 §二 里的任何一条约束，**先在 WORKLOG 里说明理由**。

---

## 五、现在的状态

**已完成**：切一刀（含吸附/切开动画/剪刀光标）· 纸与墨与覆盖率（Yule-Nielsen 半调混色）·
6 几何形 + 6 条馆藏器物剖面 · 每件器物独立旋转与插值 · 上传图片本地抠剪影 · 多元素（加/选/删/Tab/吸附）·
四种画幅 · 跨切线反色 · 网目调 · 六类纸张与吸墨差异 · 多行文字（加/选/改/删/拖动/横竖排/四字体）·
16 条命题池 · 候选托盘 · 配方打印 · 高清 PNG 下载 · 窄屏布局 · 开场自演示

**待办**（按用户给的优先级）：

1. **上传图渲染成三维**——建议用**分层错位**（丝网印多层套印的样子），
   不要用挤出成柱体（会像 PPT 的 3D 艺术字）
2. **更多风格预设**（riso / 丝网 / 活版 / 瑞士 / 日本战后 / 包豪斯 / 构成主义…），
   每套是一整组参数的联动，不是单个开关
3. AI 介入——**优先级：配色建议 > 文案生成 > 操作建议 > 图像生成 > 陪伴**。
   后端 `poster/worker.js` 已写好（Cloudflare Workers AI，免费额度，不需要 API key），
   等用户建好 Worker 给网址

---

## 六、别重做的弯路

这些是已经查证并**被推翻**的说法，不要再按它们做：

- ❌ `flux-1-schnell` 支持 seed / width / height / negative_prompt → **只有 `{prompt, steps}`**
- ❌ 用 Otsu 的可分性 η 自动挑通道 → η 对仿射变换不变，死通道能拿满分，**数学上不成立**
- ❌ CIELAB 里把 L 权重压到 0.6 能去影子 → 对目标场景是**代数空操作**
- ❌ Riso "官方 hex" → 理光**从未发布过**，现有数值是社区近似（stencil.wiki），
  且该站自己的 hex 与 cielab 两个字段差 ΔE 7.5–9.9。**材料里只能写 community approximation**
- ❌ 形态学"先开后闭" → 会削断瓶颈、壶把、器耳。**必须先闭后开**
- ❌ 闭合环直接跑 RDP → 首尾相邻、基准弦近零，会从环上切一刀过去。**必须先拆成两段开曲线**
- ❌ 二值蒙版直接描边 → 只能得到 90° 台阶。**必须先糊成浮点场再取 iso=0.5 等值线**（平滑 20 倍）

更完整的记录在本地（不在仓库里）：
`E:\PHD_27\portfolio\genai-ideation-study\原型_剪影机器\00_恢复说明.md`
以及 `独立调研_Claude_2026-09-03\` 下的九轮调研。

---

## 七、用户定下的规矩

1. 用户是**代码小白**——解释要简单详细，不要堆术语。
2. **别谈风险、隐私、伦理。** 用户明确说过："这是我作品集的一部分而不是真实的实验用原型，
   束手束脚反而做不出有意思的产品。"
3. **创意拉满、视觉审美拉满**优先于严谨性。
4. 先讲你自己的判断，再听用户的想法。
