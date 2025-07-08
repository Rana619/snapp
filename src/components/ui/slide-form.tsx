import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import pluralize from 'pluralize';
import { apiClient } from "@/lib/apiClient";

interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "date";
  options?: string[];
  required?: boolean;
}

interface SlideFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
  stickyButtons?: boolean;
}

export function SlideForm({
  isOpen,
  onOpenChange,
  title,
  fields,
  initialData = {},
  onSubmit,
  isLoading = false,
  stickyButtons = false,
}: SlideFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  function getSingular(word: string) {
    return pluralize.singular(word);
  }

  React.useEffect(() => {
  const initializedData = { ...initialData };

  // Set default values for select fields if not already present in initialData
  fields.forEach((field) => {
    if (
      field.type === "select" &&
      !initializedData[field.key] &&
      field.options &&
      field.options.length > 0
    ) {
      initializedData[field.key] = field.options[0]; // default to first option
    }
  });
  setFormData(initializedData);
}, [initialData, fields]);

const ValidateData =()=>{
  const data ={};
  fields.forEach((item)=>{
    if(item.type == "number"){
      data[item.key]= Number(formData[item.key])
    }else if(item.key== "_id"){
      data.id == formData[item.key]
    }else{
      data[item.key] =  formData[item.key]
    }
  })
  return data;
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
 const validateddata=ValidateData();
    onSubmit(validateddata);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.key}
            value={value}
            required={field.required??false}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="resize-none "
            rows={3}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            required={field.required??false}
            onValueChange={(value) => handleInputChange(field.key, value)}
          >
            <SelectTrigger className="dark:border-gray-500 dark:border-opacity-50" >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option,index) => (
                
                <SelectItem key={option} value={option} aria-selected ={index==0?true:false} >
                  {`${option[0].toUpperCase()}${option.slice(1)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <Input
            id={field.key}
            required={field.required??false}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="dark:border-gray-500 dark:border-opacity-50"
          />
        );
      default:
        return (
          <Input
            id={field.key}
            type={field.type}
            required={field.required??false}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="dark:border-gray-500 dark:border-opacity-50"
          />
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className={`w-full sm:max-w-md ${stickyButtons ? 'flex flex-col h-full' : 'overflow-y-hidden'} dark:bg-[#081028]`}>
        <SheetHeader className={stickyButtons ? 'flex-shrink-0 pb-4 border-b' : ''}>
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <SheetDescription className="text-black-300 dark:text-white-300">
            Fill out the form below to {title.toLowerCase().includes('edit') ? 'update' : 'create'} the record.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className={`mt-2 ${stickyButtons ? 'flex flex-col flex-1 min-h-0' : 'space-y-2'}`}>
          
         
          <div className={`${stickyButtons ? 'flex-1 overflow-y-auto pr-2 -mr-2 px-2' : ''}`}>
             <div className="form-container">
            {fields.map((field) => (
              <div key={field.key} className="pb-2">
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
           </div>


          <div className={`flex gap-3 p-4  ${stickyButtons ? 'flex-shrink-0 border-t bg-white dark:bg-gray-950 sticky bottom-0 -mx-6 px-6 pb-6 mt-4' : ''}`}>
            <Button
              type="button"
              variant="cancel"
              onClick={() => onOpenChange(false)}
              // className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 hover:dark:text-blue-600"
              // className="flex-1 dark:bg-[#081028] hover:dark:bg-white hover:dark:text-black hover:dark:border-black dark:border-gray-500 dark:border-opacity-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
            type="submit"
              variant="save" 
              // className="flex-1 dark:bg-[#081028] hover:dark:bg-white hover:dark:text-black dark:border-gray-500 dark:border-opacity-50" 
              disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>

        </form>
      </SheetContent>
    </Sheet>
  );
}