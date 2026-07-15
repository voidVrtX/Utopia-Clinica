import { useState } from 'react';
import { useSession } from '../context/SessionContext';

export function useLoginViewModel() {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setCargando(true);
    const res = await login(email, password);
    setCargando(false);
    if (!res.ok) setError(res.error ?? 'No se pudo iniciar sesión.');
  };

  return { email, setEmail, password, setPassword, error, cargando, submit };
}
