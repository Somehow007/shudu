# 益智游戏合集 - 项目文档

## 1. 项目概述

**益智游戏合集** 是一款跨平台休闲游戏应用，目前已上线 **数独** 和 **扫雷** 两个游戏。采用 Monorepo 架构，核心引擎与 UI 组件完全复用，为后续桌面端（Tauri）和移动端（Capacitor）开发奠定基础。

### 当前完成状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| 阶段 0：项目初始化 | ✅ 完成 | Monorepo、TypeScript、ESLint、Turborepo、Vitest |
| 阶段 1：核心引擎 | ✅ 完成 | 求解器、生成器、校验器、笔记系统、撤销/重做 |
| 阶段 2：Web 版数独 | ✅ 完成 | 完整游戏界面、设置、统计、PWA |
| 阶段 3：扫雷游戏 | ✅ 完成 | 完整扫雷游戏、首击安全、快捷键、统计 |
| 阶段 4：桌面版 | ⏳ 待开发 | Tauri 2.0 |
| 阶段 5：iOS 版 | ⏳ 待开发 | Capacitor |
| 阶段 6：Android 版 | ⏳ 待开发 | Capacitor |

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 语言 | TypeScript | ^5.4.0 |
| UI 框架 | React | ^18.3.0 |
| 状态管理 | Zustand | ^4.5.0 |
| 样式方案 | Tailwind CSS + CSS 变量 | ^3.4.0 |
| 构建工具 | Vite | ^5.4.0 |
| PWA | vite-plugin-pwa | ^0.20.0 |
| 包管理 | pnpm workspace | ^9.1.0 |
| 构建编排 | Turborepo | ^2.0.0 |
| 测试框架 | Vitest | ^1.6.0 |

### 2.2 项目结构

```
shudu/
├── packages/
│   ├── core/                      # 数独核心引擎包（100% 跨平台复用）
│   │   └── src/
│   │       ├── types.ts           # 类型定义
│   │       ├── solver.ts          # 数独求解器
│   │       ├── generator.ts       # 谜题生成器
│   │       ├── validator.ts       # 规则校验器
│   │       ├── history.ts         # 撤销/重做逻辑
│   │       ├── notes.ts           # 笔记系统逻辑
│   │       └── index.ts           # 统一导出
│   │
│   ├── minesweeper-core/          # 扫雷核心引擎包（100% 跨平台复用）
│   │   └── src/
│   │       ├── types.ts           # 类型定义（CellState、MineCell、MineGrid 等）
│   │       ├── generator.ts        # 雷区生成器（首击安全保证）
│   │       ├── floodfill.ts        # BFS 洪泛填充算法
│   │       ├── validator.ts        # 游戏校验（胜负判定）
│   │       ├── solver.ts           # 约束求解器（提示功能）
│   │       └── index.ts            # 统一导出
│   │
│   ├── ui/                        # 共享 UI 组件包
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Grid.tsx       # 9×9 数独网格
│   │       │   ├── Numpad.tsx     # 数字面板
│   │       │   ├── Timer.tsx      # 计时器
│   │       │   ├── Toolbar.tsx     # 数独工具栏
│   │       │   ├── Dialog.tsx      # 对话框 + 胜利弹窗
│   │       │   ├── MineGrid.tsx    # 扫雷网格
│   │       │   ├── MineCounter.tsx  # 地雷计数器
│   │       │   ├── FaceButton.tsx  # 笑脸按钮
│   │       │   ├── FlagToggle.tsx  # 标旗模式切换
│   │       │   ├── MineToolbar.tsx # 扫雷工具栏
│   │       │   ├── MineStatsPanel.tsx     # 扫雷统计面板
│   │       │   ├── SudokuStatsPanel.tsx   # 数独统计面板
│   │       │   ├── MineShortcutHelp.tsx    # 扫雷快捷键帮助
│   │       │   └── ...
│   │       └── stores/
│   │           ├── gameStore.ts        # 数独 Zustand 状态管理
│   │           ├── minesweeperStore.ts # 扫雷 Zustand 状态管理
│   │           └── shortcutStore.ts    # 快捷键状态管理
│   │
│   └── shared/                    # 工具与常量包（100% 复用）
│       └── src/
│           ├── constants.ts       # 常量定义（难度标签、主题等）
│           ├── shortcuts.ts        # 快捷键系统（跨平台绑定）
│           └── utils.ts           # 通用工具函数
│
├── apps/
│   └── web/                       # Web 应用
│       ├── src/
│       │   ├── App.tsx            # 应用入口（首页/游戏/设置/统计页面）
│       │   ├── main.tsx           # React 入口
│       │   └── index.css          # 全局样式 + 主题变量
│       ├── public/
│       │   └── favicon.svg        # 网站图标
│       ├── index.html              # HTML 模板
│       └── vite.config.ts          # Vite + PWA 配置
│
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── package.json
```

