import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-8">
      <h1 className="text-8xl font-light font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-highlight">
        CaliFusion
      </h1>
      <p className="text-2xl text-muted-foreground">
        Collaborative Data training platform.
      </p>
      <Button
        variant={"shine"}
        size={"lg"}
        className="font-semibold"
        onClick={() => navigate("/login")}
      >
        Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
