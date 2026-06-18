'use client';

import DatabaseIntegrationFlow from '@/components/DatabaseIntegrationFlow';
import { motion } from 'framer-motion';
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
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
            <Database size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Integración de Base de Datos</h1>
            <p className="text-gray-400 text-lg mt-1">
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
        <div className="rounded-[20px] p-8 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} className="text-blue-400" />
            <h3 className="text-xl font-bold text-white">Sincronización Automática</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Los datos se replican automáticamente cada hora sin necesidad de intervención manual.
            Configurable según tus necesidades.
          </p>
        </div>

        <div className="rounded-[20px] p-8 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-green-400" />
            <h3 className="text-xl font-bold text-white">Seguridad de Nivel Empresarial</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Encriptación SSL/TLS, OAuth 2.0, auditoría de accesos y cumplimiento GDPR.
            Tus datos están protegidos.
          </p>
        </div>

        <div className="rounded-[20px] p-8 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-purple-400" />
            <h3 className="text-xl font-bold text-white">Sin Impacto en Producción</h3>
          </div>
          <p className="text-gray-400 text-sm">
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
        className="rounded-[20px] p-8 border border-gray-500/30"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Requisitos Técnicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">📋 Base de Datos Soportada</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ PostgreSQL 10+</li>
              <li>✓ MySQL 5.7+</li>
              <li>✓ MariaDB 10+</li>
              <li>✓ SQL Server 2016+</li>
              <li>✓ Oracle Database 12c+</li>
              <li>✓ MongoDB 3.6+</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🔧 Conexión Requerida</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
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
        className="rounded-[20px] p-8 border border-gray-500/30"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-8">Timeline de Implementación</h2>
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
                  ? 'border-green-500/30 bg-green-500/10'
                  : step.status === 'active'
                    ? 'border-blue-500/30 bg-blue-500/10'
                    : 'border-gray-500/20 bg-gray-500/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {step.status === 'complete' && <CheckCircle size={18} className="text-green-400" />}
                {step.status === 'active' && <Zap size={18} className="text-blue-400 animate-pulse" />}
                {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
                <p className="text-sm font-semibold text-gray-400">{step.time}</p>
              </div>
              <h4 className="font-bold text-white mb-1">{step.title}</h4>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="rounded-[20px] p-8 border border-green-500/30"
        style={{
          background: 'linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">¿Listo para conectar tu BD?</h2>
        <p className="text-gray-300 mb-6">
          El proceso es simple y seguro. Nuestro asistente de integración te guiará paso a paso
          para conectar tu base de datos y empezar a generar reportes en minutos.
        </p>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all">
          Iniciar Integración
        </button>
      </motion.div>
    </div>
  );
}
