'use client';

import { Database, Plus, Zap, Settings, Building2, Home, Users, Wallet, User, PhoneCall, ArrowLeftRight, FileText, ChevronDown } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
          <Database size={36} className="text-brand-deep" />
          Modelador de Base de Datos
        </h1>
        <p className="text-soft text-sm mt-1">Replica automática desde CRM de ventas — Gestiona esquema y relaciones</p>
      </div>

      {/* Main Canvas - Power BI Style */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgb(255 255 255 / 0.49)',
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(120,168,215,0.26)',
        boxShadow: '0 16px 48px rgb(92 124 158 / 0.23), inset 0 1px 0 rgb(255 255 255 / 0.49)',
        minHeight: '500px',
      }}>
        {!connected ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            {/* Empty State */}
            <div className="icon-orb !w-20 !h-20 mb-6">
              <Database size={38} strokeWidth={1.6} />
            </div>

            <h2 className="text-2xl font-bold text-ink mb-2">Base de Datos No Conectada</h2>
            <p className="text-soft mb-8 max-w-md">
              Conecta la réplica de tu base de datos del CRM para visualizar el diagrama relacional completo en tiempo real
            </p>

            {/* Button */}
            <button type="button" onClick={handleAddDatabase} disabled={isConnecting} className="btn btn-primary !h-12 !px-8">
              <Plus size={19} strokeWidth={1.8} />
              {isConnecting ? 'Conectando...' : 'Agregar Base de Datos'}
            </button>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-2xl">
              <div className="glass-card glass-card--compact glass-card--muted text-center" style={{ padding: '16px' }}>
                <Zap size={20} strokeWidth={1.8} className="text-brand-deep mx-auto mb-2" />
                <p className="text-xs text-soft">Sincronización Automática</p>
              </div>
              <div className="glass-card glass-card--compact glass-card--muted text-center" style={{ padding: '16px' }}>
                <Settings size={20} strokeWidth={1.8} className="text-brand-deep mx-auto mb-2" />
                <p className="text-xs text-soft">Configuración Simple</p>
              </div>
              <div className="glass-card glass-card--compact glass-card--muted text-center" style={{ padding: '16px' }}>
                <Database size={20} strokeWidth={1.8} className="text-brand-deep mx-auto mb-2" />
                <p className="text-xs text-soft">Todas las Relaciones</p>
              </div>
            </div>
          </div>
        ) : (
          // Connected State (para cuando esté lista)
          <div className="p-12">
            <div className="text-center mb-8">
              <div className="chip chip-ok" style={{ fontSize: 13, padding: '6px 14px' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--ok))' }}></div>
                <span>Conectado</span>
              </div>
            </div>
            <p className="text-soft text-center">El diagrama de la base de datos se cargará aquí</p>
          </div>
        )}
      </div>

      {/* Reference Section */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgb(255 255 255 / 0.34)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgb(var(--line) / 0.30)',
      }}>
        <button
          onClick={() => setShowReference(!showReference)}
          type="button" aria-expanded={showReference} className="w-full flex items-center justify-between p-6 hover:bg-brand-soft/60 transition-colors"
        >
          <h3 className="text-lg font-semibold text-ink">Referencia de Esquema</h3>
          <ChevronDown size={20} strokeWidth={1.8} className={`text-soft transition-transform ${showReference ? 'rotate-180' : ''}`} />
        </button>

        {showReference && (
          <>
            <div className="border-t border-line/25"></div>

            {/* Entity Reference */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-ink mb-4">Entidades Planeadas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Proyectos', icon: Building2, desc: 'Inmuebles/desarrollos' },
                  { name: 'Propiedades', icon: Home, desc: 'Unidades en venta' },
                  { name: 'Clientes', icon: Users, desc: 'Compradores' },
                  { name: 'Transacciones', icon: Wallet, desc: 'Ventas/arriendos' },
                  { name: 'Usuarios', icon: User, desc: 'Staff/vendedores' },
                  { name: 'Leads', icon: PhoneCall, desc: 'Prospectos' },
                  { name: 'Movimientos', icon: ArrowLeftRight, desc: 'Ingresos/gastos' },
                  { name: 'Reportes', icon: FileText, desc: 'Documentación' },
                ].map((entity) => (
                  <div key={entity.name} className="glass-card glass-card--compact glass-card--muted" style={{ padding: 16 }}>
                    <div className="icon-orb !w-10 !h-10 mb-3"><entity.icon size={18} strokeWidth={1.8} /></div>
                    <p className="font-medium text-ink text-sm">{entity.name}</p>
                    <p className="text-xs text-soft mt-1">{entity.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-line/25"></div>

            {/* Connection Info */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-ink mb-4">Próximos Pasos</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="icon-orb !w-8 !h-8 text-sm font-bold shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium text-ink">Conexión al CRM</p>
                    <p className="text-xs text-soft">Configura las credenciales del CRM de ventas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="icon-orb !w-8 !h-8 text-sm font-bold shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium text-ink">Sincronización Automática</p>
                    <p className="text-xs text-soft">Los datos se replican en tiempo real</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="icon-orb !w-8 !h-8 text-sm font-bold shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium text-ink">Visualización del Diagrama</p>
                    <p className="text-xs text-soft">Todas las relaciones y campos se muestran aquí</p>
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
