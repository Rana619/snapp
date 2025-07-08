import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FilterConfig {
  type: string;
  options?: string[];
  placeholder?: string;
}

interface FilterSliderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Record<string, FilterConfig>;
  values: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  title?: string;
  onDelete?: () => void; // Optional delete function
}

export function FilterSlider({
  isOpen,
  onOpenChange,
  filters,
  values,
  onFiltersChange,
  title = "Filters",
  onDelete
}: FilterSliderProps) {
  const { toast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...values };
    if (value === "" || value === "All") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const renderFilterControl = (key: string, config: FilterConfig) => {
    switch (config.type) {
      case "dropdown":
        return (
          <Select
            value={values[key] || ""}
            onValueChange={(value) => handleFilterChange(key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={config.placeholder || `Select ${key}`}  />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {config.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "text":
        return (
          <Input
            value={values[key] || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            placeholder={config.placeholder || `Enter ${key}`}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={values[key] || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        );
        case "daterange":
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {values[key]?.from && values[key]?.to ? (
                    <>
                      {format(new Date(values[key].from), "LLL dd, y")} - {format(new Date(values[key].to), "LLL dd, y")}
                    </>
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={values[key]?.from ? new Date(values[key].from) : new Date()}
                  selected={values[key] ? { 
                    from: values[key].from ? new Date(values[key].from) : undefined, 
                    to: values[key].to ? new Date(values[key].to) : undefined 
                  } : undefined}
                  onSelect={(range: DateRange | undefined) => {
                    if (range?.from) {
                      if (range.to) {
                        // Both dates selected
                        handleFilterChange(key, [
                          range.from.toISOString().split('T')[0],
                          range.to.toISOString().split('T')[0]
                        ]);
                      } else {
                        // Only start date selected
                        handleFilterChange(key, {
                          from: range.from.toISOString().split('T')[0],
                          to: null
                        });
                      }
                    } else {
                      // Clear selection
                      handleFilterChange(key, null);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          );
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
        toast({
          title: "Success",
          description: "Successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Delete function not provided.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
    }
  };


  const activeFiltersCount = Object.values(values).filter(value => value && value !== "").length;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative dark:bg-[#081028] hover:dark:bg-white hover:text-black">
          <Filter className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Filter</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 p-4 dark:bg-[#081028] dark:text-white">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between dark:text-white">
            {title}
            <div className="flex items-center">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="ml-2">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the filter.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {Object.entries(filters).map(([key, config]) => (
            <div key={key} className="space-y-2">
              <Label className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              {renderFilterControl(key, config)}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}