import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [promos, setPromos] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('leads')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', discount_pct: '', code: '', tier_required: 'regular', valid_until: '' })

  useEffect(() => {
    if (loading) return
    if (!user || !profile?.is_admin) navigate('/', { replace: true })
  }, [user, profile, loading, navigate])

  useEffect(() => {
    if (!profile?.is_admin) return
    supabase.from('leads_mendoza').select('*').order('created_at', { ascending: false }).limit(100).then(({ data }) => {
      if (data) setLeads(data)
    })
    supabase.from('promos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPromos(data)
    })
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setUsers(data)
    })
  }, [profile])

  function resetForm() {
    setForm({ title: '', description: '', discount_pct: '', code: '', tier_required: 'regular', valid_until: '' })
    setShowForm(false)
    setEditingId(null)
  }

  function editPromo(promo) {
    setForm({
      title: promo.title,
      description: promo.description || '',
      discount_pct: promo.discount_pct?.toString() || '',
      code: promo.code || '',
      tier_required: promo.tier_required,
      valid_until: promo.valid_until?.split('T')[0] || ''
    })
    setEditingId(promo.id)
    setShowForm(true)
  }

  async function savePromo(e) {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description || null,
      discount_pct: form.discount_pct ? parseInt(form.discount_pct) : null,
      code: form.code || null,
      tier_required: form.tier_required,
      valid_until: form.valid_until || null,
    }
    if (editingId) {
      await supabase.from('promos').update(payload).eq('id', editingId)
    } else {
      await supabase.from('promos').insert({ ...payload, is_active: true })
    }
    resetForm()
    supabase.from('promos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPromos(data)
    })
  }

  async function togglePromo(id, active) {
    await supabase.from('promos').update({ is_active: !active }).eq('id', id)
    supabase.from('promos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPromos(data)
    })
  }

  async function updateUser(userId, updates) {
    await supabase.from('profiles').update(updates).eq('id', userId)
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setUsers(data)
    })
  }

  if (loading || !profile?.is_admin) return null

  return (
    <div className="min-h-screen bg-[#111111] p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-xl font-bold mb-4 uppercase tracking-wide">Panel Admin</h1>

        <div className="flex gap-4 mb-6 border-b border-[#333] pb-2">
          <button onClick={() => setTab('leads')}
            className={`text-sm font-semibold pb-1 ${tab === 'leads' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500'}`}>
            Leads ({leads.length})
          </button>
          <button onClick={() => setTab('promos')}
            className={`text-sm font-semibold pb-1 ${tab === 'promos' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500'}`}>
            Promociones
          </button>
          <button onClick={() => setTab('usuarios')}
            className={`text-sm font-semibold pb-1 ${tab === 'usuarios' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500'}`}>
            Usuarios
          </button>
        </div>

        {tab === 'leads' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-gray-500 uppercase text-xs">
                  <th className="pb-2 pr-4">Nombre</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Teléfono</th>
                  <th className="pb-2 pr-4">Vehículo</th>
                  <th className="pb-2 pr-4">Categoría</th>
                  <th className="pb-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-t border-[#222]">
                    <td className="py-2 pr-4 text-white">{lead.nombre}</td>
                    <td className="py-2 pr-4">{lead.email}</td>
                    <td className="py-2 pr-4">{lead.telefono}</td>
                    <td className="py-2 pr-4">{lead.vehiculo}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs font-semibold ${lead.categoria === 'VIP ANTELO' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                        {lead.categoria}
                      </span>
                    </td>
                    <td className="py-2">{new Date(lead.created_at).toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'promos' && (
          <div>
            <button onClick={() => setShowForm(!showForm)}
              className="mb-4 bg-[#4A0E17] hover:bg-[#5c121d] text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {showForm ? 'Cancelar' : '+ Nueva Promo'}
            </button>

              {showForm && (
              <form onSubmit={savePromo} className="bg-[#222] rounded-xl p-4 border border-[#333] space-y-3 mb-6">
                <input placeholder="Título" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm" />
                <input placeholder="Descripción" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm" />
                <div className="flex gap-3">
                  <input type="number" placeholder="% Descuento" value={form.discount_pct}
                    onChange={e => setForm({ ...form, discount_pct: e.target.value })}
                    className="w-1/3 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm" />
                  <input placeholder="Código" value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    className="w-1/3 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm" />
                  <select value={form.tier_required}
                    onChange={e => setForm({ ...form, tier_required: e.target.value })}
                    className="w-1/3 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white text-sm">
                    <option value="regular">Todos</option>
                    <option value="test_drive">Test Drive</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <input type="date" value={form.valid_until}
                  onChange={e => setForm({ ...form, valid_until: e.target.value })}
                  className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2 text-white text-sm" />
                <button type="submit"
                  className="bg-[#556B2F] hover:bg-[#657b3a] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  {editingId ? 'Guardar Cambios' : 'Crear Promo'}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {promos.map(promo => (
                <div key={promo.id} className="bg-[#222] rounded-xl p-4 border border-[#333]">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{promo.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {promo.tier_required} {promo.discount_pct && `· ${promo.discount_pct}% OFF`} {promo.code && `· ${promo.code}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editPromo(promo)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1">
                        Editar
                      </button>
                      <button onClick={() => togglePromo(promo.id, promo.is_active)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${promo.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {promo.is_active ? 'Activa' : 'Inactiva'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'usuarios' && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-[#222] rounded-xl p-4 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{u.name || 'Sin nombre'}</h3>
                    <p className="text-gray-400 text-xs">{u.phone || 'Sin teléfono'}</p>
                  </div>
                  <span className={`text-xs font-semibold ${u.is_admin ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                    {u.is_admin ? 'Admin' : 'Usuario'}
                  </span>
                </div>
                <div className="flex gap-3 mt-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Cargas restantes</label>
                    <div className="flex gap-2 mt-1">
                      <input type="number" value={u.free_charges_remaining || 0}
                        onChange={e => updateUser(u.id, { free_charges_remaining: parseInt(e.target.value) || 0 })}
                        className="w-20 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-3 py-1.5 text-white text-sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Membresía</label>
                    <select value={u.tier}
                      onChange={e => updateUser(u.id, { tier: e.target.value })}
                      className="w-full mt-1 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-3 py-1.5 text-white text-sm">
                      <option value="regular">Regular</option>
                      <option value="test_drive">Test Drive</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Puntos fidelidad</label>
                    <input type="number" value={u.fidelity_points || 0}
                      onChange={e => updateUser(u.id, { fidelity_points: parseInt(e.target.value) || 0 })}
                      className="w-full mt-1 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-3 py-1.5 text-white text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