---

## 3. 核心模块说明

### 3.1 @shudu/core - 数独核心引擎

纯逻辑层，无任何 UI 依赖，可在所有平台 100% 复用。

#### types.ts - 类型系统

| 类型 | 说明 |
|------|------|
| `CellValue` | 1-9 的数字 |
| `GridValue` | CellValue \| 0（0 表示空） |
| `CellPosition` | { row, col } 位置 |
| `CellNote` | { candidates: Set<CellValue> } 候选数 |
| `GridCell` | { value, isGiven, note } 单元格 |
| `SudokuGrid` | GridCell[][] 9×9 网格 |
| `Difficulty` | 'easy' \| 'medium' \| 'hard' \| 'expert' |
| `PuzzleData` | { grid, solution, difficulty, seed? } 谜题数据 |
| `GameMove` | 操作记录（用于撤销/重做） |
| `ValidationResult` | { isValid, isComplete, conflicts } 校验结果 |

#### solver.ts - 求解器

- `solve(grid)` - 求解数独，返回解或 null
- `countSolutions(grid, limit)` - 计算解的数量（用于唯一性验证）
- `isSolvable(grid)` - 是否可解
- `hasUniqueSolution(grid)` - 是否有唯一解

#### generator.ts - 谜题生成器

- `generate(difficulty)` - 生成指定难度的谜题
- `generateFromSeed(difficulty, seed)` - 基于种子生成确定性谜题

生成策略：完整解生成 → 随机挖洞 → 唯一解验证

难度与给定数字范围：

| 难度 | 给定数字数 | 预计完成时间 |
|------|-----------|-------------|
| 简单 | 36-45 | 5-15 分钟 |
| 中等 | 30-35 | 15-30 分钟 |
| 困难 | 27-29 | 30-60 分钟 |
| 专家 | 22-26 | 60+ 分钟 |

#### validator.ts - 校验器

- `validate(grid)` - 完整校验，返回 ValidationResult
- `validateCell(grid, position)` - 单元格冲突检测
- `findConflicts(grid)` - 查找所有冲突

#### history.ts - 撤销/重做

- `createHistory()` - 创建历史记录
- `pushMove(state, move)` - 记录操作
- `undo(state)` / `redo(state)` - 撤销/重做
- `canUndo(state)` / `canRedo(state)` - 是否可撤销/重做

#### notes.ts - 笔记系统

- `createEmptyNote()` - 创建空笔记
- `toggleCandidate(note, value)` - 切换候选数
- `addCandidate` / `removeCandidate` - 添加/移除候选数
- `clearNote` - 清空笔记
- `getCandidates(note)` - 获取排序后的候选数列表

### 3.2 @shudu/minesweeper-core - 扫雷核心引擎

#### types.ts - 类型系统

| 类型 | 说明 |
|------|------|
| `CellState` | 'hidden' \| 'revealed' \| 'flagged' \| 'questioned' |
| `MineCell` | { state, isMine, adjacentMines } 地雷单元格 |
| `MineGrid` | MineCell[][] 地雷网格 |
| `MineDifficulty` | 'beginner' \| 'intermediate' \| 'advanced' \| 'expert' |
| `MinefieldConfig` | { rows, cols, mineCount } 地雷配置 |
| `DIFFICULTY_CONFIGS` | 各难度预置配置 |

#### generator.ts - 雷区生成器

- `createEmptyGrid(rows, cols)` - 创建空网格
- `generateMinefield(config, firstClick)` - 首击安全生成（以首次点击位置为中心 3×3 区域不放雷）
- `getConfigForDifficulty(difficulty)` - 获取难度配置

#### floodfill.ts - 洪泛填充算法

- `floodFill(grid, row, col)` - BFS 展开空白区域
- `chordReveal(grid, row, col)` - 和弦揭开（双击展开）

#### validator.ts - 游戏校验

- `checkWin(grid)` - 检查胜利条件（所有非雷格已揭开）
- `revealAllMines(grid)` - 揭示所有地雷（游戏结束时）

#### solver.ts - 约束求解器

- `getSafeCellHint(grid)` - 获取安全格提示
- `getHint(grid)` - 获取任意提示（优先安全格）

### 3.3 @shudu/ui - 共享 UI 组件

#### gameStore.ts - 数独状态管理

基于 Zustand，管理全部数独游戏状态：

