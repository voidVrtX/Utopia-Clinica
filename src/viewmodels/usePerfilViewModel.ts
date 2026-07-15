import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { MedicosController } from '../controllers/MedicosController';
import { db } from '../services/mockDatabase';
import { AnyUser } from '../models/User';

export function usePerfilViewModel() {
  const { usuario, setUsuario, logout } = useSession();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (cambios: Partial<AnyUser>) => {
    if (!usuario) return;
    setGuardando(true);
    if (usuario.role === 'medico') {
      const actualizado = await MedicosController.actualizar(usuario.id, cambios as any);
      if (actualizado) setUsuario(actualizado);
    } else {
      const users = await db.getUsers();
      const idx = users.findIndex((u) => u.id === usuario.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...cambios } as AnyUser;
        await db.saveUsers(users);
        setUsuario(users[idx]);
      }
    }
    setGuardando(false);
    setEditando(false);
  };

  return { usuario, editando, setEditando, guardando, guardar, logout };
}
