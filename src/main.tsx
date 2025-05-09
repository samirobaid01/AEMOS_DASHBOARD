import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/darkMode.css'
import './styles/walkthrough.css'
import App from './App'

// Pre-load component modules to reduce direct file requests
if (import.meta.env.DEV) {
  // This will be tree-shaken in production builds
  import('./components')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
