'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Server,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Cable,
  Lock,
  Cloud,
} from 'lucide-react';

export default function DatabaseIntegrationFlow() {
  const [activeStep, setActiveStep] = useState(1);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete' | 'error'>('idle');

  const steps = [
    {
      id: 1,
      title: 'Conexión',
      description: 'Conectar a base de datos externa',
      icon: Cable,
      details: ['Host: crm.empresa.com', 'Puerto: 5432', 'Base de datos: iencinas_prod', 'Protocolo: PostgreSQL 14'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      title: 'Validación',
      description: 'Verificar credenciales y tablas',
      icon: Lock,
      details: ['Usuario: admin_sync', 'Credencial verificada ✓', 'Tablas encontradas: 12', 'Tamaño: 2.4 GB'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      title: 'Mapeo',
      description: 'Mapear tablas a entidades',
      icon: Server,
      details: [
        'proyectos → PROJECTS',
        'transacciones → TRANSACTIONS',
        'ventas → SALES',
        'leads → LEADS',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      title: 'Sincronización',
      description: 'Replica inicial de datos',
      icon: RefreshCw,
      details: ['Registros a replicar: 50,000+', 'Tiempo estimado: 2-5 min', 'Método: Full Sync', 'Compresión: GZIP'],
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      title: 'Activación',
      description: 'Base de datos lista para usar',
      icon: CheckCircle,
      details: ['Estado: Activa', 'Modo: Producción', 'Sincronización: Automática cada hora', 'Próxima: 14:30 hoy'],
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('complete');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 3000);
  };

  return (
    <div className="w-full space-y-12">
      {/* Flujo Principal */}
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold text-white mb-2">Integración de Base de Datos</h2>
          <p className="text-gray-400">
            Proceso paso a paso para conectar y replicar datos de tu base de datos empresarial
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea conectora */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500" />

          <div className="space-y-8 pl-32">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              const isComplete = activeStep > step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveStep(step.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    {/* Icono */}
                    <motion.div
                      className="absolute -left-8 w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-900 bg-gray-800"
                      animate={{
                        background: isComplete ? `linear-gradient(135deg, #22c55e, #10b981)` : isActive ? `linear-gradient(135deg, var(--tw-gradient-stops))` : '#1f2937',
                        boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.6)' : 'none',
                      }}
                    >
                      {isComplete ? (
                        <CheckCircle size={28} className="text-white" />
                      ) : (
                        <StepIcon size={28} className={isActive ? 'text-white' : 'text-gray-400'} />
                      )}
                    </motion.div>

                    {/* Contenido */}
                    <motion.div
                      className="flex-1 rounded-[20px] p-6 transition-all duration-300"
                      animate={{
                        background: isActive
                          ? 'linear-gradient(160deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)'
                          : 'rgba(255,255,255,0.03)',
                        border: isActive ? '2px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white">{step.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                        </div>
                        {isComplete && <CheckCircle size={24} className="text-green-400" />}
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10 space-y-2"
                          >
                            {step.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-2 text-sm text-gray-300"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                {detail}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel de Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[20px] p-8 border border-gray-500/30"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Estado de Sincronización</h3>
            <p className="text-gray-400 text-sm mt-1">Monitor en tiempo real</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg transition-all"
          >
            <RefreshCw size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            {syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BD Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg p-6 border border-green-500/30 bg-green-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database size={24} className="text-green-400" />
              <h4 className="font-bold text-white">BD Productiva</h4>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 crm.empresa.com:5432</p>
              <p>📦 50,234 registros</p>
              <p>⚡ Última sync: 14:15</p>
              <p>⏱️ Próxima: 15:15</p>
            </div>
          </motion.div>

          {/* Replica Local */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg p-6 border border-blue-500/30 bg-blue-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Cloud size={24} className="text-blue-400" />
              <h4 className="font-bold text-white">Replica Local</h4>
              <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 localhost:5433</p>
              <p>📦 50,234 registros</p>
              <p>✓ Sincronizada</p>
              <p>💾 1.2 GB</p>
            </div>
          </motion.div>

          {/* Estado de Sync */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg p-6 border border-purple-500/30 bg-purple-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              {syncStatus === 'syncing' && <Clock size={24} className="text-yellow-400 animate-spin" />}
              {syncStatus === 'complete' && <CheckCircle size={24} className="text-green-400" />}
              {syncStatus === 'idle' && <AlertCircle size={24} className="text-purple-400" />}
              <h4 className="font-bold text-white">
                {syncStatus === 'syncing' && 'Sincronizando...'}
                {syncStatus === 'complete' && 'Completado'}
                {syncStatus === 'idle' && 'Estado: Listo'}
              </h4>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              {syncStatus === 'syncing' && (
                <>
                  <p>⏳ Progreso: 73%</p>
                  <p>📊 12,456 / 17,000 registros</p>
                  <p>⚡ Velocidad: 68 reg/seg</p>
                  <p>⏱️ Tiempo restante: 1:08</p>
                </>
              )}
              {syncStatus === 'complete' && (
                <>
                  <p>✅ Replica completada</p>
                  <p>📦 50,234 registros</p>
                  <p>⚡ Tiempo: 14m 32s</p>
                  <p>🔄 Validación: Exitosa</p>
                </>
              )}
              {syncStatus === 'idle' && (
                <>
                  <p>✓ Bases sincronizadas</p>
                  <p>📦 50,234 registros</p>
                  <p>⚡ Modo: Automático</p>
                  <p>🔄 Intervalo: 60 min</p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {syncStatus === 'syncing' && (
          <motion.div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Progreso de sincronización</p>
              <p className="text-sm text-gray-400">73%</p>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: '73%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Flujo de Datos Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-[20px] p-8 border border-gray-500/30"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-8">Flujo de Datos en Tiempo Real</h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Sistema Original */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 space-y-4"
          >
            <div className="rounded-lg p-6 border border-red-500/30 bg-red-500/10">
              <h4 className="font-bold text-white mb-4">📊 Sistema Original (CRM)</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>✓ PostgreSQL 14</p>
                <p>✓ 50,000+ registros</p>
                <p>✓ 12 tablas principales</p>
                <p>✓ Actualización cada 15 min</p>
                <p>✓ Credenciales: SSL/TLS</p>
              </div>
            </div>
          </motion.div>

          {/* Flechas de sincronización */}
          <motion.div
            className="flex flex-col items-center gap-4"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="hidden md:block text-blue-400" size={32} />
            <div className="md:hidden">
              <motion.div
                className="text-blue-400"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={24} />
              </motion.div>
            </div>
            <div className="px-4 py-2 rounded bg-blue-500/20 border border-blue-500/30">
              <p className="text-xs text-blue-400 font-semibold">REPLICA</p>
              <p className="text-xs text-gray-400 mt-1">Sincronización automática</p>
            </div>
          </motion.div>

          {/* Sistema Iencinas */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 space-y-4"
          >
            <div className="rounded-lg p-6 border border-green-500/30 bg-green-500/10">
              <h4 className="font-bold text-white mb-4">🎯 Iencinas Analytics</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>✓ Reportería avanzada</p>
                <p>✓ 13 proyectos analizados</p>
                <p>✓ 4 módulos de análisis</p>
                <p>✓ Dashboards dinámicos</p>
                <p>✓ Acceso sin latencia</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Beneficios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="rounded-lg p-6 border border-green-500/30 bg-green-500/10">
          <h4 className="font-bold text-green-400 mb-3">✅ Ventajas de Replica</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Datos siempre actualizados</li>
            <li>• Sin impacto en BD productiva</li>
            <li>• Reportería sin latencia</li>
            <li>• Consultas sin throttling</li>
            <li>• Backup automático de datos</li>
          </ul>
        </div>
        <div className="rounded-lg p-6 border border-blue-500/30 bg-blue-500/10">
          <h4 className="font-bold text-blue-400 mb-3">🔒 Seguridad & Privacidad</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Encriptación SSL/TLS</li>
            <li>• Autenticación OAuth 2.0</li>
            <li>• Auditoría de accesos</li>
            <li>• Cumplimiento GDPR</li>
            <li>• Datos aislados localmente</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
