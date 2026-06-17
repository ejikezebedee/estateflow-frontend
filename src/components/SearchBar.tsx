import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input, Select } from "./ui";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [goal, setGoal] = useState(params.get("goal") ?? params.get("type") ?? "rent");
  const [location, setLocation] = useState(params.get("location") ?? params.get("city") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [rooms, setRooms] = useState(params.get("rooms") ?? "");

  return (
    <form className="rounded-lg border bg-white p-3 shadow-soft" onSubmit={(event) => {
      event.preventDefault();
      const next = new URLSearchParams();
      next.set("goal", goal);
      if (location) next.set("location", location);
      if (maxPrice) next.set("maxPrice", maxPrice);
      if (rooms) next.set("rooms", rooms);
      navigate(`/search?${next.toString()}`);
    }}>
      <div className="mb-3 inline-flex rounded-md bg-slate-100 p-1">
        {["rent", "buy"].map((item) => <button type="button" key={item} onClick={() => setGoal(item)} className={`rounded px-4 py-2 text-sm font-bold capitalize ${goal === item ? "bg-white text-sea shadow" : "text-slate-600"}`}>{item}</button>)}
      </div>
      <div className={`grid gap-3 ${compact ? "md:grid-cols-4" : "md:grid-cols-[1.4fr_1fr_1fr_auto]"}`}>
        <Input placeholder="City, district, or postcode" value={location} onChange={(event) => setLocation(event.target.value)} />
        <Input type="number" placeholder="Max price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        <Select value={rooms} onChange={(event) => setRooms(event.target.value)}><option value="">Rooms</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></Select>
        <Button variant="accent"><Search size={16} />Search</Button>
      </div>
    </form>
  );
}
