import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { useModelStore } from "@/lib/stores/model-store";
import { useNewModelStore } from "@/lib/stores/new-model-store";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";

interface ModelDetailProps {
  hasCompletedAllSteps: boolean;
  setHasCompletedAllSteps: (hasCompletedSteps: boolean) => void;
}

const ModelDetails = (props: ModelDetailProps) => {
  const { setHasCompletedAllSteps } = props;
  const { nextStep, prevStep } = useStepper();
  const {
    title,
    description,
    epochs,
    stakeAmount,
    setTitle,
    setDescription,
    setEpochs,
    setStakeAmount,
  } = useNewModelStore();

  const { addModel } = useModelStore();
  const { address } = useAccount();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasCompletedAllSteps(true);

    addModel({
      id: "12",
      title: title,
      description: description,
      epochs: epochs,
      stakeAmount: stakeAmount,
      createdAt: new Date(),
      walletAddress: address || "0x123456789",
      status: "draft",
    });
    nextStep();

    // TODO: API call to create model
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter model title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              placeholder="Enter model description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs</Label>
            <Input
              id="epochs"
              type="number"
              required
              placeholder="Enter number of epochs"
              min={1}
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeAmount">Stake Amount (ETH)</Label>
            <Input
              id="stakeAmount"
              type="number"
              required
              placeholder="Enter stake amount (ETH)"
              min={0}
              step={0.01}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex">
        <div className="flex-1"></div>
        <div className="flex flex-row items-center gap-2">
          <Button
            className="w-24 !h-10"
            variant={"ghost"}
            onClick={() => {
              prevStep();
            }}
          >
            <ChevronsLeft className="mr-1" size={16} /> Back
          </Button>
          <Button className="w-24 h-10" type="submit">
            Next <ChevronsRight className="ml-1" size={16} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ModelDetails;
