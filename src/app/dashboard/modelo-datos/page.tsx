'use client';

import DatabaseDiagram from '@/components/DatabaseDiagram';
import { m as motion } from 'framer-motion';

export default function ModeloDatosPage() {
  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-ink">Arquitectura de Datos</h1>
        <p className="text-soft text-lg mt-2">
          Estructura relacional y modelo de base de datos de Iencinas Analytics
        </p>
      </motion.div>

      {/* Introducción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-4">Descripción General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-soft text-sm leading-relaxed">
              <strong>Iencinas Analytics</strong> utiliza una arquitectura de base de datos relacional
              normalizada (3NF) diseñada para máxima integridad de datos y escalabilidad. Cada proyecto
              inmobiliario es la entidad central que se relaciona con múltiples entidades de negocio.
            </p>
          </div>
          <div>
            <p className="text-soft text-sm leading-relaxed">
              <strong>13 Proyectos</strong> simulados representan diferentes tipos de desarrollos:
              residenciales, comerciales y mixtos. Cada uno contiene datos reales de operaciones
              inmobiliarias (transacciones, ventas, marketing, valuaciones).
            </p>
          </div>
          <div>
            <p className="text-soft text-sm leading-relaxed">
              <strong>275+ Registros</strong> de prueba generan reportes realistas que demuestran
              cómo la aplicación se comporta con datos masivos. Los gráficos se adaptan dinámicamente
              a la distribución de datos.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Diagrama ER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DatabaseDiagram />
      </motion.div>

      {/* Especificaciones Técnicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-6">Especificaciones Técnicas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entidades */}
          <div>
            <h3 className="text-lg font-semibold text-ink mb-4">Entidades</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[rgba(152,211,186,0.30)] border border-ok/40 rounded-lg">
                <p className="text-ok-ink font-semibold text-sm">Proyectos</p>
                <p className="text-soft text-xs mt-1">13 registros. Entidad central con PK:id, atributos: nombre, ubicacion, estado, fechaInicio, fechaFin</p>
              </div>
              <div className="p-3 bg-[rgba(156,196,232,0.30)] border border-brand/40 rounded-lg">
                <p className="text-brand-deep font-semibold text-sm">Transacciones</p>
                <p className="text-soft text-xs mt-1">60+ registros. FK:proyectoId, concepto, tipo (Ingreso/Egreso), monto, fecha, categoria</p>
              </div>
              <div className="p-3 bg-[rgba(245,201,163,0.32)] border border-warn/40 rounded-lg">
                <p className="text-warn-ink font-semibold text-sm">Ventas</p>
                <p className="text-soft text-xs mt-1">50+ registros. FK:proyectoId, propiedad, etapa, cantidad, valor, fecha, clienteNombre, comision</p>
              </div>
              <div className="p-3 bg-[rgba(195,179,234,0.28)] border border-violet/40 rounded-lg">
                <p className="text-violet-ink font-semibold text-sm">Leads</p>
                <p className="text-soft text-xs mt-1">55+ registros. FK:proyectoId, nombre, email, telefono, canal, costo, estado, fecha</p>
              </div>
              <div className="p-3 bg-[rgba(245,201,163,0.32)] border border-warn/40 rounded-lg">
                <p className="text-warn-ink font-semibold text-sm">Valuaciones</p>
                <p className="text-soft text-xs mt-1">55+ registros. FK:proyectoId, anio, valor, crecimiento, fecha, metodologia (DCF/Comparables)</p>
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold text-ink mb-4">Características</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[rgba(156,196,232,0.22)] border border-brand/40 rounded-lg">
                <p className="text-brand-deep font-semibold text-sm">✓ Relaciones 1:N</p>
                <p className="text-soft text-xs mt-1">Cada proyecto se relaciona con múltiples transacciones, ventas, leads y valuaciones</p>
              </div>
              <div className="p-3 bg-[rgba(156,196,232,0.22)] border border-violet/40 rounded-lg">
                <p className="text-violet-ink font-semibold text-sm">✓ Integridad Referencial</p>
                <p className="text-soft text-xs mt-1">Foreign Keys mantienen consistencia. Imposible registros huérfanos</p>
              </div>
              <div className="p-3 bg-[rgba(156,196,232,0.22)] border border-ok/40 rounded-lg">
                <p className="text-ok-ink font-semibold text-sm">✓ Normalización 3NF</p>
                <p className="text-soft text-xs mt-1">Eliminada redundancia. Datos atómicos en cada atributo</p>
              </div>
              <div className="p-3 bg-[rgba(156,196,232,0.22)] border border-warn/40 rounded-lg">
                <p className="text-warn-ink font-semibold text-sm">✓ Datos Realistas</p>
                <p className="text-soft text-xs mt-1">275+ registros con montos en CLP, fechas reales, clientes chilenos</p>
              </div>
              <div className="p-3 bg-[rgba(156,196,232,0.22)] border border-danger/40 rounded-lg">
                <p className="text-danger-ink font-semibold text-sm">✓ Escalable</p>
                <p className="text-soft text-xs mt-1">Fácil agregar proyectos, entidades y atributos sin rediseño</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Casos de Uso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-6">Casos de Uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-[rgba(156,196,232,0.22)] border border-brand/30">
            <h4 className="text-brand-deep font-semibold mb-2">Análisis Financiero</h4>
            <p className="text-soft text-sm">
              Reportes de transacciones por proyecto, análisis de ingresos vs egresos,
              tendencias mensuales de flujo de caja.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[rgba(156,196,232,0.22)] border border-warn/30">
            <h4 className="text-warn-ink font-semibold mb-2">Pipeline de Ventas</h4>
            <p className="text-soft text-sm">
              Seguimiento de estado de ventas (Prospección → Cerrada), análisis por propiedad,
              comisiones por vendedor y período.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[rgba(156,196,232,0.22)] border border-violet/30">
            <h4 className="text-violet-ink font-semibold mb-2">Efectividad de Marketing</h4>
            <p className="text-soft text-sm">
              Costo de adquisición por canal, tasa de conversión de leads, ROI por campaña,
              análisis de fuentes de leads.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[rgba(156,196,232,0.22)] border border-warn/30">
            <h4 className="text-warn-ink font-semibold mb-2">Valuación Empresarial</h4>
            <p className="text-soft text-sm">
              Histórico de valuación por proyecto, proyecciones de crecimiento, análisis de
              metodologías (DCF vs Comparables).
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generador de Reportes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card" style={{ padding: 'calc(var(--pad-card) + 8px)' }}
      >
        <h2 className="text-2xl font-bold text-ink mb-4">Generador de Reportes Avanzado</h2>
        <p className="text-soft text-sm mb-6">
          La aplicación incluye un constructor visual de reportes que permite seleccionar
          atributos de múltiples entidades y generar análisis personalizados.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 modal-overlay rounded-lg border border-ok/30">
            <p className="text-ok-ink font-semibold text-sm mb-2">Finanzas</p>
            <p className="text-soft text-xs">/dashboard/finanzas/reportes</p>
          </div>
          <div className="p-4 modal-overlay rounded-lg border border-warn/30">
            <p className="text-warn-ink font-semibold text-sm mb-2">Comercial</p>
            <p className="text-soft text-xs">/dashboard/comercial/reportes</p>
          </div>
          <div className="p-4 modal-overlay rounded-lg border border-violet/30">
            <p className="text-violet-ink font-semibold text-sm mb-2">Marketing</p>
            <p className="text-soft text-xs">/dashboard/marketing/reportes</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
