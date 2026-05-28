# Codex Handoff — 学术个人主页

## 项目概览

这是 Jiaxuan Gong（龚珈萱）的申博学术个人主页，单文件 HTML/CSS/JS，托管在 GitHub Pages。

- **线上地址**: https://gongjiaxuan.github.io
- **GitHub 仓库**: https://github.com/gongjiaxuan/gongjiaxuan.github.io.git
- **本地路径**: `e:/PHD_27/portfolio/index.html`（单文件，1175 行）
- **部署方式**: 本地改完 → `git add -A && git commit -m "..." && git push` → 30 秒内上线

## 用户画像

- 设计科学 MFA 在读（江南大学），正在申请 PhD
- 不会写代码，需要 Agent 全权代劳
- 审美要求高（设计背景），偏好精致、现代、干净的视觉
- 主要参考网站: https://www.riteshkanchi.com/（Harvard HCI PhD 学生）
- 最终网站风格在 Kanchi 基础上做了个性化调整

## 技术栈

- 纯 HTML + CSS + JS，零框架零依赖
- 字体: Inter（Google Fonts，权重 400/500/600/700/800）
- 色彩: Tailwind prose 色板（`#364153` body, `#101828` headings, `#4a5565` mid, `#6a7282` light）
- Accent: `#6366f1`（靛蓝色）
- 布局: 单栏，max-width 700px
- 所有 CSS 变量在 `:root` 中定义

## 已实现的功能模块

| 模块 | 说明 |
|------|------|
| **导航栏** | sticky + 毛玻璃，移动端 hamburger 菜单 |
| **Hero** | 头像占位 + 名字 + 一句话介绍 + CTA 链接 |
| **About** | 简介 + 教育背景 + 研究兴趣**交互式标签**（hover 高亮关联论文） |
| **出版物时间轴** | 左侧竖线 + 年份节点 + 卡片式条目 + **滚动进度指示**（靛蓝段随滚动丝滑移动） |
| **项目卡片** | Kanchi 风格——图片叠加标题/图标 + hover 描述滑出，横向滚动 + scroll-snap + 左右箭头 |
| **技能** | 2×2 网格 |
| **CV 下载** | 按钮 + 占位链接 |
| **Footer** | 3D 彩虹线框球体（SVG 圆环 + CSS 3D 旋转）+ JS 驱动精灵粒子（Lissajous 轨迹 + 鼠标牵引） |
| **动态 Favicon** | Canvas 渲染迷你球体，每 150ms 更新 |
| **滚动渐现** | IntersectionObserver，每个 section 淡入上浮 |
| **分隔线** | `<hr>` 130% 宽度超出版心 |

## 用户偏好记录

- **字体**: 不喜欢衬线字体，统一用 Inter 无衬线
- **分隔线**: 只用 `<hr>` 细线，section 内部不加分隔线
- **粒子**: 做了很多版本才满意——目前是 Lissajous 3D 路径 + 彩虹渐变色（和球体调色板一致）+ 鼠标靠近时粒子绕鼠标盘旋
- **时间轴**: 不要每篇文章加圆点，用竖线渐变段表示滚动进度
- **作品集**: 必须匹配 Kanchi 的图片叠加 + hover 揭示风格
- **颜色**: 粒子颜色必须和球体环的 Apple 彩虹调色板一致，不匹配会很怪

## 待办

1. **头像**: 灰色圆圈是占位，需要用户提供照片替换
2. **项目预览图**: 所有卡片背景是灰色占位（`#d1d5db`），需要用户提供截图/GIF 替换
3. **CV 下载**: 链接是 `#`，需要上传 CV PDF 并更新链接
4. **Google Scholar / GitHub / 其他社交链接**: 都是 `#` 占位
5. **项目详情页**: 每个项目卡片的 `href="#"` 需要指向实际页面（可以是单独的 HTML 或 # 锚点）
6. **Resume 链接**: Hero 区的 "Resume ↗" 也是占位

## 工作原则

- 用户是设计师，审美挑剔。任何视觉改动前先确认方向，不确定就问
- 改完立刻 `git push`，让用户看线上效果
- 用 `http://localhost:8080` 本地预览（`python -m http.server 8080`）
- 用户反馈可能很简短（"太丑了""不像""改回去"），直接执行不辩论
- 重大结构改动前，先确认
- 不要改动用户已经满意的模块（粒子系统、时间轴指示器、favicon）除非用户明确要求
