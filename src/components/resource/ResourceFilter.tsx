import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourceFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
}

export const ResourceFilter: React.FC<ResourceFilterProps> = ({
  value,
  onChange,
  options,
  label = "Filter by:",
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-dark-300 border-none text-light-100">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-dark-300 border-none text-light-100">
        <SelectGroup>
          {label && <SelectLabel className="text-light-200">{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem
              className="filter-item"
              value={option.value}
              key={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
