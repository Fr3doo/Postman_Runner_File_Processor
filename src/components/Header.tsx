import React from 'react';
import { AlertTriangle, Shield, Monitor } from 'lucide-react';
import { t } from '../i18n';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Logo et titre */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Monitor className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Postman Runner Processor
                </h1>
                <p className="text-sm text-gray-600">
                  Convertisseur de fichiers local
                </p>
              </div>
            </div>
          </div>
          
          {/* Badge de statut local */}
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <Shield className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-800">
              100% Local & Sécurisé
            </span>
          </div>
        </div>

        {/* Message d'information local */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">
                🔒 Traitement 100% Local - Vos données restent privées
              </h3>
              <div className="text-sm text-amber-700 space-y-1">
                <p>
                  <strong>✅ Aucune donnée envoyée sur internet</strong> - Tous vos fichiers sont traités directement dans votre navigateur
                </p>
                <p>
                  <strong>✅ Confidentialité garantie</strong> - Vos informations sensibles ne quittent jamais votre ordinateur
                </p>
                <p>
                  <strong>✅ Fonctionne hors ligne</strong> - Pas besoin de connexion internet une fois la page chargée
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;