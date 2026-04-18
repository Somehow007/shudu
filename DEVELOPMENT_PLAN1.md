# 数独 & 扫雷 — 跨平台益智游戏合集开发计划

## 1. 项目概述

### 1.1 项目定位

本项目是一个跨平台益智游戏合集，以数独和扫雷两款经典逻辑游戏为核心，采用统一入口、共享架构的设计理念，让用户在一个应用内即可体验多种益智游戏。项目在已有数独游戏的基础上，集成扫雷游戏模块，实现代码架构的统一与复用最大化。

### 1.2 游戏核心功能

#### 数独游戏功能（已有）

| 功能模块 | 功能描述 | 优先级 | 状态 |
|---------|---------|--------|------|
| 数独核心引擎 | 标准数独规则校验、谜题生成、求解算法 | P0 | ✅ 已完成 |
| 谜题生成器 | 支持多难度等级（简单/中等/困难/专家）的谜题生成，确保唯一解 | P0 | ✅ 已完成 |
| 游戏界面 | 9×9 网格交互、数字输入、笔记模式、撤销/重做 | P0 | ✅ 已完成 |
| 游戏状态管理 | 自动保存、继续游戏、新游戏 | P0 | ✅ 已完成 |
| 计时系统 | 游戏计时、暂停/恢复、最佳记录 | P1 | ✅ 已完成 |
| 提示系统 | 错误检查、单元格提示 | P1 | ✅ 已完成 |
| 统计系统 | 游戏历史、胜率统计、难度分布、连续记录 | P1 | ✅ 已完成 |
| 自定义设置 | 主题切换（亮色/暗色）、音效开关、输入模式切换 | P1 | ✅ 已完成 |

#### 扫雷游戏功能（新增）

| 功能模块 | 功能描述 | 优先级 | 状态 |
|---------|---------|--------|------|
| 扫雷核心引擎 | 标准扫雷规则校验、雷区生成、地雷布局算法 | P0 | 🆕 新增 |
| 雷区生成器 | 支持多难度等级（初级/中级/高级/专家），保证首击安全 | P0 | 🆕 新增 |
| 游戏界面 | 网格交互、左键揭开、右键标旗、双击快速揭开 | P0 | 🆕 新增 |
| 游戏状态管理 | 自动保存、继续游戏、新游戏 | P0 | 🆕 新增 |
| 计时系统 | 游戏计时、暂停/恢复、最佳记录 | P1 | 🆕 新增 |
| 提示系统 | 安全区域提示、地雷概率提示 | P1 | 🆕 新增 |
| 统计系统 | 游戏历史、胜率统计、难度分布、连续记录 | P1 | 🆕 新增 |
| 自定义设置 | 主题切换、音效开关、操作模式切换（点击/标旗模式） | P1 | 🆕 新增 |
| 每日挑战 | 每日推送一道特定雷区，全球排名 | P2 | 🆕 新增 |
| 成就系统 | 解锁成就、里程碑奖励 | P2 | 🆕 新增 |
| 自定义雷区 | 自定义行数、列数、地雷数 | P2 | 🆕 新增 |

#### 统一平台功能（新增）

| 功能模块 | 功能描述 | 优先级 | 状态 |
|---------|---------|--------|------|
| 游戏选择入口 | 统一首页，用户可选择数独或扫雷 | P0 | 🆕 新增 |
| 游戏类型路由 | 根据选择的游戏类型加载对应游戏模块 | P0 | 🆕 新增 |
| 统一设置中心 | 共享主题、音效等全局设置，各游戏独立设置 | P1 | 🆕 新增 |
| 统一统计面板 | 汇总展示各游戏统计数据 | P1 | 🆕 新增 |
| 统一存储管理 | 共享存储抽象层，各游戏独立命名空间 | P0 | 🆕 新增 |

### 1.3 目标用户群体

- **核心用户**：益智游戏爱好者，年龄 25-65 岁，偏好逻辑推理类游戏
- **休闲用户**：寻求日常脑力锻炼的普通用户
- **进阶用户**：追求高难度挑战和竞技排名的资深玩家
- **入门用户**：对数独/扫雷感兴趣但尚未掌握技巧的新手
- **多游戏用户**：希望在一个应用内体验多种益智游戏的用户

### 1.4 各平台版本预期特性

| 平台 | 预期特性 | 差异化功能 |
|------|---------|-----------|
| **Web** | 完整游戏功能、响应式布局、PWA 支持 | 无需安装、URL 分享、SEO 可发现性 |
| **Windows** | 原生窗口体验、离线运行、系统托盘 | 键盘快捷键、本地文件存储、系统通知 |
| **macOS** | 原生窗口体验、离线运行、菜单栏集成 | Touch Bar 支持、Handoff、原生菜单 |
| **iOS** | 触控优化、离线运行、Widget | 长按标旗、iCloud 同步、3D Touch |
| **Android** | 触控优化、离线运行、Widget | 长按标旗、分屏支持、Material Design |

---

## 2. 技术架构设计

### 2.1 技术栈选型

