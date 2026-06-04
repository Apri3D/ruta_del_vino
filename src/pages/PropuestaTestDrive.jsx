import React from 'react';
import { useLocation } from 'react-router-dom'
import ChargingStatus from '../components/ChargingStatus'

export default function PropuestaTestDrive() {
  const { state } = useLocation()
  const nombre = state?.nombre || 'Usuario'
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111111] p-4">
      <div className="w-full max-w-md bg-[#222222] rounded-2xl p-8 shadow-2xl border border-[#333333]">
        
        <div className="flex items-center gap-2 bg-[#2d2d2d] text-gray-400 px-4 py-1.5 rounded-full text-xs font-medium w-fit mb-6 border border-[#3d3d3d]">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Abasteciendo vehículo vía Red Solar
        </div>

        <div className="relative flex justify-center mb-6">
          <ChargingStatus />
        </div>

        <h1 className="text-white text-xl font-bold mb-2 uppercase tracking-wide">
          Carga Iniciada Con Éxito
        </h1>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Mientras tu vehículo se abastece de energía limpia, el Grupo Antelo te invita a descubrir una nueva forma de conectar con tus viajes.
        </p>

        {/* Banner o Card Publicitaria del Vehículo Insignia */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl overflow-hidden mb-6 shadow-md">
          {/* Aquí simularías la imagen de alta calidad del Changan recorriendo el viñedo */}
          <div className="h-40 bg-gradient-to-r from-gray-800 to-gray-700 flex flex-col justify-end p-4 relative">
            <div className="absolute inset-0 bg-black/40"></div>
            <span className="relative z-10 bg-[#4A0E17] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest w-fit mb-1">
              Híbrido Enchufable
            </span>
            <h3 className="relative z-10 text-white font-bold text-lg leading-tight">Changan C55 Plus iDD</h3>
          </div>
          
          <div className="p-4 text-sm text-gray-400 space-y-2 leading-relaxed">
            <p>Descubrí el SUV premium con autonomía extendida diseñado para romper los límites de la distancia.</p>
            <div className="bg-[#556B2F]/10 border border-[#556B2F]/20 rounded p-2 text-[#7ca43b] text-xs font-semibold">
              🎁 Beneficio hoy: Accedé a un 10% de descuento de cortesía en el restaurante de la bodega por registrar tu Test Drive.
            </div>
          </div>
        </div>

        {/* Botón de conversión comercial */}
        <a
          href="https://wa.me/541134610095?text=Hola!%20Me%20encuentro%20en%20la%20estaci%C3%B3n%20de%20carga%20solar%20en%20Mendoza.%20Me%20interesa%20agendar%20un%20Test%20Drive%20del%20Changan%20C55%20Plus%20iDD%20y%20obtener%20mi%20descuento%20del%20restaurante."
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#4A0E17] hover:bg-[#5c121d] text-center transition-colors duration-200 text-white font-semibold py-3 rounded-lg uppercase text-sm tracking-wider shadow-lg"
        >
          Agendar Test Drive + Obtener Beneficio ⚡
        </a>

      </div>
    </div>
  );
}