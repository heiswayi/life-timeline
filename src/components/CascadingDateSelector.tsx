import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";

interface CascadingDateSelectorProps {
  value?: Date; // Accepts Date object
  onChange: (date: Date) => void; // Passes Date object
}

const CascadingDateSelector: React.FC<CascadingDateSelectorProps> = ({
  value,
  onChange,
}) => {
  const currentDate = value instanceof Date ? value : new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    onChange(newDate);
  }, [selectedYear, selectedMonth, selectedDay, onChange]);

  return (
    <div className="flex items-center space-x-4">
      {/* Year Selector */}
      <div className="flex flex-1 items-center space-x-2">
        <Label className="opacity-50">Year:</Label>
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: 100 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <SelectItem key={year} value={String(year)}>
                <span className="pr-4">{year}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Month Selector */}
      <div className="flex flex-1 items-center space-x-2">
        <Label className="opacity-50">Month:</Label>
        <Select
          value={String(selectedMonth)}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={String(month)}>
                <span className="pr-4">{month}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Day Selector */}
      <div className="flex flex-1 items-center space-x-2">
        <Label className="opacity-50">Day:</Label>
        <Select
          value={String(selectedDay)}
          onValueChange={(value) => setSelectedDay(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: new Date(selectedYear, selectedMonth, 0).getDate() },
              (_, i) => i + 1
            ).map((day) => (
              <SelectItem key={day} value={String(day)}>
                <span className="pr-4">{day}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CascadingDateSelector;