```
┌──────────────────────────────────────────────────────────────────┐
│                        跨平台共享层                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  数独核心引擎 (TypeScript) — @shudu/sudoku-core            │  │
│  │  - 数独生成算法 / 求解器 / 规则校验 / 状态管理              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  扫雷核心引擎 (TypeScript) — @shudu/minesweeper-core       │  │
│  │  - 雷区生成算法 / 地雷布局 / 规则校验 / 状态管理            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  共享 UI 组件 (React + TypeScript) — @shudu/ui             │  │
│  │  - 游戏网格 / 数字面板 / 计时器 / 工具栏 / 对话框          │  │
│  │  - 扫雷网格 / 地雷计数器 / 标旗面板 / 游戏选择器            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  共享工具与常量 (TypeScript) — @shudu/shared                │  │
│  │  - 存储抽象层 / 国际化 / 常量 / 快捷键管理                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
         │              │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │  Web    │   │ Desktop │   │  iOS    │   │ Android │
    │ Vite    │   │ Tauri   │   │Capacitor│   │Capacitor│
    │ React   │   │ React   │   │ React   │   │ React   │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

#### 核心技术栈

| 层级 | 技术 | 选型理由 |
|------|------|---------|
| **语言** | TypeScript | 类型安全、跨平台兼容、生态成熟 |
| **UI 框架** | React 18+ | 组件化开发、庞大生态、跨平台复用 |
| **状态管理** | Zustand | 轻量（~1KB）、TypeScript 友好、无 boilerplate |
| **样式方案** | Tailwind CSS | 原子化 CSS、响应式设计、主题切换便捷 |
| **构建工具** | Vite | 极速 HMR、原生 ESM、插件生态丰富 |
| **Web 打包** | Vite + PWA Plugin | 零配置 PWA、Service Worker 离线支持 |
| **桌面框架** | Tauri 2.0 | Rust 后端安全、体积小（~3MB）、原生性能 |
| **移动框架** | Capacitor 6 | Web 代码直接复用、原生插件桥接、官方维护 |
| **数据存储** | IndexedDB (Dexie.js) | 浏览器端结构化存储、跨平台兼容 |
| **测试框架** | Vitest + Playwright | 单元测试 + E2E 测试、Vite 原生集成 |
| **代码规范** | ESLint + Prettier | 统一代码风格、自动格式化 |

### 2.2 代码复用策略

```
shudu/
├── packages/
│   ├── sudoku-core/                # 数独核心引擎包（100% 复用）
│   │   ├── src/
│   │   │   ├── generator.ts
│   │   │   ├── solver.ts
│   │   │   ├── validator.ts
│   │   │   ├── types.ts
│   │   │   ├── history.ts
│   │   │   ├── notes.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── minesweeper-core/           # 扫雷核心引擎包（100% 复用）🆕
│   │   ├── src/
│   │   │   ├── generator.ts
│   │   │   ├── solver.ts
│   │   │   ├── validator.ts
│   │   │   ├── types.ts
│   │   │   ├── floodfill.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                         # 共享 UI 组件包（~85% 复用）
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Grid/
│   │   │   │   ├── Numpad/
│   │   │   │   ├── Timer/
│   │   │   │   ├── Toolbar/
│   │   │   │   ├── Dialog/
│   │   │   │   ├── MineGrid/       # 🆕
│   │   │   │   ├── MineCounter/    # 🆕
│   │   │   │   ├── GameSelector/   # 🆕
│   │   │   │   └── DifficultySelector/ # 🆕
│   │   │   ├── hooks/
│   │   │   │   ├── useKeyboardShortcuts.ts
│   │   │   │   └── useLongPress.ts # 🆕
│   │   │   ├── stores/
│   │   │   │   ├── sudokuStore.ts
│   │   │   │   ├── minesweeperStore.ts # 🆕
│   │   │   │   ├── appStore.ts     # 🆕
│   │   │   │   └── shortcutStore.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                     # 工具与常量包（100% 复用）
│       ├── src/
│       │   ├── storage.ts
│       │   ├── i18n.ts
│       │   ├── constants.ts
│       │   ├── shortcuts.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── pages/
│   │   │       ├── HomePage.tsx    # 🆕
│   │   │       ├── SudokuPage.tsx  # 🆕
│   │   │       ├── MinesweeperPage.tsx # 🆕
│   │   │       ├── SettingsPage.tsx
│   │   │       └── StatsPage.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── desktop/
│   ├── ios/
│   └── android/
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── tsconfig.base.json
```

#### 代码复用率预估

| 模块 | Web | Windows | macOS | iOS | Android |
|------|-----|---------|-------|-----|---------|
| 数独核心引擎 | 100% | 100% | 100% | 100% | 100% |
| 扫雷核心引擎 | 100% | 100% | 100% | 100% | 100% |
| 共享 UI 组件 | 100% | 90% | 90% | 80% | 80% |
| 状态管理 | 100% | 100% | 100% | 95% | 95% |
| 平台适配 | 0% | 15% | 15% | 20% | 20% |
| **综合复用率** | **基准** | **~85%** | **~85%** | **~80%** | **~80%** |

### 2.3 Monorepo 架构

采用 **pnpm workspace + Turborepo** 管理 Monorepo：

- **pnpm workspace**：包依赖管理、幽灵依赖隔离
- **Turborepo**：构建缓存、并行构建、任务编排
- **Changesets**：版本管理与 Changelog 生成

---

## 3. 扫雷游戏详细设计

### 3.1 需求分析

#### 3.1.1 游戏规则定义

1. 标准扫雷在矩形网格上进行，网格中隐藏若干地雷
2. 玩家左键点击揭开单元格，若为地雷则游戏失败
3. 若揭开的单元格周围无地雷，则自动递归揭开相邻安全区域（Flood Fill）
4. 若揭开的单元格周围有地雷，则显示周围地雷数量（1-8）
5. 玩家右键点击（或长按）可在单元格上标记旗帜，表示怀疑该处有地雷
6. 玩家右键再次点击已标旗的单元格可取消旗帜或标记为问号
7. 当所有非地雷单元格均被揭开时，游戏胜利
8. **首击安全**：玩家第一次点击保证不会踩到地雷

#### 3.1.2 难度等级定义

| 等级 | 网格尺寸 | 地雷数 | 地雷密度 | 预计完成时间 |
|------|---------|--------|---------|-------------|
| 初级 | 9 × 9 | 10 | 12.3% | 2-5 分钟 |
| 中级 | 16 × 16 | 40 | 15.6% | 5-15 分钟 |
| 高级 | 30 × 16 | 99 | 20.6% | 15-30 分钟 |
| 专家 | 30 × 20 | 130 | 21.7% | 30-60 分钟 |

#### 3.1.3 用户交互流程

```
┌─────────────┐
│   应用启动    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐
│  游戏选择首页 │────▶│   选择「数独」    │──▶ 数独难度选择 ──▶ 数独游戏
│             │     └──────────────────┘
│  🎮 数独     │
│  💣 扫雷     │     ┌──────────────────┐
│             │────▶│   选择「扫雷」    │──▶ 扫雷难度选择 ──▶ 扫雷游戏
└─────────────┘     └──────────────────┘
```

### 3.2 数据结构设计

#### 3.2.1 核心类型定义

```typescript
// packages/minesweeper-core/src/types.ts

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned';

export type CellContent = 'mine' | number;

export interface MineCell {
  state: CellState;
  content: CellContent;
  isMine: boolean;
  adjacentMines: number;
}

export type MineGrid = MineCell[][];

export type MineDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface MinefieldConfig {
  rows: number;
  cols: number;
  mineCount: number;
}

export interface MinefieldData {
  grid: MineGrid;
  config: MinefieldConfig;
  difficulty: MineDifficulty;
  seed?: number;
  firstClick: boolean;
}

export interface MineGameMove {
  type: 'reveal' | 'flag' | 'unflag' | 'question' | 'unquestion' | 'chord';
  position: CellPosition;
  revealedCells?: CellPosition[];
}

export interface MineGameState {
  minefield: MinefieldData;
  moves: MineGameMove[];
  moveIndex: number;
  elapsedTime: number;
  isPaused: boolean;
  isGameOver: boolean;
  isWin: boolean;
  flagCount: number;
  revealedCount: number;
}

export interface MineValidationResult {
  isValid: boolean;
  isComplete: boolean;
  incorrectFlags: CellPosition[];
  unrevealedMines: CellPosition[];
}

