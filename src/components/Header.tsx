import React, { useState } from 'react';
import { UserRole, Student, SystemUser } from '../types';
import {
  LogOut,
  User,
  ShieldCheck,
  Database,
  FileText,
  ChevronDown,
  Eye,
  Trophy,
  Users,
  UserCheck,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  currentUser: SystemUser | null;
  activeRole: UserRole;
  currentStudent?: Student | null;
  onLogout: () => void;
  onOpenDataReset: () => void;
  onOpenDocPDF?: () => void;
  pendingCount?: number;
  onSwitchRoleView?: (role: UserRole) => void;
}

export const Header: React.FC<Props> = ({
  currentUser,
  activeRole,
  currentStudent,
  onLogout,
  onOpenDataReset,
  onOpenDocPDF,
  pendingCount = 0,
  onSwitchRoleView,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const isAdmin = currentUser?.role === 'head_coach';

  const getRoleBadgeLabel = () => {
    switch (activeRole) {
      case 'head_coach':
        return 'Administrador';
      case 'coach_assistant':
        return 'Entrenador Asistente';
      case 'parent':
        return 'Padre / Tutor';
      case 'player':
        return 'Alumno / Deportista';
      default:
        return 'Usuario';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-15 sm:h-18 flex items-center justify-between gap-2 min-w-0">
        {/* Logotipo del club Geckos Voleibol */}
        <div className="flex items-center min-w-0 shrink">
          <img
            src="https://appdesignproyectos.com/geckoslogo.png"
            alt="Geckos Voleibol"
            className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[220px] object-contain shrink-0"
          />
        </div>

        {/* Zona Derecha: Usuario Autenticado, Navegación de Roles Admin, Opciones y Salir */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {/* Identificación del Usuario Autenticado (Muestra su Nombre en el Dashboard) */}
          <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] sm:text-xs min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#363435] text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-extrabold text-neutral-900 truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px] leading-tight">
                {currentUser?.name || 'Usuario'}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium leading-tight truncate">
                {getRoleBadgeLabel()}
              </span>
            </div>
            {activeRole === 'head_coach' && pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full animate-pulse shrink-0">
                {pendingCount}
              </span>
            )}
          </div>

          {/* Menú de Navegación de Roles para el Administrador */}
          {isAdmin && onSwitchRoleView && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs cursor-pointer ${
                  activeRole !== 'head_coach'
                    ? 'bg-amber-500 text-neutral-900 border-amber-600 animate-pulse'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
                title="El administrador puede navegar en todos los roles del sistema"
              >
                <Eye className="w-3.5 h-3.5 text-[#363435]" />
                <span className="hidden sm:inline">Navegar Roles</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl py-2 z-50 animate-scaleUp"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                    Navegación de Roles (Admin)
                  </div>

                  <button
                    onClick={() => {
                      onSwitchRoleView('head_coach');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-neutral-50 text-left transition ${
                      activeRole === 'head_coach' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#363435]" />
                    <span>👑 Administrador (Head Coach)</span>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRoleView('coach_assistant');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-neutral-50 text-left transition ${
                      activeRole === 'coach_assistant' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>📋 Entrenador Asistente</span>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRoleView('parent');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-neutral-50 text-left transition ${
                      activeRole === 'parent' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>👨‍👩‍👧 Padre de Familia / Tutor</span>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRoleView('player');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-neutral-50 text-left transition ${
                      activeRole === 'player' ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>🏐 Jugador / Alumno</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botón de Ficha Técnica / PDF */}
          {onOpenDocPDF && (
            <button
              onClick={onOpenDocPDF}
              title="Descargar Ficha Técnica y Manual en PDF"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          {/* Botón de Gestión de Datos (Desktop/Tablet) */}
          <button
            onClick={onOpenDataReset}
            title="Gestión de Datos y Base de Datos"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs transition"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Datos</span>
          </button>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton variant="header" />

          {/* Botón de cierre de sesión */}
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-rose-600 text-xs font-medium transition shadow-2xs active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
