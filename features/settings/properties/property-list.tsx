"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { PropertyUpsertDialog } from "./property-upsert-dialog";
import { PropertyDeleteDialog } from "./property-delete-dialog";

// Define locally since we don't have a shared type yet, or better, import from type definition if available
// Assuming Property type:
type Property = {
  id: string;
  name: string;
  address?: string | null;
};

interface PropertyListProps {
  properties: Property[];
  isSuperAdmin: boolean;
}

export function PropertyList({ properties, isSuperAdmin }: PropertyListProps) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isSuperAdmin && <PropertyUpsertDialog />}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              {isSuperAdmin && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.address || "-"}</TableCell>
                {isSuperAdmin && (
                  <TableCell className="flex gap-2">
                    <PropertyUpsertDialog
                      property={property}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <PropertyDeleteDialog
                      property={property}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {properties.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 3 : 2}
                  className="h-24 text-center text-muted-foreground"
                >
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
