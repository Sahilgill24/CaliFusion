import { TrainerModel } from "../types";

export const sampleTrainerModels: TrainerModel[] = [
  {
    id: "trainer-1",
    walletAddress: "0x8F26bc456deFAe6e4",
    title: "FL",
    description:
      "FL",
    status: "available",
    epochs: 1,
    createdAt: new Date("2024-09-12T10:00:00Z"),
    stakeAmount: 0.01,
  },
  {
    id: "trainer-2",
    walletAddress: "0x8F26bc456deFAe6e4",
    title: "Federated Learning Model - Health Data",
    description:
      "A federated learning model focusing on privacy-preserving training using health data.",
    status: "available",
    epochs: 50,
    createdAt: new Date("2024-09-12T10:00:00Z"),
    stakeAmount: 0.01,
  },

];
