# 📱 绘画板与录制应用

一个基于 Capacitor + Web 技术开发的跨平台移动应用，支持 iOS 和 Android。提供强大的画板功能和音频/视频录制功能。

## ✨ 功能特性

### 🎨 画板功能
- ✏️ **自由绘画** - 支持触摸和鼠标绘图
- 🎨 **颜色选择** - 调色板支持任意颜色
- 📏 **画笔大小** - 1-50px 可调节画笔粗细
- 🧹 **橡皮擦** - 便捷的擦除工具
- ↩️ **撤销功能** - 支持多步撤销（最多20步）
- 🗑️ **清空画布** - 一键清除所有内容
- 💾 **保存作品** - 导出 PNG 格式图片

### 🎙️ 录制功能
- 🎤 **音频录制** - 高质量音频录制
- 📹 **屏幕录制** - 录制画板操作过程（Web端）
- ⏱️ **实时计时** - 显示录制时长
- 💾 **自动保存** - 录制内容自动保存到设备

## 🛠️ 技术栈

- **Capacitor** - 跨平台框架
- **HTML5 Canvas** - 绘图引擎
- **MediaRecorder API** - 录制功能
- **capacitor-voice-recorder** - 原生音频录制插件
- **@capacitor/filesystem** - 文件系统操作
- **@capacitor/share** - 分享功能

## 📦 安装与运行

### 前置要求

- Node.js (>= 14.x)
- npm 或 yarn
- iOS 开发: macOS + Xcode
- Android 开发: Android Studio

### 安装依赖

```bash
npm install
```

### 开发调试

#### 在浏览器中测试 (Web)

```bash
npm run dev
# 访问 http://localhost:8080
```

#### iOS 平台

```bash
# 同步代码到 iOS 项目
npm run sync

# 在 Xcode 中打开项目
npm run open:ios

# 然后在 Xcode 中构建并运行
```

#### Android 平台

```bash
# 同步代码到 Android 项目
npm run sync

# 在 Android Studio 中打开项目
npm run open:android

# 然后在 Android Studio 中构建并运行
```

## 📁 项目结构

```
/workspace/
├── www/                    # Web 资源目录
│   ├── index.html         # 主 HTML 文件
│   ├── css/
│   │   └── style.css      # 样式文件
│   └── js/
│       ├── drawingBoard.js # 画板核心逻辑
│       ├── recorder.js     # 录制功能
│       └── app.js          # 主应用逻辑
├── ios/                    # iOS 原生项目
├── android/                # Android 原生项目
├── capacitor.config.json   # Capacitor 配置
└── package.json            # 项目配置
```

## 🎯 使用说明

### 画板操作

1. **绘画**: 直接在画布上拖动即可绘制
2. **选择颜色**: 点击颜色选择器选择画笔颜色
3. **调节粗细**: 拖动滑块调整画笔大小
4. **使用橡皮擦**: 点击橡皮擦按钮切换到擦除模式
5. **撤销**: 点击撤销按钮回退上一步操作
6. **清空**: 点击清空按钮清除所有内容
7. **保存**: 点击保存按钮将作品保存到设备

### 录制操作

#### 音频录制
1. 点击"开始录音"按钮
2. 系统会请求麦克风权限（首次使用）
3. 开始录音后按钮变为"停止录音"
4. 再次点击停止并保存录音

#### 屏幕录制
1. 点击"开始录屏"按钮
2. 系统会请求屏幕录制权限
3. 选择要录制的屏幕
4. 点击"停止录屏"保存视频

> **注意**: 移动端屏幕录制功能可能受限于系统和浏览器支持

## 🔐 权限说明

### Android 权限
- **RECORD_AUDIO** - 录制音频
- **MODIFY_AUDIO_SETTINGS** - 音频设置
- **WRITE_EXTERNAL_STORAGE** - 存储文件
- **READ_EXTERNAL_STORAGE** - 读取文件
- **CAMERA** - 相机访问（视频录制）

### iOS 权限
- **NSMicrophoneUsageDescription** - 麦克风访问
- **NSCameraUsageDescription** - 相机访问
- **NSPhotoLibraryAddUsageDescription** - 保存到相册
- **NSPhotoLibraryUsageDescription** - 访问相册

## 🚀 构建发布

### iOS 发布

1. 在 Xcode 中配置签名和证书
2. 选择 Product > Archive
3. 上传到 App Store Connect

### Android 发布

1. 在 Android Studio 中配置签名密钥
2. Build > Generate Signed Bundle / APK
3. 选择 APK 或 AAB 格式
4. 上传到 Google Play Console

## 📝 开发说明

### 添加新功能

1. 在 `www/` 目录下修改 Web 代码
2. 运行 `npm run sync` 同步到原生项目
3. 在原生 IDE 中测试

### 调试

- **Web**: 使用浏览器开发者工具
- **iOS**: 使用 Safari Web Inspector
- **Android**: 使用 Chrome DevTools (chrome://inspect)

## 🐛 常见问题

### 1. 录音功能不工作
- 确保已授予麦克风权限
- 检查设备是否静音
- 尝试重启应用

### 2. 画板卡顿
- 减小画笔大小
- 清理历史记录
- 关闭其他应用释放内存

### 3. 保存失败
- 确保已授予存储权限
- 检查设备存储空间
- 查看控制台错误日志

## 🔄 更新日志

### v1.0.0 (2025-12-18)
- ✅ 初始版本发布
- ✅ 完整的画板功能
- ✅ 音频录制支持
- ✅ 屏幕录制支持（Web）
- ✅ iOS 和 Android 平台支持

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题，请通过 GitHub Issues 联系。

---

**Happy Drawing! 🎨✨**
