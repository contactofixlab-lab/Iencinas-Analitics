'use client';

import { motion } from 'framer-motion';
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
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
          <Database size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Modelo de Base de Datos</h2>
          <p className="text-gray-400 text-sm">Estructura relacional de Iencinas Analytics</p>
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
          className="lg:col-span-1 rounded-[20px] p-6 border-2 border-green-500/50 bg-green-500/10"
          style={{
            background: 'linear-gradient(160deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-green-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Proyectos</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-green-400 font-semibold">🔑 id</div>
            <div className="text-gray-300">nombre</div>
            <div className="text-gray-300">ubicacion</div>
            <div className="text-gray-300">estado</div>
            <div className="text-gray-300">fechaInicio</div>
            <div className="text-gray-300">fechaFin?</div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-500/30">
            <p className="text-gray-400 text-xs">13 registros</p>
          </div>
        </motion.div>

        {/* RELACIONES */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col justify-center items-center">
          <div className="space-y-8 w-full">
            <div className="flex items-center gap-2">
              <div className="w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
              <Link2 size={16} className="text-blue-400 flex-shrink-0" />
            </div>
            <div className="text-center text-xs text-gray-400">
              <p>1:N</p>
              <p className="text-gray-500 mt-1">One to Many</p>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-blue-400 flex-shrink-0" />
              <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-orange-500"></div>
            </div>
          </div>
        </motion.div>

        {/* TABLA: TRANSACCIONES */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 rounded-[20px] p-6 border-2 border-blue-500/50 bg-blue-500/10"
          style={{
            background: 'linear-gradient(160deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-blue-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Transacciones</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-blue-400 font-semibold">🔑 id</div>
            <div className="text-blue-400 font-semibold">🔗 proyectoId</div>
            <div className="text-gray-300">concepto</div>
            <div className="text-gray-300">tipo (Ingreso/Egreso)</div>
            <div className="text-gray-300">monto</div>
            <div className="text-gray-300">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-500/30">
            <p className="text-gray-400 text-xs">60+ registros</p>
          </div>
        </motion.div>

        {/* RELACIONES */}
        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col justify-center items-center">
          <div className="space-y-8 w-full">
            <div className="flex items-center gap-2">
              <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-purple-500"></div>
              <Link2 size={16} className="text-purple-400 flex-shrink-0" />
            </div>
            <div className="text-center text-xs text-gray-400">
              <p>1:N</p>
              <p className="text-gray-500 mt-1">One to Many</p>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-purple-400 flex-shrink-0" />
              <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
          </div>
        </motion.div>

        {/* TABLA: VENTAS */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 rounded-[20px] p-6 border-2 border-orange-500/50 bg-orange-500/10"
          style={{
            background: 'linear-gradient(160deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-orange-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Ventas</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-orange-400 font-semibold">🔑 id</div>
            <div className="text-orange-400 font-semibold">🔗 proyectoId</div>
            <div className="text-gray-300">propiedad</div>
            <div className="text-gray-300">etapa</div>
            <div className="text-gray-300">valor</div>
            <div className="text-gray-300">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-500/30">
            <p className="text-gray-400 text-xs">50+ registros</p>
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
          className="lg:col-span-2 rounded-[20px] p-6 border-2 border-purple-500/50 bg-purple-500/10"
          style={{
            background: 'linear-gradient(160deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-purple-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Leads</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-purple-400 font-semibold">🔑 id</div>
            <div className="text-purple-400 font-semibold">🔗 proyectoId</div>
            <div className="text-gray-300">nombre, email, telefono</div>
            <div className="text-gray-300">canal (Web, Email, Evento, etc)</div>
            <div className="text-gray-300">costo, estado</div>
            <div className="text-gray-300">fecha</div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/30">
            <p className="text-gray-400 text-xs">55+ registros</p>
          </div>
        </motion.div>

        {/* TABLA: VALUACIONES */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-[20px] p-6 border-2 border-amber-500/50 bg-amber-500/10"
          style={{
            background: 'linear-gradient(160deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-amber-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Valuaciones</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-amber-400 font-semibold">🔑 id</div>
            <div className="text-amber-400 font-semibold">🔗 proyectoId</div>
            <div className="text-gray-300">anio, valor, crecimiento</div>
            <div className="text-gray-300">fecha, metodologia</div>
            <div className="text-gray-300">DCF, Comparables</div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-500/30">
            <p className="text-gray-400 text-xs">55+ registros</p>
          </div>
        </motion.div>

        {/* Leyenda */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 rounded-[20px] p-6 border border-gray-500/30 bg-gray-900/50"
        >
          <h4 className="font-bold text-white text-sm mb-4">Leyenda</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-yellow-400" />
              <span className="text-gray-300">Primary Key</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={14} className="text-blue-400" />
              <span className="text-gray-300">Foreign Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">1:N Relation</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-500/20">
              <p className="text-gray-500 text-xs">Total: 275+ registros</p>
              <p className="text-gray-500 text-xs">5 entidades</p>
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
          className="rounded-[20px] p-6 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h4 className="font-bold text-white mb-2 text-sm">Integridad Referencial</h4>
          <p className="text-gray-400 text-xs">
            Todas las tablas relacionales mantienen FK a proyectos. Garantiza consistencia de datos.
          </p>
        </div>
        <div
          className="rounded-[20px] p-6 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h4 className="font-bold text-white mb-2 text-sm">Escalabilidad</h4>
          <p className="text-gray-400 text-xs">
            Estructura permite crecimiento sin límite. 13 proyectos, 275+ registros de prueba.
          </p>
        </div>
        <div
          className="rounded-[20px] p-6 border border-gray-500/30"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <h4 className="font-bold text-white mb-2 text-sm">Flexibilidad</h4>
          <p className="text-gray-400 text-xs">
            Fácil de adaptar a múltiples proyectos inmobiliarios con diferentes características.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
