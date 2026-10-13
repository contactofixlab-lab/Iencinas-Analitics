'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createUser } from '@/lib/auth';
import { UserRole } from '@/types';
import { ArrowLeft, UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const MOD_BADGE: Record<string, string> = {
  Finanzas: '59, 130, 246',
  Comercial: '249, 115, 22',
  Marketing: '168, 85, 247',
  General: '120, 168, 215',
  Constructora: '245, 158, 11',
  Administración: '34, 197, 94',
};

function Badge({ label }: { label: string }) {
  const rgb = MOD_BADGE[label] || '148, 163, 184';
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
      background: `rgba(${rgb}, 0.16)`, color: `rgb(${rgb})`, border: `1px solid rgba(${rgb}, 0.35)`,
    }}>{label}</span>
  );
}

export default function CrearUsuarioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: '',
    role: 'finanzas' as UserRole,
    departamento: 'Finanzas',
  });

  if (user?.role !== 'administrador') {
    router.replace('/dashboard/finanzas');
    return null;
  }

  const ROLE_DEPT: Record<UserRole, string> = {
    finanzas: 'Finanzas',
    comercial: 'Comercial',
    marketing: 'Marketing',
    administrador: 'Administración',
  };

  function handleChange(field: string, value: string) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'role') {
        updated.departamento = ROLE_DEPT[value as UserRole];
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.apellido1 || !form.email || !form.password) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    try {
      await createUser({ ...form, proyectos: [] });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/admin'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el usuario.');
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
          <h1 className="text-2xl font-bold text-ink">Crear Nuevo Usuario</h1>
          <p className="text-soft text-sm mt-0.5">Completa el formulario para agregar un nuevo usuario al sistema</p>
        </div>
      </div>

      {success && (
        <div className="toast" role="status" style={{ background: 'rgb(var(--ok) / 0.12)', borderColor: 'rgb(var(--ok) / 0.30)' }}>
          <CheckCircle2 size={20} strokeWidth={1.8} className="text-ok-ink shrink-0" />
          <p className="text-sm font-medium text-ok-ink">Usuario creado exitosamente. Redirigiendo...</p>
        </div>
      )}

      <div className="glass-card" style={{ padding: 'calc(var(--pad-card) + 4px)' }}>
        <div className="sheen" />
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre <span className="text-danger-ink">*</span></label>
              <input type="text" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)}
                placeholder="Ej: Juan" required className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="label">Primer Apellido <span className="text-danger-ink">*</span></label>
              <input type="text" value={form.apellido1} onChange={e => handleChange('apellido1', e.target.value)}
                placeholder="Ej: García" required className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Segundo Apellido</label>
              <input type="text" value={form.apellido2} onChange={e => handleChange('apellido2', e.target.value)}
                placeholder="Ej: López" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="label">Correo Electrónico <span className="text-danger-ink">*</span></label>
              <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
                placeholder="correo@iencinas.cl" required className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="label">Contraseña <span className="text-danger-ink">*</span></label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="Mínimo 10 caracteres, con letras y números" required minLength={10}
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
              <select value={form.role} onChange={e => handleChange('role', e.target.value)}
                className={inputClass} style={inputStyle}>
                <option value="finanzas">Finanzas</option>
                <option value="comercial">Comercial</option>
                <option value="marketing">Marketing</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="label">Área / Departamento</label>
              <input type="text" value={form.departamento} onChange={e => handleChange('departamento', e.target.value)}
                className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} readOnly />
            </div>
          </div>

          {error && (
            <p role="alert" className="chip chip-danger !rounded-2xl !px-4 !py-2.5 !text-sm">{error}</p>
          )}

          {/* Permissions preview */}
          <div className="glass-card glass-card--muted glass-card--compact" style={{ padding: '16px 18px' }}>
            <p className="label">Módulos con acceso</p>
            <div className="flex flex-wrap gap-2">
              {form.role === 'finanzas' && <Badge label="Finanzas" />}
              {form.role === 'comercial' && <Badge label="Comercial" />}
              {form.role === 'marketing' && <Badge label="Marketing" />}
              {form.role === 'administrador' && (
                <>
                  <Badge label="Finanzas" /><Badge label="Comercial" /><Badge label="Marketing" />
                  <Badge label="General" /><Badge label="Constructora" /><Badge label="Administración" />
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/admin" className="btn btn-secondary flex-1">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary flex-1">
              <UserPlus size={17} strokeWidth={1.8} />Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