export const DIFFICULTY_CONFIGS: Record<MineDifficulty, MinefieldConfig> = {
  beginner:     { rows: 9,  cols: 9,  mineCount: 10 },
  intermediate: { rows: 16, cols: 16, mineCount: 40 },
  advanced:     { rows: 16, cols: 30, mineCount: 99 },
  expert:       { rows: 20, cols: 30, mineCount: 130 },
};
```

#### 3.2.2 与数独类型系统的对应关系

| 概念 | 数独 | 扫雷 |
|------|------|------|
| 游戏网格 | `SudokuGrid` (9×9 固定) | `MineGrid` (动态尺寸) |
| 单元格 | `GridCell` (value + isGiven + note) | `MineCell` (state + content + isMine + adjacentMines) |
| 难度 | `Difficulty` ('easy' \| 'medium' \| 'hard' \| 'expert') | `MineDifficulty` ('beginner' \| 'intermediate' \| 'advanced' \| 'expert') |
| 操作记录 | `GameMove` (setValue/clearValue/toggleNote) | `MineGameMove` (reveal/flag/chord) |
| 游戏状态 | `GameState` | `MineGameState` |
| 校验结果 | `ValidationResult` | `MineValidationResult` |
| 谜题数据 | `PuzzleData` (grid + solution + difficulty) | `MinefieldData` (grid + config + difficulty) |

### 3.3 算法设计

#### 3.3.1 雷区生成算法

```
雷区生成策略（首击安全保证）:

1. 创建空白网格（所有单元格均为空）
2. 等待玩家首次点击
3. 记录首次点击位置
4. 在排除首次点击位置及其 8 邻域的位置中随机放置地雷
5. 计算每个非地雷单元格的相邻地雷数
6. 返回完整雷区数据

生成流程:
  空白网格 → 玩家首次点击 → 排除安全区域 → 随机布雷 → 计算数字 → 完成
```

```typescript
function generateMinefield(
  config: MinefieldConfig,
  firstClickPos: CellPosition
): MineGrid {
  const { rows, cols, mineCount } = config;
  const grid = createEmptyGrid(rows, cols);

  const safeZone = getNeighbors(firstClickPos, rows, cols)
    .concat([firstClickPos]);

  const candidates = getAllPositions(rows, cols)
    .filter(pos => !safeZone.contains(pos));

  const minePositions = shuffleArray(candidates).slice(0, mineCount);

  for (const pos of minePositions) {
    grid[pos.row][pos.col].isMine = true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].adjacentMines = countAdjacentMines(grid, r, c);
        grid[r][c].content = grid[r][c].adjacentMines;
      } else {
        grid[r][c].content = 'mine';
      }
    }
  }

  return grid;
}
```

#### 3.3.2 Flood Fill 算法（连通区域揭开）

```
Flood Fill 策略（揭开空白区域）:

1. 点击一个单元格
2. 如果该单元格有相邻地雷数 > 0，仅揭开该单元格
3. 如果该单元格相邻地雷数 = 0（空白），递归揭开所有相邻单元格
4. 递归终止条件：遇到已揭开单元格、标旗单元格、或有数字的单元格

算法选择：BFS（广度优先搜索），避免递归栈溢出
```

```typescript
function floodFill(grid: MineGrid, startRow: number, startCol: number): CellPosition[] {
  const { rows, cols } = getGridSize(grid);
  const revealed: CellPosition[] = [];
  const visited = new Set<string>();
  const queue: CellPosition[] = [{ row: startRow, col: startCol }];

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = `${row},${col}`;

    if (visited.has(key)) continue;
    if (row < 0 || row >= rows || col < 0 || col >= cols) continue;

    const cell = grid[row][col];
    if (cell.state === 'revealed' || cell.state === 'flagged') continue;

    visited.add(key);
    cell.state = 'revealed';
    revealed.push({ row, col });

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (const neighbor of getNeighbors({ row, col }, rows, cols)) {
        queue.push(neighbor);
      }
    }
  }

  return revealed;
}
```

#### 3.3.3 Chord 操作（双击快速揭开）

```
Chord 操作策略:

1. 双击一个已揭开的数字单元格
2. 统计该单元格周围已标旗的数量
3. 如果标旗数量等于该单元格的数字
4. 则揭开周围所有未标旗的隐藏单元格
5. 如果标旗位置不正确，可能触发地雷导致游戏失败
```

#### 3.3.4 扫雷求解/提示算法

```
扫雷提示算法（逻辑推理法）:

1. 基础规则：
   - 如果某数字周围隐藏单元格数 === 数字 - 已标旗数 → 所有隐藏单元格均为地雷
   - 如果某数字周围已标旗数 === 数字 → 所有未标旗的隐藏单元格均安全

2. 约束传播：
   - 对每个已揭开的数字单元格建立约束
   - 通过约束之间的交集推导新的安全/地雷信息

3. 概率估算（高级提示）：
   - 当逻辑推理无法继续时，计算每个隐藏单元格是地雷的概率
   - 提示最安全的点击位置
```

### 3.4 模块划分

#### 3.4.1 扫雷核心引擎（@shudu/minesweeper-core）

| 文件 | 职责 | 对应数独模块 |
|------|------|-------------|
| `types.ts` | 扫雷类型定义 | `sudoku-core/types.ts` |
| `generator.ts` | 雷区生成算法 | `sudoku-core/generator.ts` |
| `solver.ts` | 求解/提示算法 | `sudoku-core/solver.ts` |
| `validator.ts` | 规则校验 | `sudoku-core/validator.ts` |
| `floodfill.ts` | 连通区域揭开 | 无（数独不需要） |

#### 3.4.2 扫雷 UI 组件

| 组件 | 职责 | 对应数独组件 |
|------|------|-------------|
| `MineGrid` | 扫雷网格渲染与交互 | `Grid` |
| `MineCounter` | 地雷计数器显示 | `Numpad`（功能不同，位置对应） |
| `FaceButton` | 表情按钮（游戏状态指示） | 无（扫雷特有） |
| `FlagToggle` | 标旗/揭开模式切换（移动端） | `Numpad`（模式切换） |
| `MineToolbar` | 扫雷工具栏 | `Toolbar` |

#### 3.4.3 扫雷状态管理

```typescript
interface MinesweeperStore {
  grid: MineGrid | null;
  config: MinefieldConfig | null;
  difficulty: MineDifficulty;
  selectedCell: CellPosition | null;
  elapsedTime: number;
  isPaused: boolean;
  isGameOver: boolean;
  isWin: boolean;
  flagCount: number;
  revealedCount: number;
  flagMode: boolean;
  settings: MineGameSettings;
  statistics: MineGameStatistics;

