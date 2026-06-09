import React, { useEffect, useState } from 'react';
import { Compte } from '../models/Compte';
import { Operation } from '../models/Operation';
import { CompteService } from '../services/compteService';
import { OperationService } from '../services/operationService';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cList, opList] = await Promise.all([
          CompteService.getAll(),
          OperationService.getAll(),
        ]);
        setComptes(cList);
        setOperations(opList);
      } catch (err: any) {
        setError("Impossible de charger les données du tableau de bord. Assurez-vous que json-server est démarré.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = comptes.reduce((sum, c) => sum + c.solde, 0);
  const currentCount = comptes.filter((c) => c.type === 'courant').length;
  const savingsCount = comptes.filter((c) => c.type === 'epargne').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/60">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left w-full">
      {/* Header banner */}
      <div className="hero bg-base-200/50 rounded-2xl border border-base-200 p-6 md:p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-base-content md:text-4xl mb-2">
            Gestionnaire Bancaire POO
          </h1>
          <p className="text-base-content/70 text-lg mb-4">
            Projet de Programmation Orientée Objet sous React & TypeScript. Simulez vos comptes et transactions avec encapsulation, héritage et polymorphisme.
          </p>
          <div className="flex gap-2">
            <Link to="/comptes" className="btn btn-primary">
              Gérer les comptes
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-base-content/50 block">Encours Total</span>
              <span className="text-2xl font-bold text-base-content">
                {totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-base-content/50 block">Comptes Actifs</span>
              <span className="text-2xl font-bold text-base-content">
                {comptes.length} <span className="text-sm font-normal text-base-content/60">({currentCount} courants, {savingsCount} épargnes)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L17.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-base-content/50 block">Opérations Enregistrées</span>
              <span className="text-2xl font-bold text-base-content">{operations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Academic concepts info */}
        <div className="card bg-base-100 border border-base-200 shadow-sm lg:col-span-1 h-fit">
          <div className="card-body p-6">
            <h2 className="card-title text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A5.906 5.906 0 0 1 1.25 12v1.455c0 1.01.439 1.954 1.173 2.608L4.26 18.25m-1.999-8.103a48.339 48.339 0 0 1 18.67-2.313m0 0a51.645 51.645 0 0 0 2.658-.812 5.907 5.907 0 0 1 2.242 4.616v1.455c0 1.01-.439 1.954-1.173 2.608L19.74 18.25m-1.999-8.103a48.347 48.347 0 0 0-15.482 0" />
              </svg>
              Concepts POO Démontrés
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="border-b border-base-200 pb-2">
                <span className="font-semibold text-primary block">Encapsulation</span>
                <span className="text-base-content/70">
                  Les attributs de <code>Compte</code> sont déclarés privés. Le solde est protégé et les dépôts/retraits se font via des règles métier strictes définies dans les classes modèles.
                </span>
              </li>
              <li className="border-b border-base-200 pb-2">
                <span className="font-semibold text-secondary block">Héritage</span>
                <span className="text-base-content/70">
                  Les classes <code>CompteCourant</code> et <code>CompteEpargne</code> étendent <code>Compte</code> pour partager le comportement de base tout en introduisant des caractéristiques spécifiques (comme le taux d'intérêt).
                </span>
              </li>
              <li className="border-b border-base-200 pb-2">
                <span className="font-semibold text-accent block">Polymorphisme</span>
                <span className="text-base-content/70">
                  La méthode abstraite <code>executer(compte)</code> de la classe <code>Operation</code> est redéfinie dans <code>Depot</code> et <code>Retrait</code>, appliquant dynamiquement le calcul approprié au compte cible.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: latest operations summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-6">
              <h2 className="card-title text-lg font-bold mb-4 flex items-center justify-between">
                <span>Dernières opérations</span>
                <Link to="/comptes" className="btn btn-ghost btn-xs text-primary hover:bg-primary/10">Voir tout</Link>
              </h2>
              {operations.length === 0 ? (
                <p className="text-center py-6 text-base-content/50 text-sm">Aucune opération pour le moment.</p>
              ) : (
                <div className="divide-y divide-base-200">
                  {operations.slice(0, 5).map((op) => {
                    const c = comptes.find((acc) => acc.id === op.compteId);
                    return (
                      <div key={op.id} className="py-3 flex items-center justify-between text-sm">
                        <div>
                          <span className={`badge badge-sm mr-2 font-medium ${op.type === 'depot' ? 'bg-success/15 text-success border-success/20' : 'bg-error/15 text-error border-error/20'}`}>
                            {op.type === 'depot' ? 'Dépôt' : 'Retrait'}
                          </span>
                          <span className="font-medium text-base-content/80">
                            {c ? `${c.proprietaire} (${c.numero})` : 'Compte inconnu'}
                          </span>
                          <span className="text-xs text-base-content/40 block mt-0.5">
                            {new Date(op.date).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <span className={`font-bold ${op.type === 'depot' ? 'text-success' : 'text-error'}`}>
                          {op.type === 'depot' ? '+' : '-'} {op.montant.toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
