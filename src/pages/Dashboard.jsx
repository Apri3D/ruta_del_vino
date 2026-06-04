import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [promos, setPromos] = useState([])
  const [redemptions, setRedemptions] = useState([])

  useEffect(() => {
    supabase.from('promos').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setPromos(data.filter(p =>
        p.tier_required === 'regular' || p.tier_required === profile?.tier
      ))
    })
    if (user) {
      supabase.from('redemptions').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(20).then(({ data }) => {
          if (data) setRedemptions(data)
        })
    }
  }, [user, profile])

  const tierLabel = { vip: 'VIP Antelo', test_drive: 'Test Drive', regular: 'Regular' }
  const tierColor = { vip: 'text-[#D4AF37]', test_drive: 'text-blue-400', regular: 'text-gray-400' }

  async function redeemCharge() {
    if (!profile || profile.free_charges_remaining <= 0) return
    const { error } = await supabase.from('redemptions').insert({
      user_id: user.id, type: 'charge', location: 'Nodo Bodega Orgánica'
    })
    if (!error) {
      await supabase.rpc('decrement_charges', { user_id: user.id })
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] p-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* Header */}
        <div className="bg-[#222222] rounded-2xl p-6 border border-[#333333]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-white text-xl font-bold">Hola, {profile?.name || 'Usuario'}</h1>
              <p className={`text-sm font-semibold mt-1 ${tierColor[profile?.tier] || tierColor.regular}`}>
                {tierLabel[profile?.tier] || tierLabel.regular}
              </p>
            </div>
            <div className="flex gap-2">
              {profile?.is_admin && (
                <Link to="/admin"
                  className="text-xs text-[#D4AF37] hover:text-[#b8942e] transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={signOut}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Free Charges */}
        <div className="bg-[#222222] rounded-2xl p-6 border border-[#333333]">
          <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Cargas Gratuitas</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">{profile?.free_charges_remaining || 0}</span>
            <span className="text-gray-400 text-sm">restantes</span>
          </div>
          <button onClick={redeemCharge}
            disabled={!profile?.free_charges_remaining}
            className="mt-4 w-full bg-[#556B2F] hover:bg-[#657b3a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold py-2.5 rounded-lg uppercase text-sm tracking-wider">
            Usar carga gratuita
          </button>
        </div>

        {/* Active Promos */}
        <div className="bg-[#222222] rounded-2xl p-6 border border-[#333333]">
          <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Promociones Activas</h2>
          {promos.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay promociones disponibles</p>
          ) : (
            <div className="space-y-3">
              {promos.map(promo => (
                <div key={promo.id} className="bg-[#2d2d2d] rounded-xl p-4 border border-[#3d3d3d]">
                  <h3 className="text-white font-semibold">{promo.title}</h3>
                  {promo.description && <p className="text-gray-400 text-sm mt-1">{promo.description}</p>}
                  {promo.discount_pct && (
                    <span className="inline-block mt-2 text-xs bg-[#4A0E17] text-white px-2 py-0.5 rounded font-bold">
                      {promo.discount_pct}% OFF
                    </span>
                  )}
                  {promo.code && (
                    <span className="inline-block mt-2 ml-2 text-xs bg-[#333] text-gray-300 px-2 py-0.5 rounded font-mono">
                      {promo.code}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Redemptions */}
        {redemptions.length > 0 && (
          <div className="bg-[#222222] rounded-2xl p-6 border border-[#333333]">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Actividad Reciente</h2>
            <div className="space-y-2">
              {redemptions.map(r => (
                <div key={r.id} className="flex justify-between text-sm text-gray-400">
                  <span>{r.type === 'charge' ? '⚡ Carga gratuita' : '🎁 Promo'}</span>
                  <span>{new Date(r.created_at).toLocaleDateString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
