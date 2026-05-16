# 乐乐小岛 🏝️

为香港小学生设计的趣味学习平台，通过游戏化方式学习粤语、繁体中文、数学、英文和常识。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 + Vite |
| 语言 | JSX (JavaScript) |
| 状态管理 | React Context + useReducer |
| 持久化 | localStorage + 可选云端同步 |
| 路由 | state 驱动（无路由库） |
| 语音 | Web Speech API (zh-HK) |
| AI 出题 | 外部 API（`src/api.js`） |
| 样式 | 单文件 CSS（`src/App.css`） |
| 构建输出 | 纯静态文件（`dist/`） |

## 目录结构

```
src/
├── App.jsx                  # 根组件，游戏模式路由
├── App.css                  # 全部样式
├── store/index.jsx          # 全局状态（useReducer + Context）
├── api.js                   # AI/外部 API 调用
├── screens/                 # 各科目主页面
│   ├── HomeScreen.jsx       # 首页（宠物展示 + 科目入口）
│   ├── MathScreen.jsx       # 数学岛
│   ├── ChineseScreen.jsx    # 汉字区（含写字+默写）
│   ├── CantoneseScreen.jsx  # 粤语区（含语音引擎）
│   ├── EnglishScreen.jsx    # 英文岛
│   └── GSScreen.jsx         # 常识科
├── games/                   # 游戏组件（可复用）
│   ├── QuizGame.jsx         # 选择题
│   ├── WritingCanvas.jsx    # 写字画布（含评分引擎）
│   ├── AudioGame.jsx        # 听力题
│   ├── MatchGame.jsx        # 配对
│   ├── SpeedChallenge.jsx   # 限时口算
│   ├── FillInGame.jsx       # 填空
│   ├── OrderGame.jsx        # 排序
│   ├── GridGame.jsx         # 记忆翻牌
│   ├── SortGame.jsx         # 分类
│   └── StepSolverGame.jsx   # 分步解题
├── components/              # 通用组件
│   ├── PetCompanion.jsx     # 宠物（SVG + 动画）
│   ├── RewardModal.jsx      # 奖励弹窗
│   └── MistakeAnalysis.jsx  # 错题分析面板
├── data/                    # 题库数据 + 模板引擎
│   ├── mathProblems.js
│   ├── characters.js        # 376 个繁体字库
│   ├── cantonese.js
│   ├── enProblems.js
│   ├── curriculum/          # 9 级课程体系
│   ├── queryEngine.js       # 模板查询引擎
│   └── templateEngine.js    # 模板渲染引擎
└── utils/
    └── speech.js            # 语音工具函数
```

## 核心架构

### 状态管理
- 所有游戏数据存在一个全局对象中（宠物、星币、进度、错题等）
- `localStorage` 自动读写，刷新不丢数据
- 离线衰减：根据离线时长降低饱食度/心情
- 在线衰减：每 3 分钟扣减宠物状态（防挂机）

### 页面路由
- 根据 `gameMode` state 变量渲染对应 screen
- 每个 screen 内部再用子状态切换具体游戏
- 返回按钮统一 `setGameMode(null)`

### 出题系统
- 模板 + 变量组合生成题目
- 支持多科目、多年级、多题型
- 9 级课程体系（小一 ~ 中三）

### 写字评分
- 10×10 网格对比算法（F1 score + 偏移惩罚）
- 防刷星机制：同字多次练习奖励递减

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

### Cloudflare Pages（推荐）

前后端全部署在 Cloudflare，无需额外服务器。

#### 第一步：创建 D1 数据库（用于用户登录和云端存档）

```bash
npx wrangler d1 create lele-island
```

会输出一段内容，把其中的 `database_id` 复制下来，填到 `wrangler.toml` 中：

```toml
[[d1_databases]]
binding = "DB"
database_name = "lele-island"
database_id = "这里填你复制到的 database_id"
```

#### 第二步：初始化数据库表

```bash
npx wrangler d1 execute lele-island --file=server/schema.sql
```

#### 第三步：部署

```bash
# 构建
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --branch main

# 设置 AI API Key（用于粤语对话、AI出题等功能）
npx wrangler pages secret put DEEPSEEK_API_KEY
# 输入: sk-d99be362daee4f828717e1d182ae7973
```

部署后访问 `https://lele-island.pages.dev` 即可使用。

> 不设置 D1 数据库也能用，会自动降级为离线模式（数据存在浏览器本地，无需登录）。AI 功能不设置 `DEEPSEEK_API_KEY` 也会自动降级，不影响核心游戏。

#### 方式二：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers 和 Pages → Pages
2. 点击「连接到 Git」→ 选择 `fanfuzi/lele-island`
3. 构建设置：框架预设 **Vite**，构建命令 `npm run build`，输出目录 `dist`
4. 部署完成后，在项目 Settings → **Functions** → **D1 database bindings** → 添加绑定：
   - 变量名称：`DB`
   - 数据库：选择你创建的 `lele-island`
5. 在 Settings → **Environment variables** → 添加 `DEEPSEEK_API_KEY`

### 其他平台

项目是纯静态 SPA，`dist/` 目录可部署到任何静态托管：

- **Vercel / Netlify** — 零配置
- **GitHub Pages** — `npm run deploy`
- **Nginx / Apache / S3** — 直接托管 dist/ 目录

## 关键配置

- `src/store/index.jsx` — 初始星币、宠物属性、衰减速率
- `src/App.jsx` — 科目开关、年级配置
- `src/data/curriculum/` — 课程体系映射
