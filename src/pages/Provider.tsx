import { useQuery } from "@tanstack/react-query";
import { BarChart3, Copy, Eye, Pause, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, imageUrl, normalizeList } from "../lib/api";
import { Messages } from "./Messages";
import { Button, Card, ErrorBox, Shell, Skeleton } from "../components/ui";

export function Provider() {
  const dashboard = useQuery({ queryKey: ["provider-dashboard"], queryFn: api.providerDashboard });
  const listings = useQuery({ queryKey: ["provider-listings"], queryFn: api.providerListings });
  const items = listings.data ? normalizeList(listings.data).items : [];

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-black">Provider dashboard</h1><p className="text-slate-600">Connected to provider dashboard and listings endpoints.</p></div><Link to="/dashboard/listings/new"><Button variant="accent"><Plus size={16} />Create listing</Button></Link></div>
      {dashboard.isError && <ErrorBox message={dashboard.error.message} />}
      <div className="grid gap-4 md:grid-cols-4">{["views", "leads", "favourites", "appointments"].map((key) => <Card className="p-5" key={key}><BarChart3 className="text-sea" /><p className="mt-3 text-sm capitalize text-slate-600">{key}</p><strong className="text-2xl">{String(dashboard.data?.[key] ?? "-")}</strong></Card>)}</div>
      <Card className="mt-8 p-5"><h2 className="text-2xl font-black">My listings</h2>{listings.isLoading && <Skeleton />}{listings.isError && <ErrorBox message={listings.error.message} />}<div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b text-left"><th className="py-3">Listing</th><th>Status</th><th>Views</th><th>Leads</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr className="border-b" key={item.id}><td className="flex items-center gap-3 py-3"><img src={imageUrl(item)} alt="" className="h-14 w-20 rounded object-cover" />{item.title}</td><td>{item.status ?? "-"}</td><td>{item.views ?? "-"}</td><td>{item.leads ?? "-"}</td><td><div className="flex gap-1"><Link to={`/property/${item.slug}`}><Button variant="ghost"><Eye size={14} /></Button></Link><Button variant="ghost" disabled title="Pause endpoint not listed"><Pause size={14} /></Button><Button variant="ghost" disabled title="Archive endpoint not listed"><Trash2 size={14} /></Button><Button variant="ghost" disabled title="Duplicate endpoint not listed"><Copy size={14} /></Button></div></td></tr>)}</tbody></table></div></Card>
      <section className="mt-8"><h2 className="mb-4 text-2xl font-black">Lead inbox</h2><Messages /></section>
    </Shell>
  );
}
