'use client';

import DatabaseIntegrationFlow from '@/components/DatabaseIntegrationFlow';
import { m as motion } from 'framer-motion';
import { Database, CheckCircle, Zap, Shield } from 'lucide-react';

export default function IntegracionBDPage() {
  return (
    <div className="space-y-12 page-enter">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="icon-orb !w-14 !h-14">
            <Database size={26} strokeWidth={1.7} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-ink">Integración de Base de Datos</h1>
            <p className="text-soft text-lg mt-1">
              Conecta tu base de datos empresarial y replica datos en tiempo real
            </p>
          </div>
        </div>
      </motion.div>

      {/* Componente Principal */}
      <DatabaseIntegrationFlow />

      {/* Características Destacadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} strokeWidth={1.8} className="text-brand-deep" />
            <h3 className="text-xl font-bold text-ink">Sincronización Automática</h3>
          </div>
          <p className="text-soft text-sm">
            Los datos se replican automáticamente cada hora sin necesidad de intervención manual.
            Configurable según tus necesidades.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} strokeWidth={1.8} className="text-ok-ink" />
            <h3 className="text-xl font-bold text-ink">Seguridad de Nivel Empresarial</h3>
          </div>
          <p className="text-soft text-sm">
            Encriptación SSL/TLS, OAuth 2.0, auditoría de accesos y cumplimiento GDPR.
            Tus datos están protegidos.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} strokeWidth={1.8} className="text-violet-ink" />
            <h3 className="text-xl font-bold text-ink">Sin Impacto en Producción</h3>
          </div>
          <p className="text-soft text-sm">
            La replica no afecta tu base de datos original. Los reportes se generan
            desde datos locales sin latencia.
          </p>
        </div>
      </motion.div>

      {/* Requisitos Técnicos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-6">Requisitos Técnicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-ink mb-4">Base de Datos Soportada</h3>
            <ul className="space-y-2 text-soft text-sm">
              <li>✓ PostgreSQL 10+</li>
              <li>✓ MySQL 5.7+</li>
              <li>✓ MariaDB 10+</li>
              <li>✓ SQL Server 2016+</li>
              <li>✓ Oracle Database 12c+</li>
              <li>✓ MongoDB 3.6+</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ink mb-4">Conexión Requerida</h3>
            <ul className="space-y-2 text-soft text-sm">
              <li>✓ Host/Puerto accesible</li>
              <li>✓ Credenciales con permisos SELECT</li>
              <li>✓ Conexión SSL/TLS (recomendado)</li>
              <li>✓ Ancho de banda: 1 Mbps+</li>
              <li>✓ Almacenamiento local: 5 GB mín</li>
              <li>✓ Mantención: 30 min/mes</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Timeline de Implementación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-8">Timeline de Implementación</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              time: 'Día 1',
              title: 'Validación',
              description: 'Verificar credenciales y tablas',
              status: 'complete',
            },
            {
              time: 'Día 1-2',
              title: 'Mapeo de Datos',
              description: 'Configurar esquema de replica',
              status: 'complete',
            },
            {
              time: 'Día 2-3',
              title: 'Sync Inicial',
              description: 'Replica de todos los datos',
              status: 'active',
            },
            {
              time: 'Día 3+',
              title: 'Producción',
              description: 'Reportería en vivo y sincronización automática',
              status: 'pending',
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-6 border transition-all ${
                step.status === 'complete'
                  ? 'border-ok/40 bg-[rgba(152,211,186,0.30)]'
                  : step.status === 'active'
                    ? 'border-brand/40 bg-[rgba(156,196,232,0.30)]'
                    : 'border-line/30 bg-[rgba(147,176,203,0.16)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {step.status === 'complete' && <CheckCircle size={18} className="text-ok-ink" />}
                {step.status === 'active' && <Zap size={18} className="text-brand-deep animate-pulse" />}
                {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-line/60" />}
                <p className="text-sm font-semibold text-soft">{step.time}</p>
              </div>
              <h4 className="font-bold text-ink mb-1">{step.title}</h4>
              <p className="text-sm text-soft">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-4">¿Listo para conectar tu BD?</h2>
        <p className="text-soft mb-6">
          El proceso es simple y seguro. Nuestro asistente de integración te guiará paso a paso
          para conectar tu base de datos y empezar a generar reportes en minutos.
        </p>
        <button type="button" className="btn btn-primary !px-8">
          Iniciar Integración
        </button>
      </motion.div>
    </div>
  );
}
