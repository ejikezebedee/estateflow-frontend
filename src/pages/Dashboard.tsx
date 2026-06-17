import { useQuery } from "@tanstack/react-query";
import { FileUp, Heart, MessageSquare, SearchCheck, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { api, normalizeList } from "../lib/api";
import { ListingCard } from "../components/ListingCard";
import { Messages } from "./Messages";
import { Button, Card, ErrorBox, Shell, Skeleton } from "../components/ui";

export function Dashboard() {
  const favourites = useQuery({ queryKey: ["favourites"], queryFn: api.favourites });
  const saved = useQuery({ queryKey: ["saved-searches"], queryFn: api.savedSearches });
  const favouriteItems = favourites.data ? normalizeList(favourites.data).items : [];
  const savedItems = saved.data ? normalizeList(saved.data).items : [];

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between gap-3"><div><h1 className="text-3xl font-black">Seeker dashboard</h1><p className="text-slate-600">Saved listings, searches, messages, and application profile.</p></div><Link to="/dashboard/listings/new"><Button variant="accent">List property</Button></Link></div>
      <div className="grid gap-4 md:grid-cols-4">
        {([
          ["Favourites", Heart, favouriteItems.length],
          ["Saved searches", SearchCheck, savedItems.length],
          ["Messages", MessageSquare, "API"],
          ["Documents", FileUp, "Disabled"]
        ] as Array<[string, LucideIcon, string | number]>).map(([label, Icon, value]) => <Card className="p-5" key={label}><Icon className="text-sea" /><p className="mt-3 text-sm text-slate-600">{label}</p><strong className="text-2xl">{String(value)}</strong></Card>)}
      </div>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div><h2 className="mb-4 text-2xl font-black">Saved listings</h2>{favourites.isLoading && <Skeleton />}{favourites.isError && <ErrorBox message={favourites.error.message} />}{favouriteItems.map((item) => <ListingCard key={item.id} listing={item} />)}</div>
        <Card className="p-5"><h2 className="text-xl font-black">Saved searches</h2><div className="mt-3 grid gap-3">{savedItems.map((item) => <div className="rounded-md border p-3" key={item.id}><p className="font-bold">{item.name}</p><p className="text-sm text-slate-600">{item.frequency ?? item.alertFrequency}</p></div>)}</div><Button className="mt-4 w-full" disabled title="Document endpoints were not listed in the handoff">Upload documents unavailable</Button></Card>
      </section>
      <section className="mt-8"><h2 className="mb-4 text-2xl font-black">Messages</h2><Messages /></section>
    </Shell>
  );
}
