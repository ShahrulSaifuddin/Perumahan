"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { createUser } from "@/server/actions/users";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2, "Name must be at least 2 chars"),
  role: z.enum([
    "DBKL_SUPER_ADMIN",
    "DBKL_OFFICER",
    "FLAT_LEADER",
    "FINANCE_OFFICER",
    "RESIDENT",
  ]),
  propertyId: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export function UserForm({
  properties,
}: {
  properties: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      role: "RESIDENT",
      propertyId: "", // Empty string for "No Property"
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("fullName", values.fullName);
    formData.append("role", values.role);
    if (values.propertyId) formData.append("propertyId", values.propertyId);
    formData.append("password", values.password);

    const result = await createUser(formData);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }

    router.push("/settings/users");
    router.refresh();
  }

  return (
    <div className={cn("grid gap-6")}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* Email */}
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              placeholder="user@example.com"
              type="email"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              placeholder="Ali bin Abu"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Initial Password
            </label>
            <input
              id="password"
              type="text" // Visible so admin knows what they set
              placeholder="secret123"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("role")}
            >
              <option value="RESIDENT">Resident</option>
              <option value="FLAT_LEADER">Flat Leader</option>
              <option value="FINANCE_OFFICER">Finance Officer</option>
              <option value="DBKL_OFFICER">DBKL Officer</option>
              <option value="DBKL_SUPER_ADMIN">DBKL Super Admin</option>
            </select>
          </div>

          {/* Property */}
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="propertyId">
              Property
            </label>
            <select
              id="propertyId"
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              {...form.register("propertyId")}
            >
              <option value="">No Property (DBKL Only)</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Required for Residents, Leaders, and Finance Officers.
            </p>
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="clay-btn inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
