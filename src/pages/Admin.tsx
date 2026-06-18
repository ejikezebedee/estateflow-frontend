import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Archive, BadgeCheck, Ban, Check, ClipboardList, Database, Eye, Flag, Gauge, Lock, Search, ShieldCheck, Star, UserCog, X } from "lucide-react";
import { useMemo, useState } from "react";
import { api, imageUrl, normalizeList } from "../lib/api";
import { cls } from "../lib/format";
import type { Listing } from "../lib/types";
import { Button, Card, EmptyState, ErrorBox, Input, Select, Shell, Skeleton } from "../components/ui";

type AdminTab = "overview" | "users" | "listings" | "moderation" | "reports" | "audit" | "security" | "settings";
// Admin payloads combine Prisma includes from multiple endpoints; keep the UI reader flexible.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Gauge }> = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "users", label: "Users", icon: UserCog },
  { id: "listings", label: "Listings", icon: ClipboardList },
  { id: "moderation", label: "Moderation", icon: ShieldCheck },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "audit", label: "Audit logs", icon: Lock },
  { id: "security", label: "Security", icon: Database },
  { id: "settings", label: "Settings", icon: BadgeCheck }
];

const unsupportedControls = [
  ["CMS editor", "CMS persistence model is not implemented yet."],
  ["SEO metadata editor", "SEO metadata persistence model is not implemented yet."],
  ["Email notification templates", "EMAIL_DELIVERY_STATUS=PLACEHOLDER_OR_NOT_CONFIGURED until SMTP/template backend is configured."],
  ["Support tickets", "Support ticket model is not implemented yet."],
  ["Private document viewing", "Blocked by privacy policy unless a specific authorized review flow is implemented."],
  ["Service restart", "No approved ops-control system exists for website-triggered restarts."]
];

const rejectReasons = [
  "Incomplete property details",
  "Suspicious price",
  "Poor or missing images",
  "Duplicate listing",
  "Prohibited content",
  "Wrong category",
  "Missing required energy/property information",
  "Suspected scam/fraud",
  "Other custom reason"
];

