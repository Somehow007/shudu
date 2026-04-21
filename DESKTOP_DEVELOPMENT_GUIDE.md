# 桌面版开发教学文档

本文档介绍如何将一个已有的 Web 应用（React + Vite + TypeScript）通过 Tauri 2.0 封装为跨平台桌面应用（Windows / macOS / Linux）。

---

## 一、整体流程概览

```
Web 应用 (React + Vite)
        │
        ▼
安装 Rust 工具链
        │
        ▼
创建 Tauri 项目结构
        │
        ▼
配置 Tauri (tauri.conf.json)
        │
        ▼
编写 Rust 后端逻辑
        │
        ▼
适配桌面特有功能 (存储/托盘/菜单/更新)
        │
        ▼
构建 & 打包
        │
        ▼
分发安装包 (.exe / .dmg / .deb)
```

---

## 二、环境准备

### 2.1 安装 Rust 工具链

Tauri 的后端使用 Rust 编写，必须先安装 Rust：

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# 访问 https://rustup.rs 下载安装器
```

验证安装：

```bash
rustc --version   # 应输出如 rustc 1.75.0
cargo --version   # 应输出如 cargo 1.75.0
```

### 2.2 系统依赖

| 平台 | 依赖 |
|------|------|
| **Linux** | `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev` |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Windows** | Microsoft Visual Studio C++ Build Tools |

Linux 安装示例（Ubuntu/Debian）：

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

---

## 三、项目结构设计

在 Monorepo 中，桌面版作为独立 app 存在于 `apps/desktop/`：

```
apps/desktop/
├── package.json              # Node.js 依赖和脚本
├── vite.config.ts            # Vite 配置（无 PWA 插件）
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.js        # Tailwind CSS 配置
├── postcss.config.js         # PostCSS 配置
├── index.html                # 入口 HTML
├── src/
│   ├── main.tsx              # React 入口
│   ├── App.tsx               # 桌面版主组件（复用 Web 版逻辑）
│   ├── index.css             # 样式（复用 Web 版 CSS 变量）
│   └── platform/             # 桌面特有逻辑
│       ├── storage.ts        # 文件系统存储适配器
│       └── updater.ts        # 自动更新检查
└── src-tauri/                # Tauri Rust 后端
    ├── Cargo.toml            # Rust 依赖
    ├── build.rs              # Tauri 构建脚本
    ├── tauri.conf.json       # Tauri 核心配置
    ├── icons/                # 应用图标
    └── src/
        ├── main.rs           # Rust 入口
        └── lib.rs            # 核心逻辑（托盘/菜单/插件注册）
```

---

## 四、逐步实现

### 步骤 1：创建 package.json

桌面版需要与 Web 版相同的 React 依赖，加上 Tauri 相关包：

```json
{
  "name": "@shudu/desktop",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "dependencies": {
    "@shudu/core": "workspace:*",
    "@shudu/ui": "workspace:*",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0",
    "@tauri-apps/plugin-process": "^2.0.0",
    "@tauri-apps/plugin-updater": "^2.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0"
  }
}
```

**关键点**：
- `@tauri-apps/api`：前端调用 Tauri 能力的 JS API
- `@tauri-apps/plugin-*`：Tauri 官方插件（文件系统、进程管理、自动更新等）
- `@tauri-apps/cli`：Tauri 命令行工具（开发、构建）

### 步骤 2：配置 Vite

桌面版的 Vite 配置与 Web 版有两个关键差异：
1. **移除 PWA 插件**（桌面应用不需要 Service Worker）
2. **配置开发服务器端口为 1420**（Tauri 默认监听此端口）

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  build: {
    target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari14',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
  },
});
```

### 步骤 3：配置 tauri.conf.json

这是 Tauri 的核心配置文件，控制窗口、构建、打包等行为：

```json
{
  "productName": "益智游戏合集",
  "version": "0.1.0",
  "identifier": "com.shudu.games",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [{
      "title": "益智游戏合集 - 数独与扫雷",
      "width": 800,
      "height": 600,
      "minWidth": 400,
      "minHeight": 500,
      "center": true,
      "resizable": true
    }],
    "security": { "csp": null },
    "trayIcon": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"],
    "category": "Game"
  }
}
```

**关键配置说明**：
- `build.devUrl`：开发时前端服务地址
- `build.frontendDist`：构建后前端产物路径
- `app.windows`：窗口属性（大小、标题、是否可调整等）
- `bundle.category`：应用分类（Linux 下用于 .desktop 文件）
- `bundle.targets`：打包目标（`all` = 当前平台所有格式）

### 步骤 4：编写 Rust 后端

#### 4.1 Cargo.toml（Rust 依赖）

```toml
[package]
name = "shudu-desktop"
version = "0.1.0"
edition = "2021"

[lib]
name = "shudu_desktop_lib"
crate-type = ["lib", "cdylib", "staticlib"]

[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
tauri-plugin-fs = "2"
tauri-plugin-process = "2"
tauri-plugin-shell = "2"
tauri-plugin-updater = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

#### 4.2 lib.rs（核心逻辑）

```rust
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    Manager, WindowEvent,
};

pub fn run() {
    tauri::Builder::default()
        // 注册插件
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            setup_tray(app)?;    // 系统托盘
            setup_menu(app)?;    // 原生菜单栏
            Ok(())
        })
        // macOS 关闭窗口时隐藏而非退出
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                #[cfg(target_os = "macos")]
                { window.hide().unwrap(); api.prevent_close(); }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 步骤 5：实现系统托盘

系统托盘允许应用最小化到任务栏/菜单栏继续运行：

