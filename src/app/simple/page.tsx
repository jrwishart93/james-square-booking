import type { Metadata } from "next";
import GradientBG from "@/components/GradientBG";
import SimpleGuide from "@/components/simple/SimpleGuide";

export const metadata: Metadata = { title: "Recovering Money from FIOR | James Square", description: "Information and official resources for James Square owners who believe they are personally owed money by FIOR Property Assets." };

export default function SimplePage(){return <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 py-10 sm:px-6 lg:py-14"><div className="relative mx-auto max-w-5xl"><SimpleGuide/></div></GradientBG>}
