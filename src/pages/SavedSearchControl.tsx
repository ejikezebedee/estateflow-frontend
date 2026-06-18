import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { api, normalizeList } from "../lib/api";
import { Button, Card, Input, Select } from "../components/ui";

export function SavedSearchControl() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("My search");
  const [alertFrequency, setFrequency] = useState<"instant" | "daily" | "weekly" | "off">("daily");
  const location = useLocation();
  const queryClient = useQueryClient();
  const saved = useQuery({ queryKey: ["saved-searches"], queryFn: api.savedSearches, enabled: open });
  const create = useMutation({
    mutationFn: () => api.createSavedSearch({ name, filters: Object.fromEntries(new URLSearchParams(location.search)), alertFrequency }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-searches"] })
  });
  const remove = useMutation({ mutationFn: (id: string) => api.deleteSavedSearch(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-searches"] }) });
  const items = saved.data ? normalizeList(saved.data).items : [];

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)}><Bell size={16} />Save search</Button>
      {open && <Card className="absolute right-0 z-20 mt-2 w-80 p-4 shadow-soft">
        <div className="grid gap-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
          <Select value={alertFrequency} onChange={(event) => setFrequency(event.target.value as typeof alertFrequency)}><option value="instant">Instant</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="off">Off</option></Select>
          <Button onClick={() => create.mutate()} disabled={create.isPending}>{create.isSuccess ? "Saved" : "Create alert"}</Button>
          {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
          <div className="border-t pt-3">
            {items.map((item) => <div className="flex items-center justify-between py-2 text-sm" key={item.id}><span>{item.name}</span><Button variant="ghost" className="h-8 px-2" onClick={() => remove.mutate(item.id)}><Trash2 size={14} /></Button></div>)}
          </div>
        </div>
      </Card>}
    </div>
  );
}
