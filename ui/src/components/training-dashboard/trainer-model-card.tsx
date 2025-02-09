"use client";

import { TrainerModel } from "@/lib/types";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

const TrainerModelCard = (props: TrainerModel) => {
  const [focused, setFocused] = useState(false);
  // reward calc
  const ethToUsd = 3900;
  const rewardInETH = props.epochs * 0.001;
  const rewardInDollars = rewardInETH * ethToUsd; // TODO: Calculate reward, ye to aise hi kra hai abhi
  const formattedRewardInUSD = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(rewardInDollars));

  const truncatedWallet =
    props.walletAddress.slice(0, 6) + "..." + props.walletAddress.slice(-6);

  return (
    <div
      className="rounded-t bg-accent/50 p-3 border-b transition-all duration-200 hover:bg-accent/70"
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <p
            className="text-lg font-semibold text-card-foreground line-clamp-2"
            title={props.title}
          >
            {props.title}
          </p>
          <p
            className="text-sm font-medium text-muted-foreground mt-1 line-clamp-2"
            title={props.description}
          >
            {props.description}
          </p>
        </div>
        <div className="w-36 bg-card rounded-md flex flex-col p-3 border-t justify-between">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Reward
          </p>
          <div>
            <p className="text-3xl  font-display text-primary">
              {formattedRewardInUSD}
            </p>
            <p className="text-xs font-bold text-muted-foreground">
              {rewardInETH.toFixed(3)} ETH
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 mt-4 text-sm *:rounded">
        <div className="flex items-center justify-between flex-1 p-2 bg-card">
          <p className="font-medium">Epochs</p>
          <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
            {props.epochs}
          </p>
        </div>
        <div className="flex items-center justify-between flex-1 p-2 bg-card">
          <p className="font-medium">Stake</p>
          <p className="bg-accent text-highlight px-2 rounded font-bold inline-flex text-xs py-1">
            {props.stakeAmount.toFixed(3)} ETH
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-muted-foreground">
          {props.createdAt.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          | <span className="text-foreground"> {truncatedWallet} </span>
        </span>
        {props.status === "available" && (
          <StartTrainingButton visible={focused} model={props} />
        )}
        {props.status === "training" && <TrainingIndicator />}
        {props.status === "completed" && <CompletedIndicator />}
      </div>
    </div>
  );
};

const StartTrainingButton = ({
  visible,
  model,
}: {
  visible: boolean;
  model: TrainerModel;
}) => {
  const [dataSet, setDataSet] = useState<File | null>(null);
  const stakeAndUploadDataSet = async () => {
    const response = await axios.post('http://localhost:4000/training')
    console.log(response)

  }
  return (
    <Dialog>
      <DialogTrigger>
        <button
          className={`inline-flex gap-1 bg-primary text-primary-foreground rounded py-1 px-2 font-medium text-xs transition-all duration-200 ${visible ? "opacity-100" : "opacity-0"
            }`}
        >
          Start Training <Rocket size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal tracking-normal">
            Stake to Continue
          </DialogTitle>
          <DialogDescription>
            Stake {model.stakeAmount.toFixed(3)} ETH to start training this
            model. This stake will be refunded after training is complete.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-2 my-2 text-sm *:rounded">
          <div className="flex items-center justify-between flex-1 p-2 bg-muted">
            <p className="font-medium">Epochs</p>
            <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
              {model.epochs}
            </p>
          </div>
        
          <div className="flex items-center justify-between flex-1 p-2 bg-muted">
            <p className="font-medium">Stake</p>
            <p className="bg-accent text-primary px-2 rounded font-bold inline-flex text-xs py-1">
              {model.stakeAmount.toFixed(3)} ETH
            </p>
          </div>
        </div>
        <div>
          <Label>Upload Dataset (for training the model)</Label>
          <Input
            type="file"
            onChange={(e) =>
              setDataSet(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <Button disabled={!dataSet} onClick={stakeAndUploadDataSet}>Stake</Button>
      </DialogContent>
    </Dialog>
  );
};


const TrainingIndicator = () => {
  return (
    <div
      className={`flex items-center gap-2 transition-all duration-300 ease-out`}
    >
      <div className="w-3 h-3 bg-primary animate-pulse rounded-full"></div>
      <p className="text-xs text-muted-foreground font-medium">Training</p>
    </div>
  );
};

const CompletedIndicator = () => {
  return (
    <div
      className={`flex items-center gap-1 transition-all duration-300 ease-out text-primary`}
    >
      <Check size={16} />
      <p className="text-xs font-medium">Completed</p>
    </div>
  );
}

export default TrainerModelCard;