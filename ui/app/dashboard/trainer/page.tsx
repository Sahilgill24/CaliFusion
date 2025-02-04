import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainerModelView from "@/components/training-dashboard";

const Trainer = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-display">
        Have some spare computing power?
      </h1>
      <p className="text-lg text-muted-foreground">
        Train models and earn ETH while you're at it. 🚀
      </p>
      <div>
        <Tabs defaultValue="Available" className="mt-4 w-full">
          <TabsList className="grid w-[600px] grid-cols-3" variant={"outline"}>
            <TabsTrigger
              value="Available"
              className="text-base"
              variant={"outline"}
            >
              Available
            </TabsTrigger>
            <TabsTrigger
              value="Training"
              className="text-base"
              variant={"outline"}
            >
              Training
            </TabsTrigger>
            <TabsTrigger
              value="Completed"
              className="text-base"
              variant={"outline"}
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Available">
            <TrainerModelView status="available" />
          </TabsContent>
          <TabsContent value="Training">
            <TrainerModelView status="training" />
          </TabsContent>
          <TabsContent value="Completed">
            <TrainerModelView status="completed" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trainer;
