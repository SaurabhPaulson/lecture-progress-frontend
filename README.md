# Lecture Progress Tracking Frontend

This project is a React-based frontend for tracking user progress on lecture videos. Users can upload or select videos, watch them, and see their viewing progress in real-time.

## Features

- Upload and select lecture videos
- Watch videos with progress tracking
- View unique watched time and percentage
- Progress is saved and resumed per user/video

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd lecture-progress-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

Start the development server:
```sh
npm start
```
The app will run at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=3001
REACT_APP_API_URL=https://lecture-progress-backend.onrender.com
```

## Project Structure

- `public/` – Static files and HTML template
- `src/api/progressApi.js` – API calls to backend
- `src/components/` – UI components (VideoPlayer, ProgressTracker)
- `src/pages/Home.jsx` – Main page
- `src/App.jsx` – Root component
- `src/styles/App.css` – Styles

## API Integration

The frontend communicates with the backend via REST API endpoints defined in `src/api/progressApi.js`.

## License

[ISC](LICENSE)