  newGame: (difficulty: MineDifficulty) => void;
  handleCellClick: (position: CellPosition) => void;
  handleCellRightClick: (position: CellPosition) => void;
  handleCellDoubleClick: (position: CellPosition) => void;
  toggleFlagMode: () => void;
  togglePause: () => void;
  setElapsedTime: (time: number) => void;
  getHint: () => void;
  updateSettings: (settings: Partial<MineGameSettings>) => void;
  resetGame: () => void;
}
```

#### 3.4.4 应用全局状态

```typescript
type GameType = 'sudoku' | 'minesweeper';

interface AppStore {
  currentGame: GameType | null;
  setCurrentGame: (game: GameType) => void;
  clearCurrentGame: () => void;
}
```

### 3.5 UI/UX 设计

#### 3.5.1 统一首页设计

```
┌──────────────────────────────────────┐
│                                      │
│           🧩 益智游戏合集             │
│         锻炼你的逻辑思维              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🎮 数独                       │  │
│  │  经典数字逻辑推理游戏            │  │
│  │  9×9 网格 · 唯一解 · 笔记模式   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  💣 扫雷                       │  │
│  │  经典策略推理游戏               │  │
│  │  避开地雷 · 标记旗帜 · 逻辑推理  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ⚙️ 设置    📊 统计                  │
│                                      │
└──────────────────────────────────────┘
```

#### 3.5.2 扫雷难度选择页

```
┌──────────────────────────────────────┐
│  ← 返回                              │
│                                      │
│  💣 扫雷                              │
│  选择难度开始游戏                      │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🟢 初级  9×9 · 10雷 · 2-5分钟 │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  🔵 中级  16×16 · 40雷 · 5-15分│  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  🟡 高级  30×16 · 99雷 · 15-30 │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  🔴 专家  30×20 · 130雷 · 30+  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### 3.5.3 扫雷单元格视觉设计

| 状态 | 视觉表现 | 交互 |
|------|---------|------|
| 隐藏（未揭开） | 凸起 3D 效果，浅灰色 | 左键揭开 |
| 已揭开 - 空白 | 平坦，白色背景 | 无 |
| 已揭开 - 数字 1-8 | 平坦，数字颜色编码 | 双击 Chord |
| 已标旗 | 凸起 + 🚩 图标 | 右键取消/问号 |
| 已标问号 | 凸起 + ❓ 图标 | 右键取消 |
| 地雷（游戏结束） | 红色背景 + 💣 图标 | 无 |
| 误标旗帜（游戏结束） | 红色叉号 + 🚩 | 无 |

**数字颜色编码（经典配色）：**

| 数字 | 颜色 | 色值 |
|------|------|------|
| 1 | 蓝色 | #0000FF |
| 2 | 绿色 | #008000 |
| 3 | 红色 | #FF0000 |
| 4 | 深蓝 | #000080 |
| 5 | 深红 | #800000 |
| 6 | 青色 | #008080 |
| 7 | 黑色 | #000000 |
| 8 | 灰色 | #808080 |

#### 3.5.4 游戏结束动画

**胜利动画：**
- 所有地雷位置自动标旗
- 表情按钮变为 😎
- 弹出胜利对话框（显示用时、难度等）
- 网格短暂高亮闪烁

**失败动画：**
- 踩到的地雷红色高亮
- 所有未标记的地雷显示 💣
- 错误标旗显示 ❌🚩
- 表情按钮变为 😵
- 弹出失败对话框（显示用时、可重试）

### 3.6 存储设计

#### 3.6.1 存储键命名规范

```typescript
export const STORAGE_KEYS = {
  // 全局
  APP_SETTINGS: 'shudu_app_settings',
  CURRENT_GAME: 'shudu_current_game',

  // 数独
  SUDOKU_GAME_STATE: 'shudu_sudoku_game_state',
  SUDOKU_SETTINGS: 'shudu_sudoku_settings',
  SUDOKU_STATISTICS: 'shudu_sudoku_statistics',
  SUDOKU_BEST_TIMES: 'shudu_sudoku_best_times',
  SUDOKU_SHORTCUTS: 'shudu_sudoku_shortcuts',

  // 扫雷 🆕
  MINESWEEPER_GAME_STATE: 'shudu_minesweeper_game_state',
  MINESWEEPER_SETTINGS: 'shudu_minesweeper_settings',
  MINESWEEPER_STATISTICS: 'shudu_minesweeper_statistics',
  MINESWEEPER_BEST_TIMES: 'shudu_minesweeper_best_times',
} as const;
```

#### 3.6.2 扫雷统计数据结构

```typescript
interface MineGameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  bestTimes: Record<MineDifficulty, number | null>;
  difficultyDistribution: Record<MineDifficulty, number>;
  totalFlagsPlaced: number;
  totalCellsRevealed: number;
}
```

#### 3.6.3 扫雷设置数据结构

```typescript
interface MineGameSettings {
  theme: ThemeOption;
  flagMode: boolean;
  showTimer: boolean;
  highlightSafeCells: boolean;
  autoFlag: boolean;
  questionMarkEnabled: boolean;
  soundEnabled: boolean;
}
```

---

## 4. 统一游戏入口设计

### 4.1 路由架构

```
/                    → 首页（游戏选择）
/sudoku              → 数独难度选择
/sudoku/game         → 数独游戏
/minesweeper         → 扫雷难度选择
/minesweeper/game    → 扫雷游戏
/settings            → 统一设置
/stats               → 统一统计
```

### 4.2 页面组件映射

| 路由 | 页面组件 | 说明 |
|------|---------|------|
| `/` | `HomePage` | 游戏选择首页 |
| `/sudoku` | `SudokuStartPage` | 数独难度选择 |
| `/sudoku/game` | `SudokuGamePage` | 数独游戏主页面 |
| `/minesweeper` | `MinesweeperStartPage` | 扫雷难度选择 |
| `/minesweeper/game` | `MinesweeperGamePage` | 扫雷游戏主页面 |
| `/settings` | `SettingsPage` | 统一设置页 |
| `/stats` | `StatsPage` | 统一统计页 |

### 4.3 应用状态流转

```
App 启动
  │
  ├─ 读取全局设置（主题、语言等）
  ├─ 读取上次游戏类型
  │
  ▼
HomePage（游戏选择）
  │
  ├── 选择「数独」──▶ SudokuStartPage ──▶ SudokuGamePage
  │                                          ├── 返回 → SudokuStartPage
  │                                          ├── 完成 → WinDialog → SudokuStartPage
  │                                          └── 主界面 → HomePage
  │
  └── 选择「扫雷」──▶ MinesweeperStartPage ──▶ MinesweeperGamePage
                                                   ├── 返回 → MinesweeperStartPage
                                                   ├── 胜利 → WinDialog → MinesweeperStartPage
                                                   ├── 失败 → LoseDialog → MinesweeperStartPage
                                                   └── 主界面 → HomePage
```

