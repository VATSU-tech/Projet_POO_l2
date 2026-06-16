import React, { useEffect, useState } from 'react';
import { Compte } from '../models/Compte';
import { Operation } from '../models/Operation';
import { CompteService } from '../services/compteService';
import { OperationService } from '../services/operationService';
import { ListeComptes } from '../components/ListeComptes';
import { CompteForm } from '../components/CompteForm';
import { DepotForm } from '../components/DepotForm';
import { RetraitForm } from '../components/RetraitForm';
import { HistoriqueOperations } from '../components/HistoriqueOperations';
import { useToast } from '../components/Toast';

export const Comptes: React.FC = () => {
  const { showToast } = useToast();
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState<'create' | 'deposit' | 'withdraw' | null>(null);
  const [selectedCompteId, setSelectedCompteId] = useState<string | undefined>(undefined);

  const refreshData = async () => {
    try {
      const [cList, opList] = await Promise.all([
        CompteService.getAll(),
        OperationService.getAll(),
      ]);
      setComptes(cList);
      setOperations(opList);
    } catch (err: any) {
      setError("Erreur lors de la récupération des données. Assurez-vous que json-server tourne.");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    init();
  }, []);

  const handleCreateSuccess = () => {
    setActiveModal(null);
    showToast("Le compte a été créé avec succès !", "success");
    refreshData();
  };

  const handleDepositSuccess = () => {
    setActiveModal(null);
    setSelectedCompteId(undefined);
    showToast("Le dépôt a été effectué avec succès !", "success");
    refreshData();
  };

  const handleWithdrawSuccess = () => {
    setActiveModal(null);
    setSelectedCompteId(undefined);
    showToast("Le retrait a été effectué avec succès !", "success");
    refreshData();
  };

  const handleDeleteCompte = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      try {
        await CompteService.delete(id);
        showToast("Le compte a été supprimé avec succès !", "success");
        refreshData();
      } catch (err: any) {
        showToast("Impossible de supprimer le compte: " + err.message, "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/60">Chargement des comptes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">Gestion des comptes</h1>
          <p className="text-sm text-base-content/60">Consultez, déposez, retirez et suivez vos transactions en direct.</p>
        </div>
        <button
          onClick={() => setActiveModal('create')}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau compte
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Accounts List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          Liste des comptes bancaires
        </h2>
        <ListeComptes
          comptes={comptes}
          onDeposit={(id) => {
            setSelectedCompteId(id);
            setActiveModal('deposit');
          }}
          onWithdraw={(id) => {
            setSelectedCompteId(id);
            setActiveModal('withdraw');
          }}
          onDelete={handleDeleteCompte}
        />
      </div>

      {/* Quick Operations Actions Banner */}
      {comptes.length > 0 && (
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedCompteId(undefined);
              setActiveModal('deposit');
            }}
            className="btn btn-success text-white"
          >
            Dépôt rapide
          </button>
          <button
            onClick={() => {
              setSelectedCompteId(undefined);
              setActiveModal('withdraw');
            }}
            className="btn btn-error text-white"
          >
            Retrait rapide
          </button>
        </div>
      )}

      {/* Operations History Section */}
      <div className="pt-4">
        <HistoriqueOperations operations={operations} comptes={comptes} />
      </div>

      {/* Modal Dialogs */}
      {activeModal === 'create' && (
        <div className="modal modal-open animate-fadeIn" role="dialog">
          <div className="modal-box bg-base-100 border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-base-content">Créer un nouveau compte</h3>
            <CompteForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setActiveModal(null)}
            />
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setActiveModal(null)}></div>
        </div>
      )}

      {activeModal === 'deposit' && (
        <div className="modal modal-open animate-fadeIn" role="dialog">
          <div className="modal-box bg-base-100 border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-success">Effectuer un dépôt</h3>
            <DepotForm
              comptes={comptes}
              selectedCompteId={selectedCompteId}
              onSuccess={handleDepositSuccess}
              onCancel={() => {
                setActiveModal(null);
                setSelectedCompteId(undefined);
              }}
            />
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setActiveModal(null)}></div>
        </div>
      )}

      {activeModal === 'withdraw' && (
        <div className="modal modal-open animate-fadeIn" role="dialog">
          <div className="modal-box bg-base-100 border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-error">Effectuer un retrait</h3>
            <RetraitForm
              comptes={comptes}
              selectedCompteId={selectedCompteId}
              onSuccess={handleWithdrawSuccess}
              onCancel={() => {
                setActiveModal(null);
                setSelectedCompteId(undefined);
              }}
            />
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setActiveModal(null)}></div>
        </div>
      )}
    </div>
  );
};
