import { Compte } from './Compte';

export abstract class Operation {
  private _id: string;
  private _montant: number;
  private _date: string;
  private _compteId: string;

  constructor(id: string, montant: number, date: string, compteId: string) {
    this._id = id;
    this._montant = montant;
    this._date = date;
    this._compteId = compteId;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get montant(): number {
    return this._montant;
  }

  get date(): string {
    return this._date;
  }

  get compteId(): string {
    return this._compteId;
  }

  // Polymorphic execution method
  abstract executer(compte: Compte): void;

  // Type helper for serialization/display
  abstract get type(): 'depot' | 'retrait';
}
