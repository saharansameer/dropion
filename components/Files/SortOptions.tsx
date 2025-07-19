"use client";

import { useState } from "react";
import { Check, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { SortOption } from "@/types";

interface FeedbackOptionsProps {
  folderId?: string;
  isRoot?: boolean;
}

const sortOptions = [
  {
    value: "date-latest",
    label: "Newest First",
  },
  {
    value: "date-oldest",
    label: "Oldest First",
  },
  {
    value: "name-az",
    label: "Name - A to Z",
  },
  {
    value: "name-za",
    label: "Name - Z to A",
  },
];

export function SortOptions({
  folderId,
  isRoot = false,
}: FeedbackOptionsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const path = isRoot ? "/my-files" : `/my-files/${folderId}`;

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const sortHandler = (value: SortOption) => {
    if (params.get("sort") === value) {
      params.delete("sort");
      router.push(`${path}?${params.toString()}`);
      router.refresh();
      setOpen(false);
      return;
    }
    params.set("sort", value || " ");
    setOpen(false);
    router.push(`${path}?${params.toString()}`);
    router.refresh();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant="outline" role="combobox" aria-expanded={open}>
          <ArrowDownUp />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 absolute -right-7">
        <Command>
          <CommandList>
            <CommandGroup heading="Sort By">
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currValue) => sortHandler(currValue as SortOption)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      params.get("sort") === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
