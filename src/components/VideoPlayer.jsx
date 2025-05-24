import React, { useEffect, useRef, useState } from 'react';
import { saveProgress, fetchProgress } from '../api/progressApi';

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a.start - b.start);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr.start <= last.end) {
      last.end = Math.max(last.end, curr.end);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

const USER_ID = 'user1'; // Replace with real user id

const VideoPlayer = ({ videoId, videoSrc, onProgressUpdate }) => {
  const videoRef = useRef(null);
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [resumeTime, setResumeTime] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProgress = async () => {
      setError('');
      try {
        const data = await fetchProgress(USER_ID, videoId);
        const intervals = data.intervals || [];
        setWatchedIntervals(intervals);
        let last = 0;
        if (intervals.length) {
          const merged = mergeIntervals(intervals);
          last = merged[merged.length - 1].end;
        }
        setResumeTime(last);
        if (onProgressUpdate) onProgressUpdate(intervals, videoDuration);
      } catch (e) {
        setWatchedIntervals([]);
        setResumeTime(0);
        setError('No progress found for this video.');
        if (onProgressUpdate) onProgressUpdate([], videoDuration);
      }
    };
    loadProgress();
    // eslint-disable-next-line
  }, [videoId]);

  useEffect(() => {
    if (resumeTime && videoRef.current) {
      videoRef.current.currentTime = resumeTime;
    }
  }, [resumeTime, videoId]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;
    if (video.paused || video.ended) return;
    if (!currentInterval) {
      setCurrentInterval({ start: current, end: current });
    } else {
      setCurrentInterval({ ...currentInterval, end: current });
    }
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentInterval({ start: video.currentTime, end: video.currentTime });
  };

  const handlePauseOrEnded = async () => {
    if (!currentInterval) return;
    const interval = {
      start: Math.min(currentInterval.start, currentInterval.end),
      end: Math.max(currentInterval.start, currentInterval.end),
    };
    if (interval.end - interval.start < 0.5) {
      setCurrentInterval(null);
      return;
    }
    const newIntervals = mergeIntervals([...watchedIntervals, interval]);
    setWatchedIntervals(newIntervals);
    setCurrentInterval(null);
    try {
      await saveProgress(USER_ID, videoId, newIntervals, videoDuration);
      if (onProgressUpdate) onProgressUpdate(newIntervals, videoDuration);
    } catch {
      setError('Failed to save progress. Please check your connection.');
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setVideoDuration(video.duration);
  };

  return (
    <div className="container">
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <video
        ref={videoRef}
        width="100%"
        className="video-player"
        controls
        src={videoSrc}
        onPlay={handlePlay}
        onPause={handlePauseOrEnded}
        onEnded={handlePauseOrEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px #ccc' }}
      />
      <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
        Video ID: <b>{videoId}</b>
      </div>
    </div>
  );
};

export default VideoPlayer;