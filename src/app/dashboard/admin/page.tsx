'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser, createUser, updateUser } from '@/lib/auth';
import { User, UserRole } from '@/types';
import { Proyecto } from '@/types/domain';
import { UserPlus, Pencil, Trash2, X, Search, Check } from 'lucide-react';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';

const ROLE_LABELS: Record<string, string> = {
  finanzas: 'Finanzas',
  comercial: 'Comercial',
  marketing: 'Marketing',
  administrador: 'Administrador',
};

const ROLE_COLORS: Record<string, string> = {
  finanzas: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  comercial: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  marketing: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  administrador: 'bg-green-500/20 text-green-300 border border-green-500/30',
};

const AREAS = ['Finanzas', 'Comercial', 'Marketing', 'Operaciones', 'Tecnología'];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterConfig>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    password: string;
    area: string;
    role: UserRole;
    proyectos: string[];
  }>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: '',
    area: AREAS[0],
    role: 'finanzas',
    proyectos: [],
  });

  useEffect(() => {
    if (user?.role !== 'administrador') {
      router.replace('/dashboard/finanzas');
      return;
    }
    setUsers(getUsers());

    fetch('/api/proyectos')
      .then(res => res.json())
      .then(data => setProyectos(data.data || []))
      .catch(err => console.error('Error loading proyectos:', err));
  }, [user, router]);

  function handleDelete(id: string) {
    if (id === user?.id) return;
    deleteUser(id);
    setUsers(getUsers());
    setConfirmDelete(null);
  }

  function resetForm() {
    setFormData({
      nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      password: '',
      area: AREAS[0],
      role: 'finanzas',
      proyectos: [],
    });
    setEditingUser(null);
  }

  function handleCreateUser() {
    if (!formData.nombre || !formData.apellido1 || !formData.email || !formData.password) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    createUser({
      nombre: formData.nombre,
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      email: formData.email,
      password: formData.password,
      departamento: formData.area,
      role: formData.role,
      proyectos: formData.proyectos,
    });
    setUsers(getUsers());
    setShowCreateModal(false);
    resetForm();
  }

  function handleEditUser() {
    if (!editingUser) return;
    if (!formData.nombre || !formData.apellido1 || !formData.email) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    updateUser(editingUser.id, {
      nombre: formData.nombre,
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      email: formData.email,
      departamento: formData.area,
      role: formData.role,
      proyectos: formData.proyectos,
    });
    setUsers(getUsers());
    setShowCreateModal(false);
    resetForm();
  }

  function openEditModal(userToEdit: User) {
    setEditingUser(userToEdit);
    setFormData({
      nombre: userToEdit.nombre,
      apellido1: userToEdit.apellido1,
      apellido2: userToEdit.apellido2,
      email: userToEdit.email,
      password: userToEdit.password,
      area: userToEdit.departamento,
      role: userToEdit.role,
      proyectos: userToEdit.proyectos || [],
    });
    setShowCreateModal(true);
  }

  function toggleProyecto(proyectoId: string) {
    setFormData(prev => {
      const current = prev.proyectos || [];
      if (current.includes(proyectoId)) {
        return { ...prev, proyectos: current.filter(p => p !== proyectoId) };
      } else {
        return { ...prev, proyectos: [...current, proyectoId] };
      }
    });
  }

  useEffect(() => {
    let filtered = users.filter(u =>
      `${u.nombre} ${u.apellido1} ${u.apellido2} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        `${u.nombre} ${u.apellido1} ${u.apellido2} ${u.email}`.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== '') {
      filtered = filtered.filter(u => u.role === filters.status);
    }

    if (filters.type && filters.type !== '') {
      filtered = filtered.filter(u => u.departamento === filters.type);
    }

    setFilteredUsers(filtered);
  }, [users, search, filters]);

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-gray-400 text-sm mt-0.5">Administra los usuarios y sus perfiles de acceso</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="shimmer-host flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}
        >
          <UserPlus size={17} />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="scene-3d grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-grid">
        {(['finanzas', 'comercial', 'marketing', 'administrador'] as const).map(role => {
          const tint = role === 'finanzas' ? 'rgba(59,130,246,0.14)' : role === 'comercial' ? 'rgba(249,115,22,0.14)' : role === 'marketing' ? 'rgba(168,85,247,0.14)' : 'rgba(74,222,128,0.14)';
          return (
            <div key={role} className="lift relative rounded-[20px] p-5 overflow-hidden" style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
              backdropFilter: 'blur(24px) saturate(150%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: `0 16px 48px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.20), 0 0 24px ${tint}`,
            }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{ROLE_LABELS[role]}</p>
              <p className="text-3xl font-bold text-white mt-1.5">
                {users.filter(u => u.role === role).length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">usuarios</p>
            </div>
          );
        })}
      </div>

      {/* Search + Table */}
      <div className="rounded-[20px] overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-white">
            Todos los usuarios ({filteredUsers.length})
          </h3>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field w-56"
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {['Usuario', 'Email', 'Departamento', 'Perfil', 'Creado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        u.role === 'finanzas' ? 'bg-blue-500' :
                        u.role === 'comercial' ? 'bg-orange-500' :
                        u.role === 'marketing' ? 'bg-purple-500' : 'bg-green-600'
                      }`}>
                        {u.nombre[0]}{u.apellido1[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.nombre} {u.apellido1} {u.apellido2}</p>
                        {u.id === user?.id && (
                          <p className="text-xs text-green-400">← Tú</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{u.email}</td>
                  <td className="px-5 py-3 text-gray-400">{u.departamento}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{u.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      {u.id !== user?.id && (
                        <button
                          onClick={() => setConfirmDelete(u.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No hay usuarios que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="rounded-[20px] p-6 max-w-sm w-full" style={{
            background: 'linear-gradient(160deg, rgba(13,24,40,0.97), rgba(16,28,48,0.95))',
            backdropFilter: 'blur(28px) saturate(150%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white text-center">¿Eliminar usuario?</h3>
            <p className="text-gray-400 text-sm text-center mt-1 mb-5">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="rounded-[20px] w-full max-w-2xl my-8 overflow-hidden" style={{
            background: 'linear-gradient(160deg, rgba(13,24,40,0.97), rgba(16,28,48,0.95))',
            backdropFilter: 'blur(28px) saturate(150%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Datos Básicos */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Datos Básicos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="field"
                  />
                  <input
                    type="text"
                    placeholder="Apellido Paterno"
                    value={formData.apellido1}
                    onChange={e => setFormData({...formData, apellido1: e.target.value})}
                    className="field"
                  />
                  <input
                    type="text"
                    placeholder="Apellido Materno"
                    value={formData.apellido2}
                    onChange={e => setFormData({...formData, apellido2: e.target.value})}
                    className="field"
                  />
                </div>
              </div>

              {/* Contacto y Seguridad */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Contacto y Seguridad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="field"
                  />
                  {!editingUser && (
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-400 outline-none border border-white/15"
                      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                    />
                  )}
                </div>
              </div>

              {/* Área y Perfil */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Área y Perfil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    className="field"
                  >
                    {AREAS.map(area => (
                      <option key={area} value={area} className="bg-gray-800">{area}</option>
                    ))}
                  </select>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as any})}
                    className="field"
                  >
                    <option value="finanzas" className="bg-gray-800">Finanzas</option>
                    <option value="comercial" className="bg-gray-800">Comercial</option>
                    <option value="marketing" className="bg-gray-800">Marketing</option>
                    <option value="administrador" className="bg-gray-800">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Proyectos Asignados */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Proyectos Asignados</h3>
                <div className="space-y-2">
                  {proyectos.length === 0 ? (
                    <p className="text-gray-400 text-sm">Cargando proyectos...</p>
                  ) : (
                    proyectos.map(p => (
                      <button
                        key={p.id}
                        onClick={() => toggleProyecto(p.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                        style={{
                          background: formData.proyectos.includes(p.id)
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.proyectos.includes(p.id)
                            ? '1px solid rgba(34, 197, 94, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{
                            background: formData.proyectos.includes(p.id)
                              ? '#22c55e'
                              : 'rgba(255, 255, 255, 0.1)',
                            borderColor: formData.proyectos.includes(p.id)
                              ? '#22c55e'
                              : 'rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          {formData.proyectos.includes(p.id) && (
                            <Check size={14} className="text-black" />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm text-white font-medium">{p.nombre}</p>
                          <p className="text-xs text-gray-400">{p.ubicacion}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingUser ? handleEditUser : handleCreateUser}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#15803d' }}
              >
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
