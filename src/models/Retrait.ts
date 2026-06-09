import { Operation } from './Operation';
import { Compte } from './Compte';

export class Retrait extends Operation {
  constructor(id: string, montant: number, date: string, compteId: string) {
    super(id, montant, date, compteId);
  }

  executer(compte: Compte): void {
    if (compte.id !== this.compteId) {
      throw new Error("Incohérence de compte pour le retrait.");
    }
    compte.retirer(this.montant);
  }

  get type(): 'retrait' {
    return 'retrait';
  }
}
