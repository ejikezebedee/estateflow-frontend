import { Heart, MapPin, Ruler, BedDouble } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api, areaOf, imageUrl, priceOf } from "../lib/api";
import { euro } from "../lib/format";
import type { Listing } from "../lib/types";
import { Button, Card } from "./ui";

export function ListingCard({ listing }: { listing: Listing }) {
  const queryClient = useQueryClient();
  const fav = useMutation({
    mutationFn: () => api.saveFavourite(listing.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favourites"] })
  });

  return (
    <Card className="lift overflow-hidden">
      <div className="grid md:grid-cols-[230px_1fr]">
        <Link to={`/property/${listing.slug}`} className="block min-h-56 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl(listing)})` }} aria-label={listing.title} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link to={`/property/${listing.slug}`} className="text-lg font-black hover:text-sea">{listing.title}</Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><MapPin size={16} />{listing.city ?? listing.address ?? "Location from backend"}</p>
            </div>
            <Button variant="outline" className="h-10 px-3" onClick={() => fav.mutate()} disabled={fav.isPending} title={fav.isError ? fav.error.message : "Save favourite"}><Heart size={16} />{fav.isSuccess ? "Saved" : ""}</Button>
          </div>
          <p className="mt-4 text-2xl font-black">{euro(priceOf(listing))}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="flex items-center gap-1"><BedDouble size={16} className="text-sea" />{listing.rooms ?? "-"} rooms</span>
            <span className="flex items-center gap-1"><Ruler size={16} className="text-sea" />{areaOf(listing) || "-"} m2</span>
            <span className="rounded bg-slate-100 px-2 py-1">{listing.propertyType ?? "Property"}</span>
            {listing.status && <span className="rounded bg-mint px-2 py-1 text-sea">{listing.status}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}