**状态：**
- `grid` / `solution` - 当前网格和答案
- `selectedCell` - 选中单元格
- `history` - 操作历史
- `elapsedTime` / `isPaused` / `isCompleted` - 计时与状态
- `mistakes` / `hintsUsed` - 错误与提示计数
- `settings` - 游戏设置（持久化到 localStorage）
- `statistics` - 游戏统计（持久化到 localStorage）
- `isNoteMode` - 笔记模式开关

**操作：**
- `newGame(difficulty)` - 开始新游戏
- `selectCell(position)` - 选中单元格
- `setValue(value)` - 填入数字
- `clearValue()` - 清除数字
- `toggleNote(value)` - 切换候选数
- `toggleNoteMode()` - 切换笔记模式
- `undo()` / `redo()` - 撤销/重做
- `getHint()` - 获取提示
- `updateSettings(settings)` - 更新设置

#### minesweeperStore.ts - 扫雷状态管理

**状态：**
- `grid` / `config` - 当前网格和配置
- `firstClick` - 首击标记（生成安全雷区）
- `elapsedTime` / `isPaused` / `isGameOver` / `isWin` - 计时与状态
- `flagCount` / `revealedCount` - 旗标/已揭计数
- `flagMode` - 标旗模式开关
- `selectedCell` - 键盘导航选中格
- `clickCount` - 点击计数（统计用）
- `settings` / `statistics` - 设置与统计（持久化）
- `hitMinePosition` - 被炸单元格位置

**操作：**
- `newGame(difficulty)` - 开始新游戏
- `handleCellClick(position)` - 左键揭开
- `handleCellRightClick(position)` - 右键标旗/问号
- `handleCellDoubleClick(position)` - 双键和弦揭开
- `toggleFlagMode()` - 切换标旗模式
- `getHint()` - 获取提示

#### 快捷键系统

跨平台快捷键支持（macOS / Windows / Linux / 移动端），支持自定义绑定。

**数独快捷键：**

| 操作 | macOS | Windows/Linux |
|------|-------|--------------|
| 填入 1-9 | 1-9 | 1-9 |
| 清除 | ⌫ | Delete |
| 撤销 | ⌘Z | Ctrl+Z |
| 重做 | ⌘⇧Z | Ctrl+Y |
| 笔记模式 | N | N |
| 提示 | H | H |
| 暂停 | P | P |
| 显示快捷键 | ? | ? |

**扫雷快捷键：**

| 操作 | 键位 |
|------|------|
| 揭开 | Space |
| 标旗 | F |
| 和弦揭开 | Enter |
| 切换标旗模式 | N |
| 新游戏 | F2 |
| 提示 | H |
| 暂停 | P |
| 导航 | ↑↓←→ |

### 3.4 @shudu/shared - 共享工具

| 模块 | 说明 |
|------|------|
| `constants.ts` | 存储键名、难度标签、主题选项 |
| `shortcuts.ts` | 快捷键定义、平台检测、冲突检测 |
| `utils.ts` | 通用工具函数（formatTime 等） |

---

## 4. Web 版功能清单

### 4.1 数独游戏核心功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 数独网格交互 | ✅ | 点击选中、高亮同行列宫 |
| 数字输入 | ✅ | 1-9 数字面板，显示已用数量 |
| 笔记模式 | ✅ | 切换笔记/普通模式，候选数显示 |
| 擦除 | ✅ | 清除已填数字 |
| 撤销/重做 | ✅ | 无限撤销重做 |
| 提示 | ✅ | 自动填入正确数字 |
| 暂停/继续 | ✅ | 暂停时模糊网格 |
| 错误检测 | ✅ | 实时标记错误数字 |
| 自动清除笔记 | ✅ | 填入数字时自动移除相关候选数 |
| 完成检测 | ✅ | 自动检测完成并弹出胜利对话框 |

### 4.2 扫雷游戏核心功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 扫雷网格交互 | ✅ | 点击揭开、右键标旗/问号、双键和弦 |
| 首击安全 | ✅ | 首次点击周围 3×3 区域保证无雷 |
| BFS 洪泛填充 | ✅ | 自动展开相连空白区域 |
| 数字提示 | ✅ | 显示周围雷数的 1-8 数字 |
| 胜负判定 | ✅ | 自动判定胜利/失败 |
| 标旗标记 | ✅ | 标记地雷位置 |
| 问号标记 | ✅ | 可选问号标记不确定格 |
| 键盘导航 | ✅ | 方向键移动，空格揭开，F 标旗 |

### 4.3 难度系统

**数独：**

| 功能 | 状态 | 说明 |
|------|------|------|
| 4 个难度等级 | ✅ | 简单/中等/困难/专家 |
| 难度切换 | ✅ | 工具栏一键切换 |
| 唯一解保证 | ✅ | 所有生成的谜题保证唯一解 |

**扫雷：**

