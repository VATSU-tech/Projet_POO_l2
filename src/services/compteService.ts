import axios from 'axios';
import { Compte } from '../models/Compte';
import { CompteFactory } from '../models/CompteFactory';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_URL = `${BASE_URL}/comptes`;

export class CompteService {
  static async getAll(): Promise<Compte[]> {
    const response = await axios.get(API_URL);
    return response.data.map((item: any) => CompteFactory.create(item));
  }

  static async getById(id: string): Promise<Compte> {
    const response = await axios.get(`${API_URL}/${id}`);
    return CompteFactory.create(response.data);
  }

  static async create(compteData: {
    numero: string;
    proprietaire: string;
    solde?: number;
    type: 'courant' | 'epargne';
    tauxInteret?: number;
    decouvertAutorise?: number;
  }): Promise<Compte> {
    const id = Date.now().toString();
    const payload = {
      id,
      numero: compteData.numero,
      proprietaire: compteData.proprietaire,
      solde: compteData.solde ?? 0,
      type: compteData.type,
      ...(compteData.type === 'epargne' ? { tauxInteret: compteData.tauxInteret ?? 0 } : {}),
      ...(compteData.type === 'courant' ? { decouvertAutorise: compteData.decouvertAutorise ?? 400 } : {})
    };
    const response = await axios.post(API_URL, payload);
    return CompteFactory.create(response.data);
  }

  static async update(compte: Compte): Promise<Compte> {
    const payload: any = {
      id: compte.id,
      numero: compte.numero,
      proprietaire: compte.proprietaire,
      solde: compte.solde,
      type: compte.type
    };
    if (compte.type === 'epargne') {
      payload.tauxInteret = (compte as any).tauxInteret;
    } else if (compte.type === 'courant') {
      payload.decouvertAutorise = (compte as any).decouvertAutorise;
    }
    const response = await axios.put(`${API_URL}/${compte.id}`, payload);
    return CompteFactory.create(response.data);
  }

  static async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}