```rust
fn setup_tray(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let show = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(w) = app.get_webview_window("main") {
                    w.show().unwrap(); w.set_focus().unwrap();
                }
            }
            "quit" => app.exit(0),
            _ => {}
        })
        .build(app)?;
    Ok(())
}
```

### 步骤 6：实现原生菜单栏（macOS）

macOS 应用必须有原生菜单栏，否则无法使用系统快捷键：

```rust
fn setup_menu(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(target_os = "macos")]
    {
        use tauri::menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder};

        let quit = MenuItemBuilder::with_id("quit", "退出")
            .accelerator("CmdOrCtrl+Q").build(app)?;
        let undo = MenuItemBuilder::with_id("undo", "撤销")
            .accelerator("CmdOrCtrl+Z").build(app)?;

        let app_menu = SubmenuBuilder::new(app, "应用")
            .item(&quit).build()?;
        let edit_menu = SubmenuBuilder::new(app, "编辑")
            .item(&undo).build()?;

        let menu = MenuBuilder::new(app)
            .item(&app_menu).item(&edit_menu).build()?;
        app.set_menu(&menu)?;

        // 菜单事件 → 发送到前端
        app.on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "undo" => {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.emit("menu_action", "undo");
                }
            }
            _ => {}
        });
    }
    Ok(())
}
```

### 步骤 7：前端存储适配

Tauri 的 WebView 支持 `localStorage`，但桌面版也可以使用文件系统存储：

```typescript
// platform/storage.ts
export async function saveToDesktopFile(key: string, data: string): Promise<void> {
  try {
    const { BaseDirectory, writeTextFile } = await import('@tauri-apps/plugin-fs');
    await writeTextFile(`shudu_data/${key}.json`, data, {
      baseDir: BaseDirectory.AppData,
    });
  } catch {
    localStorage.setItem(key, data); // 降级到 localStorage
  }
}
```

### 步骤 8：自动更新

```typescript
// platform/updater.ts
export async function checkForUpdate(): Promise<boolean> {
  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();
    return update !== null;
  } catch { return false; }
}

// App.tsx 中使用
const handleUpdate = async () => {
  const { relaunch } = await import('@tauri-apps/plugin-process');
  await relaunch();
};
```

---

## 五、构建与打包

### 5.1 开发模式

```bash
cd apps/desktop
pnpm tauri:dev
```

这会同时启动 Vite 开发服务器和 Tauri 窗口，支持热更新。

### 5.2 生产构建

```bash
cd apps/desktop
pnpm tauri:build
```

构建产物位于 `src-tauri/target/release/bundle/`：

| 平台 | 产物 |
|------|------|
| **Windows** | `.msi` 安装包、`.exe` 可执行文件 |
| **macOS** | `.dmg` 安装包、`.app` 应用包 |
| **Linux** | `.deb` / `.AppImage` |

### 5.3 生成应用图标

Tauri 需要多种尺寸的图标，可以使用官方工具从一张源图生成：

```bash
pnpm tauri icon path/to/source-icon.png
```

这会自动生成 `icons/` 目录下所有需要的尺寸。

---

## 六、关键概念总结

### 6.1 Tauri vs Electron

| 对比项 | Tauri 2.0 | Electron |
|--------|-----------|----------|
| 后端语言 | Rust | Node.js |
| 安装包体积 | ~3-8 MB | ~50-150 MB |
| 内存占用 | ~20-50 MB | ~100-200 MB |
| 渲染引擎 | 系统 WebView | 内置 Chromium |
| 安全模型 | 权限系统，默认最小权限 | 完全 Node.js 访问 |
| 跨平台 | Windows / macOS / Linux / iOS / Android | Windows / macOS / Linux |

### 6.2 前端代码复用策略

```
packages/ui/     → 100% 复用（组件、状态管理、Hooks）
packages/core/   → 100% 复用（游戏引擎）
packages/shared/ → 100% 复用（工具函数、常量）
apps/web/        → CSS 变量 & 布局复用
apps/desktop/    → 仅需添加 platform/ 适配层
```

桌面版与 Web 版的差异仅在：
1. **入口文件**：`App.tsx` 增加了更新提示横幅
2. **平台适配**：`platform/` 目录下的存储和更新逻辑
3. **Vite 配置**：移除 PWA 插件，调整开发端口
4. **Rust 后端**：系统托盘、原生菜单、窗口管理

### 6.3 常见问题

**Q: Tauri 开发时前端修改不生效？**
A: 确保使用 `pnpm tauri:dev` 而非 `pnpm dev`，前者会同时启动 Tauri 和 Vite。

**Q: macOS 上关闭窗口后应用还在运行？**
A: 这是 macOS 的标准行为。需要在 `on_window_event` 中拦截 `CloseRequested` 事件并调用 `window.hide()`。

**Q: 如何调试 Rust 代码？**
A: 使用 `RUST_BACKTRACE=1 pnpm tauri:dev` 启用 Rust 错误栈。Rust 的 `println!` 输出会显示在终端。

**Q: 构建时 Rust 编译很慢？**
A: 首次编译需要下载和编译所有 Rust 依赖，后续增量编译会快很多。可以设置 `CARGO_BUILD_JOBS` 环境变量并行编译。

---

## 七、发布流程

1. **更新版本号**：同时更新 `package.json` 和 `Cargo.toml` 中的版本
2. **生成图标**：`pnpm tauri icon source-icon.png`
3. **构建**：`pnpm tauri:build`
4. **测试**：在目标平台安装并测试
5. **分发**：
   - GitHub Releases（免费）
   - Microsoft Store（$19 一次性费用）
   - Mac App Store（$99/年开发者账号）
