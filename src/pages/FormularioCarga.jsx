import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase';

export default function FormularioCarga() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    vehiculo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insertamos los datos en Supabase
      const { data, error } = await supabase
        .from('leads_mendoza')
        .insert([formData])
        .select();

      if (error) throw error;

      // Evaluamos la categoría que devolvió la base de datos para redirigir
      const leadRegistrado = data[0];
      if (leadRegistrado.categoria === 'VIP ANTELO') {
        navigate('/vip-antelo', { state: { nombre: formData.nombre } });
      } else {
        navigate('/propuesta-testdrive', { state: { nombre: formData.nombre } });
      }

    } catch (error) {
      alert('Error al conectar con la estación de carga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111111] p-4">    
      <div className="w-full max-w-md bg-[#222222] rounded-2xl p-8 shadow-2xl border border-[#333333]">
       
        <h1 className="text-xl font-bold text-white tracking-wide uppercase mb-2">
          Bienvenido a la Red de Carga Solar Premium
        </h1>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Valle de Uco — Nodo Bodega Orgánica Piloto. Abastecé tu vehículo con la energía del sol mendocino mientras disfrutás de la experiencia.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre y Apellido *</label>
            <input
              type="text"
              required
              placeholder="Tu Nombre Completo"
              className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              placeholder="nombre@gmail.com"
              className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp / Celular *</label>
            <div className="flex gap-2">
              <span className="bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-3 py-2.5 text-gray-400 text-sm flex items-center">AR 🇦🇷</span>
              <input
                type="tel"
                required
                placeholder="+54 ..."
                className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#4A0E17]"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">¿Qué vehículo electrificado conducís hoy? *</label>
            <select
              required
              className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4A0E17]"
              value={formData.vehiculo}
              onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
            >
              <option value="" disabled>Seleccioná una marca</option>
              <option value="Changan">Changan</option>
              <option value="Audi">Audi</option>
              <option value="BMW">BMW</option>
              <option value="Volvo">Volvo</option>
              <option value="Toyota">Toyota</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4A0E17] hover:bg-[#5c121d] transition-colors duration-200 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2 mt-6 uppercase text-sm tracking-wider shadow-lg"
          >
            {loading ? 'Procesando...' : 'Iniciar Carga Sustentable ⚡'}
          </button>
        </form>

      </div>
    </div>
  );
}