"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addSku } from "@/actions/catalog-product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, { message: "SKU must be at least 3 characters long" }),
});

const ItemInput = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
    },
  });

  const { execute, isExecuting } = useAction(addSku, {
    onSuccess: () => {
      toast.success("SKU adicionado com sucesso");
      form.reset();
      router.refresh();
    },
    onError: ({ error }) => {
      console.log(error);
      toast.error(error.serverError || "Failed to add SKU");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-start gap-2"
      >
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Enter SKU..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? <Loader2 className="animate-spin" /> : "Adicionar"}
        </Button>
      </form>
    </Form>
  );
};

export default ItemInput;
