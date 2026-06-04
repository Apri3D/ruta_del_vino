import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const fn = isRegister ? signUp : signIn
    const { error: err } = await fn(
      isRegister ? { email, password, name, phone } : { email, password }
    )

    if (err) setError(err.message)
    else if (!isRegister) navigate('/dashboard')
    else setError('Revisá tu email para confirmar la cuenta')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111111] p-4">
      <div className="w-full max-w-sm bg-[#222222] rounded-2xl p-8 shadow-2xl border border-[#333333]">
        <h1 className="text-xl font-bold text-white tracking-wide uppercase mb-2">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {isRegister ? 'Registrate para gestionar tus beneficios' : 'Ingresá con tu email'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input type="text" placeholder="Nombre" required value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]" />
              <input type="tel" placeholder="WhatsApp" required value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]" />
            </>
          )}
          <input type="email" placeholder="Email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]" />
          <input type="password" placeholder="Contraseña" required value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]" />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit"
            className="w-full bg-[#4A0E17] hover:bg-[#5c121d] transition-colors text-white font-semibold py-3 rounded-lg uppercase text-sm tracking-wider">
            {isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-[#D4AF37] hover:underline">
            {isRegister ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </p>
      </div>
    </div>
  )
}
