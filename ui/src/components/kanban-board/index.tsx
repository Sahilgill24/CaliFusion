"use client";
import React, { useState } from "react";
import Column from "./column";
import { PublisherModel } from "@/lib/types";
import { useModelStore } from "@/lib/stores/model-store";

const DEFAULT_MODELS: PublisherModel[] = [
  {
    id: "1",
    title: "New Marketing Model",
    description: "Initial draft for Q3 campaign",
    status: "draft",
    walletAddress: "0x123456789",
    epochs: 0,
    createdAt: new Date(),
    stakeAmount: 0,
  },
  {
    id: "2",
    title: "Product Update Model",
    description: "Model for new features announcement",
    status: "training",
    walletAddress: "0x123456789",
    epochs: 10,
    createdAt: new Date(),
    stakeAmount: 5.167,
  },
  {
    id: "3",
    title: "Customer Support Model",
    description: "Trained model for customer inquiries",
    status: "draft",
    walletAddress: "0x123456789",
    epochs: 50,
    createdAt: new Date(),
    stakeAmount: 8.002,
  },
];

export const PublisherKanbanBoard: React.FC = () => {
  const { models, setModels} = useModelStore();

  return (
    <div className="flex h-full w-full gap-3 py-6">
      <Column
        title="Drafts"
        column="draft"
        headingColor="text-muted-foreground"
        models={models}
        setModels={setModels}
      />
      <Column
        title="Published"
        column="published"
        headingColor="text-highlight"
        models={models}
        setModels={setModels}
      />
      <Column
        title="Trained"
        column="trained"
        headingColor="text-primary"
        models={models}
        setModels={setModels}
      />
    </div>
  );
};

export default PublisherKanbanBoard;
