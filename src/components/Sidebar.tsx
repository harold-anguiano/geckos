import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  BellRing,
  Share2,
  CreditCard,
  History,
  Bell,
  Database,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingCount?: number;
  unreadNotifsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenDataReset: () => void;
  onOpenDocPDF?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeRole,
  currentTab,
  onSelectTab,
  pendingCount = 0,
  unreadNotifsCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  onOpenDataReset,
  onOpenDocPDF,
}) => {
  const isCoach = activeRole === 'head_coach' || activeRole === 'coach_assistant';

  const coachMenuItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'registered_students', label: 'Alumnos Registrados', icon: Users },
    { id: 'players', label: 'Pagos', icon: CreditCard },
    {
      id: 'validation',
      label: 'Validación de Pagos',
      icon: CheckCircle2,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { id: 'billing', label: 'Cobranza y Avisos', icon: BellRing },
    { id: 'social', label: 'Redes Oficiales', icon: Share2 },
  ];

  const parentMenuItems = [
    { id: 'account', label: 'Estado de Cuenta', icon: LayoutDashboard },
    { id: 'register_payment', label: 'Registrar Pago', icon: CreditCard },
    { id: 'history', label: 'Historial de Pagos', icon: History },
    {
      id: 'notifications',
      label: 'Bandeja de Avisos',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
    { id: 'social', label: 'Redes Oficiales', icon: Share2 },
  ];

  const menuItems = isCoach ? coachMenuItems : parentMenuItems;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-64'
      } shrink-0 select-none min-h-[calc(100vh-5rem)] sticky top-20`}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          {!isCollapsed && (isCoach ? 'Módulos Deportivos' : 'Portal de Familia')}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#363435] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-amber-400' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-amber-400 text-neutral-900' : 'bg-[#363435] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info & actions */}
      <div className="p-3 border-t border-neutral-100 space-y-2">
        {onOpenDocPDF && (
          <button
            onClick={onOpenDocPDF}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Descargar Ficha Técnica / Manual en PDF"
          >
            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
            {!isCollapsed && <span>Ficha Técnica (PDF)</span>}
          </button>
        )}

        <button
          onClick={onOpenDataReset}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Gestión de Datos & Supabase"
        >
          <Database className="w-4 h-4 text-neutral-500" />
          {!isCollapsed && <span>Gestión de Datos</span>}
        </button>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition text-xs"
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!isCollapsed && <span className="ml-2 text-xs">Plegar panel</span>}
          </button>
        )}

        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200/60 text-[11px] text-neutral-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Geckop´s Voleibol v2.0</span>
          </div>
        )}
      </div>
    </aside>
  );
};
