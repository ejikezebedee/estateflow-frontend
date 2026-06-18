import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { z } from "zod";
import { api } from "../lib/api";
import { loginSchema, registerSchema } from "../lib/forms";
import { Button, Card, Input, Select, Shell } from "../components/ui";

type RegisterValues = z.infer<typeof registerSchema>;

export function Auth({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const form = useForm<RegisterValues>({ resolver: zodResolver(mode === "login" ? loginSchema : registerSchema), defaultValues: { name: "", email: "", password: "", role: "seeker" } });
  const mutation = useMutation({
    mutationFn: (values: RegisterValues) => mode === "login" ? api.login(values) : api.register(values),
    onSuccess: (result) => {
      const role = result.user?.role;
      navigate(role === "admin" ? "/zebeclaw" : role === "landlord" || role === "agent" ? "/provider" : "/dashboard");
    }
  });

  return (
    <Shell>
      <Card className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-black">{mode === "login" ? "Login" : "Create account"}</h1>
        <form className="mt-5 grid gap-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          {mode === "register" && <Input placeholder="Name" {...form.register("name")} />}
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Password" type="password" {...form.register("password")} />
          {mode === "register" && <Select {...form.register("role")}><option value="seeker">Seeker</option><option value="landlord">Landlord/seller</option><option value="agent">Estate agent/company</option></Select>}
          <Button disabled={mutation.isPending}>{mutation.isPending ? "Please wait" : mode === "login" ? "Login" : "Register"}</Button>
          {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}
        </form>
        <Link className="mt-4 block text-sm font-bold text-sea" to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Create account" : "Already have an account?"}</Link>
      </Card>
    </Shell>
  );
}
