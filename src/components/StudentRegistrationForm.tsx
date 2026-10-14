import React, { useState } from 'react';
import { Student, StudentCategory } from '../types';
import {
  UserCheck,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  HeartPulse,
  Phone,
  Calendar,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  sedes: string[];
  onAddSede: (newSede: string) => void;
  onRegisterStudents: (newStudents: Omit<Student, 'id' | 'joinedDate'>[]) => void;
}

interface MinorChildForm {
  fullName: string;
  birthDate: string;
  category: StudentCategory;
  branch: 'Femenil' | 'Varonil';
  allergies: string;
  chronicCondition: string;
}

export const StudentRegistrationForm: React.FC<Props> = ({
  sedes,
  onAddSede,
  onRegisterStudents,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState<'adult' | 'minor'>('adult');
  const [showNewSedeInput, setShowNewSedeInput] = useState(false);
  const [newSedeName, setNewSedeName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Formulario Mayor de Edad
  const [adultForm, setAdultForm] = useState({
    fullName: '',
    birthDate: '',
    whatsapp: '',
    campus: sedes[0] || 'Tlalnepantla',
    allergies: '',
    chronicCondition: '',
    emergencyPhone: '',
    category: 'Sub 23' as StudentCategory,
    branch: 'Femenil' as 'Femenil' | 'Varonil',
  });

  // Formulario Tutor (Menores de edad)
  const [tutorForm, setTutorForm] = useState({
    tutorName: '',
    whatsapp: '',
    campus: sedes[0] || 'Tlalnepantla',
    emergencyPhone: '',
  });

  const [children, setChildren] = useState<MinorChildForm[]>([
    {
      fullName: '',
      birthDate: '',
      category: 'Juvenil',
      branch: 'Femenil',
      allergies: '',
      chronicCondition: '',
    },
  ]);

  const handleCreateSede = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSedeName.trim();
    if (!clean) return;
    onAddSede(clean);
    if (mode === 'adult') {
      setAdultForm((prev) => ({ ...prev, campus: clean }));
    } else {
      setTutorForm((prev) => ({ ...prev, campus: clean }));
    }
    setNewSedeName('');
    setShowNewSedeInput(false);
  };

  const handleAddChild = () => {
    setChildren((prev) => [
      ...prev,
      {
        fullName: '',
        birthDate: '',
        category: 'Infantil',
        branch: 'Femenil',
        allergies: '',
        chronicCondition: '',
      },
    ]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length <= 1) return;
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: keyof MinorChildForm, value: string) => {
    setChildren((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmitAdult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adultForm.fullName.trim() || !adultForm.whatsapp.trim()) return;

    const newStudent: Omit<Student, 'id' | 'joinedDate'> = {
      fullName: adultForm.fullName.trim(),
      birthDate: adultForm.birthDate,
      category: adultForm.category,
      branch: adultForm.branch,
      jerseyNumber: Math.floor(1 + Math.random() * 99),
      campus: adultForm.campus,
      whatsapp: adultForm.whatsapp.trim(),
      allergies: adultForm.allergies.trim() || 'Ninguna reportada',
      chronicCondition: adultForm.chronicCondition.trim() || 'Ninguna reportada',
      emergencyPhone: adultForm.emergencyPhone.trim() || adultForm.whatsapp.trim(),
      monthlyFee: 800,
      dueDay: 5,
      tutorName: 'Autónomo (Mayor de edad)',
      tutorPhone: adultForm.whatsapp.trim(),
      tutorEmail: '',
      currentBalance: 800,
      status: 'adeudo',
      registrationType: 'adult',
    };

    onRegisterStudents([newStudent]);
    setSuccessMessage(`¡Registro exitoso! Alumno ${adultForm.fullName} registrado en Geckop´s Voleibol.`);
    setAdultForm({
      fullName: '',
      birthDate: '',
      whatsapp: '',
      campus: sedes[0] || 'Tlalnepantla',
      allergies: '',
      chronicCondition: '',
      emergencyPhone: '',
      category: 'Sub 23',
      branch: 'Femenil',
    });
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleSubmitTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorForm.tutorName.trim() || !tutorForm.whatsapp.trim()) return;

    const validChildren = children.filter((c) => c.fullName.trim().length > 0);
    if (validChildren.length === 0) return;

    const studentsToRegister: Omit<Student, 'id' | 'joinedDate'>[] = validChildren.map((ch, idx) => ({
      fullName: ch.fullName.trim(),
      birthDate: ch.birthDate,
      category: ch.category,
      branch: ch.branch,
      jerseyNumber: Math.floor(1 + Math.random() * 99),
      campus: tutorForm.campus,
      whatsapp: tutorForm.whatsapp.trim(),
      allergies: ch.allergies.trim() || 'Ninguna reportada',
      chronicCondition: ch.chronicCondition.trim() || 'Ninguna reportada',
      emergencyPhone: tutorForm.emergencyPhone.trim() || tutorForm.whatsapp.trim(),
      monthlyFee: 750,
      dueDay: 5,
      tutorName: tutorForm.tutorName.trim(),
      tutorPhone: tutorForm.whatsapp.trim(),
      tutorEmail: '',
      currentBalance: 750,
      status: 'adeudo',
      registrationType: 'minor',
    }));

    onRegisterStudents(studentsToRegister);
    setSuccessMessage(
      `¡Registro familiar exitoso! ${studentsToRegister.length} alumno(s) inscritos bajo la tutela de ${tutorForm.tutorName}.`
    );
    setTutorForm({
      tutorName: '',
      whatsapp: '',
      campus: sedes[0] || 'Tlalnepantla',
      emergencyPhone: '',
    });
    setChildren([
      {
        fullName: '',
        birthDate: '',
        category: 'Juvenil',
        branch: 'Femenil',
        allergies: '',
        chronicCondition: '',
      },
    ]);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 transition-all duration-300">
      {/* Banner / Header del formulario visible */}
      <div className="bg-white rounded-2xl border-2 border-[#363435]/15 shadow-sm overflow-hidden">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-gradient-to-r from-neutral-50 to-white hover:bg-neutral-100/70 transition select-none"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#363435] text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Inscripciones Abiertas
                </span>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">Ciclo 2026</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight mt-0.5 truncate">
                Formulario de Acceso y Registro de Alumnos
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#363435] hidden sm:inline">
              {isOpen ? 'Ocultar formulario' : 'Abrir formulario'}
            </span>
            <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="mx-4 sm:mx-6 my-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Contenido desplegado del formulario */}
        {isOpen && (
          <div className="p-4 sm:p-6 border-t border-neutral-100 space-y-6">
            {/* Selector de Tipo de Registro: Mayor de Edad vs Padre/Tutor (Menor) */}
            <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('adult')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'adult'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#363435]" />
                <span>Alumno Mayor de Edad (18+ años)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('minor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'minor'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Users className="w-4 h-4 text-[#363435]" />
                <span>Padre / Tutor (Menor de Edad - 1 a 3+ hijos)</span>
              </button>
            </div>

            {/* FORMULARIO MAYOR DE EDAD */}
            {mode === 'adult' && (
              <form onSubmit={handleSubmitAdult} className="space-y-4 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 text-[11px] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#363435] shrink-0" />
                  <span>
                    Registro individual para atletas mayores de edad. Los datos quedarán registrados de forma autónoma.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Nombre completo */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Nombre Completo del Alumno *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Valeria Sánchez Mendoza"
                      value={adultForm.fullName}
                      onChange={(e) => setAdultForm({ ...adultForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      required
                      value={adultForm.birthDate}
                      onChange={(e) => setAdultForm({ ...adultForm, birthDate: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 font-mono text-xs"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      WhatsApp (Número de contacto) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+52 55..."
                      value={adultForm.whatsapp}
                      onChange={(e) => setAdultForm({ ...adultForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                    />
                  </div>

                  {/* Sede con opción de agregar nuevas sedes */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-neutral-800">
                        Sede de Entrenamiento *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewSedeInput(!showNewSedeInput)}
                        className="text-[10px] text-[#363435] font-bold underline cursor-pointer"
                      >
                        + Agregar nueva sede
                      </button>
                    </div>

                    <select
                      value={adultForm.campus}
                      onChange={(e) => setAdultForm({ ...adultForm, campus: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-medium"
                    >
                      {sedes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {showNewSedeInput && (
                      <div className="mt-2 flex gap-1.5 animate-in fade-in">
                        <input
                          type="text"
                          placeholder="Nombre de la nueva sede..."
                          value={newSedeName}
                          onChange={(e) => setNewSedeName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleCreateSede}
                          className="px-3 py-1.5 bg-[#363435] text-white font-bold rounded-lg text-xs hover:bg-black"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Teléfono de emergencia */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Teléfono de Contacto (Emergencias) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Teléfono familiar o de auxilio"
                      value={adultForm.emergencyPhone}
                      onChange={(e) => setAdultForm({ ...adultForm, emergencyPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={adultForm.category}
                      onChange={(e) =>
                        setAdultForm({ ...adultForm, category: e.target.value as StudentCategory })
                      }
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-semibold"
                    >
                      <option value="Sub 23">Sub 23</option>
                      <option value="Juvenil">Juvenil</option>
                      <option value="Infantil">Infantil</option>
                      <option value="Mini">Mini</option>
                    </select>
                  </div>

                  {/* Rama */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Rama *
                    </label>
                    <select
                      value={adultForm.branch}
                      onChange={(e) =>
                        setAdultForm({
                          ...adultForm,
                          branch: e.target.value as 'Femenil' | 'Varonil',
                        })
                      }
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-semibold"
                    >
                      <option value="Femenil">Femenil</option>
                      <option value="Varonil">Varonil</option>
                    </select>
                  </div>

                  {/* Alergias */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Alergias (Alimentos, medicamentos, etc.)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Penicilina, polen (o 'Ninguna')"
                      value={adultForm.allergies}
                      onChange={(e) => setAdultForm({ ...adultForm, allergies: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                    />
                  </div>

                  {/* Enfermedad o padecimiento crónico */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Enfermedad o Padecimiento Crónico
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Asma, diabetes (o 'Ninguna')"
                      value={adultForm.chronicCondition}
                      onChange={(e) =>
                        setAdultForm({ ...adultForm, chronicCondition: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#000000] hover:bg-[#363435] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Completar Inscripción de Alumno Mayor de Edad</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORMULARIO PADRE / TUTOR (MENOR DE EDAD CON OPCIÓN DE AGREGAR MÁS HIJOS) */}
            {mode === 'minor' && (
              <form onSubmit={handleSubmitTutor} className="space-y-5 text-xs">
                {/* Datos del Tutor */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <h4 className="font-extrabold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#363435]" />
                    <span>1. Datos del Padre / Tutor Responsable</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-neutral-800 mb-1">
                        Nombre Completo del Tutor *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Ing. Carlos Alberto Morales"
                        value={tutorForm.tutorName}
                        onChange={(e) => setTutorForm({ ...tutorForm, tutorName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">
                        WhatsApp del Tutor *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+52 55..."
                        value={tutorForm.whatsapp}
                        onChange={(e) => setTutorForm({ ...tutorForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">
                        Teléfono de Contacto (Emergencias)
                      </label>
                      <input
                        type="tel"
                        placeholder="Segundo teléfono o contacto adicional"
                        value={tutorForm.emergencyPhone}
                        onChange={(e) =>
                          setTutorForm({ ...tutorForm, emergencyPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-neutral-800">
                          Sede de Entrenamiento *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNewSedeInput(!showNewSedeInput)}
                          className="text-[10px] text-[#363435] font-bold underline cursor-pointer"
                        >
                          + Agregar nueva sede
                        </button>
                      </div>

                      <select
                        value={tutorForm.campus}
                        onChange={(e) => setTutorForm({ ...tutorForm, campus: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-medium"
                      >
                        {sedes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {showNewSedeInput && (
                        <div className="mt-2 flex gap-1.5 animate-in fade-in">
                          <input
                            type="text"
                            placeholder="Nombre de la nueva sede..."
                            value={newSedeName}
                            onChange={(e) => setNewSedeName(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleCreateSede}
                            className="px-3 py-1.5 bg-[#363435] text-white font-bold rounded-lg text-xs hover:bg-black"
                          >
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sección de Hijos / Alumnos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-neutral-900 text-xs uppercase tracking-wider">
                      2. Registro de Alumnos / Hijos ({children.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddChild}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-[#363435] transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Agregar otro hijo / alumno</span>
                    </button>
                  </div>

                  {children.map((child, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-3 relative"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#363435] text-white flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>Hijo / Alumno #{idx + 1}</span>
                        </span>

                        {children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveChild(idx)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1 p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Nombre Completo del Alumno *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nombre y apellidos del menor"
                            value={child.fullName}
                            onChange={(e) => handleChildChange(idx, 'fullName', e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Fecha de Nacimiento *
                          </label>
                          <input
                            type="date"
                            required
                            value={child.birthDate}
                            onChange={(e) => handleChildChange(idx, 'birthDate', e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Categoría *
                          </label>
                          <select
                            value={child.category}
                            onChange={(e) =>
                              handleChildChange(idx, 'category', e.target.value as StudentCategory)
                            }
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-semibold"
                          >
                            <option value="Mini">Mini</option>
                            <option value="Infantil">Infantil</option>
                            <option value="Juvenil">Juvenil</option>
                            <option value="Sub 23">Sub 23</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Rama *
                          </label>
                          <select
                            value={child.branch}
                            onChange={(e) =>
                              handleChildChange(
                                idx,
                                'branch',
                                e.target.value as 'Femenil' | 'Varonil'
                              )
                            }
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs font-semibold"
                          >
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Alergias
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Alergia a nueces o picadura (o 'Ninguna')"
                            value={child.allergies}
                            onChange={(e) => handleChildChange(idx, 'allergies', e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-neutral-800 mb-1">
                            Enfermedad o Padecimiento Crónico
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Asma, problemas cardíacos (o 'Ninguna')"
                            value={child.chronicCondition}
                            onChange={(e) =>
                              handleChildChange(idx, 'chronicCondition', e.target.value)
                            }
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#363435] text-neutral-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#000000] hover:bg-[#363435] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Inscribir Tutor con {children.length} Alumno(s)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
