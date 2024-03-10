import { motion } from "framer-motion";
import {
  BrainCircuit,
  AreaChart,
  PiggyBank,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { STAGGER_CHILD_VARIANTS } from "./onboarding-constants";
import { useCallback } from "react";

export default function FinancialGoals() {
  const router = useRouter();
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <motion.div
      className="z-10 mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-10 text-center"
      >
        <p className="text-2xl font-bold tracking-tighter text-foreground">
          Badget
        </p>
        <h1 className="font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl">
          What brings you here?
        </h1>
      </motion.div>
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="grid w-full grid-cols-1 divide-y divide-border text-foreground rounded-md border border-border md:grid-cols-3 md:divide-x"
      >
        <button
          className="flex flex-col items-center justify-center overflow-hidden p-5 space-y-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10 min-h-[200px]"
          onClick={() =>
            router.push("/onboarding" + "?" + createQueryString("step", "connect-accounts"))
          }
        >
          <PiggyBank className="h-auto pointer-events-none w-12 sm:w-12" />
          <p>Save more money</p>
        </button>
        <button
          className="flex flex-col items-center justify-center overflow-hidden p-5 space-y-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10 min-h-[200px]"
          onClick={() =>
            router.push("/onboarding" + "?" + createQueryString("step", "connect-accounts"))
          }
        >
          <AreaChart className="h-auto pointer-events-none w-12 sm:w-12" />
          <p>Track my expenses</p>
        </button>
        <button
          className="flex flex-col items-center justify-center overflow-hidden p-5 space-y-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10 min-h-[200px]"
          onClick={() =>
            router.push("/onboarding" + "?" + createQueryString("step", "connect-accounts"))
          }
        >
          <BrainCircuit className="h-auto pointer-events-none w-12 sm:w-12" />
          <p>Use AI Intelligence</p>
        </button>
      </motion.div>
    </motion.div>
  );
}
