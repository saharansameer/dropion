"use client";

import { useState } from "react";
import { Check, Filter } from "lucide-react";
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
import { FilterType } from "@/types";

interface FeedbackOptionsProps {
  folderId?: string;
  isRoot?: boolean;
}

const filterOptions = [
  {
    value: "video",
    label: "Videos",
  },
  {
    value: "image",
    label: "Images",
  },
  {
    value: "document",
    label: "Documents",
  },
  {
    value: "folder",
    label: "Folders",
  },
];

export function FilterOptions({
  folderId,
  isRoot = false,
}: FeedbackOptionsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const path = isRoot ? "/my-files" : `/my-files/${folderId}`;

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const filterHandler = (value: FilterType) => {
    if (params.get("filter") === value) {
      params.delete("filter");
      router.push(`${path}?${params.toString()}`);
      router.refresh();
      setOpen(false);
      return;
    }
    params.set("filter", value || " ");
    setOpen(false);
    router.push(`${path}?${params.toString()}`);
    router.refresh();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant="outline" role="combobox" aria-expanded={open}>
          <Filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 absolute -right-19">
        <Command>
          <CommandList>
            <CommandGroup heading="Filter By">
              {filterOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currValue) =>
                    filterHandler(currValue as FilterType)
                  }
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      params.get("filter") === option.value
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
