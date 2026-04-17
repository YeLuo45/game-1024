# 1024 Game — PWA 版本

## 项目说明

经典 1024 滑块合并游戏，支持 Web + Android PWA 安装。核心玩法：4x4 网格，通过方向键或滑动将相同数字的方块合并，目标是合成 1024。

## 功能特性

- 经典 1024 玩法（4x4 滑块合并）
- 触屏滑动 + 键盘方向键双操作支持
- 游戏进度自动保存（localStorage），刷新后可继续
- 3 款皮肤：Classic / Neon / Candy，皮肤偏好持久化
- PWA 可安装至 Android 主屏幕（Service Worker + manifest）
- 胜利后支持"继续游戏"模式

## 目录结构

```
./
├── src/
│   ├── main.jsx              # React 入口
│   ├── App.jsx               # 根组件
│   ├── App.css               # 全局样式
│   ├── components/
│   │   ├── Game.jsx          # 游戏主组件（含触屏/键盘事件）
│   │   ├── Grid.jsx          # 4x4 网格渲染
│   │   ├── Cell.jsx         # 单个方块
│   │   ├── ScoreBoard.jsx   # 分数板
│   │   ├── Controls.jsx     # 方向按钮（移动端）
│   │   ├── SkinPicker.jsx   # 皮肤选择器
│   │   └── GameOver.jsx     # 游戏结束/胜利弹窗
│   ├── hooks/
│   │   ├── useGame.js       # 游戏逻辑（合并、生成方块、判断结束）
│   │   └── useStorage.js    # localStorage 持久化
│   └── utils/
│       └── skins.js          # 皮肤配置（Classic/Neon/Candy）
├── dist/                     # 生产构建产物
│   ├── index.html
│   ├── assets/
│   ├── sw.js                 # Service Worker
│   ├── manifest.webmanifest  # PWA manifest
│   └── icons/
├── index.html                # 开发入口
├── package.json
└── vite.config.js
```

## 技术栈

React 18 + Vite + vite-plugin-pwa + localStorage

## 本地运行

```bash
cd ~/.hermes/workspace-dev/proposals/game-1024
npm install
npm run dev
```

开发服务器已在 `http://127.0.0.1:3456` 运行。

## 生产构建

```bash
npm run build
# 产物输出至 dist/
```

## PWA 部署

dist/ 目录可部署至任意静态托管（GitHub Pages、Cloudflare Pages 等）。Android 用户可通过浏览器"添加到主屏幕"安装为独立应用。
