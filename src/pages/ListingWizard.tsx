import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { wizardSchema } from "../lib/forms";
import { Button, Card, Input, Select, Shell } from "../components/ui";

type WizardValues = z.infer<typeof wizardSchema>;
const steps = ["Goal", "Type", "Location", "Price", "Details", "Amenities", "Photos", "Energy", "Contact", "Preview"];

export function ListingWizard() {
  const [step, setStep] = useState(0);
  const form = useForm<WizardValues>({ resolver: zodResolver(wizardSchema), defaultValues: { listingGoal: "rent", propertyType: "apartment", address: "", city: "", price: 0, rooms: 1, area: 40, amenities: "", energyClass: "B", contactEmail: "" } });
  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <Shell>
      <h1 className="text-3xl font-black">Listing creation wizard</h1>
      <p className="mt-2 text-slate-600">Draft/update/upload/submit endpoints were not listed in the handoff, so submission is controlled-disabled until OpenAPI confirms them.</p>
      <Card className="mt-6 p-5">
        <div className="mb-5"><div className="flex justify-between text-sm font-bold"><span>{steps[step]}</span><span>{progress}%</span></div><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-sea" style={{ width: `${progress}%` }} /></div></div>
        <form className="grid gap-4">
          {step === 0 && <Select {...form.register("listingGoal")}><option value="rent">Rent</option><option value="sell">Sell</option><option value="commercial">Commercial</option></Select>}
          {step === 1 && <Input {...form.register("propertyType")} placeholder="Property type" />}
          {step === 2 && <><Input {...form.register("address")} placeholder="Address" /><Input {...form.register("city")} placeholder="City" /></>}
          {step === 3 && <Input type="number" {...form.register("price")} placeholder="Price" />}
          {step === 4 && <><Input type="number" {...form.register("rooms")} placeholder="Rooms" /><Input type="number" {...form.register("area")} placeholder="Area" /></>}
          {step === 5 && <Input {...form.register("amenities")} placeholder="Amenities comma separated" />}
          {step === 6 && <div className="rounded-lg border border-dashed p-8 text-center text-slate-600">Photo metadata UI ready. Real binary upload remains limited by documented placeholder signed URLs.</div>}
          {step === 7 && <Input {...form.register("energyClass")} placeholder="Energy class" />}
          {step === 8 && <Input {...form.register("contactEmail")} placeholder="Contact email" />}
          {step === 9 && <pre className="max-h-80 overflow-auto rounded bg-slate-950 p-4 text-xs text-white">{JSON.stringify(form.getValues(), null, 2)}</pre>}
          <div className="flex justify-between"><Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>{step < steps.length - 1 ? <Button type="button" onClick={() => setStep(step + 1)}>Next</Button> : <Button disabled title="Submit endpoint not listed in handoff">Submit disabled until OpenAPI confirms endpoint</Button>}</div>
        </form>
      </Card>
    </Shell>
  );
}
