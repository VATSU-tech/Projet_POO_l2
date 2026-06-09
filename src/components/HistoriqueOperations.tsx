import React, { useState } from 'react';
import { Operation } from '../models/Operation';
import { Compte } from '../models/Compte';

interface HistoriqueOperationsProps {
  operations: Operation[];
  comptes: Compte[];
}

export const HistoriqueOperations: React.FC<HistoriqueOperationsProps> = ({
  operations,
  comptes,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'depot' | 'retrait'>('all');
  const [filterCompte, setFilterCompte] = useState<string>('all');

  const getAccountInfo = (compteId: string) => {
    const compte = comptes.find((c) => c.id === compteId);
    return compte ? `${compte.proprietaire} (${compte.numero})` : `Compte inconnu (ID: ${compteId})`;
  };

  const filteredOperations = operations.filter((op) => {
    const matchesType = filterType === 'all' || op.type === filterType;
    const matchesCompte = filterCompte === 'all' || op.compteId === filterCompte;
    return matchesType && matchesCompte;
  });

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm w-full">
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="card-title text-xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Historique des opérations
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="select select-sm select-bordered w-full sm:w-auto"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Tous les types</option>
              <option value="depot">Dépôts</option>
              <option value="retrait">Retraits</option>
            </select>

            <select
              className="select select-sm select-bordered w-full sm:w-auto"
              value={filterCompte}
              onChange={(e) => setFilterCompte(e.target.value)}
            >
              <option value="all">Tous les comptes</option>
              {comptes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.proprietaire} ({c.numero})
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredOperations.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            Aucune opération enregistrée avec ces filtres.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="font-semibold text-base-content/70">Date & Heure</th>
                  <th className="font-semibold text-base-content/70">Type</th>
                  <th className="font-semibold text-base-content/70">Compte concerné</th>
                  <th className="text-right font-semibold text-base-content/70">Montant</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperations.map((op) => (
                  <tr key={op.id} className="hover:bg-base-200/35 transition-colors">
                    <td>{new Date(op.date).toLocaleString('fr-FR')}</td>
                    <td>
                      <span
                        className={`badge badge-sm font-medium ${
                          op.type === 'depot'
                            ? 'bg-success/15 text-success border-success/20'
                            : 'bg-error/15 text-error border-error/20'
                        }`}
                      >
                        {op.type === 'depot' ? 'Dépôt' : 'Retrait'}
                      </span>
                    </td>
                    <td className="font-medium">{getAccountInfo(op.compteId)}</td>
                    <td
                      className={`text-right font-bold ${
                        op.type === 'depot' ? 'text-success' : 'text-error'
                      }`}
                    >
                      {op.type === 'depot' ? '+' : '-'} {op.montant.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
