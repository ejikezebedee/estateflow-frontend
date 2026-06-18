import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cls } from "../lib/format";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "accent" | "outline" | "ghost" }) {
  return (
    <button
      className={cls(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sea disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-sea text-white hover:bg-teal-800",
        variant === "accent" && "bg-sun text-slate-950 hover:bg-amber-500",
        variant === "outline" && "border bg-white hover:bg-slate-50",
        variant === "ghost" && "hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cls("rounded-lg border bg-white shadow-sm", className)}>{children}</div>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return <input ref={ref} {...props} className={cls("h-11 w-full rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sea", props.className)} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(props, ref) {
  return <select ref={ref} {...props} className={cls("h-11 w-full rounded-md border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sea", props.className)} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(props, ref) {
  return <textarea ref={ref} {...props} className={cls("min-h-28 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sea", props.className)} />;
});

export function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>;
}

export function ErrorBox({ message }: { message?: string }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message ?? "Something went wrong."}</div>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <Card className="border-dashed p-8 text-center"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-slate-600">{body}</p></Card>;
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return <div className="grid gap-3">{Array.from({ length: rows }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200" />)}</div>;
}
