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
  { id: '4', nombre: 'General y Constructora', descripcion: 'Acceso total a los módulos General y Constructora', modulos: ['general', 'constructora', 'reportes'], isPredeterminado: true },
  { id: '5', nombre: 'Administrador Total', descripcion: 'Acceso a todos los módulos y funciones', modulos: ['general', 'finanzas', 'comercial', 'marketing', 'constructora', 'admin', 'reportes'], isPredeterminado: true },
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
    if (user?.role === 'administrador') {
      getUsers().then(setUsers).catch(() => setUsers([]));
    }
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
          <div className="icon-orb">
            <Shield size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Gestión de Permisos</h1>
            <p className="text-soft text-sm mt-0.5">Crea y administra permisos personalizados para usuarios</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({ nombre: '', descripcion: '', modulos: [] });
            setShowCreateModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={17} strokeWidth={1.8} />
          Nuevo Permiso
        </button>
      </div>

      {/* Tabla de Permisos */}
      <div className="table-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line/25">
                <th className="text-left px-6 py-4 text-xs font-semibold text-soft uppercase tracking-wider">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-soft uppercase tracking-wider">Descripción</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-soft uppercase tracking-wider">Módulos</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-soft uppercase tracking-wider">Usuarios</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-soft uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-ink font-semibold">{p.nombre}</p>
                      {p.isPredeterminado && (
                        <p className="text-xs text-ok-ink mt-0.5">Predeterminado</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-soft">{p.descripcion}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.modulos.map(m => (
                        <span key={m} className="chip chip-neutral">
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="chip chip-info">
                      {getUsuariosConPermiso(p.id)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!p.isPredeterminado && (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="btn btn-ghost btn-icon !w-9 !h-9 text-brand-deep"
                            title="Editar"
                          >
                            <Pencil size={16} strokeWidth={1.8} />
                          </button>
                          <button
                            onClick={() => deletePermiso(p.id)}
                            className="btn btn-ghost btn-icon !w-9 !h-9 text-danger-ink"
                            title="Eliminar"
                          >
                            <Trash2 size={16} strokeWidth={1.8} />
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
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line/25">
              <h2 className="text-xl font-bold text-ink">Crear Permiso Personalizado</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                aria-label="Cerrar"
                className="btn btn-ghost btn-icon"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="label">Nombre del Permiso</label>
                <input
                  type="text"
                  placeholder="Ej: Reportes Operacionales"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="label">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Acceso a reportes operacionales avanzados"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="label">Módulos Incluidos</label>
                <div className="space-y-2">
                  {['general', 'finanzas', 'comercial', 'marketing', 'constructora', 'admin', 'reportes'].map(modulo => (
                    <label key={modulo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.modulos.includes(modulo)}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded-md"
                      />
                      <span className="text-ink text-sm font-medium capitalize">
                        {modulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-line/25">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePermiso}
                className="btn btn-primary flex-1"
              >
                Crear Permiso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar permiso */}
      {showEditModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line/25">
              <h2 className="text-xl font-bold text-ink">Editar Permiso</h2>
              <button
                onClick={() => setShowEditModal(false)}
                aria-label="Cerrar"
                className="btn btn-ghost btn-icon"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="label">Nombre del Permiso</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="label">Descripción</label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="field w-full"
                />
              </div>

              <div>
                <label className="label">Módulos Incluidos</label>
                <div className="space-y-2">
                  {['general', 'finanzas', 'comercial', 'marketing', 'constructora', 'admin', 'reportes'].map(modulo => (
                    <label key={modulo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.modulos.includes(modulo)}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded-md"
                      />
                      <span className="text-ink text-sm font-medium capitalize">
                        {modulo}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-line/25">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditPermiso}
                className="btn btn-primary flex-1"
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
