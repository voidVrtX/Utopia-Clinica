import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRegisterDraft } from '../context/RegisterDraftContext';

interface AlergiaItem {
  nombre: string;
  categoria: string;
}

const ALERGIAS_COMUNES: AlergiaItem[] = [
  // Medicamentos
  { nombre: 'Penicilina', categoria: 'Medicamento' },
  { nombre: 'Sulfonamidas', categoria: 'Medicamento' },
  { nombre: 'Aspirina', categoria: 'Medicamento' },
  { nombre: 'Ibuprofeno', categoria: 'Medicamento' },
  { nombre: 'Cefalosporinas', categoria: 'Medicamento' },
  
  // Alimentos
  { nombre: 'Cacahuate', categoria: 'Alimento' },
  { nombre: 'Mariscos', categoria: 'Alimento' },
  { nombre: 'Lácteos', categoria: 'Alimento' },
  { nombre: 'Gluten', categoria: 'Alimento' },
  { nombre: 'Huevo', categoria: 'Alimento' },
  { nombre: 'Frutos secos', categoria: 'Alimento' },
  
  // Ambientales
  { nombre: 'Polvo', categoria: 'Ambiental' },
  { nombre: 'Ácaros', categoria: 'Ambiental' },
  { nombre: 'Polen', categoria: 'Ambiental' },
  { nombre: 'Moho', categoria: 'Ambiental' },
  
  // Otros
  { nombre: 'Latex', categoria: 'Otro' },
  { nombre: 'Alcohol', categoria: 'Otro' },
];

const TIPOS_SANGRE = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const useRegistroDetallesViewModel = () => {
  const navigation = useNavigation();
  const { draft, update } = useRegisterDraft();

  // Dirección
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [colonia, setColonia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [seguroMedico, setSeguroMedico] = useState('');

  // Sangre
  const [sangre, setSangre] = useState<string>('');

  // Alergias
  const [search, setSearch] = useState('');
  const [selectedAlergias, setSelectedAlergias] = useState<string[]>([]);

  // Sugerencias de alergias basadas en búsqueda
  const suggestions = useMemo(() => {
    if (search.trim().length === 0) return [];

    const searchLower = search.toLowerCase();
    return ALERGIAS_COMUNES.filter(
      (alergia) =>
        alergia.nombre.toLowerCase().includes(searchLower) &&
        !selectedAlergias.includes(alergia.nombre)
    ).map((a) => a.nombre);
  }, [search, selectedAlergias]);

  const addAllergy = (alergia: string) => {
    if (!selectedAlergias.includes(alergia)) {
      setSelectedAlergias([...selectedAlergias, alergia]);
      setSearch('');
    }
  };

  const removeAllergy = (alergia: string) => {
    setSelectedAlergias(selectedAlergias.filter((a) => a !== alergia));
  };

  const goBack = () => {
    navigation.goBack();
  };

  const continuar = () => {
    if (!calle.trim() || !numero.trim() || !municipio.trim() || !estado.trim() || !sangre) {
      return;
    }

    const direccionFormateada = [
      [calle, numero].filter(Boolean).join(' '),
      colonia,
      localidad,
      municipio,
      estado,
      codigoPostal ? `CP ${codigoPostal}` : '',
    ]
      .filter((parte) => parte && parte.trim().length > 0)
      .join(', ');

    // Guardar los detalles en el draft
    update({
      direccion: direccionFormateada,
      seguroMedico,
      tipoSangre: sangre,
      alergias: selectedAlergias,
    });

    navigation.navigate('RegisterStep3');
  };

  return {
    // Dirección
    calle,
    setCalle,
    numero,
    setNumero,
    colonia,
    setColonia,
    localidad,
    setLocalidad,
    municipio,
    setMunicipio,
    estado,
    setEstado,
    codigoPostal,
    setCodigoPostal,
    seguroMedico,
    setSeguroMedico,
    // Sangre
    sangre,
    setSangre,
    bloodTypes: TIPOS_SANGRE,
    // Alergias
    search,
    setSearch,
    selectedAlergias,
    addAllergy,
    removeAllergy,
    suggestions,
    // Navegación
    goBack,
    continuar,
  };
};