export function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [listingStatus, setListingStatus] = useState("");
  const [reason, setReason] = useState(rejectReasons[0]);
  const queryClient = useQueryClient();

  const userParams = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter) params.set("status", statusFilter);
    return params;
  }, [query, roleFilter, statusFilter]);

  const listingParams = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (listingStatus) params.set("status", listingStatus);
    return params;
  }, [query, listingStatus]);

  const metrics = useQuery({ queryKey: ["admin-metrics"], queryFn: api.adminMetrics });
  const users = useQuery({ queryKey: ["admin-users", userParams.toString()], queryFn: () => api.adminUsers(userParams) });
  const listings = useQuery({ queryKey: ["admin-listings", listingParams.toString()], queryFn: () => api.adminListings(listingParams) });
  const pending = useQuery({ queryKey: ["admin-pending"], queryFn: api.adminPendingListings });
  const reports = useQuery({ queryKey: ["admin-reports"], queryFn: api.adminReports });
  const audit = useQuery({ queryKey: ["admin-audit"], queryFn: api.adminAuditLogs });
  const health = useQuery({ queryKey: ["admin-health"], queryFn: api.adminSystemHealth });
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: api.adminSettings });

  const invalidateAdmin = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
    queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
  };

  const approve = useMutation({ mutationFn: api.approveListing, onSuccess: invalidateAdmin });
  const reject = useMutation({ mutationFn: (id: string) => api.rejectListing(id, reason), onSuccess: invalidateAdmin });
  const pause = useMutation({ mutationFn: (id: string) => api.pauseListing(id, reason), onSuccess: invalidateAdmin });
  const archive = useMutation({ mutationFn: (id: string) => api.archiveListing(id, reason), onSuccess: invalidateAdmin });
  const feature = useMutation({ mutationFn: (id: string) => api.featureListing(id), onSuccess: invalidateAdmin });
  const unfeature = useMutation({ mutationFn: (id: string) => api.unfeatureListing(id), onSuccess: invalidateAdmin });
  const userStatus = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => api.setUserStatus(id, status), onSuccess: invalidateAdmin });
  const reportResolve = useMutation({ mutationFn: (id: string) => api.resolveReport(id, "Resolved from admin dashboard"), onSuccess: invalidateAdmin });

  const userItems = users.data ? normalizeList(users.data).items as AnyRecord[] : [];
  const listingItems = listings.data ? normalizeList(listings.data).items : [];
  const pendingItems = pending.data ? normalizeList(pending.data).items : [];
  const reportItems = reports.data ? normalizeList(reports.data).items as AnyRecord[] : [];

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-lg border bg-slate-950 p-3 text-white shadow-sm">
          <div className="px-3 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-200">Protected admin</p>
            <h1 className="mt-1 text-xl font-black">Command Center</h1>
          </div>
          <nav className="mt-2 grid gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} className={cls("flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-bold transition", tab === id ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white")} onClick={() => setTab(id)}>
                <Icon size={18} />{label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-sea">ZebeEstate / EstateFlow</p>
              <h2 className="text-3xl font-black">Admin operational control center</h2>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3">
              <Search size={18} className="text-slate-400" />
              <Input className="border-0 focus:ring-0" placeholder="Search users, listings, reports" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
          </div>

          {metrics.isError && <div className="mt-5"><ErrorBox message={metrics.error.message} /></div>}

          {tab === "overview" && (
            <div className="mt-6 grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric title="Total users" value={metric(metrics.data, "totalUsers")} />
                <Metric title="Active users" value={metric(metrics.data, "activeUsers")} />
                <Metric title="Total listings" value={metric(metrics.data, "totalListings")} />
                <Metric title="Open reports" value={metric(metrics.data, "openReports")} tone="warn" />
                <Metric title="Seekers" value={metric(metrics.data, "totalSeekers")} />
                <Metric title="Providers" value={metric(metrics.data, "totalProviders")} />
                <Metric title="Agents" value={metric(metrics.data, "totalAgents")} />
                <Metric title="Admins" value={metric(metrics.data, "totalAdmins")} />
                <Metric title="Published" value={metric(metrics.data, "publishedListings")} />
                <Metric title="Draft" value={metric(metrics.data, "draftListings")} />
                <Metric title="Pending review" value={metric(metrics.data, "pendingListings")} tone="warn" />
                <Metric title="Rejected" value={metric(metrics.data, "rejectedListings")} />
                <Metric title="Leads" value={metric(metrics.data, "totalLeads")} />
                <Metric title="Messages" value={metric(metrics.data, "totalMessages")} />
                <Metric title="Reports" value={metric(metrics.data, "totalReports")} />
                <Metric title="Resolved reports" value={metric(metrics.data, "resolvedReports")} />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <QuickLink title="Pending listings" body="Review, approve, reject, pause, archive." onClick={() => setTab("moderation")} />
                <QuickLink title="Reports" body="Inspect abuse reports and resolve cases." onClick={() => setTab("reports")} />
                <QuickLink title="Audit logs" body="Read-only trail of admin actions." onClick={() => setTab("audit")} />
              </div>
              <Card className="p-5">
                <h3 className="text-lg font-black">Platform health indicators</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {Object.entries((metrics.data?.platformHealth ?? {}) as AnyRecord).map(([key, value]) => <Status key={key} label={key} value={String(value)} />)}
                </div>
              </Card>
            </div>
          )}

          {tab === "users" && (
            <Panel title="User management" actions={<><Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><option value="">All roles</option><option value="SEEKER">Seeker</option><option value="LANDLORD">Provider/Landlord</option><option value="AGENT">Agent/Company</option><option value="ADMIN">Admin</option></Select><Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option><option value="DELETED">Deleted/anonymised</option></Select></>}>
              {users.isLoading ? <Skeleton /> : <DataTable headers={["User", "Role", "Status", "Activity", "Controls"]} rows={userItems.map((user) => [
                <Identity item={user} />,
                <Badge>{lower(user.role)}</Badge>,
                <Badge tone={user.status === "SUSPENDED" ? "warn" : "ok"}>{lower(user.status)}</Badge>,
                <span>{user._count?.listings ?? 0} listings · {(user._count?.leadsAsSeeker ?? 0) + (user._count?.leadsAsProvider ?? 0)} leads</span>,
                <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => userStatus.mutate({ id: user.id, status: user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" })}>{user.status === "SUSPENDED" ? <Check size={15} /> : <Ban size={15} />}{user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}</Button><Button disabled variant="ghost" title="Password email backend is not configured">Reset email disabled</Button></div>
              ])} />}
            </Panel>
          )}

          {tab === "listings" && (
            <Panel title="Listing management" actions={<Select value={listingStatus} onChange={(e) => setListingStatus(e.target.value)}><option value="">All statuses</option><option value="PUBLISHED">Published</option><option value="PENDING_REVIEW">Pending review</option><option value="DRAFT">Draft</option><option value="REJECTED">Rejected</option><option value="PAUSED">Paused</option><option value="ARCHIVED">Archived</option></Select>}>
              <ListingTable items={listingItems} reason={reason} approve={approve.mutate} reject={reject.mutate} pause={pause.mutate} archive={archive.mutate} feature={feature.mutate} unfeature={unfeature.mutate} />
            </Panel>
          )}

          {tab === "moderation" && (
            <Panel title="Pending listing moderation queue" actions={<Select value={reason} onChange={(e) => setReason(e.target.value)}>{rejectReasons.map((item) => <option key={item}>{item}</option>)}</Select>}>
              {pending.isLoading ? <Skeleton /> : pendingItems.length ? <ListingTable items={pendingItems} reason={reason} approve={approve.mutate} reject={reject.mutate} pause={pause.mutate} archive={archive.mutate} feature={feature.mutate} unfeature={unfeature.mutate} /> : <EmptyState title="No pending listings" body="New submitted listings will appear here for admin review." />}
            </Panel>
          )}

          {tab === "reports" && (
            <Panel title="Reports and abuse management">
              <DataTable headers={["Report", "Target", "Status", "Severity", "Controls"]} rows={reportItems.map((report) => [
                <div><p className="font-bold">{report.reason}</p><p className="text-xs text-slate-500">{report.details || "No detail provided"}</p></div>,
                <span>{report.listing?.title || report.reportedUser?.email || report.messageId || "Unknown target"}</span>,
                <Badge tone={report.status === "OPEN" ? "warn" : "ok"}>{lower(report.status)}</Badge>,
                <Badge>{report.reason?.toLowerCase().includes("fraud") ? "high" : "medium"}</Badge>,
                <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => reportResolve.mutate(report.id)}><Check size={15} />Resolve</Button><Button disabled variant="ghost" title="Message-body access requires a reported safety case and audit-specific endpoint">Inspect messages disabled</Button></div>
              ])} />
            </Panel>
          )}

          {tab === "audit" && (
            <Panel title="Read-only audit logs">
              <DataTable headers={["Timestamp", "Actor", "Action", "Target", "Result"]} rows={(audit.data ?? []).map((item: AnyRecord) => [
                dateText(item.createdAt),
                item.admin?.email ?? item.adminId,
                item.action,
                `${item.targetType}:${item.targetId}`,
                "success"
              ])} />
            </Panel>
          )}

          {tab === "security" && (
            <Panel title="Security dashboard">
              {health.isLoading ? <Skeleton /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{flattenHealth(health.data).map(([key, value]) => <Status key={key} label={key} value={value} />)}</div>}
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Button disabled variant="outline" title="Session revocation endpoint is not implemented yet">Revoke sessions disabled</Button>
                <Button disabled variant="outline" title="Force-reset endpoint is not implemented yet">Force reset disabled</Button>
                <Button disabled variant="outline" title="Blocked request telemetry is not tracked yet">Blocked requests disabled</Button>
              </div>
            </Panel>
          )}

          {tab === "settings" && (
            <Panel title="Settings, CMS, SEO, notifications">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="p-5">
                  <h3 className="font-black">Safe platform settings</h3>
                  <div className="mt-4 grid gap-3">{Object.entries((settings.data?.values ?? {}) as AnyRecord).map(([key, value]) => <Status key={key} label={key} value={String(value)} />)}</div>
                  <Button className="mt-4" disabled title="Persistent settings store is not implemented yet">Save settings disabled</Button>
                </Card>
                <Card className="p-5">
                  <h3 className="font-black">Disabled controls with reasons</h3>
                  <div className="mt-4 grid gap-3">{unsupportedControls.map(([title, body]) => <div key={title} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm"><p className="font-bold text-amber-950">{title}</p><p className="mt-1 text-amber-800">{body}</p></div>)}</div>
                </Card>
              </div>
            </Panel>
          )}
        </section>
      </div>
    </Shell>
  );
}

function Panel({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return <Card className="mt-6 p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><h3 className="text-xl font-black">{title}</h3>{actions && <div className="grid gap-2 md:flex md:min-w-96">{actions}</div>}</div><div className="mt-5">{children}</div></Card>;
}

function Metric({ title, value, tone = "neutral" }: { title: string; value: string; tone?: "neutral" | "warn" }) {
  return <Card className={cls("p-4", tone === "warn" && "border-amber-200 bg-amber-50")}><p className="text-sm font-semibold text-slate-600">{title}</p><strong className="mt-2 block text-3xl">{value}</strong></Card>;
}

function QuickLink({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-lg border bg-white p-5 text-left shadow-sm transition hover:border-sea hover:shadow-md"><p className="font-black">{title}</p><p className="mt-2 text-sm text-slate-600">{body}</p></button>;
}

function ListingTable({ items, approve, reject, pause, archive, feature, unfeature }: { items: Listing[]; reason: string; approve: (id: string) => void; reject: (id: string) => void; pause: (id: string) => void; archive: (id: string) => void; feature: (id: string) => void; unfeature: (id: string) => void }) {
  if (!items.length) return <EmptyState title="No listings found" body="Adjust filters or wait for new listing activity." />;
  return <div className="grid gap-3">{items.map((item: AnyRecord) => <div key={item.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[96px_1fr_auto] md:items-center"><img src={imageUrl(item as Listing)} alt="" className="h-20 w-24 rounded-md object-cover" /><div><div className="flex flex-wrap items-center gap-2"><p className="font-black">{item.title}</p><Badge tone={item.status === "PENDING_REVIEW" ? "warn" : "ok"}>{lower(item.status)}</Badge></div><p className="mt-1 text-sm text-slate-600">{item.city} · {item.propertyType} · {item.owner?.email ?? "No owner"}</p><p className="mt-1 text-xs text-slate-500">{item._count?.views ?? 0} views · {item._count?.favourites ?? 0} saved · {item._count?.leads ?? 0} leads · {item._count?.reports ?? 0} reports</p>{!item.energyCertificate && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-700"><AlertTriangle size={14} />Missing energy certificate data where applicable</p>}</div><div className="flex flex-wrap justify-start gap-2 md:justify-end"><Button variant="outline" onClick={() => window.open(`/property/${item.slug}`, "_blank", "noopener,noreferrer")}><Eye size={15} />Preview</Button>{item.status === "PENDING_REVIEW" && <Button onClick={() => approve(item.id)}><Check size={15} />Approve</Button>}<Button variant="outline" onClick={() => reject(item.id)}><X size={15} />Reject</Button><Button variant="outline" onClick={() => pause(item.id)}><Ban size={15} />Pause</Button><Button variant="outline" onClick={() => archive(item.id)}><Archive size={15} />Archive</Button>{item.featuredUntil ? <Button variant="ghost" onClick={() => unfeature(item.id)}><Star size={15} />Unfeature</Button> : <Button variant="ghost" onClick={() => feature(item.id)}><Star size={15} />Feature</Button>}</div></div>)}</div>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) return <EmptyState title="No records" body="There are no records for this section yet." />;
  return <div className="overflow-x-auto rounded-lg border"><table className="min-w-full divide-y text-sm"><thead className="bg-slate-50">{headers.map((item) => <th key={item} className="px-4 py-3 text-left font-black text-slate-700">{item}</th>)}</thead><tbody className="divide-y bg-white">{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-middle">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Identity({ item }: { item: AnyRecord }) {
  const name = [item.profile?.firstName, item.profile?.lastName].filter(Boolean).join(" ") || item.providerProfile?.displayName || "Unnamed user";
  return <div><p className="font-bold">{name}</p><p className="text-xs text-slate-500">{item.email}</p></div>;
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "ok" | "warn" }) {
  return <span className={cls("inline-flex rounded-full px-2.5 py-1 text-xs font-black", tone === "ok" && "bg-emerald-50 text-emerald-700", tone === "warn" && "bg-amber-100 text-amber-800", tone === "neutral" && "bg-slate-100 text-slate-700")}>{children}</span>;
}

function Status({ label, value }: { label: string; value: string }) {
  const good = /healthy|present|configured|enabled|redacted|true/i.test(value);
  return <div className="rounded-md border bg-white p-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className={cls("mt-1 font-black", good ? "text-emerald-700" : "text-amber-700")}>{value}</p></div>;
}

function metric(data: unknown, key: string) {
  const value = (data as AnyRecord | undefined)?.[key];
  return value === undefined || value === null ? "-" : String(value);
}

function lower(value: unknown) {
  return String(value ?? "-").replace(/_/g, " ").toLowerCase();
}

function dateText(value: unknown) {
  return value ? new Date(String(value)).toLocaleString() : "-";
}

function flattenHealth(payload: unknown) {
  const result: Array<[string, string]> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visit = (prefix: string, value: any) => {
    if (value && typeof value === "object" && !Array.isArray(value)) Object.entries(value).forEach(([key, inner]) => visit(prefix ? `${prefix}.${key}` : key, inner));
    else result.push([prefix, String(value)]);
  };
  visit("", payload ?? {});
  return result;
}
