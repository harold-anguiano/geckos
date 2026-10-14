import React from 'react';
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck, Users, CreditCard, Bell, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationPDFModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-neutral-200 text-[#363435] my-auto max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:border-none print:p-0">
        
        {/* Barra superior de control (Oculta al imprimir / guardar PDF) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#363435]" />
            <span className="font-bold text-neutral-900 text-sm">
              Ficha Técnica del Sistema · Formato Imprimible / PDF
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#000000] hover:bg-[#363435] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Guardar / Imprimir como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL DOCUMENTO PDF */}
        <div className="space-y-8 text-neutral-800 font-sans print:space-y-6">
          
          {/* Encabezado Institucional con Logo Completo */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-neutral-900 gap-4">
            <div>
              <img
                src="https://appdesignproyectos.com/geckoslogo.png"
                alt="Geckos Voleibol"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                Ficha Técnica & Manual Operativo
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Geckos Voleibol
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Plataforma Deportiva de Control, Cobranza y Validación de Pagos
              </p>
              <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                Versión 2.0 · Temporada Oficial 2026
              </span>
            </div>
          </div>

          {/* 1. Resumen Ejecutivo & Características Generales */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Características Generales de la Interfaz</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Acceso por Roles en Inicio</span>
                <p className="text-neutral-600">
                  Selector limpio e independiente configurado en cuadrícula de <strong>2 columnas en móvil</strong> y <strong>4 columnas en escritorio</strong>. Sin barras superiores ni textos distractores; únicamente el logo institucional y el nombre del rol.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Cabecera Institucional Unificada</span>
                <p className="text-neutral-600">
                  Despliega el logotipo oficial a escala natural sin encapsular, identificación del rol activo, botón de instalación rápida (PWA) y botón de cierre de sesión.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Navegación Móvil (Bottom Bar)</span>
                <p className="text-neutral-600">
                  Barra fija táctil en la parte inferior optimizada para pulgares con iconos legibles y etiquetas en una sola línea, cumpliendo el estándar de altura &le; 15% del viewport.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Menú Lateral en Escritorio & Cero Pestañas Repetitivas</span>
                <p className="text-neutral-600">
                  Panel lateral colapsable con accesos directos directos. Se eliminaron barras horizontales duplicadas para maximizar el área de trabajo y visualización de datos.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Paleta de Colores Institucional</span>
                <p className="text-neutral-600">
                  Fondo claro (#F8F9FA / #FFFFFF) con contrastes definidos en <strong>#363435</strong> y <strong>#000000</strong>, acompañados de indicadores semánticos accesibles.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-1">Compatibilidad PWA & Depuración de Datos</span>
                <p className="text-neutral-600">
                  Instalable en Android, iOS (Safari) y PC. Incluye botón para purgar permanentemente datos de prueba y conector para base de datos PostgreSQL / Supabase.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Roles y Módulos del Sistema */}
          <section className="space-y-4">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-1.5">
              <Users className="w-4 h-4 text-[#363435]" />
              <span>2. Roles del Sistema y sus Módulos</span>
            </h2>

            {/* Rol 1: Head Coach */}
            <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>ROL 1: Administrador / Head Coach</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase">
                  Gestión Total
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-700">
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Panel de Control (Dashboard):</strong>
                  Vista ejecutiva de ingresos recibidos, adeudos pendientes, porcentaje de cobranza y lista de morosos con envío rápido de WhatsApp.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Gestión de Jugadores y Tutores:</strong>
                  Alta de alumnos por categoría (Sub-13, Sub-15, Sub-18, Libre), rama, dorsal, asignación de cuota y contacto del tutor.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Control y Validación de Pagos:</strong>
                  Inspección visual de comprobantes subidos, aprobación con emisión de Acuse Digital Oficial o rechazo con motivo para subsanación.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Módulo de Cobranza y Recordatorios:</strong>
                  Configuración de periodos, días de corte y envío de notificaciones automáticas tanto en portal como vía WhatsApp.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200 md:col-span-2">
                  <strong className="text-neutral-900 block mb-0.5">• Enlaces Institucionales:</strong>
                  Acceso directo a las cuentas de Instagram, Facebook, TikTok y atención directa en cancha.
                </li>
              </ul>
            </div>

            {/* Rol 2: Jugador / Tutor */}
            <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                  <Users className="w-5 h-5 text-blue-700" />
                  <span>ROL 2: Jugador / Padre de Familia (Tutor)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase">
                  Portal de Alumno
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-700">
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Perfil de Alumno y Estado de Cuenta:</strong>
                  Consulta en tiempo real del saldo pendiente, cuota asignada, día de corte y estatus deportivo (Al corriente / Adeudo / En revisión).
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Registro de Pagos:</strong>
                  Formulario para subir captura bancaria o ticket de pago, monto, fecha, método (SPEI, OXXO, Efectivo, Tarjeta) y folio de rastreo.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Historial de Pagos y Acuses Digitales:</strong>
                  Relación de mensualidades pagadas con descarga de Acuse Digital Oficial o visualización del motivo de rechazo para reintento.
                </li>
                <li className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">• Bandeja de Recordatorios y Notificaciones:</strong>
                  Alertas sobre fechas de corte, nuevos ciclos de cobro y avisos de validación por parte del entrenador.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Flujo de Trabajo en 4 Etapas */}
          <section className="space-y-4 page-break-inside-avoid">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>3. Flujo de Trabajo Operativo (4 Etapas Principales)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Etapa 1 */}
              <div className="p-3.5 rounded-xl border border-neutral-300 bg-white">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#363435] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Configuración y Alta Inicial (Head Coach)</span>
                </div>
                <p className="text-neutral-600 pl-7 leading-relaxed">
                  El Head Coach registra a los deportistas, asocia los datos de contacto de sus papás o tutores y define la cuota mensual con su respectivo día de corte.
                </p>
              </div>

              {/* Etapa 2 */}
              <div className="p-3.5 rounded-xl border border-neutral-300 bg-white">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#363435] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Notificación y Recordatorio (Automatizado)</span>
                </div>
                <p className="text-neutral-600 pl-7 leading-relaxed">
                  Al iniciar el ciclo, el sistema genera la orden de cobro mensual y despacha alertas automáticas al portal de los tutores, permitiendo además el envío de avisos personalizados por WhatsApp.
                </p>
              </div>

              {/* Etapa 3 */}
              <div className="p-3.5 rounded-xl border border-neutral-300 bg-white">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#363435] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Registro del Pago (Papá / Jugador)</span>
                </div>
                <p className="text-neutral-600 pl-7 leading-relaxed">
                  El tutor consulta su saldo, adjunta la imagen o comprobante bancario, especifica monto y fecha. La transacción queda automáticamente en estatus <strong>«Pendiente de revisión»</strong>.
                </p>
              </div>

              {/* Etapa 4 */}
              <div className="p-3.5 rounded-xl border border-neutral-300 bg-white">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#363435] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Validación y Cierre (Head Coach)</span>
                </div>
                <p className="text-neutral-600 pl-7 leading-relaxed">
                  El Head Coach coteja la captura. Si es <strong>Aprobado</strong>, el saldo pasa a $0 y se emite el Acuse Digital con folio único. Si es <strong>Rechazado</strong>, se detalla el motivo para que el usuario vuelva a cargar su evidencia. Las métricas del dashboard se actualizan al instante.
                </p>
              </div>
            </div>
          </section>

          {/* Pie del Documento */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
            <span>Documento generado por el Sistema Oficial de Geckos Voleibol.</span>
            <span className="font-mono">© 2026 Geckos Voleibol · Todos los derechos reservados.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
