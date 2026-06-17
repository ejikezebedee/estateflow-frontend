import { useQuery } from "@tanstack/react-query";
import { ListFilter, Map } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, normalizeList } from "../lib/api";
import { ListingCard } from "../components/ListingCard";
import { MapBlock } from "../components/MapBlock";
import { SearchBar } from "../components/SearchBar";
import { Button, Card, EmptyState, ErrorBox, Select, Shell, Skeleton } from "../components/ui";
import { SavedSearchControl } from "./SavedSearchControl";

export function Search() {
  const [params] = useSearchParams();
  const [map, setMap] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const queryParams = useMemo(() => new URLSearchParams(params), [params]);
  const query = useQuery({ queryKey: ["search", params.toString()], queryFn: () => api.searchProperties(queryParams) });
  const normalized = query.data ? normalizeList(query.data) : { items: [] };

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black">Property search</h1><p className="text-slate-600">Connected to GET /search/properties</p></div>
        <div className="flex gap-2"><Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)}><ListFilter size={16} />Filters</Button><SavedSearchControl /><Button variant="outline" onClick={() => setMap(!map)}><Map size={16} />{map ? "List" : "Map"}</Button></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <Card className="hidden h-fit p-4 lg:block"><SearchBar compact /></Card>
        <section>
          <div className="mb-4 flex items-center justify-between"><span className="text-sm text-slate-600">{normalized.total ?? normalized.items.length} results</span><Select className="max-w-48"><option>Newest</option><option>Price ascending</option><option>Most rooms</option></Select></div>
          {query.isLoading && <Skeleton rows={4} />}
          {query.isError && <ErrorBox message={query.error.message} />}
          {!query.isLoading && !query.isError && normalized.items.length === 0 && <EmptyState title="No listings found" body="Try a different city, price range, or room count." />}
          {!query.isLoading && !query.isError && normalized.items.length > 0 && (map ? <div className="grid gap-4 lg:grid-cols-2">{normalized.items[0] && <MapBlock listing={normalized.items[0]} />}<div className="grid gap-4">{normalized.items.map((item) => <ListingCard key={item.id} listing={item} />)}</div></div> : <div className="grid gap-4">{normalized.items.map((item) => <ListingCard key={item.id} listing={item} />)}<div className="flex justify-center gap-2 pt-4"><Button variant="outline" disabled>Previous page requires backend page state</Button><Button variant="outline" disabled>Next page requires backend page state</Button></div></div>)}
        </section>
      </div>
      {drawer && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setDrawer(false)}><div className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-white p-4" onClick={(event) => event.stopPropagation()}><SearchBar compact /></div></div>}
    </Shell>
  );
}
