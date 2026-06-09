import { Compte } from './Compte';

export class CompteCourant extends Compte {
  constructor(id: string, numero: string, proprietaire: string, solde: number = 0) {
    super(id, numero, proprietaire, solde);
  }

  get type(): 'courant' {
    return 'courant';
  }
}
