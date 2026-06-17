import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Flag, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { api, imageUrl, normalizeList } from "../lib/api";
import { Button, Card, ErrorBox, Input, Shell, Skeleton } from "../components/ui";

export function Admin() {
  const [reason, setReason] = useState("Does not meet marketplace policy");
  const queryClient = useQueryClient();
  const metrics = useQuery({ queryKey: ["admin-metrics"], queryFn: api.adminMetrics });
  const pending = useQuery({ queryKey: ["admin-pending"], queryFn: api.adminPendingListings });
  const reports = useQuery({ queryKey: ["admin-reports"], queryFn: api.adminReports });
  const approve = useMutation({ mutationFn: api.approveListing, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pending"] }) });
  const reject = useMutation({ mutationFn: (id: string) => api.rejectListing(id, reason), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pending"] }) });
  const items = pending.data ? normalizeList(pending.data).items : [];

  return (
    <Shell>
      <h1 className="text-3xl font-black">Admin dashboard</h1>
      <p className="mt-2 text-slate-600">Admin-only metrics, pending listings, approvals, rejections, and reports.</p>
      {metrics.isError && <div className="mt-4"><ErrorBox message={metrics.error.message} /></div>}
      <div className="mt-6 grid gap-4 md:grid-cols-4">{["users", "listings", "pendingListings", "reports"].map((key) => <Card className="p-5" key={key}><ShieldCheck className="text-sea" /><p className="mt-3 text-sm text-slate-600">{key}</p><strong className="text-2xl">{String(metrics.data?.[key] ?? "-")}</strong></Card>)}</div>
      <Card className="mt-8 p-5"><h2 className="text-2xl font-black">Pending listings</h2><Input className="mt-4 max-w-md" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reject reason" />{pending.isLoading && <Skeleton />}{pending.isError && <ErrorBox message={pending.error.message} />}<div className="mt-4 grid gap-3">{items.map((item) => <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-[90px_1fr_auto] md:items-center" key={item.id}><img src={imageUrl(item)} alt="" className="h-16 w-24 rounded object-cover" /><div><p className="font-bold">{item.title}</p><p className="text-sm text-slate-600">{item.city} · {item.status}</p></div><div className="flex gap-2"><Button onClick={() => approve.mutate(item.id)}><Check size={16} />Approve</Button><Button variant="outline" onClick={() => reject.mutate(item.id)}><X size={16} />Reject</Button></div></div>)}</div></Card>
      <Card className="mt-8 p-5"><h2 className="flex items-center gap-2 text-2xl font-black"><Flag />Reports</h2>{reports.isError && <ErrorBox message={reports.error.message} />}<pre className="mt-4 max-h-72 overflow-auto rounded bg-slate-950 p-4 text-xs text-white">{JSON.stringify(reports.data ?? [], null, 2)}</pre></Card>
    </Shell>
  );
}
