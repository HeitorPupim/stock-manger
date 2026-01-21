"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteSku, updateSku } from "@/actions/catalog-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SkuItem = {
  id: string;
  sku: string;
};

const SkuRow = ({ item }: { item: SkuItem }) => {
  const router = useRouter();
  const [value, setValue] = useState(item.sku);

  const { execute: saveSku, isExecuting: isSaving } = useAction(updateSku, {
    onSuccess: () => {
      toast.success("SKU updated successfully");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update SKU");
    },
  });

  const { execute: removeSku, isExecuting: isDeleting } = useAction(deleteSku, {
    onSuccess: () => {
      toast.success("SKU removed successfully");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to remove SKU");
    },
  });

  const trimmedValue = value.trim();
  const canSave = trimmedValue.length >= 3 && trimmedValue !== item.sku;

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 min-w-[200px] flex-1"
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => saveSku({ id: item.id, sku: trimmedValue })}
          disabled={!canSave || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => removeSku({ id: item.id })}
          disabled={isDeleting}
        >
          {isDeleting ? "Removing..." : "Remove"}
        </Button>
      </div>
    </li>
  );
};

export const SkuList = ({ skus }: { skus: SkuItem[] }) => {
  if (skus.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
        No SKUs added yet.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {skus.map((item) => (
        <SkuRow key={item.id} item={item} />
      ))}
    </ul>
  );
};
