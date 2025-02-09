"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Merge, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import CopyAddress from "@/components/ui/copy-address";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import axios from "axios";
import { decrypt } from "@/lib/utils";
import { EncryptedData } from "@/lib/utils";
// import { ethers } from "ethers";
// import abiJson from "../../../abi/aggregator.json"


interface Contributor {
  address: string;

}
const AggregateParamsModalWrapper = ({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
}) => {


  // const abi = JSON.parse(JSON.stringify(abiJson))
  // const provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  // const signer = new ethers.Wallet('6b99711d264ac83b798ec10389f34afe53e6f6c6fdbb821b139aba9fd4cf9f2c', provider);
  // const contractAddress = '0x23cacbF723355F96fb42ce3ba1Cbc247F41C2568';
  // const aggregatorcontract = new ethers.Contract(contractAddress, abi, signer);
  const sampleContributors: Contributor[] = [
    {
      address: "bd3sg-teaaa-aaaaa-qaaba-cai",

    }
  ];
  const [contributors, setContributors] = useState<Contributor[]>(sampleContributors);
  const [isLoading, setIsLoading] = useState(false);
  const [aggregating, setIsAggregating] = useState(false);
  const [loss, setLoss] = useState<string | null>(null)
  const [uplaoder, setuploader] = useState<string | null>(null)




  const aggregate = async () => {
    setIsAggregating(true);

    const res = await axios.get('http://localhost:4001/aggregate');
    const hi = res.data
    console.log(hi)
    const finalval = hi.value


    // const finalval = decrypt({
    //   "iv": "3ef16ceda6f90e76abaaa92947d915c2",
    //   "encryptedData": "f95071503886b276e01826ee7c42f5c23e35c2b307373d0cb65baf822320dca4b2a09973f85e7b7a833dbc5a942bf07a6dc23e8de3323a59f85626b50f32c5d56f3de71c9c3091bc08c5f8a39e37269349a7f7e58dbfc4b625e4e89dc68c76e94f71b07a162a28c14cd8dd1acddf24cb820cb6e308e83e669ca36b9a339a073e"
    // }
    // ).toString();


    // Extract the numeric value from the decrypted string (e.g., "x:2989")
    const formattedValue = finalval; // "2989"
    if (!formattedValue || isNaN(Number(formattedValue))) {
      throw new Error("Invalid decrypted value format");
    }
    console.log(formattedValue)
      // const currentNonce = await provider.getTransactionCount(signer.getAddress(), "pending");
      // const tx = await aggregatorcontract.decryptedValue(parseFloat(formattedValue), {
      //   gasPrice: 7000000,
      //   nonce: currentNonce
      // })


      // await tx.wait()
      // console.log("https://sepolia.etherscan.io/tx/" + tx.hash)
      ; // Increase by 15%

    // const tx2 = await aggregatorcontract.federatedaverage({
    //   nonce: currentNonce,
    //   gasPrice: 300000,
    // });
    // setLoss(tx2)
    setLoss((parseFloat(formattedValue) / 100).toFixed(3))
    setIsAggregating(false);

  }

  useEffect(() => {
    // TODO: Fetch contributors from the server
    setIsLoading(true);
    setTimeout(() => {
      setContributors(sampleContributors);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="font-display font-normal text-2xl">
            Aggregate Params
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Aggregate parameters for {title}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <Spinner className="w-8 h-8 mb-4 mx-auto" />
        ) : (
          <>
            <Table>
              <TableCaption>
                {contributors.length
                  ? "Contributors on your model."
                  : "No Contributors on your model, currently.."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.length && contributors.map((contributor, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <CopyAddress
                        className="text-sm"
                        address={contributor.address}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              disabled={contributors.length == 0}
              onClick={async () => await aggregate()}
              className="mt-4"
            >
              {aggregating ? (
                "Aggregating..."
              ) : (
                <>
                  {" "}
                  Aggregate <Merge className="w-4 ml-1" />
                </>
              )}
            </Button>
          </>
        )}
        {loss ? (
          <p className="w-full rounded-lg border border-primary/20 p-4 flex flex-row items-center gap-2 justify-center font-semibold bg-secondary">
            Loss <MoveRight className="w-4" /> {loss}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AggregateParamsModalWrapper;
