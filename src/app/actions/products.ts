"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProductFormData } from "@/types/database";

function parseProductPayload(data: ProductFormData) {
  return {
    name: data.name.trim(),
    product_url: data.product_url.trim(),
    affiliate_url: data.affiliate_url.trim(),
    price: data.price ? Number(data.price) : null,
    category: data.category.trim() || null,
    recommended_reason: data.recommended_reason.trim() || null,
    disadvantages: data.disadvantages.trim() || null,
    target_users: data.target_users.trim() || null,
    affiliate_button_label: data.affiliate_button_label.trim() || "公式サイトで見る",
  };
}

export async function createProduct(data: ProductFormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert(parseProductPayload(data));

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update(parseProductPayload(data))
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}
