"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  groupByDate,
  extractUniqueMonths,
  getDaysInMonth,
  monthName,
  toLocalDateString,
} from "@/helper/calendar";
import { GetShiftResponse, GroupedShift } from "@/interfaces/shift";

export default function Calendar() {
  const [grouped, setGrouped] = useState<GroupedShift>({});
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("shifts")
        .select(
          `
          date,
          shift,
          doctors(name),
          created_at
        `
        )
        .order("date")
        .order("created_at")
        .returns<GetShiftResponse[]>();

      if (error) {
        console.error(error);
        return;
      }
      const groupedData = groupByDate(data);
      setGrouped(groupedData);

      const months = extractUniqueMonths(data);
      setUniqueMonths(months);

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {uniqueMonths.map((key) => {
        const [year, month] = key.split("-").map(Number);
        console.log("year", typeof year);
        console.log(year);
        const days = getDaysInMonth(year, month);
        console.log("days");
        console.log(days);

        return (
          <div key={key} className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {monthName(month)} {year}
            </h2>

            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const dateStr = toLocalDateString(d);
                const items = grouped[dateStr] || [];

                return (
                  <div key={dateStr} className="border p-2 min-h-[100px]">
                    <div className="font-bold">{d.getDate()}</div>
                    {items.map((e, idx) => (
                      <div key={idx} className="text-sm">
                        {e.doctor} ({e.shift})
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
