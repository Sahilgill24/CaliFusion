"use client";

import React, { useState } from "react";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadCode from "./steps/upload-code";
import ModelDetails from "./steps/model-detail";
import { BadgeCheck } from "lucide-react";
import { useNewModelStore } from "@/lib/stores/new-model-store";

const NewModelTrigger = ({ children }: { children: React.ReactNode }) => {
  const steps = [
    { label: "Upload Code" },
    { label: "Model Details" },
  ] satisfies StepItem[];

  const { setCode, setTitle, setDescription, setEpochs, setStakeAmount } =
    useNewModelStore();
  const [hasCompletedAllSteps, setHasCompletedAllSteps] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setHasCompletedAllSteps(false);
          setCode("");
          setTitle("");
          setDescription("");
          setEpochs(0);
          setStakeAmount(0);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen-lg">
        <DialogHeader className="mb-2">
          <DialogTitle className="font-display font-normal text-3xl">
            New Model
          </DialogTitle>
        </DialogHeader>
        <Stepper
          initialStep={0}
          steps={steps}
          orientation="horizontal"
          variant="circle"
          className="w-[60%] justify-start"
        >
          {steps.map(({ label }, index) => {
            return (
              <Step key={label} label={label}>
                {index == 0 && <UploadCode />}
                {index == 1 && (
                  <ModelDetails
                    hasCompletedAllSteps={hasCompletedAllSteps}
                    setHasCompletedAllSteps={setHasCompletedAllSteps}
                  />
                )}
              </Step>
            );
          })}
        </Stepper>
        {hasCompletedAllSteps && (
          <div className="flex flex-row gap-2 items-center justify-around pt-4 pb-2">
            <div className="flex items-center gap-2 border-r">
              <BadgeCheck size={56} className="text-primary" />
              <p className="ml-2 text-xl font-bold text-primary inline">
                Model created successfully!
              </p>
            </div>
            <p className="text-base font-medium text-muted-foreground px-2">
              You can see your model in the drafts section. You can edit it if
              you want or publish it for training :)
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewModelTrigger;
