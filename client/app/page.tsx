"use client";
import { Button } from "@/component/ui/button";
import ShimmerButton from "@/component/ui/shimmer";
import { cn } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import HomeHeader from "@/component/navber";
import NewItemsLoading from "@/component/new-product";
import WordAnimator from "@/component/word-animation";

const index = () => {

  const [blocks, setBlocks] = useState([]);

  const activeDivs = useMemo(
    () => ({
      0: new Set([4, 1]),
      2: new Set([3]),
      4: new Set([2, 5, 8]),
      5: new Set([4]),
      6: new Set([0]),
      7: new Set([1]),
      10: new Set([3]),
      12: new Set([7]),
      13: new Set([2, 4]),
      14: new Set([1, 5]),
      15: new Set([3, 6]),
    }),
    [], // No dependencies, so `activeDivs` will only be created once
  );
  useEffect(() => {
    const updateBlocks = () => {
      const { innerWidth, innerHeight } = window;
      const blockSize = innerWidth * 0.06; // Using 6vw for the block size
      const amountOfBlocks = Math.ceil(innerHeight / blockSize);

      const newBlocks = Array.from({ length: 17 }, (_, columnIndex) => (
        <div key={columnIndex} className="w-[6vw] h-full">
          {Array.from({ length: amountOfBlocks }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`h-[6vw] w-full border-[1px] dark:border-[rgba(255,255,255,0.015)] border-gray-50 ${
                // @ts-ignore
                activeDivs[columnIndex]?.has(rowIndex)
                  ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-50"
                  : ""
              }`}
              style={{ height: `${blockSize}px` }}
            ></div>
          ))}
        </div>
      ));
      // @ts-ignore
      setBlocks(newBlocks);
    };

    updateBlocks();
    window.addEventListener("resize", updateBlocks);

    return () => window.removeEventListener("resize", updateBlocks);
  }, [activeDivs]);
  const words = ["Career ", "Growth ", "Success ", "Future "];
  return (
    <>
      <HomeHeader />
      <section className=" h-screen  overflow-hidden  relative pb-20 dark:bg-black bg-white  ">
        <div className="absolute inset-0 -z-0 h-screen w-full  dark:bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 top-0 left-0  h-screen w-full items-center px-5 py-24  bg-gradient-to-t dark:from-[#050505] from-white from-0% to-transparent to-60%"></div>

        <div className="pointer-events-none absolute inset-0 flex w-screen justify-end [mask-image:radial-gradient(transparent_5%,white)]">
          <div className="absolute right-0 top-1/4 opacity-10 dark:opacity-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full w-96 h-96"></div>
              <div className="absolute top-20 left-20 bg-purple-500/20 blur-[80px] rounded-full w-64 h-64"></div>
            </div>
          </div>
        </div>
        <article className="grid 2xl:pt-52 2xl:pb-24 py-40 relative text-primary-foreground z-[2] sm:px-0 px-4">
          <NewItemsLoading />
          <h1 className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl text-center font-semibold tracking-tight">
            <span className="text-[2.5rem]">AI-Powered Youth Employment,</span>{" "}
            <span className="relative translate-x-0 flex gap-2 justify-center">
              Build Your{" "}
              <WordAnimator
                words={words}
                duration={5}
                className="italic w-fit pr-3 dark:bg-gray-800 bg-gray-200 dark:border-neutral-800 border-neutral-200"
              />{" "}
              Path.
            </span>
          </h1>
          <p className="mx-auto lg:w-[700px] sm:w-[80%] text-center sm:text-lg text-sm mt-5">
            <strong>Harican</strong> is an AI-powered platform that connects{" "}
            <strong>youth skills</strong> with real job opportunities and provides{" "}
            <strong>personalized career roadmaps</strong> for students and job seekers.
            Supporting SDG 8 by promoting inclusive economic growth and decent work for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
            <ShimmerButton
              borderRadius={"100px"}
              className={cn(
                "flex items-center gap-2 w-fit rounded-full text-white border sm:px-4 px-2 py-2",
              )}
              background={"#3b82f6"}
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                Start Your Career Journey
              </span>
            </ShimmerButton>

            <Button className=" rounded-full px-4 h-12">
              Explore Jobs
              <ChevronsRight />
            </Button>
          </div>
          {/* <p className="text-center py-2">Join 10K+ youth building their careers.</p> */}
        </article>
        <div className="flex h-screen overflow-hidden top-0 left-0  inset-0  z-0 absolute">
          {blocks}
        </div>
      </section>
    </>
  );
};

export default index;
