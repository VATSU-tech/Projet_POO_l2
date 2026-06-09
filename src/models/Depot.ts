import { Operation } from './Operation';
import { Compte } from './Compte';

export class Depot extends Operation {
  constructor(id: string, montant: number, date: string, compteId: string) {
    super(id, montant, date, compteId);
  }

  executer(compte: Compte): void {
    if (compte.id !== this.compteId) {
      throw new Error("Incohérence de compte pour le dépôt.");
    }
    compte.deposer(this.montant);
  }

  get type(): 'depot' {
    return 'depot';
  }
}
