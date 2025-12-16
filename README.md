# Frontend Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

3. Build for production:
```bash
npm run build
```

## Environment Configuration

Make sure your backend API is running at `http://localhost:8000` (or update the `BASE_URL` in `src/utils/api.js`)
