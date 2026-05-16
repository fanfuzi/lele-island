# 乐乐小岛 🏝️

为香港小学生设计的趣味学习平台，通过游戏化方式学习粤语、繁体中文、数学、英文和常识。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 + Vite |
| 语言 | JSX (JavaScript) |
| 状态管理 | React Context + useReducer |
| 持久化 | localStorage |
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

项目是纯静态 SPA，构建后 `dist/` 目录可部署到任何静态托管服务：

- **Vercel** / **Netlify** / **Cloudflare Pages** — 零配置
- **GitHub Pages** — 构建后推送到 gh-pages 分支
- **Nginx / Apache / S3** — 直接托管 dist/ 目录

### AI 出题功能

如需 AI 出题（`src/api.js`），部署后需修改 API 地址指向你的后端服务。不配置也不影响核心玩法。

## 关键配置

- `src/store/index.jsx` — 初始星币、宠物属性、衰减速率
- `src/App.jsx` — 科目开关、年级配置
- `src/data/curriculum/` — 课程体系映射
