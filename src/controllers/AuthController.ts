import { apiClient, ApiError, setAuthToken } from '../services/apiClient';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../services/storage';
import { AnyUser, Medico, Paciente } from '../models/User';
import { toISODate, fromISODate } from '../utils/dateFormat';

function normalizeUser<T extends AnyUser>(user: T): T {
  return { ...user, fechaNacimiento: fromISODate(user.fechaNacimiento) } as T;
}

async function persistSession(token: string, email: string) {
  setAuthToken(token);
  await setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  await setItem(STORAGE_KEYS.SESSION_ACTIVE, true);
  await setItem(STORAGE_KEYS.LAST_SESSION_EMAIL, email);
}

export const AuthController = {
  async login(email: string, password: string): Promise<{ user: AnyUser | null; error?: string }> {
    try {
      const res = await apiClient.post<{ token: string; user: AnyUser }>('/auth/login', {
        email,
        password,
      });
      await persistSession(res.token, res.user.email);
      return { user: normalizeUser(res.user) };
    } catch (e) {
      return { user: null, error: e instanceof ApiError ? e.message : 'No se pudo iniciar sesión.' };
    }
  },

  async logout() {
    // Se conserva el token y el último correo para poder reingresar con huella;
    // solo se marca la sesión como inactiva (requiere biometría/login para reanudar).
    await setItem(STORAGE_KEYS.SESSION_ACTIVE, false);
  },

  async getLastSessionEmail(): Promise<string | null> {
    return getItem<string>(STORAGE_KEYS.LAST_SESSION_EMAIL);
  },

  async getCurrentSessionEmail(): Promise<string | null> {
    const activa = await getItem<boolean>(STORAGE_KEYS.SESSION_ACTIVE);
    if (!activa) return null;
    return getItem<string>(STORAGE_KEYS.LAST_SESSION_EMAIL);
  },

  /** Reanuda la sesión usando el token guardado (login normal o huella). */
  async resumeSession(): Promise<AnyUser | null> {
    const token = await getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return null;
    setAuthToken(token);
    try {
      const user = await apiClient.get<AnyUser>('/auth/me');
      await setItem(STORAGE_KEYS.SESSION_ACTIVE, true);
      return normalizeUser(user);
    } catch {
      setAuthToken(null);
      await removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await setItem(STORAGE_KEYS.SESSION_ACTIVE, false);
      return null;
    }
  },

  async verificarEmailExistente(email: string): Promise<boolean> {
    const res = await apiClient.get<{ exists: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
    return res.exists;
  },

  async registrarPaciente(data: {
    email: string;
    password: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    sexo: 'Masculino' | 'Femenino' | 'Otro';
    fechaNacimiento: string;
    telefono: string;
    direccion?: string;
    seguroMedico?: string;
    tipoSangre?: string;
    alergias?: string[];
    contactoEmergencia: { nombreCompleto: string; parentesco: string; telefono: string };
  }): Promise<{ user: Paciente | null; error?: string }> {
    try {
      const res = await apiClient.post<{ token: string; user: Paciente }>('/auth/register', {
        ...data,
        fechaNacimiento: toISODate(data.fechaNacimiento),
      });
      await persistSession(res.token, res.user.email);
      return { user: normalizeUser(res.user) };
    } catch (e) {
      return {
        user: null,
        error: e instanceof ApiError ? e.message : 'No se pudo completar el registro.',
      };
    }
  },

  async crearMedico(data: Omit<Medico, 'id' | 'role'>): Promise<Medico> {
    const res = await apiClient.post<Medico>('/medicos', {
      ...data,
      fechaNacimiento: toISODate(data.fechaNacimiento),
    });
    return normalizeUser(res);
  },

  /** Actualiza el perfil propio (pacientes; médicos usan MedicosController.actualizar). */
  async actualizarPerfil(userId: string, cambios: Partial<AnyUser>): Promise<AnyUser | null> {
    const res = await apiClient.patch<AnyUser>(`/users/${userId}`, {
      ...cambios,
      fechaNacimiento: cambios.fechaNacimiento ? toISODate(cambios.fechaNacimiento) : undefined,
    });
    return normalizeUser(res);
  },
};
