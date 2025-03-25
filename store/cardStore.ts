import { create } from 'zustand';

export interface Card {
  id: number;
  title: string;
  description: string;
}

interface CardState {
  cards: Card[];
  savedCards: Card[];
  addSavedCard: (card: Card) => void;
  removeCard: (cardId: number) => void;
}

export const useCardStore = create<CardState>((set) => ({
  cards: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: 'Swipe left to keep, right to trash. Try to keep only the most important cards.',
  })),
  savedCards: [],
  addSavedCard: (card) =>
    set((state) => ({
      savedCards: [...state.savedCards, card],
    })),
  removeCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    })),
}));