### 4.4 共享组件复用策略

| 共享组件 | 数独使用方式 | 扫雷使用方式 |
|---------|-------------|-------------|
| `Timer` | 直接复用 | 直接复用 |
| `Dialog` / `WinDialog` | 直接复用 | 直接复用（扩展 `LoseDialog`） |
| `Toast` | 直接复用 | 直接复用 |
| `Toolbar` | 数独工具栏 | 扫雷工具栏（不同按钮组合） |
| `DifficultySelector` | 数独难度选项 | 扫雷难度选项（不同配置） |
| `GameSelector` | - | - （首页使用） |

---

## 5. 开发阶段划分

### 阶段 0：项目重构与统一入口（1 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 重构现有包名为 `@shudu/sudoku-core` | 包重命名完成 | 现有数独功能不受影响 |
| 创建 `@shudu/minesweeper-core` 包骨架 | 包结构搭建 | 包可构建，导出空模块 |
| 创建应用全局 Store (`appStore`) | `appStore.ts` | 游戏类型切换逻辑正确 |
| 重构首页为游戏选择页 | `HomePage.tsx` | 可选择数独或扫雷 |
| 重构路由系统 | 路由配置 | 各页面路由正确跳转 |
| 扩展 `@shudu/shared` 常量 | 常量更新 | 扫雷相关常量定义完成 |
| 更新存储键命名空间 | 存储迁移 | 数独旧数据兼容，新键名生效 |
| 回归测试 | 测试通过 | 数独所有现有功能正常 |

### 阶段 1：扫雷核心引擎开发（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 定义扫雷类型系统 | `types.ts` | 所有核心类型定义完成，导出正确 |
| 实现雷区生成算法 | `generator.ts` | 首击安全保证，4 个难度等级可生成 |
| 实现 Flood Fill 算法 | `floodfill.ts` | 空白区域递归揭开正确，无栈溢出 |
| 实现规则校验器 | `validator.ts` | 正确检测游戏完成、标旗错误 |
| 实现扫雷求解/提示算法 | `solver.ts` | 基础逻辑推理提示可用 |
| 实现 Chord 操作逻辑 | `generator.ts` 内 | 双击快速揭开逻辑正确 |
| 核心引擎单元测试 | `__tests__/` | 测试覆盖率 ≥ 95% |
| 性能基准测试 | `benchmarks/` | 高级难度生成 < 10ms |

### 阶段 2：扫雷 UI 开发（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 扫雷网格组件 | `MineGrid.tsx` | 动态尺寸网格渲染正确，交互流畅 |
| 地雷计数器组件 | `MineCounter.tsx` | 剩余地雷数显示正确 |
| 表情按钮组件 | `FaceButton.tsx` | 游戏状态指示正确 |
| 标旗模式切换组件 | `FlagToggle.tsx` | 移动端标旗/揭开模式切换 |
| 扫雷工具栏组件 | `MineToolbar.tsx` | 重新开始/提示/标旗切换 |
| 扫雷游戏状态管理 | `minesweeperStore.ts` | Zustand store 完整，持久化正常 |
| 扫雷难度选择页 | `MinesweeperStartPage.tsx` | 4 个难度等级可选 |
| 扫雷游戏页面 | `MinesweeperGamePage.tsx` | 完整游戏流程可运行 |
| 胜利/失败对话框 | `WinDialog` / `LoseDialog` | 游戏结束弹窗正确 |
| 主题适配 | 亮色/暗色 | 扫雷组件主题切换流畅 |
| 响应式布局 | CSS 布局 | 桌面/平板/手机三端适配 |
| 长按标旗 Hook | `useLongPress.ts` | 移动端长按标旗体验流畅 |

### 阶段 3：统一平台集成（1 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 统一首页开发 | `HomePage.tsx` | 游戏选择交互流畅 |
| 统一设置页面 | `SettingsPage.tsx` | 全局设置 + 各游戏独立设置 |
| 统一统计页面 | `StatsPage.tsx` | 汇总展示各游戏统计 |
| 应用全局状态管理 | `appStore.ts` | 游戏切换、状态保持正确 |
| 路由系统集成 | 路由配置 | 页面间导航流畅 |
| 数据迁移与兼容 | 迁移逻辑 | 数独旧版数据无缝迁移 |
| 快捷键扩展 | 快捷键配置 | 扫雷快捷键可用 |
| 集成测试 | 测试用例 | 两款游戏切换无异常 |

### 阶段 4：Web 版优化与发布（1 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| PWA 配置更新 | `manifest.json`, SW | 可安装到桌面，离线可玩 |
| 性能优化 | 优化报告 | 首屏加载 < 1.5s，交互延迟 < 100ms |
| SEO 优化 | Meta 标签 | 搜索引擎可发现 |
| E2E 测试 | Playwright 用例 | 数独 + 扫雷核心流程测试通过 |
| 无障碍优化 | a11y 审计 | WCAG 2.1 AA 级合规 |
| Web 版上线 | 部署完成 | 正式可访问 |

### 阶段 5：桌面版开发（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| Tauri 项目初始化 | `src-tauri/` | 可构建出 .exe / .dmg |
| 窗口管理 | `main.rs` | 窗口大小/标题/图标正确 |
| 本地存储适配 | storage adapter | 数据持久化至本地文件系统 |
| 键盘快捷键 | shortcuts | 扫雷快捷键（F2 重新开始等） |
| 右键菜单支持 | context menu | 扫雷右键标旗正常工作 |
| 系统托盘 (Windows) | `tray.rs` | 最小化到托盘功能 |
| 菜单栏 (macOS) | `menu.rs` | 原生菜单栏集成 |
| 自动更新 | updater | 支持应用内更新检查 |
| 桌面版测试 | test/ | Windows 10/11 + macOS 13+ 测试通过 |

### 阶段 6：iOS 版开发（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| Capacitor 项目初始化 | `ios/` | Xcode 项目可编译运行 |
| 触控交互优化 | touch handlers | 长按标旗、滑动操作流畅 |
| iOS 存储适配 | storage adapter | 数据持久化至 UserDefaults/文件系统 |
| iCloud 同步 | iCloud plugin | 跨设备数据同步 |
| Widget 支持 | WidgetKit | iOS 主屏 Widget |
| App Store 资源 | 截图/描述/预览 | 符合 App Store 审核要求 |
| iOS 真机测试 | TestFlight | iPhone + iPad 真机测试通过 |

