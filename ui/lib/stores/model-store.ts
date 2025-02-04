import { create } from "zustand";
import { PublisherModel } from "../types";

interface ModelStates {
  models: PublisherModel[];
  addModel: (model: PublisherModel) => void;
  setModels: (models: PublisherModel[]) => void;
}

export const useModelStore = create<ModelStates>((set) => ({
  models: [],
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  setModels: (models) => set({ models }),
}));
