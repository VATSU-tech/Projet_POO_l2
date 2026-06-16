import React, { useState } from 'react';
import { CompteService } from '../services/compteService';

interface CompteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CompteForm: React.FC<CompteFormProps> = ({ onSuccess, onCancel }) => {
  const [numero, setNumero] = useState('');
  const [proprietaire, setProprietaire] = useState('');
  const [solde, setSolde] = useState<number | undefined>(undefined);
  const [type, setType] = useState<'courant' | 'epargne'>('courant');
  const [tauxInteret, setTauxInteret] = useState<number>(1.5);
  const [decouvertAutorise, setDecouvertAutorise] = useState<number>(400);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || !proprietaire.trim()) {
      setError("Le numéro de compte et le nom du propriétaire sont obligatoires.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await CompteService.create({
        numero: numero.trim(),
        proprietaire: proprietaire.trim(),
        solde: solde,
        type,
        tauxInteret: type === 'epargne' ? tauxInteret : undefined,
        decouvertAutorise: type === 'courant' ? decouvertAutorise : undefined,
      });
      // Clear form
      setNumero('');
      setProprietaire('');
      setSolde(undefined);
      setType('courant');
      setDecouvertAutorise(400);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Une erreur est survenue lors de la création du compte.");
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
          <span className="label-text font-medium text-base-content/75">Numéro de compte</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
          placeholder="Ex: FR76 3000..."
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content/75">Nom du propriétaire</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
          placeholder="Ex: Alice Martin"
          value={proprietaire}
          onChange={(e) => setProprietaire(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/75">Type de compte</span>
          </label>
          <select
            className="select select-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
            value={type}
            onChange={(e) => setType(e.target.value as 'courant' | 'epargne')}
          >
            <option value="courant">Compte Courant</option>
            <option value="epargne">Compte Épargne</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content/75">Solde initial (facultatif)</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
            placeholder="Ex: 500"
            value={solde ?? ''}
            onChange={(e) => setSolde(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>

      {type === 'epargne' ? (
        <div className="form-control transition-all duration-300 ease-in-out">
          <label className="label">
            <span className="label-text font-medium text-base-content/75">Taux d'intérêt (%)</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
            placeholder="Ex: 2.5"
            value={tauxInteret}
            onChange={(e) => setTauxInteret(parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      ) : (
        <div className="form-control transition-all duration-300 ease-in-out">
          <label className="label">
            <span className="label-text font-medium text-base-content/75">Découvert autorisé (€)</span>
          </label>
          <input
            type="number"
            step="1"
            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all duration-200"
            placeholder="Ex: 400"
            value={decouvertAutorise}
            onChange={(e) => setDecouvertAutorise(parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      )}

      <div className="modal-action mt-6">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm"></span>}
          Créer le compte
        </button>
      </div>
    </form>
  );
};
