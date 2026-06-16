import { describe, it, expect } from 'vitest';
import { CompteCourant } from './CompteCourant';
import { CompteEpargne } from './CompteEpargne';
import { CompteFactory } from './CompteFactory';
import { Depot } from './Depot';
import { Retrait } from './Retrait';

describe('Classes de Modèles POO (Comptes & Opérations)', () => {

  describe('CompteCourant', () => {
    it('devrait créer un compte courant avec les bonnes valeurs', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 500, 300);
      expect(compte.id).toBe('1');
      expect(compte.numero).toBe('CC-123');
      expect(compte.proprietaire).toBe('Alice');
      expect(compte.solde).toBe(500);
      expect(compte.decouvertAutorise).toBe(300);
      expect(compte.type).toBe('courant');
    });

    it('devrait accepter un dépôt valide', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100);
      compte.deposer(50);
      expect(compte.solde).toBe(150);
    });

    it('devrait refuser un dépôt négatif ou nul', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100);
      expect(() => compte.deposer(-50)).toThrow();
      expect(() => compte.deposer(0)).toThrow();
    });

    it('devrait autoriser un retrait dans la limite du solde', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100, 0);
      compte.retirer(60);
      expect(compte.solde).toBe(40);
    });

    it('devrait autoriser un retrait dans la limite du découvert autorisé', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100, 200);
      compte.retirer(250);
      expect(compte.solde).toBe(-150);
    });

    it('devrait lever une erreur si le retrait dépasse la limite du découvert', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100, 200);
      expect(() => compte.retirer(350)).toThrow(/insuffisant/);
    });
  });

  describe('CompteEpargne', () => {
    it('devrait créer un compte épargne avec les bonnes valeurs', () => {
      const compte = new CompteEpargne('2', 'CE-456', 'Bob', 1000, 2.5);
      expect(compte.tauxInteret).toBe(2.5);
      expect(compte.type).toBe('epargne');
    });

    it('devrait refuser un taux d\'intérêt négatif', () => {
      const compte = new CompteEpargne('2', 'CE-456', 'Bob', 1000, 2.5);
      expect(() => { compte.tauxInteret = -1; }).toThrow();
    });

    it('devrait interdire un retrait entraînant un découvert', () => {
      const compte = new CompteEpargne('2', 'CE-456', 'Bob', 100);
      expect(() => compte.retirer(101)).toThrow(/insuffisant/);
    });
  });

  describe('CompteFactory', () => {
    it('devrait créer des instances correctes à partir de données brutes', () => {
      const rawCourant = {
        id: '1',
        numero: 'CC-123',
        proprietaire: 'Alice',
        solde: 500,
        type: 'courant' as const,
        decouvertAutorise: 300
      };
      const rawEpargne = {
        id: '2',
        numero: 'CE-456',
        proprietaire: 'Bob',
        solde: 1000,
        type: 'epargne' as const,
        tauxInteret: 2.5
      };

      const courant = CompteFactory.create(rawCourant);
      const epargne = CompteFactory.create(rawEpargne);

      expect(courant).toBeInstanceOf(CompteCourant);
      expect(epargne).toBeInstanceOf(CompteEpargne);
      expect((courant as CompteCourant).decouvertAutorise).toBe(300);
      expect((epargne as CompteEpargne).tauxInteret).toBe(2.5);
    });
  });

  describe('Opérations (Polymorphisme)', () => {
    it('devrait exécuter correctement un dépôt via la classe Depot', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100);
      const depot = new Depot('op1', 50, new Date().toISOString(), '1');
      depot.executer(compte);
      expect(compte.solde).toBe(150);
    });

    it('devrait exécuter correctement un retrait via la classe Retrait', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100, 0);
      const retrait = new Retrait('op2', 40, new Date().toISOString(), '1');
      retrait.executer(compte);
      expect(compte.solde).toBe(60);
    });

    it('devrait jeter une erreur en cas d\'incohérence d\'identifiant de compte', () => {
      const compte = new CompteCourant('1', 'CC-123', 'Alice', 100);
      const depot = new Depot('op1', 50, new Date().toISOString(), '999'); // différent de 1
      expect(() => depot.executer(compte)).toThrow(/Incohérence/);
    });
  });
});
