import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [leads, setLeads] = useState([])
  const [promos, setPromos] = useState([])
  const [tab, setTab] = useState('leads')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', discount_pct: '', code: '', tier_required: 'regular', valid_until: '' })

  useEffect(() => {
    supabase.from('leads_mendoza').select('*').order('created_at', { ascending: false }).limit(100).then(({ data }) => {
      if (data) setLeads(data)
    })
    supabase.from('promos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPromos(data)
    })
  }, [])

  async function createPromo(e) {
    e.preventDefault()
    await supabase.from('promos').insert({
      title: form.title,
      description: form.description || null,
      discount_pct: form.discount_pct ? parseInt(form.discount_pct) : null,
      code: form.code || null,
      tier_required: form.tier_required,
      valid_until: form.valid_until || null,
      is_active: true
    })
    setForm({ title: '', description: '', discount_pct: '', code: '', tier_required: 'regular', valid_until: '' })
    setShowForm(false)
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

  return (
    <div className="min-h-screen bg-[#111111] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-xl font-bold mb-4 uppercase tracking-wide">Panel Admin</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#333] pb-2">
          <button onClick={() => setTab('leads')}
            className={`text-sm font-semibold pb-1 ${tab === 'leads' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500'}`}>
            Leads ({leads.length})
          </button>
          <button onClick={() => setTab('promos')}
            className={`text-sm font-semibold pb-1 ${tab === 'promos' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500'}`}>
            Promociones
          </button>
        </div>

        {/* Leads Tab */}
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

        {/* Promos Tab */}
        {tab === 'promos' && (
          <div>
            <button onClick={() => setShowForm(!showForm)}
              className="mb-4 bg-[#4A0E17] hover:bg-[#5c121d] text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {showForm ? 'Cancelar' : '+ Nueva Promo'}
            </button>

            {showForm && (
              <form onSubmit={createPromo} className="bg-[#222] rounded-xl p-4 border border-[#333] space-y-3 mb-6">
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
                  Crear Promo
                </button>
              </form>
            )}

            <div className="space-y-3">
              {promos.map(promo => (
                <div key={promo.id} className="bg-[#222] rounded-xl p-4 border border-[#333] flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{promo.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {promo.tier_required} {promo.discount_pct && `· ${promo.discount_pct}% OFF`} {promo.code && `· ${promo.code}`}
                    </p>
                  </div>
                  <button onClick={() => togglePromo(promo.id, promo.is_active)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${promo.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {promo.is_active ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
