import { useMutation, useQuery } from "@tanstack/react-query";
import { Flag, Heart, Share2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { api, areaOf, imageUrl, priceOf } from "../lib/api";
import { contactSchema } from "../lib/forms";
import { euro } from "../lib/format";
import { MapBlock } from "../components/MapBlock";
import { Button, Card, ErrorBox, Input, Shell, Skeleton, Textarea } from "../components/ui";

type ContactValues = z.infer<typeof contactSchema>;

export function PropertyDetail() {
  const { slug = "" } = useParams();
  const query = useQuery({ queryKey: ["listing", slug], queryFn: () => api.listing(slug) });
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", message: "" } });
  const contact = useMutation({ mutationFn: (values: ContactValues) => api.contactProvider(query.data!.id, values) });
  const favourite = useMutation({ mutationFn: () => api.saveFavourite(query.data!.id) });

  if (query.isLoading) return <Shell><Skeleton rows={4} /></Shell>;
  if (query.isError) return <Shell><ErrorBox message={query.error.message} /></Shell>;
  const listing = query.data!;
  const amenities = listing.amenities?.map((item) => typeof item === "string" ? item : item.name) ?? [];

  return (
    <Shell>
      <div className="grid gap-2 overflow-hidden rounded-lg md:grid-cols-[2fr_1fr]">
        <div className="min-h-80 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl(listing)})` }} />
        <div className="grid gap-2">
          <div className="min-h-40 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl(listing)})` }} />
          <div className="min-h-40 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl(listing)})` }} />
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="space-y-5">
          <div><p className="text-sm font-bold uppercase text-sea">{listing.city ?? listing.address}</p><h1 className="mt-2 text-3xl font-black">{listing.title}</h1><p className="mt-2 text-slate-600">{euro(priceOf(listing))} · {listing.rooms ?? "-"} rooms · {areaOf(listing) || "-"} m2</p></div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => favourite.mutate()}><Heart size={16} />{favourite.isSuccess ? "Saved" : "Save"}</Button><Button variant="outline" onClick={() => navigator.clipboard.writeText(location.href)}><Share2 size={16} />Share</Button><Button variant="outline" disabled title="No report endpoint was listed in the frontend handoff"><Flag size={16} />Report unavailable</Button></div>
          <Card className="p-5"><h2 className="text-xl font-black">Description</h2><p className="mt-3 leading-7 text-slate-700">{listing.description ?? "Description will appear when supplied by the backend."}</p></Card>
          <Card className="p-5"><h2 className="text-xl font-black">Amenities</h2><div className="mt-3 flex flex-wrap gap-2">{amenities.length ? amenities.map((item) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm" key={item}>{item}</span>) : <span className="text-sm text-slate-600">No amenities returned.</span>}</div></Card>
          <Card className="p-5"><h2 className="text-xl font-black">Energy certificate</h2><p className="mt-2 text-slate-700">{listing.energyClass ?? JSON.stringify(listing.energyCertificate ?? "No energy data returned.")}</p></Card>
          <Card className="p-5"><h2 className="mb-3 text-xl font-black">Location</h2><MapBlock listing={listing} /></Card>
        </article>
        <aside className="space-y-4">
          <Card className="p-5"><h2 className="text-2xl font-black">{euro(priceOf(listing))}</h2><p className="mt-3 text-sm text-slate-600">{listing.propertyType} · {listing.listingGoal}</p><p className="mt-3 font-bold">{listing.provider?.name ?? "Provider from backend"}</p></Card>
          <Card className="p-5"><h2 className="text-xl font-black">Contact provider</h2><form className="mt-4 grid gap-3" onSubmit={form.handleSubmit((values) => contact.mutate(values))}><Input placeholder="Name" {...form.register("name")} /><Input placeholder="Email" type="email" {...form.register("email")} /><Textarea placeholder="Message" {...form.register("message")} /><Button disabled={contact.isPending}><Send size={16} />{contact.isSuccess ? "Sent" : "Request viewing"}</Button>{contact.isError && <p className="text-sm text-red-600">{contact.error.message}</p>}</form></Card>
        </aside>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white p-3 lg:hidden"><Button className="w-full" variant="accent">Request viewing</Button></div>
    </Shell>
  );
}
