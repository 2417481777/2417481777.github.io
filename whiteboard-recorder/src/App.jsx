import React from 'react'
import WhiteboardRecorder from './components/WhiteboardRecorder'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎨 WebRTC 白板录制系统</h1>
        <p>基于 Excalidraw 和 WebRTC 的实时白板录制工具</p>
      </header>
      <WhiteboardRecorder />
    </div>
  )
}

export default App
