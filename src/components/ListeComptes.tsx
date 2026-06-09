import React from 'react';
import { Compte } from '../models/Compte';

interface ListeComptesProps {
  comptes: Compte[];
  onDeposit: (compteId: string) => void;
  onWithdraw: (compteId: string) => void;
  onDelete?: (compteId: string) => void;
}

export const ListeComptes: React.FC<ListeComptesProps> = ({
  comptes,
  onDeposit,
  onWithdraw,
  onDelete,
}) => {
  if (comptes.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm text-center p-8">
        <p className="text-base-content/50">Aucun compte bancaire trouvé. Veuillez en créer un.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-base-200 shadow-sm">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200/50">
            <th className="font-semibold text-base-content/70">Numéro de compte</th>
            <th className="font-semibold text-base-content/70">Propriétaire</th>
            <th className="font-semibold text-base-content/70">Type</th>
            <th className="font-semibold text-base-content/70">Taux d'intérêt</th>
            <th className="text-right font-semibold text-base-content/70">Solde</th>
            <th className="text-center font-semibold text-base-content/70">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comptes.map((c) => (
            <tr key={c.id} className="hover:bg-base-200/35 transition-colors">
              <td className="font-mono text-sm">{c.numero}</td>
              <td className="font-medium">{c.proprietaire}</td>
              <td>
                <span
                  className={`badge ${
                    c.type === 'courant' ? 'badge-primary badge-outline' : 'badge-secondary badge-outline'
                  }`}
                >
                  {c.type === 'courant' ? 'Courant' : 'Épargne'}
                </span>
              </td>
              <td>
                {c.type === 'epargne' ? (
                  <span className="text-sm font-medium text-base-content/70">{(c as any).tauxInteret} %</span>
                ) : (
                  <span className="text-sm text-base-content/30">-</span>
                )}
              </td>
              <td className="text-right font-semibold text-base-content">
                {c.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </td>
              <td>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onDeposit(c.id)}
                    className="btn btn-success btn-xs text-white"
                  >
                    Dépôt
                  </button>
                  <button
                    onClick={() => onWithdraw(c.id)}
                    className="btn btn-error btn-xs text-white"
                  >
                    Retrait
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(c.id)}
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      title="Supprimer le compte"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
