import { useAuth } from '../context/AuthContext'
import FormularioCarga from './FormularioCarga'
import Login from './Login'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111111]">
        <div className="w-6 h-6 border-2 border-[#4A0E17] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return user ? <FormularioCarga /> : <Login />
}
