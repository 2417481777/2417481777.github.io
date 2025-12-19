import React from 'react'
import './RecordControls.css'

const RecordControls = ({
  isRecording,
  isPaused,
  hasRecording,
  recordingTime,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onDownloadRecording,
  onClearRecording
}) => {
  return (
    <div className="record-controls">
      <div className="controls-group">
        {!isRecording ? (
          <button
            className="control-btn start-btn"
            onClick={onStartRecording}
            title="开始录制"
          >
            <span className="btn-icon">●</span>
            <span className="btn-text">开始录制</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                className="control-btn resume-btn"
                onClick={onResumeRecording}
                title="恢复录制"
              >
                <span className="btn-icon">▶</span>
                <span className="btn-text">继续</span>
              </button>
            ) : (
              <button
                className="control-btn pause-btn"
                onClick={onPauseRecording}
                title="暂停录制"
              >
                <span className="btn-icon">❚❚</span>
                <span className="btn-text">暂停</span>
              </button>
            )}
            
            <button
              className="control-btn stop-btn"
              onClick={onStopRecording}
              title="停止录制"
            >
              <span className="btn-icon">■</span>
              <span className="btn-text">停止</span>
            </button>
          </>
        )}

        {hasRecording && !isRecording && (
          <>
            <button
              className="control-btn download-btn"
              onClick={onDownloadRecording}
              title="下载录制"
            >
              <span className="btn-icon">⬇</span>
              <span className="btn-text">下载视频</span>
            </button>
            
            <button
              className="control-btn clear-btn"
              onClick={onClearRecording}
              title="清除录制"
            >
              <span className="btn-icon">🗑</span>
              <span className="btn-text">清除</span>
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="recording-status">
          <span className={`recording-indicator ${isPaused ? 'paused' : ''}`}>
            {isPaused ? '⏸' : '⏺'}
          </span>
          <span className="recording-time">{recordingTime}</span>
          <span className="recording-text">
            {isPaused ? '录制已暂停' : '正在录制...'}
          </span>
        </div>
      )}
    </div>
  )
}

export default RecordControls
