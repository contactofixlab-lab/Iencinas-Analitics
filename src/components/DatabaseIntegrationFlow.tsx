'use client';

import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
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
      color: 'from-[#9CC4E8] to-[#6FA0D2]',
    },
    {
      id: 2,
      title: 'Validación',
      description: 'Verificar credenciales y tablas',
      icon: Lock,
      details: ['Usuario: admin_sync', 'Credencial verificada ✓', 'Tablas encontradas: 12', 'Tamaño: 2.4 GB'],
      color: 'from-[#C3B3EA] to-[#9D89D8]',
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
      color: 'from-[#98D3BA] to-[#6DB899]',
    },
    {
      id: 4,
      title: 'Sincronización',
      description: 'Replica inicial de datos',
      icon: RefreshCw,
      details: ['Registros a replicar: 50,000+', 'Tiempo estimado: 2-5 min', 'Método: Full Sync', 'Compresión: GZIP'],
      color: 'from-[#F5C9A3] to-[#E4A67C]',
    },
    {
      id: 5,
      title: 'Activación',
      description: 'Base de datos lista para usar',
      icon: CheckCircle,
      details: ['Estado: Activa', 'Modo: Producción', 'Sincronización: Automática cada hora', 'Próxima: 14:30 hoy'],
      color: 'from-[#98D3BA] to-[#6DB899]',
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
          <h2 className="text-3xl font-bold text-ink mb-2">Integración de Base de Datos</h2>
          <p className="text-soft">
            Proceso paso a paso para conectar y replicar datos de tu base de datos empresarial
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea conectora */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-brand via-brand-soft to-brand-hover" />

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
                      className="absolute -left-8 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white/80"
                      animate={{
                        background: isComplete ? 'rgb(143, 185, 224)' : isActive ? 'rgb(118, 167, 213)' : 'rgb(255, 255, 255)',
                        boxShadow: isActive ? '0 0 0 6px rgba(143,185,224,0.28), 0 10px 24px -10px rgba(92,124,158,0.5)' : '0 8px 20px -10px rgba(92,124,158,0.35)',
                      }}
                    >
                      {isComplete ? (
                        <CheckCircle size={28} strokeWidth={1.8} className="text-white" />
                      ) : (
                        <StepIcon size={28} strokeWidth={1.8} className={isActive ? 'text-white' : 'text-soft'} />
                      )}
                    </motion.div>

                    {/* Contenido */}
                    <motion.div
                      className="flex-1 rounded-[20px] p-6 transition-all duration-300 shadow-glass-sm"
                      animate={{
                        background: isActive ? 'rgba(214, 232, 248, 0.85)' : 'rgba(255, 255, 255, 0.62)',
                        border: isActive ? '1px solid rgb(143, 185, 224)' : '1px solid rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                          <p className="text-soft text-sm mt-1">{step.description}</p>
                        </div>
                        {isComplete && <CheckCircle size={24} className="text-ok-ink" />}
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-line/25 space-y-2"
                          >
                            {step.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-2 text-sm text-soft"
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
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-ink">Estado de Sincronización</h3>
            <p className="text-soft text-sm mt-1">Monitor en tiempo real</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="btn btn-primary"
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
            className="glass-card glass-card--compact p-6 bg-[rgba(152,211,186,0.30)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database size={24} className="text-ok-ink" />
              <h4 className="font-bold text-ink">BD Productiva</h4>
              <div className="ml-auto w-2 h-2 rounded-full bg-ok animate-pulse" />
            </div>
            <div className="space-y-2 text-sm text-soft">
              <p>crm.empresa.com:5432</p>
              <p>50,234 registros</p>
              <p>Última sync: 14:15</p>
              <p>⏱Próxima: 15:15</p>
            </div>
          </motion.div>

          {/* Replica Local */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card glass-card--compact p-6 bg-[rgba(156,196,232,0.30)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Cloud size={24} className="text-brand-deep" />
              <h4 className="font-bold text-ink">Replica Local</h4>
              <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <div className="space-y-2 text-sm text-soft">
              <p>localhost:5433</p>
              <p>50,234 registros</p>
              <p>✓ Sincronizada</p>
              <p>1.2 GB</p>
            </div>
          </motion.div>

          {/* Estado de Sync */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card glass-card--compact p-6 bg-[rgba(195,179,234,0.28)]"
          >
            <div className="flex items-center gap-3 mb-4">
              {syncStatus === 'syncing' && <Clock size={24} className="text-warn-ink animate-spin" />}
              {syncStatus === 'complete' && <CheckCircle size={24} className="text-ok-ink" />}
              {syncStatus === 'idle' && <AlertCircle size={24} className="text-violet-ink" />}
              <h4 className="font-bold text-ink">
                {syncStatus === 'syncing' && 'Sincronizando...'}
                {syncStatus === 'complete' && 'Completado'}
                {syncStatus === 'idle' && 'Estado: Listo'}
              </h4>
            </div>
            <div className="space-y-2 text-sm text-soft">
              {syncStatus === 'syncing' && (
                <>
                  <p>⏳ Progreso: 73%</p>
                  <p>12,456 / 17,000 registros</p>
                  <p>Velocidad: 68 reg/seg</p>
                  <p>⏱Tiempo restante: 1:08</p>
                </>
              )}
              {syncStatus === 'complete' && (
                <>
                  <p>✓ Replica completada</p>
                  <p>50,234 registros</p>
                  <p>Tiempo: 14m 32s</p>
                  <p>Validación: Exitosa</p>
                </>
              )}
              {syncStatus === 'idle' && (
                <>
                  <p>✓ Bases sincronizadas</p>
                  <p>50,234 registros</p>
                  <p>Modo: Automático</p>
                  <p>Intervalo: 60 min</p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {syncStatus === 'syncing' && (
          <motion.div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-soft">Progreso de sincronización</p>
              <p className="text-sm text-soft">73%</p>
            </div>
            <div className="h-2 bg-line/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand to-brand-hover"
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
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h3 className="text-2xl font-bold text-ink mb-8">Flujo de Datos en Tiempo Real</h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Sistema Original */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 space-y-4"
          >
            <div className="glass-card glass-card--compact p-6 bg-[rgba(156,196,232,0.30)]">
              <h4 className="font-bold text-ink mb-4">Sistema Original (CRM)</h4>
              <div className="space-y-2 text-sm text-soft">
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
            <ArrowRight className="hidden md:block text-brand-deep" size={32} />
            <div className="md:hidden">
              <motion.div
                className="text-brand-deep"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight size={24} />
              </motion.div>
            </div>
            <div className="chip chip-info !rounded-xl">
              <p className="text-xs text-brand-deep font-semibold">REPLICA</p>
              <p className="text-xs text-soft mt-1">Sincronización automática</p>
            </div>
          </motion.div>

          {/* Sistema Iencinas */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 space-y-4"
          >
            <div className="glass-card glass-card--compact p-6 bg-[rgba(152,211,186,0.30)]">
              <h4 className="font-bold text-ink mb-4">Iencinas Analytics</h4>
              <div className="space-y-2 text-sm text-soft">
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
        <div className="glass-card glass-card--compact p-6 bg-[rgba(152,211,186,0.30)]">
          <h4 className="font-bold text-ok-ink mb-3">✓ Ventajas de Replica</h4>
          <ul className="space-y-2 text-sm text-soft">
            <li>• Datos siempre actualizados</li>
            <li>• Sin impacto en BD productiva</li>
            <li>• Reportería sin latencia</li>
            <li>• Consultas sin throttling</li>
            <li>• Backup automático de datos</li>
          </ul>
        </div>
        <div className="glass-card glass-card--compact p-6 bg-[rgba(156,196,232,0.30)]">
          <h4 className="font-bold text-brand-deep mb-3">Seguridad & Privacidad</h4>
          <ul className="space-y-2 text-sm text-soft">
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
