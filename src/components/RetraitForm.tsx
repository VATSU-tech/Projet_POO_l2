import React, { useState, useEffect } from 'react';
import { Compte } from '../models/Compte';
import { OperationService } from '../services/operationService';

interface RetraitFormProps {
  comptes: Compte[];
  selectedCompteId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RetraitForm: React.FC<RetraitFormProps> = ({
  comptes,
  selectedCompteId,
  onSuccess,
  onCancel,
}) => {
  const [compteId, setCompteId] = useState('');
  const [montant, setMontant] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCompteId) {
      setCompteId(selectedCompteId);
    } else if (comptes.length > 0) {
      setCompteId(comptes[0].id);
    }
  }, [selectedCompteId, comptes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compteId) {
      setError("Veuillez sélectionner un compte.");
      return;
    }
    if (montant === '' || montant <= 0) {
      setError("Le montant doit être supérieur à 0.");
      return;
    }

    setError('');
    setLoading(true);
    try {
      await OperationService.create({
        montant: Number(montant),
        compteId,
        type: 'retrait',
      });
      setMontant('');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Une erreur est survenue lors du retrait.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error text-sm py-2 px-3 rounded-lg shadow-sm">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content/75">Compte débité</span>
        </label>
        <select
          className="select select-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
          value={compteId}
          onChange={(e) => setCompteId(e.target.value)}
          disabled={!!selectedCompteId}
          required
        >
          <option value="" disabled>Sélectionnez un compte</option>
          {comptes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.proprietaire} - {c.numero} ({c.type === 'courant' ? 'Courant' : 'Épargne'} : {c.solde.toFixed(2)} €)
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content/75">Montant du retrait (€)</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
          placeholder="Ex: 50.00"
          value={montant}
          onChange={(e) => setMontant(e.target.value ? parseFloat(e.target.value) : '')}
          required
        />
      </div>

      <div className="modal-action mt-6">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Annuler
        </button>
        <button type="submit" className="btn btn-error text-white" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm"></span>}
          Confirmer le retrait
        </button>
      </div>
    </form>
  );
};
