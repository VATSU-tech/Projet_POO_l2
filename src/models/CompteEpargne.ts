import { Compte } from './Compte';

export class CompteEpargne extends Compte {
  private _tauxInteret: number;

  constructor(id: string, numero: string, proprietaire: string, solde: number = 0, tauxInteret: number = 0) {
    super(id, numero, proprietaire, solde);
    this._tauxInteret = tauxInteret;
  }

  get tauxInteret(): number {
    return this._tauxInteret;
  }

  set tauxInteret(value: number) {
    if (value < 0) {
      throw new Error("Le taux d'intérêt ne peut pas être négatif.");
    }
    this._tauxInteret = value;
  }

  get type(): 'epargne' {
    return 'epargne';
  }
}
