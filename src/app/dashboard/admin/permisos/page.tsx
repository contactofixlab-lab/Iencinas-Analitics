'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shield, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { getUsers } from '@/lib/auth';
import { User } from '@/types';

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulos: string[];
  isPredeterminado: boolean;
}

const PERMISOS_INICIALES: Permiso[] = [
  { id: '1', nombre: 'Finanzas Completo', descripcion: 'Acceso total al módulo de finanzas y reportes', modulos: ['finanzas', 'reportes'], isPredeterminado: true },
  { id: '2', nombre: 'Comercial Completo', descripcion: 'Acceso total al módulo comercial y reportes', modulos: ['comercial', 'reportes'], isPredeterminado: true },
  { id: '3', nombre: 'Marketing Completo', descripcion: 'Acceso total al módulo de marketing y reportes', modulos: ['marketing', 'reportes'], isPredeterminado: true },
  { id: '4', nombre: 'Valor Empresa Completo', descripcion: 'Acceso total al módulo de valor empresa', modulos: ['valor-empresa', 'reportes'], isPredeterminado: true },
  { id: '5', nombre: 'Administrador Total', descripcion: 'Acceso a todos los módulos y funciones', modulos: ['finanzas', 'comercial', 'marketing', 'valor-empresa', 'admin', 'reportes'], isPredeterminado: true },
];

export default function PermisosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [permisos, setPermisos] = useState<Permiso[]>(PERMISOS_INICIALES);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modulos: [] as string[],
  });

  useEffect(() => {
    if (user && user.role !== 'administrador') router.replace('/dashboard/finanzas');
    setUsers(getUsers());
  }, [user, router]);

  function getUsuariosConPermiso(id: string): number {
    return users.filter(u => u.permissions?.includes(id) || (id === '5' && u.role === 'administrador')).length;
  }

  function handleCreatePermiso() {
    if (!formData.nombre || !formData.descripcion || formData.modulos.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }
    setPermisos([...permisos, {
      id: Date.now().toString(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      modulos: formData.modulos,
      isPredeterminado: false,
    }]);
    setFormData({ nombre: '', descripcion: '', modulos: [] });
    setShowCreateModal(false);
  }

  function handleEditPermiso() {
    if (!formData.nombre || !formData.descripcion || formData.modulos.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }
    setPermisos(permisos.map(p => p.id === editingId ? {
      ...p,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      modulos: formData.modulos,
    } : p));
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', modulos: [] });
    setShowEditModal(false);
  }

  function startEdit(permiso: Permiso) {
    setEditingId(permiso.id);
    setFormData({ nombre: permiso.nombre, descripcion: permiso.descripcion, modulos: permiso.modulos });
    setShowEditModal(true);
  }

  function deletePermiso(id: string) {
    if (confirm('¿Eliminar este permiso?')) {
      setPermisos(permisos.filter(p => p.id !== id));
    }
  }

  function toggleModulo(modulo: string) {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.includes(modulo)
        ? prev.modulos.filter(m => m !== modulo)
        : [...prev.modulos, modulo],
    }));
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
          }}>
            <Shield size={20} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Permisos</h1>
            <p className="text-gray-400 text-sm mt-0.5">Crea y administra permisos personalizados para usuarios</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ nombre: '', descripcion: '', modulos: [] });
            setShowCreateModal(true);
          }}
          className="shimmer-host flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}
        >
          <Plus size={17} />
          Nuevo Permiso
        </button>
      </div>

      {/* Tabla de Permisos */}
      <div className="rounded-[20px] overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripción</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Módulos</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuarios</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {permisos.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-white font-semibold">{p.nombre}</p>
                      {p.isPredeterminado && (
                        <p className="text-xs text-green-400 mt-0.5">Predeterminado</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{p.descripcion}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.modulos.map(m => (
                        <span key={m} className="px-2 py-1 rounded text-xs bg-white/10 text-gray-300">
                          {m === 'valor-empresa' ? 'Valor' : m.charAt(0).toUpperCase() + m.slice(1)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold">
                      {getUsuariosConPermiso(p.id)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!p.isPredeterminado && (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deletePermiso(p.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear permiso */}
      {showCreateModal && !showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="rounded-[20px] w-full max-w-md overflow-hidden" style={{
            background: 'linear-gradient(160deg, rgba(13,24,40,0.97), rgba(16,28,48,0.95))',
            backdropFilter: 'blur(28px) saturate(150%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Crear Permiso Personalizado</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white block mb-2">Nombre del Permiso</label>
                <input
                  type="text"
                  placeholder="Ej: Reportes Operacionales"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white block mb-2">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Acceso a reportes operacionales avanzados"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white block mb-3">Módulos Incluidos</label>
                <div className="space-y-2">
                  {['finanzas', 'comercial', 'marketing', 'valor-empresa', 'admin', 'reportes'].map(modulo => (
                    <label key={modulo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.modulos.includes(modulo)}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded-md accent-green-500"
                      />
                      <span className="text-white text-sm font-medium capitalize">
                        {modulo === 'valor-empresa' ? 'Valor Empresa' : modulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePermiso}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#15803d' }}
              >
                Crear Permiso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar permiso */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="rounded-[20px] w-full max-w-md overflow-hidden" style={{
            background: 'linear-gradient(160deg, rgba(13,24,40,0.97), rgba(16,28,48,0.95))',
            backdropFilter: 'blur(28px) saturate(150%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Editar Permiso</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white block mb-2">Nombre del Permiso</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white block mb-2">Descripción</label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white block mb-3">Módulos Incluidos</label>
                <div className="space-y-2">
                  {['finanzas', 'comercial', 'marketing', 'valor-empresa', 'admin', 'reportes'].map(modulo => (
                    <label key={modulo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.modulos.includes(modulo)}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded-md accent-green-500"
                      />
                      <span className="text-white text-sm font-medium capitalize">
                        {modulo === 'valor-empresa' ? 'Valor Empresa' : modulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditPermiso}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#15803d' }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
