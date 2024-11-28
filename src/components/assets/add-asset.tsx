"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Loader2,
  Home,
  Car,
  Coins,
  Briefcase,
} from "lucide-react";
import { createAsset } from "@/actions/assets/create-asset";

const assetSchema = z.object({
  name: z.string().min(2, {
    message: "Asset name must be at least 2 characters.",
  }),
  type: z.enum(["REAL_ESTATE", "VEHICLE", "PRECIOUS_METALS", "OTHER"], {
    required_error: "Please select an asset type",
  }),
  value: z.string().min(1, "Value is required"),
  purchaseDate: z.date().optional(),
  description: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

const assetTypes = [
  {
    id: "REAL_ESTATE",
    name: "Real Estate",
    icon: Home,
    description: "Properties and land investments",
  },
  {
    id: "VEHICLE",
    name: "Vehicle",
    icon: Car,
    description: "Cars, boats, and other vehicles",
  },
  {
    id: "PRECIOUS_METALS",
    name: "Precious Metals",
    icon: Coins,
    description: "Gold, silver, and other metals",
  },
  {
    id: "OTHER",
    name: "Other Assets",
    icon: Briefcase,
    description: "Art, collectibles, and other valuables",
  },
];

export function AddAssetComponent() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      value: "",
      description: "",
    },
  });

  async function onSubmit(data: AssetFormValues) {
    try {
      setIsLoading(true);
      console.log("Submitting form data:", data);

      const result = await createAsset({
        ...data,
        type: data.type as
          | "REAL_ESTATE"
          | "VEHICLE"
          | "PRECIOUS_METALS"
          | "OTHER",
        value: data.value.toString(),
      });

      console.log("Create asset result:", result);

      if (!result.success) {
        if (Array.isArray(result.error)) {
          result.error.forEach((error) => {
            form.setError(error.path[0] as any, {
              message: error.message,
            });
          });
          toast.error("Please check the form for errors");
          return;
        }
        throw new Error(result.error);
      }

      toast.success("Asset added successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to add asset");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAssetTypeSelect(typeId: AssetFormValues["type"]) {
    form.setValue("type", typeId);
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Adding your asset...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Asset Type" : "Asset Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {assetTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  form.watch("type") === type.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() =>
                  handleAssetTypeSelect(type.id as AssetFormValues["type"])
                }
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <type.icon className="h-10 w-10 mb-3" />
                  <h3 className="text-base font-semibold mb-1">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tesla Model S" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter asset value"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add details about your asset"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Asset"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
