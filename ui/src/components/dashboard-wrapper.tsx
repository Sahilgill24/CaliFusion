import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

interface navItem {
  name: string;
  link: string;
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const navItems: navItem[] = [
    { name: "Publisher", link: "/dashboard/publisher" },
    { name: "Trainer", link: "/dashboard/trainer" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const address = "0x1234567890"; // TODO: make this dynamic as per user login
  const balance = 0.001

  const truncatedWallet = address?.slice(0, 6) + "..." + address?.slice(-6);

  return (
    <>
      <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]">
        <header className="flex items-center justify-between bg-background py-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-lg ">CaliFusion</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeIndex === index ? "linkActive" : "linkHover2"}
                  onClick={() => {
                    setActiveIndex(index);
                    navigate(item.link);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>


        </header>
        <div className="mt-8 flex w-full flex-col gap-8">{children}</div>
      </div>
    </>
  );
};

export default DashboardWrapper;