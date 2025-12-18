# 🚀 快速开始指南

## 第一步：测试 Web 版本

1. 安装 http-server（如果还没有）：
```bash
npm install -g http-server
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中访问：`http://localhost:8080`

4. 测试功能：
   - 在画布上绘画
   - 尝试不同颜色和画笔大小
   - 测试橡皮擦和撤销功能
   - 点击保存按钮下载图片

> **注意**: Web 版本的录制功能需要 HTTPS 或 localhost 环境

---

## 第二步：在 iOS 上运行

### 前置条件
- macOS 系统
- 已安装 Xcode (从 App Store 下载)
- 已安装 CocoaPods：`sudo gem install cocoapods`

### 步骤

1. **打开 iOS 项目**
```bash
npm run open:ios
```

2. **在 Xcode 中配置**
   - 选择一个开发团队（Team）
   - 选择目标设备或模拟器
   - 点击运行按钮 ▶️

3. **首次运行可能需要**
   - 在真机上：信任开发者证书（设置 > 通用 > VPN与设备管理）
   - 授予麦克风权限

### 常见问题

**问题**: "No development team selected"
**解决**: 在 Xcode 中选择 Signing & Capabilities，选择你的 Apple ID

**问题**: CocoaPods 安装失败
**解决**: 
```bash
cd ios/App
pod install
```

---

## 第三步：在 Android 上运行

### 前置条件
- 已安装 Android Studio
- 已配置 Android SDK
- 启用 USB 调试的 Android 设备 或 模拟器

### 步骤

1. **打开 Android 项目**
```bash
npm run open:android
```

2. **在 Android Studio 中**
   - 等待 Gradle 同步完成
   - 连接 Android 设备或启动模拟器
   - 点击运行按钮 ▶️

3. **首次运行**
   - 应用会请求麦克风和存储权限
   - 点击"允许"授予权限

### 常见问题

**问题**: "SDK location not found"
**解决**: 创建 `android/local.properties` 文件：
```properties
sdk.dir=/Users/你的用户名/Library/Android/sdk
```

**问题**: Gradle 同步失败
**解决**: 
- 检查网络连接
- 在 Android Studio 中: File > Invalidate Caches / Restart

---

## 功能测试清单

### 画板功能 ✅
- [ ] 用手指/鼠标在画布上绘画
- [ ] 改变画笔颜色
- [ ] 调整画笔大小
- [ ] 使用橡皮擦擦除
- [ ] 撤销上一步操作
- [ ] 清空整个画布
- [ ] 保存图片到设备

### 录制功能 ✅
- [ ] 开始音频录制
- [ ] 查看录制时长
- [ ] 停止并保存录音
- [ ] 在文件管理器中找到录音文件

### 性能测试 ✅
- [ ] 绘画流畅无延迟
- [ ] 多次撤销不卡顿
- [ ] 保存文件速度正常
- [ ] 录制时应用不崩溃

---

## 💡 实用技巧

### 1. 修改代码后如何更新？
```bash
# 修改 www/ 目录下的文件后
npm run sync

# 然后在原生 IDE 中重新运行应用
```

### 2. 如何查看控制台日志？

**iOS (Safari)**:
1. 连接设备
2. 打开 Safari > 开发 > [你的设备] > [应用名称]

**Android (Chrome)**:
1. 连接设备
2. 打开 Chrome，访问 `chrome://inspect`
3. 找到你的应用并点击 "inspect"

### 3. 录音文件保存在哪里？

**iOS**: 
- Files 应用 > On My iPhone > DrawingBoard

**Android**: 
- 文件管理器 > Documents 文件夹

### 4. 如何自定义应用图标？

**iOS**:
- 替换 `ios/App/App/Assets.xcassets/AppIcon.appiconset/` 中的图片

**Android**:
- 替换 `android/app/src/main/res/mipmap-*/ic_launcher.png`

---

## 🔧 调试技巧

### 1. 画板不显示？
- 检查浏览器控制台是否有错误
- 确认 Canvas 元素尺寸正常
- 刷新页面重试

### 2. 录音没有声音？
- 确认已授予麦克风权限
- 检查设备音量设置
- 测试其他录音应用是否正常

### 3. 应用崩溃？
- 查看原生 IDE 的日志输出
- 检查是否有内存溢出
- 尝试清空画布后再操作

---

## 📚 下一步

1. **自定义界面**: 修改 `www/css/style.css`
2. **添加功能**: 在 `www/js/` 中扩展代码
3. **优化性能**: 减少历史记录数量，优化绘图算法
4. **发布应用**: 参考 README.md 中的发布说明

---

## 🆘 需要帮助？

- 查看详细文档：`README.md`
- 查看 Capacitor 官方文档：https://capacitorjs.com
- 检查浏览器控制台的错误信息

祝你开发愉快！🎉
