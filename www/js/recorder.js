/**
 * 录制器类 - 负责音频和视频录制功能
 */
class Recorder {
    constructor() {
        this.audioRecording = false;
        this.screenRecording = false;
        this.audioRecorder = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.startTime = null;
        this.timerInterval = null;
        this.hasVoiceRecorderPlugin = false;
        
        this.checkPlugins();
    }

    /**
     * 检查可用的插件
     */
    async checkPlugins() {
        if (window.Capacitor && window.Capacitor.Plugins) {
            // 检查是否有 capacitor-voice-recorder 插件
            this.hasVoiceRecorderPlugin = !!window.Capacitor.Plugins.VoiceRecorder;
        }
    }

    /**
     * 开始音频录制
     */
    async startAudioRecording() {
        try {
            if (this.audioRecording) {
                await this.stopAudioRecording();
                return { success: true, action: 'stopped' };
            }

            // 尝试使用 Capacitor VoiceRecorder 插件
            if (this.hasVoiceRecorderPlugin) {
                const { VoiceRecorder } = window.Capacitor.Plugins;
                
                // 请求权限
                const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
                if (!hasPermission.value) {
                    const permission = await VoiceRecorder.requestAudioRecordingPermission();
                    if (!permission.value) {
                        throw new Error('未获得录音权限');
                    }
                }

                // 开始录制
                await VoiceRecorder.startRecording();
                this.audioRecording = true;
                this.startTimer();
                
                return { success: true, action: 'started', method: 'plugin' };
            } else {
                // 使用 Web API
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.audioRecorder = new MediaRecorder(stream);
                this.recordedChunks = [];

                this.audioRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.recordedChunks.push(e.data);
                    }
                };

                this.audioRecorder.onstop = () => {
                    this.saveAudioRecording();
                };

                this.audioRecorder.start();
                this.audioRecording = true;
                this.startTimer();
                
                return { success: true, action: 'started', method: 'web' };
            }
        } catch (error) {
            console.error('音频录制失败:', error);
            return { success: false, message: '录音失败：' + error.message };
        }
    }

    /**
     * 停止音频录制
     */
    async stopAudioRecording() {
        try {
            if (!this.audioRecording) return { success: false, message: '未在录音' };

            if (this.hasVoiceRecorderPlugin) {
                const { VoiceRecorder } = window.Capacitor.Plugins;
                const result = await VoiceRecorder.stopRecording();
                
                if (result.value && result.value.recordDataBase64) {
                    await this.saveAudioFromPlugin(result.value.recordDataBase64);
                }
            } else if (this.audioRecorder) {
                this.audioRecorder.stop();
                this.audioRecorder.stream.getTracks().forEach(track => track.stop());
            }

            this.audioRecording = false;
            this.stopTimer();
            
            return { success: true, message: '录音已停止' };
        } catch (error) {
            console.error('停止录音失败:', error);
            return { success: false, message: '停止录音失败：' + error.message };
        }
    }

    /**
     * 保存音频录制（Web API）
     */
    async saveAudioRecording() {
        if (this.recordedChunks.length === 0) return;

        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        if (window.Capacitor && window.Capacitor.Plugins.Filesystem) {
            // Capacitor 环境保存到文件系统
            const { Filesystem } = window.Capacitor.Plugins;
            const reader = new FileReader();
            
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                const fileName = `audio_${Date.now()}.webm`;
                
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: 'DOCUMENTS'
                });
                
                console.log('音频已保存:', fileName);
            };
            
            reader.readAsDataURL(blob);
        } else {
            // Web 环境下载
            const a = document.createElement('a');
            a.href = url;
            a.download = `audio_${Date.now()}.webm`;
            a.click();
        }
        
        this.recordedChunks = [];
    }

    /**
     * 保存音频（来自插件）
     */
    async saveAudioFromPlugin(base64Data) {
        try {
            if (window.Capacitor && window.Capacitor.Plugins.Filesystem) {
                const { Filesystem } = window.Capacitor.Plugins;
                const fileName = `audio_${Date.now()}.aac`;
                
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: 'DOCUMENTS'
                });
                
                console.log('音频已保存:', fileName);
            }
        } catch (error) {
            console.error('保存音频失败:', error);
        }
    }

    /**
     * 开始屏幕录制
     */
    async startScreenRecording() {
        try {
            if (this.screenRecording) {
                await this.stopScreenRecording();
                return { success: true, action: 'stopped' };
            }

            // Web环境使用 MediaRecorder API
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                throw new Error('您的浏览器不支持屏幕录制');
            }

            // 请求屏幕捕获（注意：移动端可能不支持）
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' }
            });

            // 可选：同时录制音频
            let audioStream = null;
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (e) {
                console.warn('未能获取音频流:', e);
            }

            // 合并视频和音频流
            const tracks = [
                ...displayStream.getVideoTracks(),
                ...(audioStream ? audioStream.getAudioTracks() : [])
            ];

            const combinedStream = new MediaStream(tracks);
            this.mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp8,opus'
            });

            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.saveScreenRecording();
                tracks.forEach(track => track.stop());
            };

            this.mediaRecorder.start(1000); // 每秒保存一次数据
            this.screenRecording = true;
            this.startTimer();

            return { success: true, action: 'started' };
        } catch (error) {
            console.error('屏幕录制失败:', error);
            return { 
                success: false, 
                message: error.name === 'NotAllowedError' 
                    ? '未获得屏幕录制权限' 
                    : '屏幕录制失败：' + error.message 
            };
        }
    }

    /**
     * 停止屏幕录制
     */
    async stopScreenRecording() {
        try {
            if (!this.screenRecording) return { success: false, message: '未在录屏' };

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            this.screenRecording = false;
            this.stopTimer();

            return { success: true, message: '录屏已停止' };
        } catch (error) {
            console.error('停止录屏失败:', error);
            return { success: false, message: '停止录屏失败：' + error.message };
        }
    }

    /**
     * 保存屏幕录制
     */
    async saveScreenRecording() {
        if (this.recordedChunks.length === 0) return;

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        if (window.Capacitor && window.Capacitor.Plugins.Filesystem) {
            // Capacitor 环境
            const { Filesystem } = window.Capacitor.Plugins;
            const reader = new FileReader();
            
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                const fileName = `screen_${Date.now()}.webm`;
                
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: 'DOCUMENTS'
                });
                
                console.log('视频已保存:', fileName);
            };
            
            reader.readAsDataURL(blob);
        } else {
            // Web 环境
            const a = document.createElement('a');
            a.href = url;
            a.download = `screen_${Date.now()}.webm`;
            a.click();
        }
        
        this.recordedChunks = [];
    }

    /**
     * 开始计时器
     */
    startTimer() {
        this.startTime = Date.now();
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.startTime = null;
        
        const timeElement = document.getElementById('recordingTime');
        if (timeElement) {
            timeElement.textContent = '00:00';
        }
    }

    /**
     * 更新计时器显示
     */
    updateTimer() {
        if (!this.startTime) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        
        const timeElement = document.getElementById('recordingTime');
        if (timeElement) {
            timeElement.textContent = `${minutes}:${seconds}`;
        }
    }

    /**
     * 检查是否正在录制
     */
    isRecording() {
        return this.audioRecording || this.screenRecording;
    }
}
