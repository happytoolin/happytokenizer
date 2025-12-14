"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ComboboxShadcn({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Group options by their group property
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, ComboboxOption[]> = {};
    options.forEach((option) => {
      const groupName = option.group || "Other";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(option);
    });
    return groups;
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-brand-paper border-brand-black text-brand-black font-body font-semibold hover:bg-gray-200 focus:bg-brand-black focus:text-white min-h-10",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={disabled}
        >
          <span className="truncate mr-2">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-brand-orange" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 max-h-[260px] min-w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <Command className="w-full">
          <CommandInput placeholder="Search model..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandList>
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <CommandGroup
                key={groupName}
                heading={groupName !== "Other" ? groupName : undefined}
              >
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(
                        currentValue === value ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                    disabled={option.disabled}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-3 w-3 text-brand-orange flex-shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
