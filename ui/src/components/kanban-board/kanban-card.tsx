"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PublisherModel } from "@/lib/types";
import DropIndicator from "./drop-indicator";
import { Merge, Pencil, Trash } from "lucide-react";
import AggregateParamsModalWrapper from "./aggregate-params-modal";

interface CardProps extends PublisherModel {
  column: "draft" | "published" | "trained";
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    model: PublisherModel
  ) => void;
}

const KanbanCard: React.FC<CardProps> = ({
  id,
  title,
  description,
  status,
  epochs,
  stakeAmount,
  createdAt,
  column,
  handleDragStart,
}) => {
  const [focused, setFocused] = useState(false);
  const [clients, setClients] = useState(1);

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={column === "draft"}
        onDragStart={(e) =>
          handleDragStart(e, {
            id,
            title,
            description,
            status,
            epochs,
            createdAt,
            stakeAmount,
          })
        }
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        className={`rounded-t bg-accent/50 p-3 border-b transition-all duration-200 hover:bg-accent/70 ${
          column === "draft" ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <p
          className="text-lg font-semibold text-card-foreground line-clamp-1"
          title={title}
        >
          {title}
        </p>
        <p
          className="text-sm font-medium text-muted-foreground mt-1 line-clamp-2"
          title={description}
        >
          {description}
        </p>
        <div className="flex flex-col lg:flex-row gap-2 my-2 text-sm *:rounded">
          <div className="flex items-center justify-between flex-1 p-2 bg-card">
            <p className="font-medium">Epochs</p>
            <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
              {epochs}
            </p>
          </div>
          <div className="flex items-center justify-between flex-1 p-2 bg-card">
            <p className="font-medium">Stake</p>
            <p className="bg-accent text-primary px-2 rounded font-bold inline-flex text-xs py-1">
              {stakeAmount.toFixed(3)} ETH
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium text-muted-foreground">
            {createdAt.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          {column === "draft" && <Actions visible={focused} />}
          {column === "published" && status === "training" && (
            <TrainingIndicator focused={focused} id={id} />
          )}
        </div>
      </motion.div>
    </>
  );
};

const Actions = ({ visible = true }: { visible: boolean }) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 transition-all duration-200 *:grid *:place-items-center ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        title="edit"
        className="text-muted-foreground cursor-default hover:text-foreground"
      >
        <Pencil size={14} />
      </button>
      <button
        title="delete"
        className="text-muted-foreground cursor-default hover:text-foreground"
      >
        <Trash size={14} />
      </button>
    </div>
  );
};

const TrainingIndicator = ({
  focused,
  id,
}: {
  focused: boolean;
  id: string;
}) => {
  const [showButton, setShowButton] = useState(focused);
  const [buttonOpacity, setButtonOpacity] = useState(focused ? 1 : 0);
  useEffect(() => {
    if (focused) {
      setShowButton(true);
      setTimeout(() => setButtonOpacity(1), 50);
    } else {
      setButtonOpacity(0);
      setTimeout(() => setShowButton(false), 300);
    }
  }, [focused]);

  return (
    <div className="flex flex-row gap-2 items-center transition-all duration-300">
      <div
        className={`flex flex-row items-center gap-2 transition-all duration-300 ease-out`}
      >
        <div className="w-3 h-3 bg-highlight animate-pulse rounded-full"></div>
        <p className="text-xs text-muted-foreground font-medium">Training</p>
      </div>
      <div
        className={`overflow-hidden grid place-items-center transition-all duration-300 ease-out ${
          focused ? "w-6 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <AggregateParamsModalWrapper id={id}>
          <button
            title="aggregate model params"
            className={`transition-all duration-300 text-muted-foreground enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-50`}
            style={{
              transform: `translateX(${buttonOpacity === 0 ? "10px" : "0"})`,
            }}
          >
            <Merge className="w-4" />
          </button>
        </AggregateParamsModalWrapper>
      </div>
    </div>
  );
};

export default KanbanCard;