| 功能 | 状态 | 说明 |
|------|------|------|
| 4 个难度等级 | ✅ | 初级(9×9/10)/中级(16×16/40)/高级(30×16/99)/专家(30×20/130) |
| 难度切换 | ✅ | 开始页面直接选择 |

### 4.4 计时系统

| 功能 | 状态 | 说明 |
|------|------|------|
| 游戏计时 | ✅ | 实时计时显示 |
| 暂停计时 | ✅ | 暂停时停止计时 |
| 最佳记录 | ✅ | 按难度记录最佳时间 |

### 4.5 设置系统

| 功能 | 状态 | 说明 |
|------|------|------|
| 主题切换 | ✅ | 亮色/暗色 |
| 高亮错误（数独） | ✅ | 可开关 |
| 高亮相同数字（数独） | ✅ | 可开关 |
| 自动清除笔记（数独） | ✅ | 可开关 |
| 显示计时器 | ✅ | 可开关 |
| 问号标记（扫雷） | ✅ | 可开关 |
| 设置持久化 | ✅ | localStorage 存储 |

### 4.6 统计系统

| 功能 | 状态 | 说明 |
|------|------|------|
| 已玩局数 | ✅ | |
| 胜利局数 | ✅ | |
| 胜率 | ✅ | |
| 连胜记录 | ✅ | 当前连胜 + 最佳连胜 |
| 最佳时间 | ✅ | 按难度记录 |
| 平均时间 | ✅ | 按难度记录 |
| 难度分布 | ✅ | 可视化柱状图（数独） |
| 最近游戏记录 | ✅ | 扫雷最近 10 局历史 |
| 高级数据 | ✅ | 扫雷总点击/标旗准确率 |
| 统计持久化 | ✅ | localStorage 存储 |

### 4.7 快捷键系统

| 功能 | 状态 | 说明 |
|------|------|------|
| 键盘快捷键（数独） | ✅ | 数字填入/擦除/撤销/重做/提示等 |
| 键盘快捷键（扫雷） | ✅ | 揭开/标旗/和弦/提示等 |
| 方向键导航 | ✅ | 网格单元格导航 |
| 快捷键自定义 | ✅ | 自定义键位绑定 |
| 快捷键帮助面板 | ✅ | 游戏内查看所有快捷键 |

### 4.8 PWA 支持

| 功能 | 状态 | 说明 |
|------|------|------|
| 可安装到桌面 | ✅ | Web App Manifest |
| 离线可玩 | ✅ | Service Worker 缓存 |
| 自动更新 | ✅ | autoUpdate 注册策略 |

### 4.9 响应式设计

| 功能 | 状态 | 说明 |
|------|------|------|
| 桌面端适配 | ✅ | |
| 平板适配 | ✅ | |
| 手机适配 | ✅ | 触控优化、紧凑布局 |

---

## 5. 构建产物

| 文件 | 大小 | Gzip |
|------|------|------|
| index.html | 0.99 KB | 0.52 KB |
| CSS | 41.86 KB | 7.25 KB |
| JS | 218.57 KB | 65.01 KB |
| SW + Workbox | ~30 KB | - |

---

## 6. 测试覆盖

| 测试文件 | 测试数量 | 覆盖内容 |
|---------|---------|---------|
| solver.test.ts | 12 | 求解、解数量、可解性、唯一解 |
| generator.test.ts | 7 | 各难度生成、唯一解、种子确定性 |
| validator.test.ts | 10 | 完整校验、行/列/宫冲突 |
| history.test.ts | 8 | 创建、记录、撤销、重做 |
| notes.test.ts | 16 | 候选数增删改查、清空、批量操作 |
| minesweeper/generator.test.ts | 11 | 雷区生成、洪泛填充、校验、求解 |
| shortcuts.test.ts | 56 | 平台检测、键位格式化、快捷键匹配 |
| useKeyboardShortcuts.test.ts | 10 | React 快捷键钩子 |
| Toast.test.tsx | 4 | 吐司通知组件 |
| ShortcutHelpPanel.test.tsx | 10 | 快捷键帮助面板 |
| shortcutStore.test.ts | 14 | 快捷键状态管理 |

**总计：158+ 个测试用例**

---

## 7. 待开发功能

### P1 优先级

- [ ] 游戏状态自动保存/恢复（意外关闭可继续）
- [ ] 逻辑推理提示（不仅是直接填数）

### P2 优先级

- [ ] 每日挑战
- [ ] 成就系统
- [ ] 多种数独变体
- [ ] 国际化（中/英/日/韩/法/德/西）
- [ ] 桌面端（Tauri 2.0）
- [ ] iOS 端（Capacitor）
- [ ] Android 端（Capacitor）
