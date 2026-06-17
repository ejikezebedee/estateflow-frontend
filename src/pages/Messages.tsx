import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { api, normalizeList } from "../lib/api";
import { Button, Card, EmptyState, ErrorBox, Textarea } from "../components/ui";

export function Messages() {
  const [selected, setSelected] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const threads = useQuery({ queryKey: ["threads"], queryFn: api.threads });
  const list = threads.data ? normalizeList(threads.data).items : [];
  const currentId = selected ?? list[0]?.id;
  const detail = useQuery({ queryKey: ["thread", currentId], queryFn: () => api.thread(currentId!), enabled: !!currentId });
  const send = useMutation({ mutationFn: () => api.sendMessage(currentId!, body), onSuccess: () => { setBody(""); queryClient.invalidateQueries({ queryKey: ["thread", currentId] }); } });

  if (threads.isError) return <ErrorBox message={threads.error.message} />;
  if (!threads.isLoading && list.length === 0) return <EmptyState title="No message threads" body="Seeded conversations will appear here when the backend returns them." />;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <Card className="overflow-hidden">{list.map((thread) => <button className={`block w-full border-b p-4 text-left ${thread.id === currentId ? "bg-mint" : ""}`} key={thread.id} onClick={() => setSelected(thread.id)}><strong>{thread.participant?.name ?? "Contact"}</strong><p className="text-sm text-slate-600">{thread.listing?.title ?? "Listing context"}</p></button>)}</Card>
      <Card className="p-4">
        <div className="mb-4 rounded-md bg-slate-100 p-3"><p className="font-bold">{detail.data?.listing?.title ?? "Conversation"}</p><span className="text-sm text-sea">{detail.data?.leadStatus ?? "Lead status"}</span></div>
        <div className="space-y-3">{detail.data?.messages?.map((message) => <div className="rounded-md border p-3" key={message.id}><p className="text-sm font-bold">{message.authorName ?? "Participant"}</p><p>{message.body}</p></div>)}</div>
        <form className="mt-4 grid gap-2" onSubmit={(event) => { event.preventDefault(); send.mutate(); }}><Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message" /><Button disabled={!body.trim() || send.isPending}><Send size={16} />Send message</Button>{send.isError && <p className="text-sm text-red-600">{send.error.message}</p>}</form>
      </Card>
    </div>
  );
}
