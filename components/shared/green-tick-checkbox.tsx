"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface GreenTickCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // label?: string;
}

const GreenTickCheckbox = React.forwardRef<
  HTMLInputElement,
  GreenTickCheckboxProps
>(({ className, ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                ref={ref}
                {...props}
                onClick={() => {
                  console.log("clicked: ", props.checked);
                }}
              />
              <motion.div
                className={`w-6 h-6 border-2 rounded-md border-gray-300 bg-white`}
                animate={props.checked ? "checked" : "unchecked"}
                variants={{
                  checked: { scale: 1.05 },
                  unchecked: { scale: 1 },
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.svg
                  className="absolute top-1/2 left-1/2 transform -translate-x-[35%] -translate-y-[55%]"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  initial={false}
                  animate={props.checked ? "checked" : "unchecked"}
                >
                  <motion.path
                    d="M 3 12 L 9 18 L 21 6"
                    fill="transparent"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      checked: {
                        pathLength: 1,
                        opacity: 1,
                      },
                      unchecked: {
                        pathLength: 0,
                        opacity: 0,
                      },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.svg>
              </motion.div>
            </div>
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.checked ? "Completed" : "Pending"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

GreenTickCheckbox.displayName = "GreenTickCheckbox";

export default GreenTickCheckbox;
