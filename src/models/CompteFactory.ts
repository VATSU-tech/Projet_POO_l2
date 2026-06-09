import { Compte } from './Compte';
import { CompteCourant } from './CompteCourant';
import { CompteEpargne } from './CompteEpargne';

export class CompteFactory {
  static create(data: {
    id: string;
    numero: string;
    proprietaire: string;
    solde?: number;
    type: 'courant' | 'epargne';
    tauxInteret?: number;
  }): Compte {
    const solde = data.solde ?? 0;
    if (data.type === 'courant') {
      return new CompteCourant(data.id, data.numero, data.proprietaire, solde);
    } else if (data.type === 'epargne') {
      return new CompteEpargne(data.id, data.numero, data.proprietaire, solde, data.tauxInteret ?? 0);
    }
    throw new Error(`Type de compte inconnu: ${data.type}`);
  }
}
