import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2 } from "lucide-react";

const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid work email is required"),
  practiceName: z.string().min(1, "Practice name is required"),
  pms: z.string().optional().default("Dentrix"),
  locations: z.coerce.number().optional().or(z.literal("")),
  providers: z.coerce.number().optional().or(z.literal("")),
});

export type WaitlistFormValues = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  submitLabel?: string;
  submittingLabel?: string;
  /** When true, the form renders its own success card. When false, it calls onSuccess and lets the parent take over. */
  showInternalSuccess?: boolean;
  successTitle?: string;
  successMessage?: string;
  onSuccess?: (data: WaitlistFormValues) => void;
}

export function WaitlistForm({
  submitLabel = "Join Waitlist",
  submittingLabel = "Submitting...",
  showInternalSuccess = true,
  successTitle = "You're on the list.",
  successMessage = "We'll be in touch soon.",
  onSuccess,
}: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      practiceName: "",
      pms: "Dentrix",
      locations: "",
      providers: "",
    },
  });

  async function onSubmit(data: WaitlistFormValues) {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit to waitlist");
      }

      setStatus("success");
      onSuccess?.(data);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or contact hello@heymandi.ai.");
    }
  }

  if (status === "success" && showInternalSuccess) {
    return (
      <div className="text-center py-8" data-testid="waitlist-success">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdfa] mb-6">
          <CheckCircle2 className="h-8 w-8 text-[#0d9488]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">{successTitle}</h2>
        <p className="text-[#64748b]">{successMessage}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-waitlist">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} data-testid="input-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@practice.com" {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="practiceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice name</FormLabel>
              <FormControl>
                <Input placeholder="Main St Dental" {...field} data-testid="input-practice-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice Management System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-pms">
                    <SelectValue placeholder="Select PMS" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dentrix">Dentrix</SelectItem>
                  <SelectItem value="Eaglesoft">Eaglesoft</SelectItem>
                  <SelectItem value="Open Dental">Open Dental</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="locations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locations <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} value={field.value || ""} data-testid="input-locations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="providers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Providers <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="2" {...field} value={field.value || ""} data-testid="input-providers" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {status === "error" && (
          <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-medium border border-red-100" data-testid="waitlist-error">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white h-12 text-base mt-2"
          disabled={status === "submitting"}
          data-testid="button-submit-waitlist"
        >
          {status === "submitting" ? submittingLabel : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
