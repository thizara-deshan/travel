import { CalendarCheck, CalendarCog, Leaf, Map } from "lucide-react";

import { ElementType } from "react";

type WhyChooseUsType = {
  id: number;
  title: string;
  description: string;
  icon: ElementType;
};

export const whyChooseUs: WhyChooseUsType[] = [
  {
    id: 1,
    title: "Local Expertise",
    description:
      "Our team is composed of local experts who know the ins and outs of Sri Lanka. From the hidden gems to the must-see attractions, we have the knowledge and connections to make your trip truly special.",
    icon: Map,
  },
  {
    id: 2,
    title: "Tailored Experiences",
    description:
      "We understand that every traveler is different. That’s why we offer bespoke travel experiences, carefully curated to match your interests, budget, and travel style.",
    icon: CalendarCog,
  },
  {
    id: 3,
    title: "Sustainable Travel",
    description:
      "We are committed to promoting sustainable tourism in Sri Lanka. We work closely with local communities, support eco-friendly practices, and strive to minimize our environmental impact.",
    icon: Leaf,
  },
  {
    id: 4,
    title: "24/7 Support",
    description:
      "Your comfort and safety are our top priorities. Our dedicated support team is available 24/7 to assist you during your trip, ensuring a smooth and worry-free experience.",
    icon: CalendarCheck,
  },
];
