import React from 'react';
import { useLocation } from 'react-router-dom'
import ChargingStatus from '../components/ChargingStatus'

export default function VipAntelo() {
  const { state } = useLocation()
  const nombre = state?.nombre || 'Propietario'

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111111] p-4">
      <div className="w-full max-w-md bg-[#222222] rounded-2xl p-8 shadow-2xl border border-[#333333] text-center">
        
        <div className="inline-flex items-center gap-2 bg-[#556B2F]/20 text-[#7ca43b] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-[#556B2F]/30 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#7ca43b]"></span>
          Carga Solar Activa (Bonificada)
        </div>

        <div className="relative flex justify-center mb-6">
          <ChargingStatus />
        </div>

        {/* Tarjeta de Membresía VIP */}
        <div className="bg-gradient-to-br from-[#4A0E17] to-[#2d090e] rounded-xl p-6 border border-[#D4AF37]/30 shadow-xl text-left mb-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <h2 className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-1">Comunidad Antelo</h2>
          <h3 className="text-white text-xl font-bold mb-4 tracking-wide">MEMBRESÍA ELEVATE VIP</h3>
          
          <div className="space-y-3 text-sm text-gray-200">
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37]">✦</span> 
              <span><strong>Carga Energética:</strong> 100% bonificada por compromiso sustentable.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D4AF37]">✦</span> 
              <span><strong>Hospitalidad:</strong> Copa de bienvenida y upgrade de cata sin cargo en la recepción.</span>
            </p>
          </div>
        </div>

        <h1 className="text-white text-lg font-bold mb-2 uppercase tracking-wide">
          ¡Bienvenido, {nombre}!
        </h1>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Tu vehículo ya se está abasteciendo con energía limpia generada por los paneles solares de la finca. Presentá esta pantalla en la recepción de la bodega para activar tus beneficios exclusivos de hospitalidad.
        </p>

        <a
          href="https://wa.me/541134610095?text=Hola!%20Soy%20cliente%20VIP%20de%20Antelo%20y%20acabo%20de%20conectar%20mi%20veh%C3%ADculo.%20Quisiera%20confirmar%20mi%20lugar%20en%20el%20restaurante."
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#D4AF37] hover:bg-[#b8942e] transition-colors duration-200 text-[#111111] font-bold py-3 rounded-lg uppercase text-sm tracking-wider shadow-lg"
        >
          Confirmar Espacio en Restaurante 🍷
        </a>

      </div>
    </div>
  );
}