import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import FormularioCarga from './pages/FormularioCarga'
import VipAntelo from './pages/VipAntelo'
import PropuestaTestDrive from './pages/PropuestaTestDrive'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<FormularioCarga />} />
          <Route path="/vip-antelo" element={<VipAntelo />} />
          <Route path="/propuesta-testdrive" element={<PropuestaTestDrive />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
