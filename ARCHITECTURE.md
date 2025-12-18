# 🏗️ 项目架构说明

## 整体架构

```
┌─────────────────────────────────────────────────┐
│              前端 Web 层 (HTML/CSS/JS)            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  画板模块     │  │  录制模块     │            │
│  │ DrawingBoard │  │   Recorder   │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              Capacitor 桥接层                     │
│  ┌────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Filesystem │ │VoiceRecorder│ │   Share    │ │
│  └────────────┘ └─────────────┘ └────────────┘ │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                  原生层                          │
│    ┌──────────────┐      ┌──────────────┐      │
│    │  iOS Native  │      │Android Native│      │
│    │   (Swift)    │      │   (Kotlin)   │      │
│    └──────────────┘      └──────────────┘      │
└─────────────────────────────────────────────────┘
```

## 核心模块详解

### 1. DrawingBoard 类 (画板模块)

**职责**: 管理 Canvas 绘图的所有操作

**核心方法**:
```javascript
- initCanvas()       // 初始化画布
- startDrawing()     // 开始绘制
- draw()             // 绘制线条
- stopDrawing()      // 停止绘制
- undo()             // 撤销操作
- clear()            // 清空画布
- saveImage()        // 保存图片
- setColor()         // 设置颜色
- setSize()          // 设置画笔大小
- setTool()          // 切换工具（画笔/橡皮擦）
```

**关键特性**:
- 支持鼠标和触摸事件
- 历史记录管理（最多20步）
- 响应式画布尺寸
- 平滑的线条绘制

**数据流**:
```
用户输入 → 事件监听 → 获取坐标 → Canvas绘制 → 保存历史
```

---

### 2. Recorder 类 (录制模块)

**职责**: 处理音频和屏幕录制功能

**核心方法**:
```javascript
// 音频录制
- startAudioRecording()  // 开始录音
- stopAudioRecording()   // 停止录音
- saveAudioRecording()   // 保存录音

// 屏幕录制
- startScreenRecording() // 开始录屏
- stopScreenRecording()  // 停止录屏
- saveScreenRecording()  // 保存录屏

// 工具方法
- startTimer()           // 开始计时
- stopTimer()            // 停止计时
- updateTimer()          // 更新计时显示
```

**录制策略**:

#### 音频录制
1. **Capacitor 环境** (移动端):
   - 使用 `capacitor-voice-recorder` 插件
   - 原生录音质量更好
   - 支持后台录制

2. **Web 环境** (浏览器):
   - 使用 `MediaRecorder API`
   - 需要 HTTPS 或 localhost
   - 输出 WebM 格式

#### 屏幕录制
- 使用 `getDisplayMedia()` API
- 主要用于桌面浏览器
- 移动端支持有限

**数据流**:
```
用户操作 → 请求权限 → 开始录制 → 数据采集 → 停止录制 → 保存文件
```

---

### 3. App 主控制器

**职责**: 协调各模块，处理 UI 交互

**核心功能**:
```javascript
- initApp()           // 初始化应用
- bindUIEvents()      // 绑定UI事件
- selectTool()        // 切换工具
- toggleAudioRecording()  // 切换录音状态
- toggleScreenRecording() // 切换录屏状态
- showMessage()       // 显示提示消息
```

**事件流**:
```
UI事件 → 事件处理器 → 调用模块方法 → 更新UI状态 → 用户反馈
```

---

## 文件系统架构

### Web 资源目录 (`www/`)

```
www/
├── index.html              # 主HTML文件
│   ├── 顶部工具栏
│   ├── 画布容器
│   └── 底部控制面板
│
├── css/
│   └── style.css          # 样式文件
│       ├── 全局样式
│       ├── 工具栏样式
│       ├── 画布样式
│       ├── 控制面板样式
│       └── 响应式设计
│
└── js/
    ├── drawingBoard.js    # 画板类（独立模块）
    ├── recorder.js        # 录制类（独立模块）
    └── app.js             # 主应用逻辑（协调器）
```

### 原生项目目录

#### iOS (`ios/`)
```
ios/
└── App/
    ├── App/
    │   ├── public/         # Web资源（自动同步）
    │   ├── Info.plist      # 权限配置
    │   └── Assets.xcassets # 应用图标
    ├── Podfile            # CocoaPods依赖
    └── App.xcodeproj      # Xcode项目
```

#### Android (`android/`)
```
android/
└── app/
    ├── src/main/
    │   ├── assets/public/     # Web资源（自动同步）
    │   ├── AndroidManifest.xml # 权限配置
    │   └── res/              # 应用图标
    └── build.gradle          # Gradle配置
```

---

## 数据流架构

### 1. 绘图数据流

```
用户触摸
    ↓
事件捕获 (touchstart/mousedown)
    ↓
计算坐标 (getPosition)
    ↓
Canvas API 绘制
    ↓
实时渲染
    ↓
停止绘制 (touchend/mouseup)
    ↓
保存历史记录 (saveHistory)
```

