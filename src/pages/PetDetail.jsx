import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApiClient } from "../hooks/useApiClient";
import { usePets } from "../hooks/usePets";
import { toasts } from "../utils/toasts";
import { formatDateForDisplay, toISOStringGMT3, fromInputDateTimeGMT3 } from "../utils/dateUtils";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { QRCodeSVG } from "qrcode.react";

function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const api = useApiClient();
  const { pets, setSelectedPet, removePet, setError } = usePets();

  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingComponent, setLoadingComponent] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(<></>);
  const [modalTitulo, setModalTitulo] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    description: '',
    dateTime: new Date().toISOString().slice(0, 16)
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareStep, setShareStep] = useState(1); // 1: email input, 2: user confirmation
  const [shareForm, setShareForm] = useState({
    email: '',
    role: 'Familiar'
  });
  const [foundUser, setFoundUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [vetStep, setVetStep] = useState(1); // 1: email input, 2: vet confirmation
  const [vetForm, setVetForm] = useState({
    email: ''
  });
  const [foundVet, setFoundVet] = useState(null);
  const [loadingVet, setLoadingVet] = useState(false);
  const [showAssignedUsersModal, setShowAssignedUsersModal] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingAssignedUsers, setLoadingAssignedUsers] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPetDetails();
  }, [id, user, navigate]);

  const handleCloseModal = () => setIsModalOpen(false);

  const fetchPetDetails = async () => {
    const loadingToast = toasts.loading("Cargando detalles de la mascota...");

    try {
      setLoadingComponent(true);

      const petFromStore = pets.find((p) => p.id === parseInt(id));
      if (petFromStore) {
        setPet(petFromStore);
        setSelectedPet(petFromStore);
      }

      // Cargar detalles de la mascota
      const petResponse = await api.get(`/pets/${id}`);
      setPet(petResponse.data);
      setSelectedPet(petResponse.data);

      // Cargar registros médicos
      const recordsResponse = await api.get(`/records/${id}`);
      setRecords(recordsResponse.data);

      // Cargar registros clínicos
      const clinicalResponse = await api.get(`/clinical-records/pet/${id}`);
      setClinicalRecords(clinicalResponse.data);

      // Cargar notas
      const notesResponse = await api.get(`/notes/pet/${id}`);
      setNotes(notesResponse.data);

      toasts.dismissById(loadingToast);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg =
        error.response?.data?.message ||
        "Error al cargar los detalles de la mascota";
      toasts.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoadingComponent(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today - birth);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );

    if (diffYears > 0) {
      return diffMonths > 0
        ? `${diffYears} años, ${diffMonths} meses`
        : `${diffYears} años`;
    }
    return diffMonths > 0 ? `${diffMonths} meses` : "Menos de 1 mes";
  };

  const getSpeciesEmoji = (species) => {
    const speciesMap = {
      perro: "🐶",
      gato: "🐱",
      ave: "🦅",
      conejo: "🐰",
      hamster: "🐹",
      pez: "🐟",
      reptil: "🦎",
      otro: "🐾",
    };
    return speciesMap[species?.toLowerCase()] || "🐾";
  };

  const getGenderEmoji = (gender) => {
    const genderMap = {
      macho: "♂️",
      hembra: "♀️",
      desconocido: "❓"
    };
    return genderMap[gender?.toLowerCase()] || "❓";
  };

  const getGenderLabel = (gender) => {
    const labelMap = {
      macho: "Macho",
      hembra: "Hembra", 
      desconocido: "Desconocido"
    };
    return labelMap[gender?.toLowerCase()] || "No especificado";
  };

  const handleEdit = () => navigate(`/pets/${id}/edit`);

  const handleDelete = async () => {
    const deletingToast = toasts.loading(`Eliminando a ${pet.name}...`);

    try {
      await api.delete(`/pets/${id}`);

      removePet(parseInt(id));

      toasts.dismissById(deletingToast);
      toasts.pet.deleted(pet.name);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toasts.dismissById(deletingToast);
      const errorMsg =
        error.response?.data?.message || "Error al eliminar la mascota";
      toasts.error(errorMsg);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleGenerateQR = async () => {
    const generatingToast = toasts.loading(
      `Generando código QR para ${pet.name}...`
    );

    try {
      const response = await api.post(`/qr/generate/${id}`);
      console.log("🚀 ~ handleGenerateQR ~ response:", response);

      toasts.dismissById(generatingToast);
      toasts.pet.qrGenerated(pet.name);

      // Si el endpoint devuelve una URL del QR o datos, los podemos usar aquí
      if (response.data?.url || response.data?.url) {
        // Aquí se puede abrir el QR en una nueva ventana, descargarlo, o mostrarlo en un modal
        const qrData = response.data.url || response.data.qrCode;
        
        setIsModalOpen(true);
        setModalBody(
          <div className="flex justify-center items-center">
            <QRCodeSVG value={qrData} />
          </div>
        );
        setModalTitulo("El veterinario debe escanear el QR para evolucionar la mascota")
      }
    } catch (error) {
      toasts.dismissById(generatingToast);
      const errorMsg =
        error.response?.data?.message || "Error al generar el código QR";
      toasts.error(errorMsg);
    }
  };

  const handleGenerateGeneralQR = async () => {
    const generatingToast = toasts.loading(
      `Generando código QR general para ${pet.name}...`
    );

    try {
      const response = await api.get(`/qr/accesogralqr/${id}`);
      console.log("🚀 ~ handleGenerateGeneralQR ~ response:", response);

      toasts.dismissById(generatingToast);
      toasts.success(`Código QR general generado para ${pet.name}`);

      // Mostrar QR en modal con la URL devuelta
      if (response.data?.qrUrl) {
        setIsModalOpen(true);
        setModalBody(
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG value={response.data.qrUrl} size={256} />
            <p className="text-sm text-gray-600 text-center">
              Código QR de identificacion para {pet.name}
            </p>
          </div>
        );
        setModalTitulo("Código QR identificacion de mascota")
      }
    } catch (error) {
      toasts.dismissById(generatingToast);
      const errorMsg =
        error.response?.data?.message || "Error al generar el código QR general";
      toasts.error(errorMsg);
    }
  };

  const handleDeleteRecord = async (recordId, recordDescription) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar este registro médico?\n\n"${recordDescription}"`
    );

    if (!confirmDelete) return;

    const deletingToast = toasts.loading("Eliminando registro médico...");

    try {
      await api.delete(`/records/${recordId}`);

      // Actualizar la lista de registros
      setRecords(records.filter((record) => record.id !== recordId));

      toasts.dismissById(deletingToast);
      toasts.success("🗑️ Registro médico eliminado exitosamente");
    } catch (error) {
      toasts.dismissById(deletingToast);
      const errorMsg =
        error.response?.data?.message || "Error al eliminar el registro médico";
      toasts.error(errorMsg);
    }
  };

  const handleViewClinicalRecord = (record) => {
    // Navegar a la nueva página de detalle del registro clínico
    navigate(`/pets/${id}/clinical-records/${record.id}`);
  };

  // Funciones para manejo de notas
  const handleOpenNotesModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        description: note.description,
        dateTime: new Date(note.dateTime).toISOString().slice(0, 16)
      });
    } else {
      setEditingNote(null);
      setNoteForm({
        description: '',
        dateTime: new Date().toISOString().slice(0, 16)
      });
    }
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setEditingNote(null);
    setNoteForm({
      description: '',
      dateTime: new Date().toISOString().slice(0, 16)
    });
  };

  const handleNoteFormChange = (e) => {
    const { name, value } = e.target;
    setNoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    
    if (!noteForm.description.trim()) {
      toasts.error('La descripción de la nota es requerida');
      return;
    }

    if (!noteForm.dateTime) {
      toasts.error('La fecha y hora son requeridas');
      return;
    }

    // Validar que la fecha sea válida
    const dateTimeValue = new Date(noteForm.dateTime);
    if (isNaN(dateTimeValue.getTime())) {
      toasts.error('La fecha y hora ingresadas no son válidas');
      return;
    }

    const savingToast = toasts.loading(
      editingNote ? 'Actualizando nota...' : 'Guardando nota...'
    );

    try {
      console.log("🚀 ~ handleSaveNote ~ noteForm:", noteForm)
      console.log("🚀 ~ handleSaveNote ~ noteForm.dateTime:", noteForm.dateTime)
      console.log("🚀 ~ handleSaveNote ~ fromInputDateTimeGMT3(noteForm.dateTime):", fromInputDateTimeGMT3(noteForm.dateTime))
      
      const noteData = {
        description: noteForm.description,
        
        dateTime: toISOStringGMT3(fromInputDateTimeGMT3(noteForm.dateTime)),
        ...(editingNote ? {} : { petId: parseInt(id) })
      };

      let response;
      if (editingNote) {
        response = await api.put(`/notes/${editingNote.id}`, noteData);
        // Actualizar la nota en la lista
        setNotes(notes.map(note => 
          note.id === editingNote.id ? response.data : note
        ));
      } else {
        console.log("🚀 ~ handleSaveNote ~ noteData:", noteData)
        response = await api.post('/notes', noteData);
        
        console.log("🚀 ~ handleSaveNote ~ response:", response)
        // Agregar la nueva nota a la lista
        setNotes([response.data, ...notes]);
      }

      toasts.dismissById(savingToast);
      toasts.success(
        editingNote ? '📝 Nota actualizada exitosamente' : '📝 Nueva nota agregada'
      );
      handleCloseNotesModal();
    } catch (error) {
      console.log("🚀 ~ handleSaveNote ~ error:", error)
      toasts.dismissById(savingToast);
      const errorMsg = error.response?.data?.message || 
        `Error al ${editingNote ? 'actualizar' : 'guardar'} la nota`;
      toasts.error(errorMsg);
    }
  };

  const handleDeleteNote = async (noteId, description) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar esta nota?\n\n"${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`
    );

    if (!confirmDelete) return;

    const deletingToast = toasts.loading('Eliminando nota...');

    try {
      await api.delete(`/notes/${noteId}`);
      
      // Remover la nota de la lista
      setNotes(notes.filter(note => note.id !== noteId));
      
      toasts.dismissById(deletingToast);
      toasts.success('🗑️ Nota eliminada exitosamente');
    } catch (error) {
      toasts.dismissById(deletingToast);
      const errorMsg = error.response?.data?.message || 'Error al eliminar la nota';
      toasts.error(errorMsg);
    }
  };

  // Funciones para compartir con familia
  const handleOpenShareModal = () => {
    setShowShareModal(true);
    setShareStep(1);
    setShareForm({ email: '', role: 'Familiar' });
    setFoundUser(null);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setShareStep(1);
    setShareForm({ email: '', role: 'Familiar' });
    setFoundUser(null);
    setLoadingUser(false);
  };

  const handleShareFormChange = (e) => {
    const { name, value } = e.target;
    setShareForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    
    if (!shareForm.email.trim()) {
      toasts.error('El email es requerido');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareForm.email)) {
      toasts.error('Por favor ingresa un email válido');
      return;
    }

    setLoadingUser(true);
    const searchingToast = toasts.loading('Buscando usuario...');

    try {
      const response = await api.get(`/users/by-email?email=${encodeURIComponent(shareForm.email)}`);
      
      if (response.data.user) {
        setFoundUser(response.data.user);
        setShareStep(2);
        toasts.dismissById(searchingToast);
        toasts.success(`Usuario encontrado: ${response.data.user.name}`);
      }
    } catch (error) {
      toasts.dismissById(searchingToast);
      if (error.response?.data?.error === 'Usuario no encontrado') {
        toasts.error('No se encontró un usuario con ese email');
      } else {
        const errorMsg = error.response?.data?.message || 'Error al buscar el usuario';
        toasts.error(errorMsg);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSharePet = async (e) => {
    e.preventDefault();
    
    if (!foundUser) {
      toasts.error('No hay usuario seleccionado');
      return;
    }

    const sharingToast = toasts.loading(`Compartiendo ${pet.name} con ${foundUser.name}...`);

    try {
      const shareData = {
        petId: parseInt(id),
        userId: foundUser.id,
        role: shareForm.role
      };

      await api.post('/user-pet', shareData);
      
      toasts.dismissById(sharingToast);
      toasts.success(`¡${pet.name} ha sido compartido exitosamente con ${foundUser.name} como ${shareForm.role}!`);
      
      handleCloseShareModal();
    } catch (error) {
      toasts.dismissById(sharingToast);
      const errorMsg = error.response?.data?.message || 'Error al compartir la mascota';
      toasts.error(errorMsg);
    }
  };

  // Funciones para asignar veterinario
  const handleOpenVetModal = () => {
    setShowVetModal(true);
    setVetStep(1);
    setVetForm({ email: '' });
    setFoundVet(null);
  };

  const handleCloseVetModal = () => {
    setShowVetModal(false);
    setVetStep(1);
    setVetForm({ email: '' });
    setFoundVet(null);
    setLoadingVet(false);
  };

  const handleVetFormChange = (e) => {
    const { name, value } = e.target;
    setVetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchVet = async (e) => {
    e.preventDefault();
    
    if (!vetForm.email.trim()) {
      toasts.error('El email es requerido');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vetForm.email)) {
      toasts.error('Por favor ingresa un email válido');
      return;
    }

    setLoadingVet(true);
    const searchingToast = toasts.loading('Buscando veterinario...');

    try {
      const response = await api.get(`/users/by-email?email=${encodeURIComponent(vetForm.email)}`);
      
      if (response.data.user) {
        // Verificar que el usuario sea veterinario
        if (response.data.user.role !== 'VET') {
          toasts.dismissById(searchingToast);
          toasts.error('El usuario encontrado no corresponde a un veterinario');
          return;
        }
        
        setFoundVet(response.data.user);
        setVetStep(2);
        toasts.dismissById(searchingToast);
        toasts.success(`Veterinario encontrado: ${response.data.user.name}`);
      }
    } catch (error) {
      toasts.dismissById(searchingToast);
      if (error.response?.data?.error === 'Usuario no encontrado') {
        toasts.error('No se encontró un usuario con ese email');
      } else {
        const errorMsg = error.response?.data?.message || 'Error al buscar el veterinario';
        toasts.error(errorMsg);
      }
    } finally {
      setLoadingVet(false);
    }
  };

  const handleAssignVet = async (e) => {
    e.preventDefault();
    
    if (!foundVet) {
      toasts.error('No hay veterinario seleccionado');
      return;
    }

    const assigningToast = toasts.loading(`Asignando Dr. ${foundVet.name} a ${pet.name}...`);

    try {
      const assignData = {
        petId: parseInt(id),
        userId: foundVet.id,
        role: 'VET'
      };

      await api.post('/user-pet', assignData);
      
      toasts.dismissById(assigningToast);
      toasts.success(`¡Dr. ${foundVet.name} ha sido asignado exitosamente como veterinario de ${pet.name}!`);
      
      handleCloseVetModal();
    } catch (error) {
      toasts.dismissById(assigningToast);
      const errorMsg = error.response?.data?.message || 'Error al asignar el veterinario';
      toasts.error(errorMsg);
    }
  };

  // Funciones para usuarios asignados
  const handleOpenAssignedUsersModal = async () => {
    setShowAssignedUsersModal(true);
    await fetchAssignedUsers();
  };

  const handleCloseAssignedUsersModal = () => {
    setShowAssignedUsersModal(false);
    setAssignedUsers([]);
  };

  const fetchAssignedUsers = async () => {
    setLoadingAssignedUsers(true);
    const loadingToast = toasts.loading('Cargando usuarios asignados...');

    try {
      const response = await api.get(`/user-pet/${id}`);
      
      // Filtrar para no mostrar el usuario logueado
      const filteredUsers = response.data.filter(userPet => userPet.userId !== user.id);
      setAssignedUsers(filteredUsers);
      
      toasts.dismissById(loadingToast);
    } catch (error) {
      toasts.dismissById(loadingToast);
      const errorMsg = error.response?.data?.message || 'Error al cargar los usuarios asignados';
      toasts.error(errorMsg);
    } finally {
      setLoadingAssignedUsers(false);
    }
  };

  const handleRemoveUser = async (userId, userName, role) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres quitar a ${userName} como ${role} de ${pet.name}?`
    );

    if (!confirmDelete) return;

    const removingToast = toasts.loading(`Quitando a ${userName}...`);

    try {
      await api.delete(`/user-pet/${id}/${userId}`);
      
      // Actualizar la lista removiendo el usuario
      setAssignedUsers(assignedUsers.filter(userPet => userPet.userId !== userId));
      
      toasts.dismissById(removingToast);
      toasts.success(`${userName} ha sido quitado exitosamente de ${pet.name}`);
    } catch (error) {
      toasts.dismissById(removingToast);
      const errorMsg = error.response?.data?.message || 'Error al quitar el usuario';
      toasts.error(errorMsg);
    }
  };

  const getRoleEmoji = (role) => {
    const roleMap = {
      'VET': '👨‍⚕️',
      'Familiar': '👨‍👩‍👧‍👦',
      'CUIDADOR': '🤗',
      'Cuidador': '🤗'
    };
    return roleMap[role] || '👤';
  };

  const getRoleLabel = (role) => {
    const labelMap = {
      'VET': 'Veterinario',
      'Familiar': 'Familiar',
      'CUIDADOR': 'Cuidador',
      'Cuidador': 'Cuidador'
    };
    return labelMap[role] || role;
  };

  if (loadingComponent) {
    return (
      <Loading
        message={`Cargando detalles de ${pet?.name || "la mascota"}...`}
        variant="paw"
      />
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mascota no encontrada
          </h2>
          <p className="text-red-600 mb-4">La mascota que buscas no existe</p>
          <button
            onClick={() => {
              toasts.info("Regresando al dashboard");
              navigate("/dashboard");
            }}
            className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            🏠 Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header con información de la mascota */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-4xl">{getSpeciesEmoji(pet.especie)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-display mb-2 text-gray-800">
                  {pet.name}
                </h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                    {pet.especie || "Sin especie"}
                  </span>
                  <span className="text-sm text-gray-600">
                    🎂 {calculateAge(pet.fechaNacimiento)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEdit}
                className="bg-white/20 hover:bg-gray-300 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 text-gray-800 border-2 border-gray-400"
              >
                <span>✏️</span>
                <span>Editar</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-500/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>🗑️</span>
                <span>Eliminar</span>
              </button>
              <button
                onClick={handleGenerateGeneralQR}
                className="bg-purple-500 hover:bg-purple-600 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>QR Identificacion</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información detallada */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center space-x-2">
                <span>📋</span>
                <span>Información Básica</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { icon: "🏷️", label: "Nombre", value: pet.name },
                    {
                      icon: "🌿",
                      label: "Especie",
                      value: pet.especie || "No especificada",
                    },
                    {
                      icon: "🐕",
                      label: "Raza",
                      value: pet.raza || "No especificada",
                    },
                    {
                      icon: getGenderEmoji(pet.genero),
                      label: "Género",
                      value: getGenderLabel(pet.genero),
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {item.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: "⚖️",
                      label: "Peso",
                      value: pet.peso ? `${pet.peso} kg` : "No registrado",
                    },
                    {
                      icon: "🎂",
                      label: "Edad",
                      value: calculateAge(pet.fechaNacimiento),
                    },
                    {
                      icon: "📅",
                      label: "Fecha de Nacimiento",
                      value: pet.fechaNacimiento
                        ? new Date(pet.fechaNacimiento).toLocaleDateString()
                        : "No especificada",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-xl"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {item.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {pet.observaciones && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <span>📝</span>
                  <span>Observaciones</span>
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {pet.observaciones}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <span>⚡</span>
                <span>Acciones</span>
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenShareModal}
                  className="w-full btn-success text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>👨‍👩‍👧‍👦</span>
                  <span>Compartir con familia</span>
                </button>

                <button
                  onClick={handleOpenVetModal}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>👨‍⚕️</span>
                  <span>Asignar veterinario</span>
                </button>

                <button
                  onClick={handleOpenAssignedUsersModal}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>👥</span>
                  <span>Usuarios asignados</span>
                </button>

                <button
                  onClick={handleGenerateQR}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>Generar QR veterinario</span>
                </button>

                <button
                  onClick={() => handleOpenNotesModal()}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>📝</span>
                  <span>Agregar nota</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Historial clínico */}
        <div className="mt-8 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold font-display flex items-center space-x-2">
                <span>🏥</span>
                <span>Historial Médico</span>
              </h2>
              <button
                onClick={() => navigate(`/pets/${id}/medical-records/new`)}
                className="btn-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Agregar registro</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {records.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin registros médicos
                </h3>
                <p className="text-gray-600 mb-6">
                  Esta mascota aún no tiene registros médicos
                </p>
                <button
                  onClick={() => navigate(`/pets/${id}/medical-records/new`)}
                  className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Agregar primer registro
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        📅 Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        🩺 Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        👨‍⚕️ Veterinario
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        📝 Descripción
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ⚡ Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateForDisplay(record.date || record.fecha)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.type || record.tipo || "Consulta"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {record.vetName ||
                            record.veterinario ||
                            "No especificado"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div
                            className="truncate"
                            title={
                              record.description ||
                              record.diagnostico ||
                              "Sin descripción"
                            }
                          >
                            {(
                              record.description ||
                              record.diagnostico ||
                              "Sin descripción"
                            ).substring(0, 100)}
                            {(record.description || record.diagnostico || "")
                              .length > 100 && "..."}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/pets/${id}/medical-records/${record.id}/edit`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg"
                              title="Editar registro"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteRecord(
                                  record.id,
                                  record.description ||
                                    record.diagnostico ||
                                    "Registro médico"
                                )
                              }
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                              title="Eliminar registro"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Registros Clínicos */}
        <div className="mt-8 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold font-display flex items-center space-x-2">
              <span>👩‍⚕️</span>
              <span>Registros Clínicos</span>
            </h2>
          </div>

          <div className="p-6">
            {clinicalRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👩‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin registros clínicos
                </h3>
                <p className="text-gray-600">
                  Esta mascota aún no tiene registros clínicos realizados por veterinarios
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        📅 Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        🩺 Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        👩‍⚕️ Veterinario
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        📝 Descripción
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ⚡ Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clinicalRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateForDisplay(record.fecha)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div>
                            <p>{record.vetName}</p>
                            {record.vetEmail && (
                              <p className="text-xs text-gray-500">{record.vetEmail}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div
                            className="truncate"
                            title={record.description || "Sin descripción"}
                          >
                            {(record.description || "Sin descripción").substring(0, 100)}
                            {(record.description || "").length > 100 && "..."}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleViewClinicalRecord(record)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg"
                            title="Ver registro completo"
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Notas */}
        <div className="mt-8 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold font-display flex items-center space-x-2">
                <span>📝</span>
                <span>Notas de {pet.name}</span>
              </h2>
              <button
                onClick={() => handleOpenNotesModal()}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Agregar nota</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin notas registradas
                </h3>
                <p className="text-gray-600 mb-6">
                  Aún no hay notas para {pet.name}
                </p>
                <button
                  onClick={() => handleOpenNotesModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Agregar primera nota
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-600">📅</span>
                        <span className="text-sm font-medium text-gray-600">
                          {formatDateForDisplay(note.dateTime)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenNotesModal(note)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 hover:bg-blue-50 rounded"
                          title="Editar nota"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id, note.description)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                          title="Eliminar nota"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {note.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ¿Eliminar mascota?
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar a{" "}
                <strong>{pet.name}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} titulo={modalTitulo}>
        <div>{modalBody}</div>
      </Modal>

      {/* Modal para agregar/editar notas */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>📝</span>
                <span>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</span>
              </h3>
              <button
                onClick={handleCloseNotesModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={noteForm.dateTime}
                  onChange={handleNoteFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Descripción *
                </label>
                <textarea
                  name="description"
                  value={noteForm.description}
                  onChange={handleNoteFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all duration-300 resize-none"
                  rows="4"
                  placeholder="Escribe tu nota aquí..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseNotesModal}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  {editingNote ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para compartir con familia */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>👨‍👩‍👧‍👦</span>
                <span>Compartir {pet.name}</span>
              </h3>
              <button
                onClick={handleCloseShareModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            {shareStep === 1 && (
              <form onSubmit={handleSearchUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email del usuario
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shareForm.email}
                    onChange={handleShareFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300"
                    placeholder="usuario@ejemplo.com"
                    required
                    disabled={loadingUser}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseShareModal}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    disabled={loadingUser}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingUser}
                  >
                    {loadingUser ? 'Buscando...' : 'Buscar usuario'}
                  </button>
                </div>
              </form>
            )}

            {shareStep === 2 && foundUser && (
              <form onSubmit={handleSharePet} className="space-y-4">
                {/* Información del usuario encontrado */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                    <span>✅</span>
                    <span>Usuario encontrado</span>
                  </h4>
                  <div className="text-sm text-green-700">
                    <p><strong>Nombre:</strong> {foundUser.name}</p>
                    <p><strong>Email:</strong> {foundUser.email}</p>
                  </div>
                </div>

                {/* Selector de rol */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👥 Rol en la familia
                  </label>
                  <select
                    name="role"
                    value={shareForm.role}
                    onChange={handleShareFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300"
                    required
                  >
                    <option value="Familiar">Familiar</option>
                    <option value="Cuidador">Cuidador</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShareStep(1)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Compartir mascota
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal para asignar veterinario */}
      {showVetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>👨‍⚕️</span>
                <span>Asignar Veterinario a {pet.name}</span>
              </h3>
              <button
                onClick={handleCloseVetModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            {vetStep === 1 && (
              <form onSubmit={handleSearchVet} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email del veterinario
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={vetForm.email}
                    onChange={handleVetFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
                    placeholder="veterinario@clinica.com"
                    required
                    disabled={loadingVet}
                  />
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-700">
                    <strong>ℹ️ Nota:</strong> Solo usuarios con rol de veterinario pueden ser asignados a mascotas.
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseVetModal}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    disabled={loadingVet}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingVet}
                  >
                    {loadingVet ? 'Buscando...' : 'Buscar veterinario'}
                  </button>
                </div>
              </form>
            )}

            {vetStep === 2 && foundVet && (
              <form onSubmit={handleAssignVet} className="space-y-4">
                {/* Información del veterinario encontrado */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center space-x-2">
                    <span>✅</span>
                    <span>Veterinario encontrado</span>
                  </h4>
                  <div className="text-sm text-purple-700">
                    <p><strong>Nombre:</strong> Dr. {foundVet.name}</p>
                    <p><strong>Email:</strong> {foundVet.email}</p>
                    <p><strong>Rol:</strong> {foundVet.role}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700">
                    <strong>🩺 Confirmación:</strong> Dr. {foundVet.name} será asignado como veterinario responsable de {pet.name}.
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setVetStep(1)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Asignar veterinario
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal para usuarios asignados */}
      {showAssignedUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>👥</span>
                <span>Usuarios asignados a {pet.name}</span>
              </h3>
              <button
                onClick={handleCloseAssignedUsersModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            {loadingAssignedUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando usuarios...</p>
              </div>
            ) : assignedUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin usuarios asignados
                </h4>
                <p className="text-gray-600 mb-6">
                  No hay otros usuarios asignados a {pet.name}
                </p>
                <button
                  onClick={handleCloseAssignedUsersModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedUsers.map((userPet) => (
                  <div
                    key={`${userPet.userId}-${userPet.role}`}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{getRoleEmoji(userPet.role)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                            <span>{userPet.user.name}</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getRoleLabel(userPet.role)}
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600">{userPet.user.email}</p>
                          {userPet.addedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Asignado el {formatDateForDisplay(userPet.addedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(userPet.userId, userPet.user.name, getRoleLabel(userPet.role))}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                        title={`Quitar a ${userPet.user.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseAssignedUsersModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para usuarios asignados */}
      {showAssignedUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span>👥</span>
                <span>Usuarios asignados a {pet.name}</span>
              </h3>
              <button
                onClick={handleCloseAssignedUsersModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            {loadingAssignedUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando usuarios...</p>
              </div>
            ) : assignedUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin usuarios asignados
                </h4>
                <p className="text-gray-600 mb-6">
                  No hay otros usuarios asignados a {pet.name}
                </p>
                <button
                  onClick={handleCloseAssignedUsersModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedUsers.map((userPet) => (
                  <div
                    key={`${userPet.userId}-${userPet.role}`}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{getRoleEmoji(userPet.role)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                            <span>{userPet.user.name}</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getRoleLabel(userPet.role)}
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600">{userPet.user.email}</p>
                          {userPet.addedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Asignado el {formatDateForDisplay(userPet.addedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(userPet.userId, userPet.user.name, getRoleLabel(userPet.role))}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                        title={`Quitar a ${userPet.user.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseAssignedUsersModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PetDetail;
