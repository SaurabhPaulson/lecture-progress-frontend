const API_URL = process.env.REACT_APP_API_URL;

export const fetchProgress = async (userId, videoId) => {
  const response = await fetch(`${API_URL}/api/progress/${userId}/${videoId}`);
  if (!response.ok) throw new Error('Failed to fetch progress');
  return await response.json();
};

export const saveProgress = async (userId, videoId, intervals, videoDuration) => {
  const response = await fetch(`${API_URL}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, videoId, intervals, videoDuration }),
  });
  if (!response.ok) throw new Error('Failed to save progress');
  return await response.json();
};