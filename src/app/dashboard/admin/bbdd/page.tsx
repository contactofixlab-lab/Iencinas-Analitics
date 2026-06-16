'use client';

import { Database, Plus, Zap, Settings } from 'lucide-react';
import { useState } from 'react';

export default function BBDDPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const handleAddDatabase = async () => {
    setIsConnecting(true);
    // Simulación de conexión
    setTimeout(() => {
      setIsConnecting(false);
      // setConnected(true); // Descomenta cuando el CRM esté listo
    }, 2000);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Database size={36} className="text-blue-400" />
          Modelador de Base de Datos
        </h1>
        <p className="text-gray-400 text-sm mt-1">Replica automática desde CRM de ventas — Gestiona esquema y relaciones</p>
      </div>

      {/* Main Canvas - Power BI Style */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        minHeight: '500px',
      }}>
        {!connected ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            {/* Empty State */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
            }}>
              <Database size={40} className="text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Base de Datos No Conectada</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Conecta la réplica de tu base de datos del CRM para visualizar el diagrama relacional completo en tiempo real
            </p>

            {/* Button */}
            <button
              onClick={handleAddDatabase}
              disabled={isConnecting}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Plus size={20} />
              {isConnecting ? 'Conectando...' : 'Agregar Base de Datos'}
            </button>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-2xl">
              <div className="p-4 rounded-xl" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}>
                <Zap size={20} className="text-green-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Sincronización Automática</p>
              </div>
              <div className="p-4 rounded-xl" style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}>
                <Settings size={20} className="text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Configuración Simple</p>
              </div>
              <div className="p-4 rounded-xl" style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}>
                <Database size={20} className="text-orange-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Todas las Relaciones</p>
              </div>
            </div>
          </div>
        ) : (
          // Connected State (para cuando esté lista)
          <div className="p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.5)',
              }}>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-green-300 text-sm font-medium">Conectado</span>
              </div>
            </div>
            <p className="text-gray-400 text-center">El diagrama de la base de datos se cargará aquí</p>
          </div>
        )}
      </div>

      {/* Reference Section */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
        <button
          onClick={() => setShowReference(!showReference)}
          className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
        >
          <h3 className="text-lg font-semibold text-white">Referencia de Esquema</h3>
          <div className={`transition-transform ${showReference ? 'rotate-180' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        {showReference && (
          <>
            <div className="border-t border-white/10"></div>

            {/* Entity Reference */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-white mb-4">Entidades Planeadas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Proyectos', icon: '🏢', desc: 'Inmuebles/desarrollos' },
                  { name: 'Propiedades', icon: '🏠', desc: 'Unidades en venta' },
                  { name: 'Clientes', icon: '👥', desc: 'Compradores' },
                  { name: 'Transacciones', icon: '💰', desc: 'Ventas/arriendos' },
                  { name: 'Usuarios', icon: '👤', desc: 'Staff/vendedores' },
                  { name: 'Leads', icon: '📞', desc: 'Prospectos' },
                  { name: 'Movimientos', icon: '📊', desc: 'Ingresos/gastos' },
                  { name: 'Reportes', icon: '📄', desc: 'Documentación' },
                ].map((entity) => (
                  <div key={entity.name} className="p-4 rounded-lg" style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}>
                    <div className="text-2xl mb-2">{entity.icon}</div>
                    <p className="font-medium text-white text-sm">{entity.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{entity.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10"></div>

            {/* Connection Info */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-white mb-4">Próximos Pasos</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">1</div>
                  <div>
                    <p className="text-sm font-medium text-white">Conexión al CRM</p>
                    <p className="text-xs text-gray-400">Configura las credenciales del CRM de ventas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">2</div>
                  <div>
                    <p className="text-sm font-medium text-white">Sincronización Automática</p>
                    <p className="text-xs text-gray-400">Los datos se replican en tiempo real</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">3</div>
                  <div>
                    <p className="text-sm font-medium text-white">Visualización del Diagrama</p>
                    <p className="text-xs text-gray-400">Todas las relaciones y campos se muestran aquí</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
