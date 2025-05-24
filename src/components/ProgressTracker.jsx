import React from 'react';

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

function calculateUniqueViewingTime(intervals) {
  const merged = mergeIntervals(intervals);
  return merged.reduce((sum, i) => sum + (i.end - i.start), 0);
}

const ProgressTracker = ({ intervals, videoDuration }) => {
  const uniqueTime = calculateUniqueViewingTime(intervals || []);
  const percent = videoDuration ? (uniqueTime / videoDuration) * 100 : 0;

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 8 }}>Progress</h2>
      <div className="progress-bar" style={{
        marginBottom: 8,
        height: 16,
        background: '#eee',
        borderRadius: 8,
        overflow: 'hidden'
      }}>
        <div
          className="progress"
          style={{
            width: `${percent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #76c7c0 60%, #4fa3a0 100%)',
            transition: 'width 0.5s'
          }}
        />
      </div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>
        {percent.toFixed(2)}% watched
      </div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
        Unique seconds watched: {uniqueTime.toFixed(1)} / {videoDuration ? videoDuration.toFixed(1) : '...'}s
      </div>
    </div>
  );
};

export default ProgressTracker;