import React, { useState } from 'react';
import {
  Trash2,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Server,
  KeyRound,
  Shield,
  Layers,
  Copy,
  Check,
  Code,
  ExternalLink,
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import { supabaseService, DEFAULT_SUPABASE_CONFIG } from '../utils/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onWipeAllSampleData: () => void;
  onRestoreSampleData: () => void;
  isCleared: boolean;
  supabaseConfig: SupabaseConfig;
  onSaveSupabaseConfig: (config: SupabaseConfig) => void;
  counts: {
    students: number;
    payments: number;
    cycles: number;
    notifications: number;
  };
}

export const SUPABASE_SQL_SCRIPT = `-- ====================================================================
-- GECKOP'S VOLEIBOL - ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE
-- Proyecto: geckos@appdesignsoftware.com (avchpdtkogejgnomkxua)
-- Instrucciones: Pega y ejecuta este script en el SQL Editor de Supabase
-- ====================================================================

-- 1. EXTENSIÓN PARA GENERACIÓN DE IDENTIFICADORES UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE SEDES DE ENTRENAMIENTO
CREATE TABLE IF NOT EXISTS public.sedes (
    id TEXT PRIMARY KEY DEFAULT ('sede_' || uuid_generate_v4()::text),
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS en sedes
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica/anon de sedes"
    ON public.sedes FOR SELECT USING (true);

CREATE POLICY "Permitir insercion y actualizacion publica/anon de sedes"
    ON public.sedes FOR ALL USING (true);

-- Insertar sedes iniciales oficiales
INSERT INTO public.sedes (name, is_active)
VALUES ('Tlalnepantla', true), ('Cuautitlán Izcalli', true)
ON CONFLICT (name) DO NOTHING;

-- 3. TABLA DE ALUMNOS REGISTRADOS (PADRÓN COMPLETO)
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    birth_date DATE,
    category TEXT NOT NULL,
    jersey_number INTEGER DEFAULT 0,
    branch TEXT NOT NULL,
    campus TEXT NOT NULL DEFAULT 'Tlalnepantla',
    whatsapp TEXT NOT NULL,
    allergies TEXT DEFAULT 'Ninguna reportada',
    chronic_condition TEXT DEFAULT 'Ninguna',
    emergency_phone TEXT,
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 750.00,
    due_day INTEGER NOT NULL DEFAULT 5,
    tutor_name TEXT NOT NULL,
    tutor_phone TEXT,
    tutor_email TEXT DEFAULT '',
    current_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'al_corriente',
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    registration_type TEXT NOT NULL DEFAULT 'minor',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para búsquedas de alumnos
CREATE INDEX IF NOT EXISTS idx_students_campus ON public.students(campus);
CREATE INDEX IF NOT EXISTS idx_students_category ON public.students(category);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON public.students(is_active);

-- Habilitar RLS en alumnos
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura completa de alumnos"
    ON public.students FOR SELECT USING (true);

CREATE POLICY "Permitir insercion, actualizacion y borrado de alumnos"
    ON public.students FOR ALL USING (true);

-- 4. TABLA DE COMPROBANTES DE PAGO (MENSUALIDADES Y PAGOS EXTRAS)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    payment_type TEXT NOT NULL DEFAULT 'mensualidad',
    extra_category TEXT,
    event_name TEXT,
    concept TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reported_date TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'Transferencia SPEI',
    reference_number TEXT NOT NULL DEFAULT '',
    receipt_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pendiente',
    reviewed_date TEXT,
    reviewed_by TEXT,
    rejection_reason TEXT,
    receipt_folio TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_type ON public.payments(payment_type);

-- Habilitar RLS en pagos
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura de pagos"
    ON public.payments FOR SELECT USING (true);

CREATE POLICY "Permitir gestion de pagos"
    ON public.payments FOR ALL USING (true);

-- 5. TABLA DE CICLOS DE COBRO
CREATE TABLE IF NOT EXISTS public.billing_cycles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    period TEXT NOT NULL,
    due_date DATE NOT NULL,
    default_fee NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    total_expected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_collected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_pending NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.billing_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir gestion de ciclos" ON public.billing_cycles FOR ALL USING (true);

-- 6. TABLA DE NOTIFICACIONES DEL SISTEMA
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id TEXT PRIMARY KEY,
    target_role TEXT NOT NULL DEFAULT 'all',
    student_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'reminder',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir gestion de avisos" ON public.system_notifications FOR ALL USING (true);
`;

