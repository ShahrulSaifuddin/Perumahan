"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { createProperty, updateProperty } from "@/server/actions/properties";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Property = {
  id: string;
  name: string;
  address?: string | null;
};

interface PropertyUpsertDialogProps {
  property?: Property;
  trigger?: React.ReactNode;
}

export function PropertyUpsertDialog({
  property,
  trigger,
}: PropertyUpsertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      let result;
      if (property) {
        result = await updateProperty(property.id, {}, formData);
      } else {
        result = await createProperty({}, formData);
      }

      if (result.errors) {
        // Handle validation errors (could display below inputs)
        toast({
          title: "Error",
          description: "Please check your input.",
          variant: "destructive",
        });
        return;
      }

      if (result.message && !result.message.includes("successfully")) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: result.message,
      });
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {property ? "Edit Property" : "Create Property"}
          </DialogTitle>
          <DialogDescription>
            {property
              ? "Make changes to the property here."
              : "Add a new flat or apartment to the system."}
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={property?.name}
                className="col-span-3"
                required
                minLength={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                defaultValue={property?.address || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : property
                  ? "Save changes"
                  : "Create property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
