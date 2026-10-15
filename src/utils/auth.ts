import { SystemUser, Student } from '../types';
import { getSupabaseClient } from './supabaseClient';

const STORAGE_KEYS = {
  USERS: 'geckos_system_users',
  CURRENT_USER: 'geckos_current_session_user',
};

// Credenciales oficiales de Administrador solicitadas por el usuario
export const DEFAULT_ADMIN_USERS: SystemUser[] = [
  {
    id: 'admin-harold',
    name: 'Harold Anguiano Morales',
    username: 'haroldo90',
    password: 'Chevropar#1970',
    email: 'haroldo90@geckosvoleibol.com',
    phone: '',
    role: 'head_coach',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'admin-luis',
    name: 'Luis Gerardo Ángeles Falcón',
    username: 'clubgeckosvoleibol',
    password: 'GeckosAdmin#2026!',
    email: 'clubgeckosvoleibol@gmail.com',
    phone: '',
    role: 'head_coach',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * Obtener todos los usuarios del sistema almacenados localmente
 */
export const getStoredUsers = (): SystemUser[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.USERS);
  if (saved) {
    try {
      const parsed: SystemUser[] = JSON.parse(saved);
      // Garantizar que los administradores oficiales siempre estén presentes y actualizados
      const userMap = new Map<string, SystemUser>();
      parsed.forEach((u) => userMap.set(u.username.toLowerCase(), u));

      // Sobrescribir/asegurar administradores oficiales
      DEFAULT_ADMIN_USERS.forEach((admin) => {
        const existing = userMap.get(admin.username.toLowerCase());
        userMap.set(admin.username.toLowerCase(), {
          ...admin,
          ...(existing || {}),
          password: existing?.password || admin.password,
          name: existing?.name || admin.name,
          email: existing?.email || admin.email,
          phone: existing?.phone || admin.phone,
          avatarUrl: existing?.avatarUrl,
          role: 'head_coach',
          isActive: true,
        });
      });

      const merged = Array.from(userMap.values());
      return merged;
    } catch {
      // fallback
    }
  }
  return DEFAULT_ADMIN_USERS;
};

export const saveStoredUsers = (users: SystemUser[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Obtener usuario con sesión activa en este navegador
 */
export const getCurrentSessionUser = (): SystemUser | null => {
  const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const setCurrentSessionUser = (user: SystemUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

/**
 * Autenticación en el sistema:
 * Admite:
 * 1. Administradores (Harold Anguiano Morales y Luis Gerardo Ángeles Falcón)
 * 2. Entrenadores registrados por el admin
 * 3. Alumnos registrados (usando su teléfono/WhatsApp de contacto, correo del tutor, o nombre de usuario)
 */
export const authenticateUser = (
  identifierRaw: string,
  passwordRaw: string,
  students: Student[] = []
): { success: boolean; user?: SystemUser; student?: Student; error?: string } => {
  const identifier = identifierRaw.trim().toLowerCase();
  const password = passwordRaw.trim();

  if (!identifier || !password) {
    return { success: false, error: 'Por favor ingresa tu usuario o correo y contraseña.' };
  }

  const users = getStoredUsers();

  // 1. Buscar en usuarios registrados (Admins y Entrenadores)
  const systemUser = users.find(
    (u) =>
      u.username.toLowerCase() === identifier ||
      (u.email && u.email.toLowerCase() === identifier)
  );

  if (systemUser) {
    if (!systemUser.isActive) {
      return { success: false, error: 'Esta cuenta ha sido desactivada por el administrador.' };
    }
    if (systemUser.password !== password) {
      return { success: false, error: 'Contraseña incorrecta. Verifica tus datos.' };
    }
    return { success: true, user: systemUser };
  }

  // 2. Buscar en alumnos registrados
  // Los alumnos pueden ingresar con su teléfono (WhatsApp), correo del tutor, o nombre completo
  const cleanPhone = identifier.replace(/\D/g, '');
  const matchedStudent = students.find((s) => {
    const phoneMatch = cleanPhone.length >= 7 && (
      (s.whatsapp && s.whatsapp.replace(/\D/g, '').includes(cleanPhone)) ||
      (s.tutorPhone && s.tutorPhone.replace(/\D/g, '').includes(cleanPhone))
    );
    const emailMatch = s.tutorEmail && s.tutorEmail.toLowerCase() === identifier;
    const nameMatch = s.fullName.toLowerCase() === identifier;
    return phoneMatch || emailMatch || nameMatch;
  });

  if (matchedStudent) {
    if (matchedStudent.isActive === false) {
      return { success: false, error: 'El registro del alumno se encuentra inactivo. Contacta a administración.' };
    }

    // Para alumnos, la contraseña por defecto es su número de teléfono o los últimos 4 dígitos o una clave asignada
    const validStudentPasswords = [
      matchedStudent.whatsapp?.replace(/\D/g, ''),
      matchedStudent.tutorPhone?.replace(/\D/g, ''),
      matchedStudent.jerseyNumber ? String(matchedStudent.jerseyNumber) : null,
      'geckos2026',
      '123456',
    ].filter(Boolean);

    const isStudentPassValid =
      validStudentPasswords.includes(password.replace(/\D/g, '')) ||
      password === 'geckos2026' ||
      password === '123456' ||
      (matchedStudent.whatsapp && password === matchedStudent.whatsapp);

    if (isStudentPassValid) {
      const studentUser: SystemUser = {
        id: `user-${matchedStudent.id}`,
        name: matchedStudent.fullName,
        username: matchedStudent.whatsapp || matchedStudent.id,
        email: matchedStudent.tutorEmail,
        phone: matchedStudent.whatsapp || matchedStudent.tutorPhone,
        role: 'player',
        assignedStudentId: matchedStudent.id,
        campus: matchedStudent.campus,
        isActive: true,
      };
      return { success: true, user: studentUser, student: matchedStudent };
    } else {
      return {
        success: false,
        error: 'Contraseña incorrecta para el alumno. (Tip: Puedes usar el número de WhatsApp registrado o geckos2026).',
      };
    }
  }

  return { success: false, error: 'Usuario o correo no encontrado. Verifica las credenciales o regístrate en el formulario.' };
};

/**
 * Registrar un nuevo entrenador (creado por el Admin)
 */
export const registerCoach = async (coachData: {
  name: string;
  username: string;
  password?: string;
  phone?: string;
  email?: string;
  campus?: string;
}): Promise<{ success: boolean; user?: SystemUser; error?: string }> => {
  const users = getStoredUsers();
  const cleanUsername = coachData.username.trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'Ese nombre de usuario ya está en uso. Por favor elige otro.' };
  }

  const newCoach: SystemUser = {
    id: `coach-${Date.now()}`,
    name: coachData.name.trim(),
    username: cleanUsername,
    password: coachData.password?.trim() || 'GeckosCoach2026!',
    phone: coachData.phone?.trim() || '',
    email: coachData.email?.trim() || '',
    campus: coachData.campus || 'Tlalnepantla',
    role: 'coach_assistant',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newCoach];
  saveStoredUsers(updatedUsers);

  // Sincronizar con Supabase
  try {
    const client = getSupabaseClient();
    await client.from('system_users').upsert({
      id: newCoach.id,
      name: newCoach.name,
      username: newCoach.username,
      password: newCoach.password,
      phone: newCoach.phone,
      email: newCoach.email,
      role: newCoach.role,
      is_active: newCoach.isActive,
    });
  } catch (err) {
    console.warn('Error al guardar entrenador en Supabase:', err);
  }

  return { success: true, user: newCoach };
};

/**
 * Actualizar datos de un entrenador
 */
export const updateCoach = async (coach: SystemUser): Promise<{ success: boolean; error?: string }> => {
  const users = getStoredUsers();
  const updatedUsers = users.map((u) => (u.id === coach.id ? coach : u));
  saveStoredUsers(updatedUsers);

  try {
    const client = getSupabaseClient();
    await client.from('system_users').upsert({
      id: coach.id,
      name: coach.name,
      username: coach.username,
      password: coach.password,
      phone: coach.phone,
      email: coach.email,
      role: coach.role,
      is_active: coach.isActive,
    });
  } catch (err) {
    console.warn('Error al actualizar entrenador en Supabase:', err);
  }

  return { success: true };
};

/**
 * Eliminar entrenador
 */
export const deleteCoach = async (coachId: string): Promise<{ success: boolean; error?: string }> => {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === coachId);
  if (target?.role === 'head_coach') {
    return { success: false, error: 'No es posible eliminar las cuentas principales de Administrador.' };
  }

  const updatedUsers = users.filter((u) => u.id !== coachId);
  saveStoredUsers(updatedUsers);

  try {
    const client = getSupabaseClient();
    await client.from('system_users').delete().eq('id', coachId);
  } catch (err) {
    console.warn('Error al eliminar entrenador en Supabase:', err);
  }

  return { success: true };
};

/**
 * Activar o desactivar entrenador
 */
export const toggleCoachActive = async (coachId: string, isActive: boolean): Promise<{ success: boolean }> => {
  const users = getStoredUsers();
  const updatedUsers = users.map((u) => (u.id === coachId ? { ...u, isActive } : u));
  saveStoredUsers(updatedUsers);

  try {
    const client = getSupabaseClient();
    await client.from('system_users').update({ is_active: isActive }).eq('id', coachId);
  } catch (err) {
    console.warn('Error al actualizar estado en Supabase:', err);
  }

  return { success: true };
};

/**
 * Sincronizar usuarios desde Supabase en segundo plano
 */
export const syncUsersFromSupabase = async (): Promise<SystemUser[]> => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('system_users').select('*');
    if (!error && data && data.length > 0) {
      const mapped: SystemUser[] = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        username: d.username,
        password: d.password,
        email: d.email || '',
        phone: d.phone || '',
        role: d.role as any,
        campus: d.campus || 'Tlalnepantla',
        assignedStudentId: d.assigned_student_id,
        isActive: d.is_active !== false,
        avatarUrl: d.avatar_url || d.avatarUrl || '',
        createdAt: d.created_at,
      }));

      // Fusionar asegurando siempre a Harold y a Luis
      const userMap = new Map<string, SystemUser>();
      mapped.forEach((u) => userMap.set(u.username.toLowerCase(), u));
      DEFAULT_ADMIN_USERS.forEach((a) => {
        const exist = userMap.get(a.username.toLowerCase());
        userMap.set(a.username.toLowerCase(), {
          ...a,
          ...(exist || {}),
          password: exist?.password || a.password,
          name: exist?.name || a.name,
          email: exist?.email || a.email,
          phone: exist?.phone || a.phone,
          avatarUrl: exist?.avatarUrl || a.avatarUrl,
          role: 'head_coach',
          isActive: true,
        });
      });

      const merged = Array.from(userMap.values());
      saveStoredUsers(merged);
      return merged;
    }
  } catch (err) {
    console.info('Aviso Supabase usuarios sync:', err);
  }
  return getStoredUsers();
};

