import React from 'react';
import { UserRole, Student } from '../types';
import { LogOut, User, ShieldCheck, Database, FileText } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  activeRole: UserRole;
  currentStudent?: Student | null;
  onLogout: () => void;
  onOpenDataReset: () => void;
  onOpenDocPDF?: () => void;
  pendingCount?: number;
}

export const Header: React.FC<Props> = ({
  activeRole,
  currentStudent,
  onLogout,
  onOpenDataReset,
  onOpenDocPDF,
  pendingCount = 0,
}) => {
  const getRoleLabel = () => {
    switch (activeRole) {
      case 'head_coach':
        return 'Head Coach';
      case 'coach_assistant':
        return 'Asistente';
      case 'parent':
        return currentStudent ? `Tutor: ${currentStudent.tutorName.split(' ')[0]}` : 'Tutor';
      case 'player':
        return currentStudent ? currentStudent.fullName.split(' ')[0] : 'Jugador';
      default:
        return 'Usuario';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-15 sm:h-18 flex items-center justify-between gap-2 min-w-0">
        {/* Logotipo del sistema: No encapsulado, visto de tamaño completo */}
        <div className="flex items-center min-w-0 shrink">
          <img
            src="https://appdesignproyectos.com/geckoslogo.png"
            alt="Geckop´s Voleibol"
            className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[220px] object-contain shrink-0"
          />
        </div>

        {/* Zona Derecha: Identificación del rol activo, Botón de Instalación, Botón de Cierre de Sesión */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {/* Identificación del Rol Activo */}
          <div className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-[11px] sm:text-xs">
            {activeRole === 'head_coach' || activeRole === 'coach_assistant' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#363435] shrink-0" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#363435] shrink-0" />
            )}
            <span className="font-semibold text-neutral-900 truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[150px]">
              {getRoleLabel()}
            </span>
            {activeRole === 'head_coach' && pendingCount > 0 && (
              <span className="px-1 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full animate-pulse shrink-0">
                {pendingCount}
              </span>
            )}
          </div>

          {/* Botón de Ficha Técnica / PDF */}
          {onOpenDocPDF && (
            <button
              onClick={onOpenDocPDF}
              title="Descargar Ficha Técnica y Manual en PDF"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          {/* Botón de Gestión de Datos (Desktop/Tablet) */}
          <button
            onClick={onOpenDataReset}
            title="Gestión de Datos y Base de Datos"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs transition"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Datos</span>
          </button>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton variant="header" />

          {/* Botón de cierre de sesión */}
          <button
            onClick={onLogout}
            title="Cerrar sesión / Cambiar de rol"
            className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 text-xs font-medium transition shadow-2xs active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

