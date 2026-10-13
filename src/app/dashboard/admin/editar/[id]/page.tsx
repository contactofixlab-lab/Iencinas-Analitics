'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUsers, updateUser } from '@/lib/auth';
import { User, UserRole } from '@/types';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function EditarUsuarioPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '', apellido1: '', apellido2: '',
    email: '', password: '', role: 'finanzas' as UserRole, departamento: '',
  });

  const ROLE_DEPT: Record<UserRole, string> = {
    finanzas: 'Finanzas', comercial: 'Comercial',
    marketing: 'Marketing', administrador: 'Administración',
  };

  useEffect(() => {
    if (currentUser?.role !== 'administrador') {
      router.replace('/dashboard/finanzas');
      return;
    }
    getUsers()
      .then((users: User[]) => {
        const found = users.find(u => u.id === id);
        if (found) {
          setForm({
            nombre: found.nombre, apellido1: found.apellido1, apellido2: found.apellido2,
            email: found.email, password: '', role: found.role, departamento: found.departamento,
          });
        }
      })
      .catch(() => setError('No se pudo cargar el usuario.'));
  }, [id, currentUser, router]);

  function handleChange(field: string, value: string) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'role') updated.departamento = ROLE_DEPT[value as UserRole];
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.apellido1 || !form.email) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    try {
      const { password, ...rest } = form;
      await updateUser(id, password ? { ...rest, password } : rest);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/admin'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el usuario.');
    }
  }

  const inputClass = 'field w-full';
  const inputStyle: React.CSSProperties = {};

  return (
    <div className="space-y-6 max-w-2xl page-enter">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin" aria-label="Volver" className="btn btn-secondary btn-icon">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">Editar Usuario</h1>
          <p className="text-soft text-sm mt-0.5">Modifica los datos del usuario</p>
        </div>
      </div>

      {success && (
        <div className="toast" role="status" style={{ background: 'rgb(var(--ok) / 0.12)', borderColor: 'rgb(var(--ok) / 0.30)' }}>
          <CheckCircle2 size={20} strokeWidth={1.8} className="text-ok-ink shrink-0" />
          <p className="text-sm font-medium text-ok-ink">Usuario actualizado exitosamente. Redirigiendo...</p>
        </div>
      )}

      <div className="glass-card" style={{ padding: 'calc(var(--pad-card) + 4px)' }}>
        <div className="sheen" />
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre <span className="text-danger-ink">*</span></label>
              <input type="text" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="label">Primer Apellido <span className="text-danger-ink">*</span></label>
              <input type="text" value={form.apellido1} onChange={e => handleChange('apellido1', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Segundo Apellido</label>
              <input type="text" value={form.apellido2} onChange={e => handleChange('apellido2', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="label">Correo Electrónico <span className="text-danger-ink">*</span></label>
              <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="label">Nueva Contraseña</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => handleChange('password', e.target.value)} placeholder="Dejar igual o escribir nueva"
                className={inputClass + ' !pr-11'} style={inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                aria-label="Mostrar u ocultar contraseña" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-mute hover:text-ink transition-colors">
                {showPass ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Perfil / Rol <span className="text-danger-ink">*</span></label>
              <select value={form.role} onChange={e => handleChange('role', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="finanzas">Finanzas</option>
                <option value="comercial">Comercial</option>
                <option value="marketing">Marketing</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="label">Área / Departamento</label>
              <input type="text" value={form.departamento} readOnly className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} />
            </div>
          </div>
          {error && <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/admin" className="btn btn-secondary flex-1">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={17} strokeWidth={1.8} />Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