/**
 * Actualizar perfil de usuario (nombre, correo, teléfono, foto, contraseña)
 */
export const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    password?: string;
  }
): Promise<{ success: boolean; user?: SystemUser; error?: string }> => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);

  let targetUser: SystemUser | null = index !== -1 ? users[index] : null;

  if (!targetUser) {
    const current = getCurrentSessionUser();
    if (current && (current.id === userId || current.username === userId)) {
      targetUser = current;
    }
  }

  if (!targetUser) {
    return { success: false, error: 'Usuario no encontrado en el sistema.' };
  }

  const updatedUser: SystemUser = {
    ...targetUser,
    name: data.name !== undefined && data.name.trim() !== '' ? data.name.trim() : targetUser.name,
    email: data.email !== undefined ? data.email.trim() : targetUser.email,
    phone: data.phone !== undefined ? data.phone.trim() : targetUser.phone,
    avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : targetUser.avatarUrl,
    password: data.password !== undefined && data.password.trim() !== '' ? data.password.trim() : targetUser.password,
  };

  const updatedUsers = index !== -1
    ? users.map((u, i) => (i === index ? updatedUser : u))
    : [...users, updatedUser];

  saveStoredUsers(updatedUsers);

  // Si es la sesión activa, sincronizar sesión
  const current = getCurrentSessionUser();
  if (current && (current.id === updatedUser.id || current.username === updatedUser.username)) {
    setCurrentSessionUser(updatedUser);
  }

  // Sincronizar en segundo plano con Supabase si está disponible
  try {
    const client = getSupabaseClient();
    await client.from('system_users').upsert({
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      password: updatedUser.password,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar_url: updatedUser.avatarUrl,
      is_active: updatedUser.isActive !== false,
    });
  } catch (err) {
    console.warn('Aviso al actualizar perfil en Supabase:', err);
  }

  return { success: true, user: updatedUser };
};