### 阶段 7：Android 版开发（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| Capacitor 项目初始化 | `android/` | Android Studio 项目可编译运行 |
| Material Design 适配 | 主题/组件 | 符合 Material Design 规范 |
| Android 存储适配 | storage adapter | 数据持久化至 SharedPreferences/文件 |
| 长按标旗优化 | 触控处理 | 长按标旗响应灵敏 |
| 分屏支持 | manifest 配置 | 支持分屏/自由窗口模式 |
| Widget 支持 | AppWidget | Android 桌面 Widget |
| Google Play 资源 | 截图/描述/预览 | 符合 Google Play 上架要求 |
| Android 真机测试 | 多设备测试 | 主流 Android 10+ 设备测试通过 |

### 阶段 8：优化与发布（2 周）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 性能优化 | 优化报告 | 首屏加载 < 1s，交互延迟 < 100ms |
| 无障碍优化 | a11y 测试 | WCAG 2.1 AA 级合规 |
| 国际化 (i18n) | 多语言包 | 中/英/日/韩/法/德/西 7 语言 |
| 各平台打包发布 | 安装包/上架 | 全平台正式发布 |
| 用户反馈系统 | 反馈入口 | 应用内反馈渠道 |
| 崩溃监控 | Sentry 集成 | 崩溃上报正常 |

---

## 6. 里程碑规划

```
2026
 │
 ▼ M1: 项目重构完成 ───────────────── 第 0 周
 │  ✓ 包重命名完成（@shudu/sudoku-core）
 │  ✓ 扫雷核心包骨架搭建
 │  ✓ 统一首页开发完成
 │  ✓ 数独功能回归测试通过
 │
 ▼ M2: 扫雷引擎就绪 ──────────────── 第 2 周
 │  ✓ 雷区生成算法完成
 │  ✓ Flood Fill 算法完成
 │  ✓ 测试覆盖率 ≥ 95%
 │  ✓ 性能基准达标
 │
 ▼ M3: 扫雷 UI Alpha ─────────────── 第 4 周
 │  ✓ 扫雷核心 UI 组件完成
 │  ✓ 扫雷游戏流程可运行
 │  ✓ 响应式适配完成
 │
 ▼ M4: 统一平台集成完成 ────────────── 第 5 周
 │  ✓ 统一首页/设置/统计完成
 │  ✓ 两款游戏切换流畅
 │  ✓ 数据迁移兼容完成
 │
 ▼ M5: Web 版正式发布 ─────────────── 第 6 周
 │  ✓ Web 版上线
 │  ✓ PWA 离线可用
 │  ✓ E2E 测试通过
 │
 ▼ M6: 桌面版 Alpha ──────────────── 第 8 周
 │  ✓ Windows + macOS 可运行
 │  ✓ 右键标旗正常
 │
 ▼ M7: 桌面版正式发布 ─────────────── 第 9 周
 │  ✓ Windows .msi / .exe 发布
 │  ✓ macOS .dmg 发布
 │
 ▼ M8: iOS 版 Alpha ──────────────── 第 10 周
 │  ✓ iPhone + iPad 可运行
 │  ✓ 长按标旗优化完成
 │
 ▼ M9: iOS 版正式发布 ─────────────── 第 11 周
 │  ✓ App Store 审核通过
 │
 ▼ M10: Android 版 Alpha ──────────── 第 12 周
 │  ✓ 主流设备可运行
 │  ✓ Material 适配完成
 │
 ▼ M11: Android 版正式发布 ─────────── 第 13 周
 │  ✓ Google Play 上架
 │
 ▼ M12: 全平台优化发布 ────────────── 第 14 周
    ✓ 全平台正式发布
    ✓ 国际化完成
    ✓ 监控体系就绪
```

### 里程碑时间表

| 里程碑 | 时间节点 | 关键交付物 | 验收标准 |
|--------|---------|-----------|---------|
| M1 项目重构 | 第 0 周 | 重构后项目、统一首页 | 数独功能不受影响，首页可切换游戏 |
| M2 引擎就绪 | 第 2 周 | 扫雷核心引擎包 | 测试覆盖率 ≥ 95%，性能达标 |
| M3 UI Alpha | 第 4 周 | 扫雷 UI 组件 | 扫雷游戏流程可体验 |
| M4 平台集成 | 第 5 周 | 统一平台 | 两款游戏切换流畅 |
| M5 Web 发布 | 第 6 周 | 正式 Web 版 | 上线可访问，性能达标 |
| M6 桌面 Alpha | 第 8 周 | 桌面内测版 | 双平台可运行 |
| M7 桌面发布 | 第 9 周 | 桌面正式版 | 安装包可分发 |
| M8 iOS Alpha | 第 10 周 | iOS 内测版 | TestFlight 可安装 |
| M9 iOS 发布 | 第 11 周 | iOS 正式版 | App Store 上架 |
| M10 Android Alpha | 第 12 周 | Android 内测版 | 主流设备可运行 |
| M11 Android 发布 | 第 13 周 | Android 正式版 | Google Play 上架 |
| M12 全平台优化 | 第 14 周 | 全平台最终版 | 国际化 + 监控 + 优化完成 |

---

## 7. 资源需求分析

### 7.1 开发工具

| 类别 | 工具 | 用途 | 费用 |
|------|------|------|------|
| **IDE** | VS Code | 日常开发 | 免费 |
| **桌面构建** | Rust toolchain | Tauri 编译 | 免费 |
| **iOS 构建** | Xcode | iOS 编译/调试 | 免费（需 Mac） |
| **Android 构建** | Android Studio | Android 编译/调试 | 免费 |
| **设计** | Figma | UI/UX 设计 | 免费版 |
| **版本控制** | GitHub | 代码托管 + CI/CD | 免费版 |
| **监控** | Sentry | 崩溃监控 | 免费版 |
| **分析** | Google Analytics | 用户行为分析 | 免费 |
| **域名** | - | Web 版托管 | ~$10/年 |
| **托管** | Vercel / Cloudflare Pages | Web 版部署 | 免费版 |

### 7.2 开发环境

| 环境 | 要求 | 用途 |
|------|------|------|
| macOS 13+ | Apple Silicon / Intel | iOS 构建、macOS 构建 |
| Windows 10/11 | x64 | Windows 构建、测试 |
| Node.js 20 LTS | - | 全平台开发 |
| pnpm 9+ | - | 包管理 |
| Rust 1.75+ | - | Tauri 编译 |

### 7.3 发布渠道与费用

| 平台 | 渠道 | 费用 |
|------|------|------|
| Web | Vercel / Cloudflare Pages | 免费 |
| Windows | GitHub Releases / Microsoft Store | 免费 / $19 一次性 |
| macOS | GitHub Releases / Mac App Store | 免费 / $99/年 |
| iOS | App Store | $99/年 |
| Android | Google Play | $25 一次性 |

### 7.4 潜在第三方依赖

