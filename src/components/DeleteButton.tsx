"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function DeleteButton({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!confirm(`「${label}」を削除しますか？`)) return;
    setPending(true);
    try {
      await onDelete();
    } catch {
      alert("削除に失敗しました");
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="danger"
      onClick={handleClick}
      disabled={pending}
      className="text-xs px-3 py-1"
    >
      {pending ? "削除中..." : "削除"}
    </Button>
  );
}
