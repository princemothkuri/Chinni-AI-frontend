"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlarmCard } from "./alarm-card";
import { Alarm } from "@/lib/types/dashboard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { setAllFetchedAlarms } from "@/lib/redux/features/dashboard/dashboardSlice";

interface AlarmsListProps {
  searchQuery: string;
  selectedTags: string[];
}

export function AlarmsList({ searchQuery, selectedTags }: AlarmsListProps) {
  const dispatch = useDispatch();

  const { allAlarms } = useSelector((state: RootState) => state.dashBoard);

  const { authToken, isLoggedIn } = useSelector(
    (state: RootState) => state.chinniMain
  );

  const filteredAlarms = allAlarms.filter((alarm) => {
    const matchesSearch = alarm?.description
      ?.toLowerCase()
      .includes(searchQuery?.toLowerCase());
    const matchesTags =
      selectedTags?.length === 0 ||
      selectedTags?.some((tag) => alarm?.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const fetchAllAlarmsApi = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/alarms", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      dispatch(setAllFetchedAlarms(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllAlarmsApi();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {filteredAlarms.map((alarm) => (
          <AlarmCard key={alarm._id} alarm={alarm} />
        ))}
        {!searchQuery && filteredAlarms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            No alarms found!
          </motion.div>
        )}
        {searchQuery && filteredAlarms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            No alarms found matching your criteria
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
