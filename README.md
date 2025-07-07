# DevTinder Web

This is the frontend for the DevTinder platform, a developer matchmaking and collaboration application. Built with React, Vite, Redux, Tailwind CSS, and DaisyUI.

## Features

- Modern UI with React and Vite
- Developer discovery feed (Tinder-style swiping)
- User authentication and signup
- Profile management and editing
- Real-time chat and connections
- Responsive design with Tailwind CSS and DaisyUI
- Toast notifications for feedback

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- The [DevTinder backend](../devTinder_backend/README.md) running locally or remotely

### Installation

1. Clone the repository and navigate to the web folder:

    ```sh
    git clone <repo-url>
    cd devTinder_web
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the development server:

    ```sh
    npm run dev
    ```

    The app will run on `http://localhost:5173` by default.

## Project Structure

```
src/
  components/      # React components (Feed, Signup, Navbar, etc.)
  utils/           # Redux slices and utility functions
  assets/          # Static assets (SVGs, images)
  constants.js     # App-wide constants (e.g., API base URL)
  App.jsx          # Main app component
  main.jsx         # Entry point
  index.css        # Tailwind and DaisyUI styles
public/
  vite.svg         # Public assets
```

## Customization

- Update API endpoints in [`src/constants.js`](src/constants.js) if your backend runs on a different URL.
- Tailwind and DaisyUI are configured in [`vite.config.js`](vite.config.js) and [`src/index.css`](src/index.css).

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build


For backend setup and API documentation, see [devTinder_backend/README.md](../devTinder_backend/README.md)
