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
    const users = getUsers();
    const found = users.find((u: User) => u.id === id);
    if (found) {
      setForm({
        nombre: found.nombre, apellido1: found.apellido1, apellido2: found.apellido2,
        email: found.email, password: found.password, role: found.role, departamento: found.departamento,
      });
    }
  }, [id, currentUser, router]);

  function handleChange(field: string, value: string) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'role') updated.departamento = ROLE_DEPT[value as UserRole];
      return updated;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.apellido1 || !form.email) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    updateUser(id, form);
    setSuccess(true);
    setTimeout(() => router.push('/dashboard/admin'), 1500);
  }

  const inputClass = 'field w-full';
  const inputStyle: React.CSSProperties = {};

  return (
    <div className="space-y-6 max-w-2xl page-enter">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin" className="p-2 rounded-xl transition-colors hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={20} className="text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Editar Usuario</h1>
          <p className="text-gray-400 text-sm mt-0.5">Modifica los datos del usuario</p>
        </div>
      </div>

      {success && (
        <div className="rounded-xl p-4 text-green-300 text-sm font-medium flex items-center gap-2" style={{
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
        }}>
          <CheckCircle2 size={18} className="text-green-400" />
          Usuario actualizado exitosamente. Redirigiendo...
        </div>
      )}

      <div className="rounded-[20px] p-6 overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre <span className="text-red-400">*</span></label>
              <input type="text" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Primer Apellido <span className="text-red-400">*</span></label>
              <input type="text" value={form.apellido1} onChange={e => handleChange('apellido1', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Segundo Apellido</label>
              <input type="text" value={form.apellido2} onChange={e => handleChange('apellido2', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Correo Electrónico <span className="text-red-400">*</span></label>
              <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nueva Contraseña</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => handleChange('password', e.target.value)} placeholder="Dejar igual o escribir nueva"
                className={inputClass + ' pr-10'} style={inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Perfil / Rol <span className="text-red-400">*</span></label>
              <select value={form.role} onChange={e => handleChange('role', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="finanzas">Finanzas</option>
                <option value="comercial">Comercial</option>
                <option value="marketing">Marketing</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Área / Departamento</label>
              <input type="text" value={form.departamento} readOnly className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} />
            </div>
          </div>
          {error && <p className="text-red-300 text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</p>}
          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/admin"
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 text-center"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              Cancelar
            </Link>
            <button type="submit"
              className="shimmer-host flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}>
              <Save size={16} />Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
