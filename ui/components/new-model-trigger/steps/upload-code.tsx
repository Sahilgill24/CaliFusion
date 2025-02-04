'use client'
import React, { useEffect, useState } from "react";
import cobalt from "../cobalt.json";
import { Editor } from "@monaco-editor/react";
import { useStepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsRight, InfoIcon, UploadIcon } from "lucide-react";
import { useNewModelStore } from "@/lib/stores/new-model-store";
import axios from "axios";
import ethers from "ethers";


const UploadCode = () => {
  const { nextStep } = useStepper();
  const { code, setCode } = useNewModelStore();
  console.log(code)
  // await request(code)

  async function request(data: any) {
    console.log(data)
    const response = await axios.post('http://localhost:5001/modelupload', { "data": data })
    console.log(response)
  }


  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const theme = JSON.parse(JSON.stringify(cobalt));

  console.log(code);

  useEffect(() => {
    if (uploadedFile) {
      console.log(uploadedFile);
      const reader = new FileReader();
      reader.readAsText(uploadedFile);
      reader.onload = (e) => {
        console.log(e.target?.result);
        setCode(e.target?.result as string);
      };
    }
  }, [uploadedFile]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-4">
        <div className="py-2 px-2 w-full rounded-t-2xl bg-black border-t border-primary/20 flex items-center justify-between">
          <div className="gap-2 flex pr-2">
            <Input
              type="file"
              accept=".py"
              placeholder="Upload your model code"
              onChange={(e) => {
                setUploadedFile(e.target.files?.[0]);
              }}
            />
            <Button size={"icon"} variant={"secondary"} className="px-2 !w-10">
              <UploadIcon size={16} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm inline-block font-medium">
            <InfoIcon size={16} className="mr-1 inline-block" />
            We only have support for{" "}
            <span className="text-accent-foreground font-bold underline-theme">
              {" "}
              python linear regression models
            </span>{" "}
            at the moment.
          </p>
        </div>
        <Editor
          value={code}
          language="python"
          width={"100%"}
          height={360}
          onChange={(fileContent) => setCode(fileContent || "")}
          theme="cobalt"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("cobalt", theme);
          }}
        />
      </div>

      <div className="flex flex-row px-1">
        <div className="flex-1" />
        <Button
          onClick={async () => {
            nextStep();
            await request(code);
          }}
          className="flex items-center"
          disabled={!code}
        >
          Next <ChevronsRight className="ml-1" size={16} />
        </Button>

      </div>
    </div>
  );
};

export default UploadCode;
