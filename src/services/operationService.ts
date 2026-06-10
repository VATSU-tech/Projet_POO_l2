import axios from 'axios';
import { Operation } from '../models/Operation';
import { OperationFactory } from '../models/OperationFactory';
import { CompteService } from './compteService';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_URL = `${BASE_URL}/operations`;

export class OperationService {
  static async getAll(): Promise<Operation[]> {
    const response = await axios.get(API_URL);
    // Sort operations by date descending by default
    const data = response.data.map((item: any) => OperationFactory.create(item));
    return data.sort((a: Operation, b: Operation) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getByCompteId(compteId: string): Promise<Operation[]> {
    const response = await axios.get(`${API_URL}?compteId=${compteId}`);
    const data = response.data.map((item: any) => OperationFactory.create(item));
    return data.sort((a: Operation, b: Operation) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async create(operationData: {
    montant: number;
    compteId: string;
    type: 'depot' | 'retrait';
  }): Promise<Operation> {
    // 1. Get the account instance
    const compte = await CompteService.getById(operationData.compteId);

    // 2. Instantiate the Operation using the factory
    const id = Date.now().toString();
    const date = new Date().toISOString();
    const operation = OperationFactory.create({
      id,
      montant: operationData.montant,
      date,
      compteId: operationData.compteId,
      type: operationData.type,
    });

    // 3. Execute the operation (applies the business logic: deposer/retirer)
    operation.executer(compte);

    // 4. Save the updated account
    await CompteService.update(compte);

    // 5. Save the operation record
    const payload = {
      id: operation.id,
      montant: operation.montant,
      date: operation.date,
      compteId: operation.compteId,
      type: operation.type,
    };
    const response = await axios.post(API_URL, payload);
    return OperationFactory.create(response.data);
  }
}
