"use client";

import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcnui/button";
import { Calendar } from "@/components/shadcnui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnui/popover";
import { Input } from "@/components/shadcnui/input";

type DateTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const tryParse = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

export const DateTimePicker = ({ value, onChange, disabled }: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => tryParse(value), [value]);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange("");
        return;
      }
      const merged = new Date(date);
      if (selectedDate) {
        merged.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      }
      onChange(merged.toISOString());
    },
    [selectedDate, onChange],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;
      const updated = selectedDate ? new Date(selectedDate) : new Date();
      updated.setHours(hours, minutes);
      onChange(updated.toISOString());
    },
    [selectedDate, onChange],
  );

  const timeString = selectedDate ? format(selectedDate, "HH:mm") : "";
  const displayValue = selectedDate
    ? format(selectedDate, "MMM d, yyyy HH:mm")
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!selectedDate}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="size-4" />
        {selectedDate ? (
          <span>{displayValue}</span>
        ) : (
          <span>Pick date & time</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col gap-3 p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
          />
          <div className="flex items-center gap-2 border-t pt-3">
            <span className="text-sm text-muted-foreground">Time</span>
            <Input
              type="time"
              value={timeString}
              onChange={handleTimeChange}
              className="w-32"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
