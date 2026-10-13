'use client';

import { m as motion } from 'framer-motion';
import { Database, Link2, Key } from 'lucide-react';

export default function DatabaseDiagram() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full space-y-8">
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#9CC4E8] to-[#6FA0D2]">
          <Database size={24} className="text-ink" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-ink">Modelo de Base de Datos</h2>
          <p className="text-soft text-sm">Estructura relacional de Iencinas Analytics</p>
        </div>
      </motion.div>

      {/* Diagrama ER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* TABLA: PROYECTOS */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 glass-card glass-card--compact bg-[rgba(152,211,186,0.30)]"
          style={{
            background: 'linear-gradient(160deg, rgba(143,185,224,0.13) 0%, rgba(143,185,224,0.08) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-ok-ink" />
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Proyectos</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-ok-ink font-semibold">PK id</div>
            <div className="text-soft">nombre</div>
            <div className="text-soft">ubicacion</div>
            <div className="text-soft">estado</div>
            <div className="text-soft">fechaInicio</div>
            <div className="text-soft">fechaFin?</div>
          </div>
          <div className="mt-4 pt-4 border-t border-ok/40">
            <p className="text-soft text-xs">13 registros</p>
          </div>
        </motion.div>

        {/* RELACIONES */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col justify-center items-center">
          <div className="space-y-8 w-full">
            <div className="flex items-center gap-2">
              <div className="w-full h-1 bg-gradient-to-r from-[#98D3BA] to-[#6DB899]"></div>
              <Link2 size={16} className="text-brand-deep flex-shrink-0" />
            </div>
            <div className="text-center text-xs text-soft">
              <p>1:N</p>
              <p className="text-mute mt-1">One to Many</p>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-brand-deep flex-shrink-0" />
              <div className="w-full h-1 bg-gradient-to-r from-[#9CC4E8] to-[#6FA0D2]"></div>
            </div>
          </div>
        </motion.div>

        {/* TABLA: TRANSACCIONES */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 glass-card glass-card--compact bg-[rgba(156,196,232,0.30)]"
          style={{
            background: 'linear-gradient(160deg, rgba(120,168,215,0.13) 0%, rgba(120,168,215,0.08) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-brand-deep" />
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Transacciones</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-brand-deep font-semibold">PK id</div>
            <div className="text-brand-deep font-semibold">FK proyectoId</div>
            <div className="text-soft">concepto</div>
            <div className="text-soft">tipo (Ingreso/Egreso)</div>
            <div className="text-soft">monto</div>
            <div className="text-soft">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand/40">
            <p className="text-soft text-xs">60+ registros</p>
          </div>
        </motion.div>

        {/* RELACIONES */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col justify-center items-center">
          <div className="space-y-8 w-full">
            <div className="flex items-center gap-2">
              <div className="w-full h-1 bg-gradient-to-r from-[#F5C9A3] to-[#E4A67C]"></div>
              <Link2 size={16} className="text-violet-ink flex-shrink-0" />
            </div>
            <div className="text-center text-xs text-soft">
              <p>1:N</p>
              <p className="text-mute mt-1">One to Many</p>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-violet-ink flex-shrink-0" />
              <div className="w-full h-1 bg-gradient-to-r from-[#C3B3EA] to-[#9D89D8]"></div>
            </div>
          </div>
        </motion.div>

        {/* TABLA: VENTAS */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 glass-card glass-card--compact bg-[rgba(245,201,163,0.32)]"
          style={{
            background: 'linear-gradient(160deg, rgba(214,150,80,0.13) 0%, rgba(214,150,80,0.08) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-warn-ink" />
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Ventas</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-warn-ink font-semibold">PK id</div>
            <div className="text-warn-ink font-semibold">FK proyectoId</div>
            <div className="text-soft">propiedad</div>
            <div className="text-soft">etapa</div>
            <div className="text-soft">valor</div>
            <div className="text-soft">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-warn/40">
            <p className="text-soft text-xs">50+ registros</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Segunda fila de tablas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* TABLA: LEADS */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 glass-card glass-card--compact bg-[rgba(195,179,234,0.28)]"
          style={{
            background: 'linear-gradient(160deg, rgba(150,128,214,0.13) 0%, rgba(150,128,214,0.08) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-violet-ink" />
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Leads</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-violet-ink font-semibold">PK id</div>
            <div className="text-violet-ink font-semibold">FK proyectoId</div>
            <div className="text-soft">nombre, email, telefono</div>
            <div className="text-soft">canal (Web, Email, Evento, etc)</div>
            <div className="text-soft">costo, estado</div>
            <div className="text-soft">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-violet/40">
            <p className="text-soft text-xs">55+ registros</p>
          </div>
        </motion.div>

        {/* TABLA: VALUACIONES */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 glass-card glass-card--compact bg-[rgba(245,201,163,0.32)]"
          style={{
            background: 'linear-gradient(160deg, rgba(214,150,80,0.13) 0%, rgba(214,150,80,0.08) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-warn-ink" />
            <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Valuaciones</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-warn-ink font-semibold">PK id</div>
            <div className="text-warn-ink font-semibold">FK proyectoId</div>
            <div className="text-soft">anio, valor, crecimiento</div>
            <div className="text-soft">fecha, metodologia</div>
            <div className="text-soft">DCF, Comparables</div>
          </div>
          <div className="mt-4 pt-4 border-t border-warn/40">
            <p className="text-soft text-xs">55+ registros</p>
          </div>
        </motion.div>

        {/* Leyenda */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 glass-card glass-card--compact"
        >
          <h4 className="font-bold text-ink text-sm mb-4">Leyenda</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-warn-ink" />
              <span className="text-soft">Primary Key</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={14} className="text-brand-deep" />
              <span className="text-soft">Foreign Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ok"></div>
              <span className="text-soft">1:N Relation</span>
            </div>
            <div className="mt-4 pt-4 border-t border-line/30">
              <p className="text-mute text-xs">Total: 275+ registros</p>
              <p className="text-mute text-xs">5 entidades</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Características */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          className="glass-card glass-card--compact"
          style={{
            background: 'linear-gradient(160deg, rgb(255 255 255 / 0.38) 0%, rgb(255 255 255 / 0.46) 100%)',
          }}
        >
          <h4 className="font-bold text-ink mb-2 text-sm">Integridad Referencial</h4>
          <p className="text-soft text-xs">
            Todas las tablas relacionales mantienen FK a proyectos. Garantiza consistencia de datos.
          </p>
        </div>
        <div
          className="glass-card glass-card--compact"
          style={{
            background: 'linear-gradient(160deg, rgb(255 255 255 / 0.38) 0%, rgb(255 255 255 / 0.46) 100%)',
          }}
        >
          <h4 className="font-bold text-ink mb-2 text-sm">Escalabilidad</h4>
          <p className="text-soft text-xs">
            Estructura permite crecimiento sin límite. 13 proyectos, 275+ registros de prueba.
          </p>
        </div>
        <div
          className="glass-card glass-card--compact"
          style={{
            background: 'linear-gradient(160deg, rgb(255 255 255 / 0.38) 0%, rgb(255 255 255 / 0.46) 100%)',
          }}
        >
          <h4 className="font-bold text-ink mb-2 text-sm">Flexibilidad</h4>
          <p className="text-soft text-xs">
            Fácil de adaptar a múltiples proyectos inmobiliarios con diferentes características.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
