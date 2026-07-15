import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { MedicosController } from '../controllers/MedicosController';
import { AuthController } from '../controllers/AuthController';
import { AnyUser } from '../models/User';

export function usePerfilViewModel() {
  const { usuario, setUsuario, logout } = useSession();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (cambios: Partial<AnyUser>) => {
    if (!usuario) return;
    setGuardando(true);
    const actualizado =
      usuario.role === 'medico'
        ? await MedicosController.actualizar(usuario.id, cambios as any)
        : await AuthController.actualizarPerfil(usuario.id, cambios);
    if (actualizado) setUsuario(actualizado);
    setGuardando(false);
    setEditando(false);
  };

  return { usuario, editando, setEditando, guardando, guardar, logout };
}
