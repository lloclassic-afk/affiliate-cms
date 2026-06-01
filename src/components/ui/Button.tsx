import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 border border-stone-900",
  secondary:
    "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-300",
  danger:
    "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200",
  ghost: "text-stone-700 hover:bg-stone-100 border border-transparent",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant]} disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
