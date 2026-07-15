import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AnyUser } from '../models/User';
import { AuthController } from '../controllers/AuthController';
import { db } from '../services/mockDatabase';
import { habilitarRotacionLibre } from '../services/orientationService';

interface SessionState {
  cargando: boolean;
  usuario: AnyUser | null;
  ultimoEmail: string | null;
  mostrarPromptHuella: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  continuarConHuella: () => Promise<boolean>;
  omitirHuella: () => void;
  registrarPacienteExitoso: (user: AnyUser) => void;
  setUsuario: (u: AnyUser) => void;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuarioState] = useState<AnyUser | null>(null);
  const [ultimoEmail, setUltimoEmail] = useState<string | null>(null);
  const [mostrarPromptHuella, setMostrarPromptHuella] = useState(false);

  useEffect(() => {
    (async () => {
      await db.init();
      await habilitarRotacionLibre();
      const currentEmail = await AuthController.getCurrentSessionEmail();
      const lastEmail = await AuthController.getLastSessionEmail();
      setUltimoEmail(lastEmail);
      if (currentEmail) {
        // ya había sesión activa (no se cerró explícitamente)
        const u = await AuthController.resumeSession(currentEmail);
        setUsuarioState(u);
      } else if (lastEmail) {
        // hubo sesión antes: ofrecer reingreso con huella
        setMostrarPromptHuella(true);
      }
      setCargando(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, error } = await AuthController.login(email, password);
    if (!user) return { ok: false, error };
    setUsuarioState(user);
    setUltimoEmail(user.email);
    setMostrarPromptHuella(false);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await AuthController.logout();
    setUsuarioState(null);
    // el último email se conserva para poder re-ingresar con huella después
  }, []);

  const continuarConHuella = useCallback(async () => {
    if (!ultimoEmail) return false;
    const u = await AuthController.resumeSession(ultimoEmail);
    if (u) {
      setUsuarioState(u);
      setMostrarPromptHuella(false);
      return true;
    }
    return false;
  }, [ultimoEmail]);

  const omitirHuella = useCallback(() => {
    setMostrarPromptHuella(false);
  }, []);

  const registrarPacienteExitoso = useCallback((user: AnyUser) => {
    setUsuarioState(user);
    setUltimoEmail(user.email);
  }, []);

  const setUsuario = useCallback((u: AnyUser) => setUsuarioState(u), []);

  return (
    <SessionContext.Provider
      value={{
        cargando,
        usuario,
        ultimoEmail,
        mostrarPromptHuella,
        login,
        logout,
        continuarConHuella,
        omitirHuella,
        registrarPacienteExitoso,
        setUsuario,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider');
  return ctx;
}
