import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelineState {
  visitedEras: Set<string>;
  currentEra: string;
  isMapOpen: boolean;
  visitEra: (eraId: string) => void;
  setCurrentEra: (eraId: string) => void;
  openMap: () => void;
  closeMap: () => void;
  toggleMap: () => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      visitedEras: new Set(['boot']),
      currentEra: 'boot',
      isMapOpen: false,
      visitEra: (eraId: string) =>
        set((state) => ({
          visitedEras: new Set([...state.visitedEras, eraId]),
        })),
      setCurrentEra: (eraId: string) => {
        const { visitEra } = get();
        visitEra(eraId);
        set({ currentEra: eraId });
      },
      openMap: () => set({ isMapOpen: true }),
      closeMap: () => set({ isMapOpen: false }),
      toggleMap: () => set((state) => ({ isMapOpen: !state.isMapOpen })),
    }),
    {
      name: 'genesis-timeline-storage',
      partialize: (state) => ({
        visitedEras: Array.from(state.visitedEras),
        currentEra: state.currentEra,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as { visitedEras: string[]; currentEra: string };
        return {
          ...current,
          visitedEras: new Set(persistedState.visitedEras || ['boot']),
          currentEra: persistedState.currentEra || 'boot',
          isMapOpen: false,
        };
      },
    }
  )
);
