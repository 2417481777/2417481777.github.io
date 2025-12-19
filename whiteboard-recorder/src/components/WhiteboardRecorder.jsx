import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import RecordControls from './RecordControls'
import './WhiteboardRecorder.css'

const WhiteboardRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const excalidrawRef = useRef(null)

  // 定时器更新录制时间
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  // 获取Canvas元素
  const getExcalidrawCanvas = useCallback(() => {
    // Excalidraw使用canvas渲染，我们需要找到它
    const canvas = document.querySelector('.excalidraw .excalidraw-canvas')
    return canvas
  }, [])

  // 开始录制
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setRecordedChunks([])
      setRecordingTime(0)

      // 等待一小段时间确保Excalidraw已渲染
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = getExcalidrawCanvas()
      if (!canvas) {
        throw new Error('无法找到白板Canvas元素')
      }

      canvasRef.current = canvas

      // 从Canvas创建MediaStream
      const stream = canvas.captureStream(30) // 30 FPS
      streamRef.current = stream

      // 创建MediaRecorder
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      }

      // 如果vp9不支持，尝试vp8
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8'
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm'
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks)
        setIsRecording(false)
        setIsPaused(false)
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder错误:', event)
        setError('录制过程中发生错误')
        setIsRecording(false)
      }

      // 开始录制
      mediaRecorder.start(100) // 每100ms收集一次数据
      setIsRecording(true)
      console.log('开始录制，编码格式:', options.mimeType)
    } catch (err) {
      console.error('开始录制失败:', err)
      setError(`录制失败: ${err.message}`)
    }
  }, [getExcalidrawCanvas])

  // 暂停录制
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }, [])

  // 恢复录制
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }, [])

  // 停止录制
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      
      // 停止所有轨道
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // 下载录制的视频
  const downloadRecording = useCallback(() => {
    if (recordedChunks.length === 0) {
      setError('没有可下载的录制内容')
      return
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `whiteboard-recording-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }, [recordedChunks])

  // 清除录制
  const clearRecording = useCallback(() => {
    setRecordedChunks([])
    setRecordingTime(0)
    setError(null)
  }, [])

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="whiteboard-recorder">
      <RecordControls
        isRecording={isRecording}
        isPaused={isPaused}
        hasRecording={recordedChunks.length > 0}
        recordingTime={formatTime(recordingTime)}
        onStartRecording={startRecording}
        onPauseRecording={pauseRecording}
        onResumeRecording={resumeRecording}
        onStopRecording={stopRecording}
        onDownloadRecording={downloadRecording}
        onClearRecording={clearRecording}
      />
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="excalidraw-container">
        <Excalidraw
          ref={excalidrawRef}
          initialData={{
            appState: {
              viewBackgroundColor: '#ffffff'
            }
          }}
          UIOptions={{
            canvasActions: {
              loadScene: false
            }
          }}
        />
      </div>

      {recordedChunks.length > 0 && !isRecording && (
        <div className="preview-section">
          <h3>📹 录制预览</h3>
          <video
            controls
            className="preview-video"
            src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))}
          />
        </div>
      )}
    </div>
  )
}

export default WhiteboardRecorder
