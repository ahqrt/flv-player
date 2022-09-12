import { FlvDemuxer } from '@player/flv-player'
import { useEffect, useRef } from 'react'
import flv from 'flv.js'
const fetchStream = (file: string) => fetch(file).then(r => r.arrayBuffer())

function App() {

  const videoRef = useRef<HTMLVideoElement>(null)

  async function init() {
    if (flv.isSupported()) {
      const flvPlayer = flv.createPlayer({
        type: 'flv',
        url: '/797809977-1-32.flv'
      });
      flvPlayer.attachMediaElement(videoRef.current!);
      flvPlayer.load();
      flvPlayer.play();
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="App">
      <video muted ref={videoRef} style={{ width: '100%', height: '100%' }}></video>
    </div>
  )
}

export default App