### 2. 录音数据流

```
点击录音按钮
    ↓
检查平台环境
    ↓
┌─────────────┬─────────────┐
│  移动端      │  Web端      │
│  (Plugin)   │ (MediaAPI)  │
└─────────────┴─────────────┘
    ↓              ↓
请求麦克风权限    getUserMedia
    ↓              ↓
开始录制         MediaRecorder
    ↓              ↓
实时计时         ondataavailable
    ↓              ↓
停止录制         stop + save
    ↓              ↓
保存到文件系统    Filesystem API
```

### 3. 保存数据流

```
点击保存按钮
    ↓
Canvas.toDataURL()
    ↓
转换为Base64
    ↓
检查环境
    ↓
┌────────────────┬────────────────┐
│  Capacitor     │  Web Browser   │
│  (Filesystem)  │  (Download)    │
└────────────────┴────────────────┘
    ↓                  ↓
保存到Documents      创建<a>标签
    ↓                  ↓
返回成功消息         触发下载
```

---

## 状态管理

### 画板状态
```javascript
{
  isDrawing: false,          // 是否正在绘制
  currentColor: '#000000',   // 当前颜色
  currentSize: 5,            // 当前画笔大小
  currentTool: 'pen',        // 当前工具
  history: [],               // 历史记录数组
  historyStep: -1            // 当前历史步骤
}
```

### 录制状态
```javascript
{
  audioRecording: false,     // 是否正在录音
  screenRecording: false,    // 是否正在录屏
  startTime: null,           // 开始时间
  recordedChunks: [],        // 录制数据块
  timerInterval: null        // 计时器引用
}
```

---

## 性能优化策略

### 1. 画布优化
- **离屏渲染**: 复杂绘图使用离屏Canvas
- **节流处理**: mousemove/touchmove 事件节流
- **历史限制**: 最多保存20步历史记录
- **尺寸限制**: 画布大小根据容器自适应

### 2. 录制优化
- **分块保存**: MediaRecorder 每秒保存一次数据
- **内存管理**: 停止录制后立即释放流资源
- **格式选择**: WebM 格式平衡质量和大小

### 3. UI优化
- **CSS动画**: 使用transform和opacity优化动画
- **事件委托**: 减少事件监听器数量
- **懒加载**: 按需初始化模块

---

## 安全考虑

### 1. 权限管理
- 录音前必须请求麦克风权限
- 文件保存前检查存储权限
- 用户拒绝权限时提供友好提示

### 2. 数据隐私
- 所有录制内容保存在本地
- 不上传任何用户数据到服务器
- 支持用户手动删除文件

### 3. 输入验证
- 画笔大小范围限制 (1-50)
- 颜色值格式验证
- 文件名非法字符过滤

---

## 扩展性设计

### 如何添加新工具？

1. **在 DrawingBoard 类中添加工具逻辑**:
```javascript
setTool(tool) {
  if (tool === 'newTool') {
    // 新工具的绘制逻辑
  }
}
```

2. **在 UI 中添加按钮**:
```html
<button id="newToolBtn">新工具</button>
```

3. **绑定事件**:
```javascript
document.getElementById('newToolBtn').addEventListener('click', () => {
  drawingBoard.setTool('newTool');
});
```

### 如何添加新的录制格式？

```javascript
// 在 Recorder 类中修改 MediaRecorder 配置
this.mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/mp4' // 更改格式
});
```

### 如何集成云存储？

```javascript
// 在保存方法中添加云上传逻辑
async saveToCloud(dataUrl) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ image: dataUrl })
  });
  return response.json();
}
```

---

## 测试架构

### 单元测试
- DrawingBoard 类的方法测试
- Recorder 类的状态测试
- 工具函数的输入输出测试

### 集成测试
- 绘图 → 保存 完整流程
- 录音 → 保存 完整流程
- 撤销 → 重做 流程

### E2E测试
- 用户完整操作流程
- 跨平台兼容性测试
- 权限请求流程测试

---

## 部署架构

```
开发环境 (localhost:8080)
    ↓
Git 仓库 (GitHub)
    ↓
┌──────────────┬──────────────┐
│   iOS部署    │  Android部署  │
│   ↓          │     ↓        │
│ TestFlight   │ Google Play  │
│   ↓          │  Internal    │
│ App Store    │     ↓        │
│              │ Google Play  │
└──────────────┴──────────────┘
```

---

## 依赖关系图

```
app.js (主控制器)
  ├── DrawingBoard (画板类)
  │   └── Canvas API
  │
  ├── Recorder (录制类)
  │   ├── MediaRecorder API
  │   └── VoiceRecorder Plugin
  │
  └── Capacitor Plugins
      ├── @capacitor/filesystem
      └── @capacitor/share
```

---

这个架构设计遵循了**模块化**、**可扩展**和**跨平台**的原则，便于维护和功能扩展。
