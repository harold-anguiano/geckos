import React, { useState } from 'react';
import { Download, Check, Smartphone, Monitor, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'compact' | 'card';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled) {
    if (variant === 'compact') return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>App Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Geckop´s Voleibol en tu dispositivo"
        className={`flex items-center gap-1.5 rounded-lg font-medium transition-all shadow-xs active:scale-95 shrink-0 ${
          variant === 'header'
            ? 'bg-[#363435] text-white hover:bg-[#000000] px-2.5 py-1.5 sm:px-3 text-xs'
            : 'bg-[#363435] text-white hover:bg-[#000000] px-4 py-2 text-sm w-full justify-center'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0 text-amber-400" />
        <span className="hidden xs:inline whitespace-nowrap">Instalar</span>
      </button>

      {/* Instructional modal for iOS, Desktop Chrome/Edge and Android fallback */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 text-[#363435]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <img
                  src="https://appdesignproyectos.com/geckosicono.png"
                  alt="Geckop´s Voleibol"
                  className="w-7 h-7 object-contain"
                />
                <h3 className="text-base font-bold text-neutral-900">Instalar Geckop´s Voleibol</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-neutral-600">
              {isIOS ? (
                <div className="space-y-3 bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>Instalación en iPhone / iPad (iOS Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-neutral-700">
                    <li>
                      Toca el botón <strong>Compartir</strong> <span className="inline-block px-1 bg-white rounded border border-neutral-300">⎋</span> en la barra inferior de Safari.
                    </li>
                    <li>
                      Desplázate hacia abajo y selecciona <strong>«Agregar al inicio»</strong>.
                    </li>
                    <li>
                      Confirma tocando <strong>«Agregar»</strong> en la esquina superior derecha.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                    <Monitor className="w-4 h-4 text-neutral-700" />
                    <span>En Computadoras (Chrome / Edge) o Android</span>
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-neutral-900">•</span>
                      <span>En Chrome o Edge: Haz clic en el ícono de instalación <span className="inline-block px-1 py-0.5 bg-white rounded border border-neutral-300 font-mono">⊕</span> ubicado a la derecha de la barra de direcciones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-neutral-900">•</span>
                      <span>En Android: Toca el menú de tres puntos (⋮) en tu navegador y selecciona <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.</span>
                    </li>
                  </ul>
                </div>
              )}

              <p className="text-xs text-neutral-500 text-center">
                Disfruta de acceso ultrarrápido, modo pantalla completa y consulta de cuotas sin conexión.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 rounded-xl bg-[#000000] py-2.5 text-xs font-semibold text-white hover:bg-[#363435] transition"
                >
                  Continuar Instalación
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-neutral-100 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
