# Technical Solution — P-20250416-002

## 1. Overview

- **Project**: 1024 Game (Web + PWA)
- **Type**: 前端单页游戏应用 (SPA)
- **Tech Stack**: React 18 + Vite
- **Deployment**: GitHub Pages (静态托管)
- **Target**: 移动端浏览器（安卓为主）+ PWA 可安装到主屏幕

---

## 2. 功能范围

### 2.1 核心游戏
- 4×4 网格滑动合并
- 数字生成：2 或 4（90% vs 10%概率）
- 移动方向：上/下/左/右（触屏滑动 + 键盘方向键）
- 合并规则：相同数字相加，生成下一级数字
- 通关目标：生成 1024 方块
- 分数系统：每次合并累加得分

### 2.2 存档与继续
- localStorage 存储当前游戏状态
- 自动存档：每次操作后保存
- 继续游戏：刷新/重开直接恢复
- 存档内容：grid、score、gameOver、won

### 2.3 皮肤系统
- 3 套免费皮肤：经典/霓虹/糖果
- 皮肤切换即时生效，不中断游戏
- 皮肤保存在 localStorage

### 2.4 PWA
- Service Worker 缓存静态资源
- Web App Manifest：可安装到主屏幕
- 离线可用

---

## 3. 数据模型

```js
// 游戏存档
{
  grid: number[][],      // 4x4 数字网格，0 表示空
  score: number,          // 当前分数
  won: boolean,           // 是否已达1024
  gameOver: boolean,      // 是否无合法移动
  skin: string,           // 当前皮肤名称
}

// 皮肤配置
{
  id: string,             // 'classic' | 'neon' | 'candy'
  name: string,           // 显示名称
  colors: {               // 各数字对应背景色
    2: string,
    4: string,
    8: string,
    16: string,
    32: string,
    64: string,
    128: string,
    256: string,
    512: string,
    1024: string,
  },
  textColor: string,      // 文字颜色
}
```

---

## 4. 技术架构

### 4.1 项目结构
```
game-1024/
├── public/
│   ├── index.html
│   ├── manifest.json       # PWA Manifest
│   └── icons/              # PWA 图标
├── src/
│   ├── components/
│   │   ├── Game.jsx        # 游戏主组件
│   │   ├── Grid.jsx        # 4x4 网格
│   │   ├── Cell.jsx        # 单个方格
│   │   ├── Controls.jsx    # 方向控制按钮（移动端）
│   │   ├── ScoreBoard.jsx  # 分数/最高分
│   │   ├── SkinPicker.jsx  # 皮肤选择器
│   │   └── GameOver.jsx    # 结束/胜利弹窗
│   ├── hooks/
│   │   ├── useGame.js      # 游戏逻辑（移动/合并/生成）
│   │   └── useStorage.js   # localStorage 存档
│   ├── utils/
│   │   └── skins.js        # 皮肤配置
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── vite.config.js
└── package.json
```

### 4.2 游戏核心算法

**移动逻辑**：
1. 根据方向压缩一行（去除0）
2. 相邻相同数字合并（累加到前者）
3. 合并后再次压缩补0
4. 比较移动前后是否有变化

**方块生成**：
- 每次有效移动后随机生成
- 位置：当前为0的格子中随机选一
- 数值：90%概率2，10%概率4

---

## 5. PWA 配置

### manifest.json
```json
{
  "name": "1024 Game",
  "short_name": "1024",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [...]
}
```

### Service Worker
- vite-plugin-pwa (基于 Workbox)
- 预缓存所有静态资源
- 离线可用

---

## 6. 构建与部署

- `npm run build` → 输出到 `dist/`
- 部署到 GitHub Pages
- PWA 可在安卓 Chrome 安装到主屏幕
