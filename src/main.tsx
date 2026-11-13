// Import React, the root component and shared stylesheet.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Mount the application in the HTML root element.
// StrictMode enables additional development checks for React components.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
