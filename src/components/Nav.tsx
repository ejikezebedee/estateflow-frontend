import { Building2, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { clearSession, getUser } from "../lib/auth";
import type { User } from "../lib/types";
import { Button } from "./ui";

export function Nav() {
  const [user, setUser] = useState<User | null>(getUser());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("estateflow-auth", sync);
    return () => window.removeEventListener("estateflow-auth", sync);
  }, []);

  const links = [
    ["/search", "Search", true],
    ["/dashboard", "Dashboard", !!user],
    ["/provider", "Provider", user?.role === "landlord" || user?.role === "agent" || user?.role === "admin"],
    ["/zebeclaw", "ZebeClaw", user?.role === "admin"]
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-sea"><Building2 />ZebeEstate</Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.filter((item) => item[2]).map(([href, label]) => <NavLink key={href} className="text-sm font-semibold text-slate-700 hover:text-sea" to={href}>{label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold capitalize text-sea">{user.role}</span>
              <Button variant="ghost" onClick={() => clearSession()}><LogOut size={16} />Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button variant="accent">Register</Button></Link>
            </>
          )}
        </div>
        <Button variant="ghost" className="md:hidden" aria-label="Open menu" onClick={() => setOpen(!open)}><Menu /></Button>
      </div>
      {open && <div className="border-t bg-white px-4 py-3 md:hidden">{links.filter((item) => item[2]).map(([href, label]) => <Link className="block py-2 font-semibold" to={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}</div>}
    </header>
  );
}