| 依赖 | 用途 | 大小 | 许可证 |
|------|------|------|--------|
| React 18 | UI 框架 | ~45KB gzip | MIT |
| Zustand | 状态管理 | ~1KB | MIT |
| Dexie.js | IndexedDB 封装 | ~15KB | Apache-2.0 |
| Tailwind CSS | 样式框架 | 按需加载 | MIT |
| @tauri-apps/api | Tauri API | ~10KB | MIT/Apache-2.0 |
| @capacitor/core | Capacitor 核心 | ~20KB | MIT |
| Vitest | 测试框架 | 开发依赖 | MIT |
| Playwright | E2E 测试 | 开发依赖 | Apache-2.0 |

---

## 8. 质量保障策略

### 8.1 测试体系

```
┌─────────────────────────────────────────────┐
│              测试金字塔                       │
│                                             │
│                 ╱ ╲                         │
│                ╱ E2E ╲          ~10%        │
│               ╱ 测试    ╲                   │
│              ╱───────────╲                  │
│             ╱  集成测试   ╲      ~20%       │
│            ╱               ╲                │
│           ╱─────────────────╲               │
│          ╱    单元测试       ╲    ~70%      │
│         ╱                     ╲             │
└─────────────────────────────────────────────┘
```

#### 单元测试（覆盖率目标 ≥ 90%）

| 模块 | 测试重点 | 工具 |
|------|---------|------|
| 扫雷核心引擎 | 雷区生成首击安全、Flood Fill 正确性、校验边界 | Vitest |
| 数独核心引擎 | 求解正确性、生成唯一解、校验边界 | Vitest |
| 状态管理 | Store 操作、持久化、状态转换 | Vitest |
| 工具函数 | 存储抽象、国际化、常量 | Vitest |

#### 集成测试

| 场景 | 测试重点 | 工具 |
|------|---------|------|
| 扫雷组件交互 | MineGrid + FlagToggle 联动、Chord 操作 | Vitest + Testing Library |
| 数独组件交互 | Grid + Numpad 联动、撤销/重做流程 | Vitest + Testing Library |
| 游戏切换 | 数独 ↔ 扫雷切换、状态保持 | Vitest |
| 数据流 | 生成→游玩→保存→恢复 | Vitest |

#### E2E 测试

| 场景 | 测试重点 | 工具 |
|------|---------|------|
| 数独完整流程 | 选择→难度→游玩→完成→统计 | Playwright |
| 扫雷完整流程 | 选择→难度→游玩→胜利/失败→统计 | Playwright |
| 游戏切换流程 | 首页→数独→返回→扫雷→返回 | Playwright |
| 设置变更 | 主题切换→持久化→恢复 | Playwright |

### 8.2 质量标准

| 指标 | 标准 | 测量方式 |
|------|------|---------|
| 首屏加载时间 | < 1.5s (Web) / < 500ms (原生) | Lighthouse / 原生性能监控 |
| 交互响应延迟 | < 100ms | Chrome DevTools / 原生 Profiler |
| 雷区生成时间 | < 10ms (任意难度) | 基准测试 |
| 数独生成时间 | < 50ms (单道) | 基准测试 |
| 内存占用 | < 100MB (Web) / < 50MB (原生) | 性能分析器 |
| 安装包体积 | < 5MB (Web) / < 10MB (Desktop) / < 20MB (Mobile) | 构建产物 |
| 测试覆盖率 | ≥ 90% (核心引擎) / ≥ 80% (UI) | Vitest 覆盖率报告 |
| 崩溃率 | < 0.1% | Sentry |
| 无障碍 | WCAG 2.1 AA 级 | axe-core 审计 |

### 8.3 性能优化措施

| 优化方向 | 具体措施 | 预期效果 |
|---------|---------|---------|
| **渲染优化** | React.memo 防止网格单元格无效重渲染 | 减少重渲染 80%+ |
| **计算优化** | Web Worker 执行雷区生成/数独求解 | 主线程零阻塞 |
| **Flood Fill 优化** | BFS 替代递归，避免栈溢出 | 高级难度无卡顿 |
| **存储优化** | IndexedDB 批量写入、数据压缩 | 存储效率提升 50% |
| **加载优化** | 代码分割、路由懒加载、资源预加载 | 首屏时间 < 1.5s |
| **缓存优化** | Service Worker 缓存策略、HTTP 缓存 | 二次访问 < 500ms |
| **动画优化** | CSS transform + will-change、requestAnimationFrame | 60fps 流畅动画 |
| **包体积优化** | Tree-shaking、动态 import、依赖分析 | 总包 < 200KB gzip |

### 8.4 代码质量门禁

每次 PR 合并必须通过以下检查：

```yaml
- lint:        ESLint 零错误，零警告
- format:      Prettier 格式检查通过
- typecheck:   TypeScript 严格模式编译通过
- test:        单元测试全部通过，覆盖率不降低
- build:       所有平台构建成功
- e2e:         核心流程 E2E 测试通过 (仅 main 分支)
```

---

## 9. 风险管理计划

### 9.1 风险识别与应对

| 风险 | 概率 | 影响 | 等级 | 应对策略 |
|------|------|------|------|---------|
| **项目重构导致数独功能回归** | 中 | 高 | 🔴 高 | 重构前完整回归测试；渐进式重构；保持数独测试全通过 |
| **Flood Fill 性能问题** | 低 | 中 | 🟡 中 | 使用 BFS 替代递归；大网格限制单帧揭开数量 |
| **移动端右键标旗体验差** | 中 | 中 | 🟡 中 | 长按标旗方案；标旗模式切换按钮；触觉反馈 |
| **Tauri 跨平台兼容性问题** | 中 | 中 | 🟡 中 | 优先验证 Tauri 在目标平台的兼容性；准备 Electron 备选方案 |
| **Capacitor 原生功能受限** | 中 | 中 | 🟡 中 | 提前评估原生插件需求；准备自定义原生插件开发方案 |
| **App Store 审核被拒** | 中 | 高 | 🔴 高 | 提前研究审核指南；预留 2 周审核缓冲期；准备申诉材料 |
| **两款游戏状态管理冲突** | 低 | 中 | 🟡 中 | 独立 Store 隔离；全局 Store 仅管理路由和全局设置 |
| **大尺寸雷区渲染性能** | 中 | 中 | 🟡 中 | 虚拟滚动/懒渲染；单元格 memo 化；Web Worker 计算 |
| **包体积超出预期** | 低 | 中 | 🟢 低 | 持续监控包体积；按需加载策略；依赖审计 |

### 9.2 技术挑战与解决方案

#### 挑战 1：项目重构与向后兼容

**问题**：将现有 `@shudu/core` 重命名为 `@shudu/sudoku-core`，同时保持现有功能不受影响。

**解决方案**：
1. 渐进式重构：先创建新包名，旧包名作为别名导出
2. 逐个应用迁移引用路径
3. 完成迁移后移除旧包名
4. 存储键增加命名空间前缀，旧数据自动迁移

