// Column.tsx
import React, { useState } from "react";
import Card from "./kanban-card";
import DropIndicator from "./drop-indicator";
import { PublisherModel } from "@/lib/types";
import { getIndicators, getNearestIndicator } from "@/lib/dragUtils";
import NewModelTrigger from "@/components/new-model-trigger";
import { Button } from "../ui/button";

interface ColumnProps {
  title: string;
  headingColor: string;
  models: PublisherModel[];
  column: "draft" | "published" | "trained";
  setModels: (models: PublisherModel[]) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  models,
  column,
  setModels,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    model: PublisherModel
  ) => {
    // Only allow dragging from draft column
    if (column === "draft") {
      e.dataTransfer.setData("modelId", model.id);
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const modelId = e.dataTransfer.getData("modelId");
    setActive(false);
    clearHighlights();

    // Only allow dropping in the published column
    if (column !== "published") return;

    const indicators = getIndicators(column);
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== modelId) {
      let copy = [...models];
      const modelToTransfer = copy.find((m) => m.id === modelId);
      if (!modelToTransfer) return;

      modelToTransfer.status = "training";

      copy = copy.filter((m) => m.id !== modelId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(modelToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, modelToTransfer);
      }
      setModels(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Only allow dragging over the published column
    if (column !== "published") {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators(column);
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators(column);
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredModels = models.filter((m) => {
    if (column === "draft") return m.status === "draft";
    if (column === "published") return m.status === "training";
    if (column === "trained") return m.status === "trained";
    return false;
  });

  return (
    <div className={`flex-1`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-muted-foreground">
          {filteredModels.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active && column === "published" ? "bg-muted/50" : "bg-muted/0"
        }`}
      >
        {filteredModels.map((m) => (
          <Card
            key={m.id}
            {...m}
            column={column}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        {column === "draft" && (
          <NewModelTrigger>
            <Button
              className="text-muted-foreground hover:bg-background hover:text-foreground"
              size={"sm"}
              variant={"ghost"}
            >
              + Add Model
            </Button>
          </NewModelTrigger>
        )}
      </div>
    </div>
  );
};

export default Column;
