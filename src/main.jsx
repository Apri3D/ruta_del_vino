import React from 'react'
import ReactDOM from 'react-dom/client'
import FormularioCarga from './FormularioCarga'
import VipAntelo from './VipAntelo'
import PropuestaTestDrive from './PropuestaTestDrive'

const path = window.location.pathname

function App() {
  if (path === '/vip-antelo') return <VipAntelo />
  if (path === '/propuesta-testdrive') return <PropuestaTestDrive />
  return <FormularioCarga />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)