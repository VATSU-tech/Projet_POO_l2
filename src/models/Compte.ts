export abstract class Compte {
  private _id: string;
  private _numero: string;
  private _proprietaire: string;
  private _solde: number;

  constructor(id: string, numero: string, proprietaire: string, solde: number = 0) {
    this._id = id;
    this._numero = numero;
    this._proprietaire = proprietaire;
    this._solde = solde;
  }

  // Getters & Setters
  get id(): string {
    return this._id;
  }

  get numero(): string {
    return this._numero;
  }

  set numero(value: string) {
    this._numero = value;
  }

  get proprietaire(): string {
    return this._proprietaire;
  }

  set proprietaire(value: string) {
    this._proprietaire = value;
  }

  get solde(): number {
    return this._solde;
  }

  set solde(value: number) {
    this._solde = value;
  }

  // Business Logic Methods
  deposer(montant: number): void {
    if (montant <= 0) {
      throw new Error("Le montant à déposer doit être supérieur à zéro.");
    }
    this._solde += montant;
  }

  retirer(montant: number): void {
    if (montant <= 0) {
      throw new Error("Le montant à retirer doit être supérieur à zéro.");
    }
    if (this._solde < montant) {
      throw new Error("Solde insuffisant pour effectuer ce retrait.");
    }
    this._solde -= montant;
  }

  consulterSolde(): number {
    return this._solde;
  }

  // Abstract property to identify account type
  abstract get type(): 'courant' | 'epargne';
}
