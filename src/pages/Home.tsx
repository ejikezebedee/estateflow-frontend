import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { api, normalizeList } from "../lib/api";
import { ListingCard } from "../components/ListingCard";
import { SearchBar } from "../components/SearchBar";
import { Button, Card, ErrorBox, Shell, Skeleton } from "../components/ui";

export function Home() {
  const featured = useQuery({ queryKey: ["featured"], queryFn: () => api.searchProperties(new URLSearchParams("page=1&limit=3")) });
  const listings = featured.data ? normalizeList(featured.data).items.slice(0, 3) : [];

  return (
    <>
      <section className="bg-[linear-gradient(120deg,rgba(15,118,110,.92),rgba(16,32,39,.78)),url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
        <div className="mx-auto max-w-7xl px-4 py-20 text-white md:py-28">
          <h1 className="max-w-3xl text-4xl font-black md:text-6xl">Homes, leads, and listings flowing in one place.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">EstateFlow connects seekers, landlords, agents, and moderators through Emeka's real-estate backend.</p>
          <div className="mt-8 max-w-5xl text-ink"><SearchBar /></div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/search"><Button variant="accent">Search properties<ArrowRight size={16} /></Button></Link>
            <Link to="/dashboard/listings/new"><Button className="bg-white text-sea hover:bg-slate-50">List your property</Button></Link>
          </div>
        </div>
      </section>
      <Shell>
        <section>
          <h2 className="text-2xl font-black">Featured cities</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Duisburg", "Essen", "Dusseldorf", "Cologne"].map((city) => <Link className="rounded-lg border bg-white p-5 font-bold hover:border-sea" key={city} to={`/search?location=${city}`}><MapPin className="mb-3 text-sea" />{city}</Link>)}
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-black">Featured listings</h2>
          <div className="mt-4 grid gap-4">
            {featured.isLoading && <Skeleton />}
            {featured.isError && <ErrorBox message={featured.error.message} />}
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </section>
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[["Verified accounts", ShieldCheck], ["Clear process", CheckCircle2], ["Fast search", ArrowRight]].map(([label, Icon]) => <Card key={String(label)} className="p-6"><Icon className="text-sea" /><h3 className="mt-4 font-black">{String(label)}</h3><p className="mt-2 text-sm text-slate-600">Built around real backend actions, guarded dashboards, and accessible forms.</p></Card>)}
        </section>
      </Shell>
      <footer className="border-t bg-white px-4 py-8 text-center text-sm text-slate-600">EstateFlow · Original real-estate marketplace frontend</footer>
    </>
  );
}
