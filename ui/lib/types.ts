export type PublisherModelStatus = "draft" | "training" | "trained";

export type PublisherModel = {
  id: string;
  walletAddress: string;
  title: string;
  description: string;
  status: PublisherModelStatus;
  epochs: number;
  createdAt: Date;
  stakeAmount: number;
};

export type TrainerModel = Omit<PublisherModel, "status"> & {
  status: "available" | "training" | "completed";
};