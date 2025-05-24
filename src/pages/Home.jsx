import React, { useState, useRef } from 'react';
import ProgressTracker from '../components/ProgressTracker';
import VideoPlayer from '../components/VideoPlayer';

// Simulate a video list (in production, fetch from backend or storage)
const initialVideos = [
  { id: 'lecture1', name: 'Sample Lecture', src: '/sample.mp4' }
];

const Home = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState(initialVideos[0]);
  const [intervals, setIntervals] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const fileInputRef = useRef();

  // Handle progress update from VideoPlayer
  const handleProgressUpdate = (newIntervals, duration) => {
    setIntervals(newIntervals);
    setVideoDuration(duration);
  };

  // Handle video selection
  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setIntervals([]); // Reset intervals, will be loaded by VideoPlayer
    setVideoDuration(0);
  };

  // Handle video upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = file.name + '-' + Date.now();
    const newVideo = { id, name: file.name, src: url };
    setVideos((prev) => [...prev, newVideo]);
    setSelectedVideo(newVideo);
    setIntervals([]);
    setVideoDuration(0);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: 24 }}>Lecture Progress Tracker</h1>
      <div className="container" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <b>Uploaded Videos:</b>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {videos.map((video) => (
              <li key={video.id} style={{ margin: '8px 0' }}>
                <button
                  style={{
                    background: selectedVideo.id === video.id ? '#76c7c0' : '#eee',
                    color: selectedVideo.id === video.id ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 16px',
                    cursor: 'pointer',
                    marginRight: 8
                  }}
                  onClick={() => handleSelectVideo(video)}
                >
                  {video.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            background: '#4fa3a0',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            cursor: 'pointer'
          }}
        >
          Upload Video
        </button>
      </div>
      <VideoPlayer
        key={selectedVideo.id}
        videoId={selectedVideo.id}
        videoSrc={selectedVideo.src}
        onProgressUpdate={handleProgressUpdate}
      />
      <ProgressTracker intervals={intervals} videoDuration={videoDuration} />
    </div>
  );
};

export default Home;