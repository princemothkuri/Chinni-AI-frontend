"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { SearchBar } from "@/components/dashboard/search-bar";
import { TagsFilter } from "@/components/dashboard/tags-filter";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { AddButton } from "@/components/dashboard/add-button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState("alarms");
  const [isAddAlarmOpen, setIsAddAlarmOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const { defaultNavigation } = useSelector(
    (state: RootState) => state.dashBoard
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen pt-16 relative">
      <ParticlesBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <DashboardHeader />

          <div
            className={`flex ${screenWidth >= 768 ? "flex-row" : "flex-col"
              } gap-4 items-start md:items-center`}
          >
            <div className={`w-full`}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className={`md:w-auto flex flex-row gap-4 w-full`}>
              {/* <div className={screenWidth >= 768 ? "md:w-auto" : "w-1/2"}>
                <TagsFilter
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </div>
              <div className={screenWidth >= 768 ? "md:w-auto" : "w-1/2"}>
                <AddButton
                  type={defaultNavigation as "alarms" | "tasks"}
                  onClick={() => {
                    if (defaultNavigation) {
                      if (defaultNavigation === "alarms") {
                        setIsAddAlarmOpen(true);
                      } else {
                        setIsAddTaskOpen(true);
                      }
                      return;
                    }
                  }}
                />
              </div> */}
              <div className="w-full">
                <AddButton
                  type={defaultNavigation as "alarms" | "tasks"}
                  onClick={() => {
                    if (defaultNavigation) {
                      if (defaultNavigation === "alarms") {
                        setIsAddAlarmOpen(true);
                      } else {
                        setIsAddTaskOpen(true);
                      }
                      return;
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <DashboardTabs
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            setActiveTab={setActiveTab}
            setIsAddAlarmOpen={setIsAddAlarmOpen}
            setIsAddTaskOpen={setIsAddTaskOpen}
            isAddAlarmOpen={isAddAlarmOpen}
            isAddTaskOpen={isAddTaskOpen}
          />
        </motion.div>
      </div>
    </div>
  );
}
