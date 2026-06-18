import { NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api/server';
import { getDataSource } from '@/lib/datasource';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ds = getDataSource();
    const allProyectos = await ds.getProyectos();

    // Get user from session/auth context
    const authHeader = req.headers.get('authorization');
    const userEmail = req.nextUrl.searchParams.get('email');

    if (!userEmail && !authHeader) {
      return fail(new Error('No user identified'));
    }

    // In a real app, you'd get user from session/JWT
    // For now, we'll get all users and find by email
    const INITIAL_USERS = [
      {
        id: '1',
        proyectos: ['proj-001', 'proj-002'],
        email: 'juan@iencinas.cl',
      },
      {
        id: '2',
        proyectos: ['proj-001', 'proj-009'],
        email: 'maria@iencinas.cl',
      },
      {
        id: '3',
        proyectos: ['proj-001', 'proj-002', 'proj-009'],
        email: 'carlos@iencinas.cl',
      },
      {
        id: '4',
        proyectos: ['proj-001', 'proj-002', 'proj-009'],
        email: 'ana@iencinas.cl',
      },
    ];

    const email = userEmail || 'ana@iencinas.cl'; // Default to admin for testing
    const user = INITIAL_USERS.find(u => u.email === email);

    if (!user || !user.proyectos) {
      return ok([], ds.name);
    }

    // Filter proyectos to only those assigned to this user
    const misProyectos = allProyectos.filter(p => user.proyectos.includes(p.id));

    return ok(misProyectos, ds.name);
  } catch (err) {
    return fail(err);
  }
}
