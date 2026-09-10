import Hero from "@/components/sections/Hero";
import TheQuestion from "@/components/sections/TheQuestion";
import ThinkInTokens from "@/components/sections/ThinkInTokens";
import ThinkInStates from "@/components/sections/ThinkInStates";
import TheLab from "@/components/sections/TheLab";
import WhatChanges from "@/components/sections/WhatChanges";
import WhatBreaks from "@/components/sections/WhatBreaks";
import BDHModule from "@/components/sections/BDHModule";
import Research from "@/components/sections/Research";
import Reproduce from "@/components/sections/Reproduce";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TheQuestion />
      <ThinkInTokens />
      <ThinkInStates />
      <TheLab />
      <WhatChanges />
      <WhatBreaks />
      <BDHModule />
      <Research />
      <Reproduce />
      <About />
    </div>
  );
}