```typescript
// 兼容方案：旧包名作为别名
// packages/core/package.json (临时)
{
  "name": "@shudu/core",
  "dependencies": {
    "@shudu/sudoku-core": "workspace:*"
  }
}
// packages/core/src/index.ts
export * from '@shudu/sudoku-core';
```

#### 挑战 2：动态尺寸网格渲染

**问题**：扫雷网格尺寸随难度变化（9×9 到 30×20），需保证各尺寸下渲染性能和交互体验。

**解决方案**：
1. 单元格尺寸根据网格大小和屏幕尺寸动态计算
2. 大网格（高级/专家）使用虚拟滚动，仅渲染可视区域
3. 单元格组件使用 React.memo 避免无效重渲染
4. Flood Fill 结果批量更新，减少渲染次数

```typescript
function calculateCellSize(
  config: MinefieldConfig,
  containerWidth: number,
  containerHeight: number
): number {
  const { rows, cols } = config;
  const maxCellWidth = Math.floor(containerWidth / cols);
  const maxCellHeight = Math.floor(containerHeight / rows);
  return Math.min(maxCellWidth, maxCellHeight, 40);
}
```

#### 挑战 3：移动端标旗交互

**问题**：移动端无右键，需提供替代的标旗交互方式。

**解决方案**：
1. **长按标旗**：长按单元格触发标旗操作（≥ 300ms）
2. **标旗模式切换**：底部工具栏提供标旗/揭开模式切换按钮
3. **双指操作**：双指点击触发标旗（可选）
4. **触觉反馈**：标旗操作时触发轻微震动确认

```typescript
function useLongPress(
  onLongPress: () => void,
  onClick: () => void,
  { delay = 300 }: { delay?: number } = {}
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = useCallback(() => {
    timerRef.current = setTimeout(onLongPress, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
  };
}
```

#### 挑战 4：跨平台存储一致性

**问题**：不同平台的数据存储机制差异大，需保证数据模型一致。

**解决方案**：
1. 定义统一的存储抽象接口 (IStorageAdapter) — 已有
2. 各游戏使用独立命名空间隔离数据
3. 数据序列化使用 JSON Schema 校验
4. 版本迁移机制应对数据结构变更

```typescript
interface IStorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}
```

### 9.3 应急预案

| 场景 | 触发条件 | 应急措施 |
|------|---------|---------|
| 重构导致严重回归 | 数独核心功能异常 | 回滚到重构前版本，重新评估重构方案 |
| Tauri 严重兼容问题 | 目标平台无法正常运行 | 切换至 Electron，预计延迟 1 周 |
| App Store 多次被拒 | 连续 3 次审核被拒 | 聘请 App Store 审核顾问，调整功能 |
| 关键依赖库停止维护 | 核心依赖 30 天无更新 | Fork 并自行维护，或寻找替代库 |
| 性能严重不达标 | 核心指标低于标准 50% | 暂停新功能开发，集中性能攻坚 |

---

## 附录

### A. 扫雷规则定义

1. 标准扫雷在矩形网格上进行
2. 网格中隐藏若干地雷，数量由难度决定
3. 左键点击揭开单元格，若为地雷则游戏失败
4. 揭开的空白单元格（周围无地雷）自动扩展揭开相邻区域
5. 揭开的数字单元格显示周围 8 格中的地雷数量
6. 右键点击可标记/取消旗帜
7. 当所有非地雷单元格均被揭开时，游戏胜利
8. 首次点击保证不会踩到地雷

### B. 难度等级定义

#### 数独难度

| 等级 | 给定数字数 | 逻辑推理难度 | 预计完成时间 |
|------|-----------|-------------|-------------|
| 简单 | 36-45 | 仅需基础排除法 | 5-15 分钟 |
| 中等 | 30-35 | 需要隐性唯一法 | 15-30 分钟 |
| 困难 | 25-29 | 需要 X-Wing 等高级技巧 | 30-60 分钟 |
| 专家 | 20-24 | 需要多种高级技巧组合 | 60+ 分钟 |

#### 扫雷难度

| 等级 | 网格尺寸 | 地雷数 | 地雷密度 | 预计完成时间 |
|------|---------|--------|---------|-------------|
| 初级 | 9 × 9 | 10 | 12.3% | 2-5 分钟 |
| 中级 | 16 × 16 | 40 | 15.6% | 5-15 分钟 |
| 高级 | 30 × 16 | 99 | 20.6% | 15-30 分钟 |
| 专家 | 30 × 20 | 130 | 21.7% | 30-60 分钟 |

### C. 关键技术决策记录

| 决策 | 选项 | 选择 | 理由 |
|------|------|------|------|
| UI 框架 | React / Vue / Svelte | React | 生态最成熟，跨平台方案最多 |
| 桌面框架 | Tauri / Electron | Tauri | 体积小、安全、性能好 |
| 移动框架 | Capacitor / React Native / Flutter | Capacitor | Web 代码直接复用，学习成本低 |
| 状态管理 | Zustand / Redux / Jotai | Zustand | 轻量、TypeScript 友好 |
| 样式方案 | Tailwind / CSS Modules / Styled-components | Tailwind | 开发效率高、主题切换方便 |
| Monorepo | pnpm + Turborepo / Nx / Lerna | pnpm + Turborepo | 配置简单、构建缓存好 |
| 扫雷 Flood Fill | DFS / BFS | BFS | 避免递归栈溢出，大网格安全 |
| 扫雷首击安全 | 预生成 / 延迟生成 | 延迟生成 | 首次点击后再布雷，保证安全 |
| 移动端标旗 | 长按 / 模式切换 / 双指 | 长按 + 模式切换 | 兼顾效率和易用性 |
| 包命名策略 | 统一 core / 分离包 | 分离包 | 职责清晰，按需加载 |

### D. 扫雷与数独功能对比

| 功能维度 | 数独 | 扫雷 |
|---------|------|------|
| 网格尺寸 | 固定 9×9 | 动态（9×9 ~ 30×20） |
| 操作类型 | 填数、笔记、擦除 | 揭开、标旗、Chord |
| 撤销/重做 | ✅ 支持 | ⚠️ 有限支持（仅标旗操作可撤销） |
| 提示系统 | 填入正确数字 | 标记安全区域/地雷 |
| 错误检测 | 实时冲突高亮 | 踩雷即失败 |
| 游戏结束条件 | 填满且正确 | 揭开所有安全格 / 踩雷 |
| 首击安全 | N/A | ✅ 保证首次点击安全 |
| 笔记/标记 | 候选数笔记 | 旗帜/问号标记 |
| 计时 | ✅ | ✅ |
| 统计 | ✅ | ✅ |
| 主题 | ✅ | ✅ |