export const DataManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onWipeAllSampleData,
  onRestoreSampleData,
  isCleared,
  supabaseConfig,
  onSaveSupabaseConfig,
  counts,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || DEFAULT_SUPABASE_CONFIG.url);
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.anonKey || DEFAULT_SUPABASE_CONFIG.anonKey);
  const [isConnected, setIsConnected] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [confirmWipeOpen, setConfirmWipeOpen] = useState(false);
  const [confirmSupabaseWipeOpen, setConfirmSupabaseWipeOpen] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await supabaseService.testConnection();
      setConnectionResult(res.message);
      setIsConnected(res.connected);
    } catch (err: any) {
      setConnectionResult(`Error: ${err?.message || 'Fallo de red'}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    const config: SupabaseConfig = {
      url: supabaseUrl.trim(),
      anonKey: supabaseKey.trim(),
      connected: !!(supabaseUrl.trim() && supabaseKey.trim()),
      lastSync: new Date().toISOString(),
    };
    setIsConnected(config.connected);
    onSaveSupabaseConfig(config);
    setActionMessage('Configuración de Supabase guardada correctamente.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleWipeData = () => {
    onWipeAllSampleData();
    setConfirmWipeOpen(false);
    setActionMessage('Datos de muestra eliminados del sistema. El navegador no los volverá a mostrar.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleWipeSupabase = async () => {
    setConfirmSupabaseWipeOpen(false);
    const res = await supabaseService.wipeAllTables();
    setActionMessage(res.message);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-200 text-[#363435]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#363435]" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Gestión de Datos & Supabase PostgreSQL
              </h3>
              <p className="text-[11px] text-neutral-500">
                Proyecto: <strong>avchpdtkogejgnomkxua</strong> (geckos@appdesignsoftware.com)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="mt-4 space-y-5 text-xs">
          {/* Summary of current database items */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 text-xs block">
                Padrón y Almacenamiento
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Producción Limpia
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="p-2 bg-white rounded-lg border border-neutral-200">
                <span className="font-mono font-bold text-sm text-neutral-900 block">{counts.students}</span>
                <span className="text-[10px] text-neutral-500">Alumnos Reales</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-neutral-200">
                <span className="font-mono font-bold text-sm text-neutral-900 block">{counts.payments}</span>
                <span className="text-[10px] text-neutral-500">Comprobantes</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-neutral-200">
                <span className="font-mono font-bold text-sm text-neutral-900 block">{counts.cycles}</span>
                <span className="text-[10px] text-neutral-500">Ciclos Mensuales</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-neutral-200">
                <span className="font-mono font-bold text-sm text-neutral-900 block">{counts.notifications}</span>
                <span className="text-[10px] text-neutral-500">Avisos</span>
              </div>
            </div>
          </div>

          {/* Sección Supabase Configurada */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <Server className="w-4 h-4 text-[#363435]" />
                <span>Credenciales Supabase Vinculadas</span>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-3 py-1 bg-[#363435] text-white rounded-lg font-bold text-[10px] flex items-center gap-1 hover:bg-black transition cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>{testingConnection ? 'Probando...' : 'Probar Conexión'}</span>
              </button>
            </div>

            {connectionResult && (
              <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700">
                {connectionResult}
              </div>
            )}

            <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-1.5 font-mono text-[11px]">
              <div>
                <span className="text-neutral-400 select-none">URL: </span>
                <span className="text-neutral-900 font-bold">{DEFAULT_SUPABASE_CONFIG.url}</span>
              </div>
              <div>
                <span className="text-neutral-400 select-none">Project ID: </span>
                <span className="text-neutral-900 font-bold">{DEFAULT_SUPABASE_CONFIG.projectId}</span>
              </div>
              <div>
                <span className="text-neutral-400 select-none">Anon Key: </span>
                <span className="text-neutral-600 truncate block">
                  {DEFAULT_SUPABASE_CONFIG.anonKey.substring(0, 35)}...
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSqlViewer(!showSqlViewer)}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>{showSqlViewer ? 'Ocultar Script SQL' : 'Ver Script SQL para Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL Completo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmSupabaseWipeOpen(true)}
                className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar Supabase Remoto</span>
              </button>
            </div>

            {/* SQL Viewer box */}
            {showSqlViewer && (
              <div className="mt-3 p-3 bg-neutral-900 text-neutral-200 rounded-xl space-y-2 border border-neutral-800">
                <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                  <span className="text-[10px] text-amber-400 font-mono font-bold">SQL DDL Supabase Editor</span>
                  <button
                    onClick={handleCopySql}
                    className="text-[10px] text-neutral-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono max-h-48 overflow-y-auto whitespace-pre leading-relaxed select-all">
                  {SUPABASE_SQL_SCRIPT}
                </pre>
              </div>
            )}

            {confirmSupabaseWipeOpen && (
              <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                <span className="font-bold text-rose-800 block">¿Vaciar registros remotos en Supabase?</span>
                <p className="text-[11px] text-neutral-600">
                  Esta acción ejecutará DELETE en las tablas <code>students</code>, <code>payments</code>, <code>billing_cycles</code> y <code>system_notifications</code> de tu proyecto en Supabase.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleWipeSupabase}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Confirmar Borrado en Supabase
                  </button>
                  <button
                    onClick={() => setConfirmSupabaseWipeOpen(false)}
                    className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sección Borrado Local */}
          <div className="space-y-2 p-4 rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <Trash2 className="w-4 h-4" />
              <span>Limpieza de Almacenamiento Local del Navegador</span>
            </div>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Garantiza que el navegador no guarde ningún dato residual de prueba. Todos los contadores quedan en cero.
            </p>

            {confirmWipeOpen ? (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 space-y-2">
                <span className="font-bold text-rose-700 block">¿Confirmar limpieza local?</span>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleWipeData}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
                  >
                    Sí, Limpiar Almacenamiento Local
                  </button>
                  <button
                    onClick={() => setConfirmWipeOpen(false)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmWipeOpen(true)}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Limpiar Localmente</span>
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-3 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
