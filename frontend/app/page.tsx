import AboutUs from "@/components/AboutUs";
import HomePage from "@/components/HomePage";
import { Separator } from "@/components/ui/separator";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomePage />
      <AboutUs />
      <Separator />
      <WhyChooseUs />
    </div>
  );
}
