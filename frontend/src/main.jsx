import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
