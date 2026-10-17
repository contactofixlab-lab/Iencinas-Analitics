'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser, createUser, updateUser } from '@/lib/auth';
import { User, UserRole } from '@/types';
import { Proyecto } from '@/types/domain';
import { UserPlus, Pencil, Trash2, X, Check } from 'lucide-react';
import { ROLE_AVATAR, ROLE_CHIP, ROLE_SHORT as ROLE_LABELS } from '@/lib/ui';
import FilterPanel, { FilterConfig } from '@/components/FilterPanel';
import { useFiltros } from '@/lib/filtros-client';

const AREA_INICIAL = 'Finanzas';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { opciones } = useFiltros();
  const areaOptions = opciones('area');
  const [users, setUsers] = useState<User[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
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
    area: AREA_INICIAL,
    role: 'finanzas',
    proyectos: [],
  });

  useEffect(() => {
    if (user?.role !== 'administrador') {
      router.replace('/dashboard/finanzas');
      return;
    }
    getUsers().then(setUsers).catch(err => console.error('Error loading usuarios:', err));

    fetch('/api/proyectos')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.data)) setProyectos(data.data);
        else setProyectos([]);
      })
      .catch(err => {
        console.error('Error loading proyectos:', err);
        setProyectos([]);
      });
  }, [user, router]);

  async function handleDelete(id: string) {
    if (id === user?.id) return;
    try {
      await deleteUser(id);
      setUsers(await getUsers());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar el usuario');
    }
    setConfirmDelete(null);
  }

  function resetForm() {
    setFormData({
      nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      password: '',
      area: AREA_INICIAL,
      role: 'finanzas',
      proyectos: [],
    });
    setEditingUser(null);
  }

  async function handleCreateUser() {
    if (!formData.nombre || !formData.apellido1 || !formData.email || !formData.password) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    try {
      await createUser({
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        email: formData.email,
        password: formData.password,
        departamento: formData.area,
        role: formData.role,
        proyectos: formData.proyectos,
      });
      setUsers(await getUsers());
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    }
  }

  async function handleEditUser() {
    if (!editingUser) return;
    if (!formData.nombre || !formData.apellido1 || !formData.email) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    try {
      await updateUser(editingUser.id, {
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        email: formData.email,
        departamento: formData.area,
        role: formData.role,
        proyectos: formData.proyectos,
        ...(formData.password ? { password: formData.password } : {}),
      });
      setUsers(await getUsers());
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo actualizar el usuario');
    }
  }

  function openEditModal(userToEdit: User) {
    setEditingUser(userToEdit);
    setFormData({
      nombre: userToEdit.nombre,
      apellido1: userToEdit.apellido1,
      apellido2: userToEdit.apellido2,
      email: userToEdit.email,
      password: '',
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
    let filtered = users;

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
  }, [users, filters]);

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Gestión de Usuarios</h1>
          <p className="text-soft text-sm mt-0.5">Administra los usuarios y sus perfiles de acceso</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)} className="btn btn-primary shrink-0 whitespace-nowrap">
          <UserPlus size={17} strokeWidth={1.8} />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        showDateRange={false}
        showSearch={true}
        showStatus={true}
        showType={true}
        statusOptions={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))}
        typeOptions={areaOptions}
        statusLabel="Perfil"
        typeLabel="Área"
      />

      {/* Tabla */}
      <div className="table-glass">
        <div className="px-5 py-4 border-b border-line/25 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-ink">
            Todos los usuarios ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Usuario', 'Email', 'Departamento', 'Perfil', 'Creado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-soft uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ background: ROLE_AVATAR[u.role], textShadow: '0 1px 2px rgb(52 73 94 / 0.25)' }}
                      >
                        {u.nombre[0]}{u.apellido1[0]}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{u.nombre} {u.apellido1} {u.apellido2}</p>
                        {u.id === user?.id && (
                          <p className="text-xs text-ok-ink">← Tú</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-soft">{u.email}</td>
                  <td className="px-5 py-3 text-soft">{u.departamento}</td>
                  <td className="px-5 py-3">
                    <span className={ROLE_CHIP[u.role]}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-mute text-xs">{u.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="btn btn-ghost btn-icon !w-9 !h-9 text-brand-deep"
                        title="Editar"
                      >
                        <Pencil size={16} strokeWidth={1.8} />
                      </button>
                      {u.id !== user?.id && (
                        <button
                          onClick={() => setConfirmDelete(u.id)}
                          className="btn btn-ghost btn-icon !w-9 !h-9 text-danger-ink"
                          title="Eliminar"
                        >
                          <Trash2 size={16} strokeWidth={1.8} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-mute">
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
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="modal-panel p-7 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(var(--danger) / 0.14)' }}>
              <Trash2 size={22} strokeWidth={1.8} className="text-danger-ink" />
            </div>
            <h3 className="text-lg font-semibold text-ink text-center">¿Eliminar usuario?</h3>
            <p className="text-soft text-sm text-center mt-1 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)} className="btn btn-secondary flex-1">
                Cancelar
              </button>
              <button type="button" onClick={() => handleDelete(confirmDelete)} className="btn btn-danger flex-1">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="modal-panel w-full max-w-2xl my-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line/25">
              <h2 className="text-xl font-bold text-ink">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                aria-label="Cerrar"
                className="btn btn-ghost btn-icon"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Datos Básicos */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Datos Básicos</h3>
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
                <h3 className="text-sm font-semibold text-ink mb-3">Contacto y Seguridad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="field"
                  />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="field"
                  />
                </div>
                <p className="text-xs text-soft mt-2">
                  Mínimo 10 caracteres, combinando letras y números.
                  {editingUser && ' Déjala en blanco para no cambiarla.'}
                </p>
              </div>

              {/* Área y Perfil */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Área y Perfil</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    className="field"
                  >
                    {[...areaOptions.map(o => o.value), ...(areaOptions.some(o => o.value === formData.area) ? [] : [formData.area])].map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as any})}
                    className="field"
                  >
                    <option value="finanzas">Finanzas</option>
                    <option value="comercial">Comercial</option>
                    <option value="marketing">Marketing</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Proyectos Asignados */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Proyectos Asignados</h3>
                <div className="space-y-2">
                  {proyectos.length === 0 ? (
                    <p className="text-soft text-sm">Cargando proyectos...</p>
                  ) : (
                    proyectos.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProyecto(p.id)}
                        aria-pressed={formData.proyectos.includes(p.id)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-colors"
                        style={{
                          background: formData.proyectos.includes(p.id) ? 'rgb(var(--brand-soft) / 0.85)' : 'rgb(255 255 255 / 0.35)',
                          border: formData.proyectos.includes(p.id) ? '1px solid rgb(var(--brand))' : '1px solid rgb(var(--line) / 0.30)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            background: formData.proyectos.includes(p.id) ? 'rgb(var(--brand-hover))' : '#fff',
                            border: formData.proyectos.includes(p.id) ? '1px solid rgb(var(--brand-hover))' : '1px solid rgb(var(--line) / 0.55)',
                          }}
                        >
                          {formData.proyectos.includes(p.id) && (
                            <Check size={14} strokeWidth={3} className="text-white" />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm text-ink font-medium">{p.nombre}</p>
                          <p className="text-xs text-soft">{p.ubicacion}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-line/25">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button type="button" onClick={editingUser ? handleEditUser : handleCreateUser} className="btn btn-primary flex-1">
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
