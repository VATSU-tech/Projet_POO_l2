import { Compte } from './Compte';

export class CompteCourant extends Compte {
  private _decouvertAutorise: number;

  constructor(id: string, numero: string, proprietaire: string, solde: number = 0, decouvertAutorise: number = 400) {
    super(id, numero, proprietaire, solde);
    this._decouvertAutorise = decouvertAutorise;
  }

  get decouvertAutorise(): number {
    return this._decouvertAutorise;
  }

  set decouvertAutorise(value: number) {
    if (value < 0) {
      throw new Error("Le découvert autorisé ne peut pas être négatif.");
    }
    this._decouvertAutorise = value;
  }

  retirer(montant: number): void {
    if (montant <= 0) {
      throw new Error("Le montant à retirer doit être supérieur à zéro.");
    }
    if (this.solde + this._decouvertAutorise < montant) {
      throw new Error(`Solde insuffisant pour effectuer ce retrait. Solde disponible: ${this.solde} €, Découvert autorisé: ${this._decouvertAutorise} €.`);
    }
    this.solde -= montant;
  }

  get type(): 'courant' {
    return 'courant';
  }
}
