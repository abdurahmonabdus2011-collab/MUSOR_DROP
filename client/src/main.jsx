import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import App from './App'
import './style.css'

// Ilovaning kirish nuqtasi.
// HashRouter ishlatamiz — sahifani yangilaganda server "/chalqalar" topmaydi:
// URL oxirida #/path turadi, backendga oddiy / so'rov keladi.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)
