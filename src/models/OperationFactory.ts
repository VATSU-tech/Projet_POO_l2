import { Operation } from './Operation';
import { Depot } from './Depot';
import { Retrait } from './Retrait';

export class OperationFactory {
  static create(data: {
    id: string;
    montant: number;
    date: string;
    compteId: string;
    type: 'depot' | 'retrait';
  }): Operation {
    if (data.type === 'depot') {
      return new Depot(data.id, data.montant, data.date, data.compteId);
    } else if (data.type === 'retrait') {
      return new Retrait(data.id, data.montant, data.date, data.compteId);
    }
    throw new Error(`Type d'opération inconnu: ${data.type}`);
  }
}
