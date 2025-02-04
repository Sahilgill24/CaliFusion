"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
// import { useAccount, useBalance } from "wagmi";
// import { sepolia } from "viem/chains";

interface navItem {
  name: string;
  link: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems: navItem[] = [
    { name: "Publisher", link: "/dashboard/publisher" },
    { name: "Trainer", link: "/dashboard/trainer" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Fetching account and balance (sepolia eth)
  // const { address } = useAccount();
  // const balance = useBalance({
  //   address: address,
  //   chainId: sepolia.id,
  // });
  const address = "0x1234567890"; // TODO: make this dynamic as per user login
  const balance = 0.001
  
  const truncatedWallet = address?.slice(0, 6) + "..." + address?.slice(-6);

  return (
    <>
      <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg ">CaliFusion</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeIndex === index ? "linkActive" : "linkHover2"}
                  onClick={() => {
                    setActiveIndex(index);
                    router.push(item.link);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>

          {address ? (
            <div className="flex flex-row gap-1">
              <span className="text-sm ">
                Balance :{" "}
                {balance.data?.formatted
                  ? parseFloat(balance.data.formatted).toFixed(3)
                  : 0}{" "}
                ETH
              </span>
              <Separator className="w-[2px]" orientation="vertical" />
              <span className="text-sm text-muted-foreground">
                {truncatedWallet}
              </span>
            </div>
          ) : (
            <Button>Connect Wallet</Button>
          )}
        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
