import { db } from '../services/mockDatabase';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../services/storage';
import { AnyUser, Medico, Paciente } from '../models/User';
import { uid } from '../utils/helpers';

export const AuthController = {
  async login(email: string, password: string): Promise<{ user: AnyUser | null; error?: string }> {
    const users = await db.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { user: null, error: 'No existe una cuenta con ese correo.' };
    if (found.password !== password) return { user: null, error: 'Contraseña incorrecta.' };
    await setItem(STORAGE_KEYS.LAST_SESSION_EMAIL, found.email);
    await setItem(STORAGE_KEYS.CURRENT_SESSION_EMAIL, found.email);
    return { user: found };
  },

  async logout() {
    await removeItem(STORAGE_KEYS.CURRENT_SESSION_EMAIL);
  },

  async getLastSessionEmail(): Promise<string | null> {
    return getItem<string>(STORAGE_KEYS.LAST_SESSION_EMAIL);
  },

  async getCurrentSessionEmail(): Promise<string | null> {
    return getItem<string>(STORAGE_KEYS.CURRENT_SESSION_EMAIL);
  },

  async resumeSession(email: string): Promise<AnyUser | null> {
    const users = await db.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      await setItem(STORAGE_KEYS.CURRENT_SESSION_EMAIL, found.email);
    }
    return found ?? null;
  },

  async verificarEmailExistente(email: string): Promise<boolean> {
    const users = await db.getUsers();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
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
    const users = await db.getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { user: null, error: 'Ese correo ya está registrado.' };
    }
    const nuevo: Paciente = {
      id: uid('paciente-'),
      email: data.email.trim(),
      password: data.password,
      role: 'paciente',
      nombre: `${data.nombre} ${data.apellidoPaterno}`.trim(),
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      sexo: data.sexo,
      fechaNacimiento: data.fechaNacimiento,
      telefono: data.telefono,
      direccion: data.direccion,
      seguroMedico: data.seguroMedico,
      tipoSangre: data.tipoSangre,
      alergias: data.alergias,
      contactoEmergencia: data.contactoEmergencia,
    };
    await db.saveUsers([...users, nuevo]);
    await setItem(STORAGE_KEYS.LAST_SESSION_EMAIL, nuevo.email);
    await setItem(STORAGE_KEYS.CURRENT_SESSION_EMAIL, nuevo.email);
    return { user: nuevo };
  },

  async crearMedico(data: Omit<Medico, 'id' | 'role'>): Promise<Medico> {
    const users = await db.getUsers();
    const nuevo: Medico = { ...data, id: uid('medico-'), role: 'medico' };
    await db.saveUsers([...users, nuevo]);
    return nuevo;
  },
};
