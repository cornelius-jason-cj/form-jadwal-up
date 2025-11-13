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
  const namaHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

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
                const getDayName = namaHari[d.getDay()];
                const isWeekend =
                  getDayName === "Sabtu" || getDayName === "Minggu";
                return (
                  <div key={dateStr}>
                    <div className="text-sm">
                      <span className="mx-1">{d.getDate()},</span>
                      <span
                        className={`font-semibold ${
                          isWeekend ? "text-red-600" : "text-black"
                        }`}
                      >
                        {getDayName}
                      </span>
                    </div>
                    <div className="border p-1 min-h-[150px]">
                      <div className=""></div>
                      {items.map((e, idx) => (
                        <div key={idx} className="text-xs">
                          {e.doctor} ({e.shift})
                        </div>
                      ))}
                    </div>
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
