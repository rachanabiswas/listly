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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnui/select";

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

const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const minuteOptions = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, "0"),
);

export const DateTimePicker = ({ value, onChange, disabled }: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => tryParse(value), [value]);

  const hours12 = selectedDate ? selectedDate.getHours() % 12 || 12 : 12;
  const minutes = selectedDate ? selectedDate.getMinutes() : 0;
  const isPM = selectedDate ? selectedDate.getHours() >= 12 : false;
  const periodLabel = isPM ? "PM" : "AM";

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

  const handleHourChange = useCallback(
    (hourStr: string | null) => {
      if (!hourStr) return;
      const hour = parseInt(hourStr, 10);
      if (isNaN(hour)) return;
      const updated = selectedDate ? new Date(selectedDate) : new Date();
      const hour24 = isPM ? (hour % 12) + 12 : hour % 12;
      updated.setHours(hour24, updated.getMinutes());
      onChange(updated.toISOString());
    },
    [selectedDate, isPM, onChange],
  );

  const handleMinuteChange = useCallback(
    (minuteStr: string | null) => {
      if (!minuteStr) return;
      const minute = parseInt(minuteStr, 10);
      if (isNaN(minute)) return;
      const updated = selectedDate ? new Date(selectedDate) : new Date();
      updated.setHours(updated.getHours(), minute);
      onChange(updated.toISOString());
    },
    [selectedDate, onChange],
  );

  const handlePeriodToggle = useCallback(() => {
    const updated = selectedDate ? new Date(selectedDate) : new Date();
    const currentHours = updated.getHours();
    updated.setHours(currentHours < 12 ? currentHours + 12 : currentHours - 12);
    onChange(updated.toISOString());
  }, [selectedDate, onChange]);

  const displayValue = selectedDate
    ? format(selectedDate, "MMM d, yyyy h:mm aa")
    : "";
  const roundedMinutes = Math.round(minutes / 5) * 5;

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
            <div className="flex items-center gap-1">
              <Select
                value={hours12.toString()}
                onValueChange={handleHourChange}
              >
                <SelectTrigger size="sm" className="w-16 justify-center">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">:</span>
              <Select
                value={roundedMinutes.toString().padStart(2, "0")}
                onValueChange={handleMinuteChange}
              >
                <SelectTrigger size="sm" className="w-16 justify-center">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePeriodToggle}
                className="w-14"
              >
                {periodLabel}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
