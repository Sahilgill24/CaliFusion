import { TrainerModel } from "../types";

export const sampleTrainerModels: TrainerModel[] = [
  {
    id: "trainer-1",
    walletAddress: "a3shf-5eaaa-aaaaa-qaafa-cai",
    title: "FL",
    description:
      "FL",
    status: "available",
    epochs: 1,
    createdAt: new Date(),
    stakeAmount: 0.01,
  },
  {
    id: "trainer-2",
    walletAddress: "a3shf-5eaaa-aaaaa-qaafa-cai",
    title: "Federated Learning Model - Health Data",
    description:
      "A federated learning model focusing on privacy-preserving training using health data.",
    status: "available",
    epochs: 50,
    createdAt: new Date(),
    stakeAmount: 0.01,
  },

];
