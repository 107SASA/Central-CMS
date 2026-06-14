"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

// ─── Internal types ────────────────────────────────────────────────────────────

interface Service {
  title: string;
  slug: string;
  pain: string;
  description: string;
  features: string[];
}

interface TeamMember {
  photo: string;
  badge: string;
  name: string;
  title: string;
  quote: string;
  tags: string[];
}

interface Testimonial {
  name: string;
  business: string;
  location: string;
  service: string;
  quote: string;
  initial: string;
  rating: number;
}

interface StaffMember {
  name: string;
  title: string;
  role: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function parseJson<T>(value: string | null, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function serialize(items: unknown[]): string {
  return JSON.stringify(items, null, 2);
}

function ItemHeader({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Services List Editor ──────────────────────────────────────────────────────

export function ServicesListEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [items, setItems] = useState<Service[]>(() =>
    parseJson<Service>(value, [])
  );

  function update(next: Service[]) {
    setItems(next);
    onChange(serialize(next));
  }

  function patch(i: number, p: Partial<Service>) {
    update(items.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader
              label={`Service ${i + 1}`}
              onRemove={() => update(items.filter((_, idx) => idx !== i))}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => patch(i, { title: e.target.value })}
                  placeholder="e.g. Trade Marks"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL Slug</Label>
                <Input
                  value={item.slug}
                  onChange={(e) => patch(i, { slug: e.target.value })}
                  placeholder="e.g. trademarks"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Pain Point</Label>
              <Input
                value={item.pain}
                onChange={(e) => patch(i, { pain: e.target.value })}
                placeholder="e.g. Someone may already be using your brand name."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => patch(i, { description: e.target.value })}
                rows={3}
                placeholder="Service description..."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">What&apos;s Included (one feature per line)</Label>
              <Textarea
                value={(item.features || []).join("\n")}
                onChange={(e) =>
                  patch(i, {
                    features: e.target.value
                      .split("\n")
                      .filter((f) => f.trim()),
                  })
                }
                rows={5}
                placeholder={"Trademark Search & Clearance\nApplication Filing\nExamination Response"}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          update([
            ...items,
            { title: "", slug: "", pain: "", description: "", features: [] },
          ])
        }
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Service
      </Button>
    </div>
  );
}

// ─── Team List Editor ──────────────────────────────────────────────────────────

export function TeamListEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [items, setItems] = useState<TeamMember[]>(() =>
    parseJson<TeamMember>(value, [])
  );

  function update(next: TeamMember[]) {
    setItems(next);
    onChange(serialize(next));
  }

  function patch(i: number, p: Partial<TeamMember>) {
    update(items.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader
              label={`Member ${i + 1}`}
              onRemove={() => update(items.filter((_, idx) => idx !== i))}
            />

            <div className="space-y-1">
              <Label className="text-xs">Photo URL</Label>
              <Input
                value={item.photo}
                onChange={(e) => patch(i, { photo: e.target.value })}
                placeholder="/photo.jpg or https://..."
              />
              {item.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photo}
                  alt=""
                  className="h-16 w-16 rounded object-cover border mt-1"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                  placeholder="Adv. Full Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role Badge</Label>
                <Input
                  value={item.badge}
                  onChange={(e) => patch(i, { badge: e.target.value })}
                  placeholder="Founder & Director"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Designation / Degree</Label>
              <Input
                value={item.title}
                onChange={(e) => patch(i, { title: e.target.value })}
                placeholder="B.A.LL.B · IP Law Specialist"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Quote</Label>
              <Textarea
                value={item.quote}
                onChange={(e) => patch(i, { quote: e.target.value })}
                rows={2}
                placeholder="Quote shown on the card..."
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tags (comma-separated)</Label>
              <Input
                value={(item.tags || []).join(", ")}
                onChange={(e) =>
                  patch(i, {
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Trademarks, Patents, Copyright, 15+ Yrs Exp"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          update([
            ...items,
            { photo: "", badge: "", name: "", title: "", quote: "", tags: [] },
          ])
        }
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Team Member
      </Button>
    </div>
  );
}

// ─── Testimonials List Editor ──────────────────────────────────────────────────

export function TestimonialsListEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [items, setItems] = useState<Testimonial[]>(() =>
    parseJson<Testimonial>(value, [])
  );

  function update(next: Testimonial[]) {
    setItems(next);
    onChange(serialize(next));
  }

  function patch(i: number, p: Partial<Testimonial>) {
    update(items.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader
              label={`Testimonial ${i + 1}`}
              onRemove={() => update(items.filter((_, idx) => idx !== i))}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Client Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                  placeholder="Usha Sharma"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Avatar Letter</Label>
                <Input
                  value={item.initial}
                  onChange={(e) =>
                    patch(i, {
                      initial: e.target.value.slice(0, 1).toUpperCase(),
                    })
                  }
                  placeholder="U"
                  maxLength={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Business / Company</Label>
                <Input
                  value={item.business}
                  onChange={(e) => patch(i, { business: e.target.value })}
                  placeholder="Usha's Frosting Cakes"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Input
                  value={item.location}
                  onChange={(e) => patch(i, { location: e.target.value })}
                  placeholder="Kolkata"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Service Used</Label>
                <Input
                  value={item.service}
                  onChange={(e) => patch(i, { service: e.target.value })}
                  placeholder="Trademark"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Star Rating</Label>
                <Select
                  value={String(item.rating || 5)}
                  onValueChange={(v) => patch(i, { rating: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {"★".repeat(n)} ({n} star{n !== 1 ? "s" : ""})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Quote</Label>
              <Textarea
                value={item.quote}
                onChange={(e) => patch(i, { quote: e.target.value })}
                rows={3}
                placeholder="What the client said about working with you..."
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          update([
            ...items,
            {
              name: "",
              business: "",
              location: "",
              service: "",
              quote: "",
              initial: "",
              rating: 5,
            },
          ])
        }
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Testimonial
      </Button>
    </div>
  );
}

// ─── Staff List Editor ─────────────────────────────────────────────────────────

const STAFF_ROLES = [
  "Senior Associate",
  "Associate",
  "Paralegal",
  "Partner",
  "Director",
];

export function StaffListEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  const [items, setItems] = useState<StaffMember[]>(() =>
    parseJson<StaffMember>(value, [])
  );

  function update(next: StaffMember[]) {
    setItems(next);
    onChange(serialize(next));
  }

  function patch(i: number, p: Partial<StaffMember>) {
    update(items.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30"
        >
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div className="space-y-1">
              <Label className="text-xs">Full Name</Label>
              <Input
                value={item.name}
                onChange={(e) => patch(i, { name: e.target.value })}
                placeholder="Mr. Full Name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Designation</Label>
              <Input
                value={item.title}
                onChange={(e) => patch(i, { title: e.target.value })}
                placeholder="Advocate & Trademark Attorney"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <Select
                value={item.role}
                onValueChange={(v) => patch(i, { role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
            onClick={() => update(items.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          update([...items, { name: "", title: "", role: "Associate" }])
        }
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Staff Member
      </Button>
    </div>
  );
}

// ─── ANSPL: Service Blocks Editor (blocks_json) ───────────────────────────────

interface ServiceBlock { label: string; title: string; img: string; desc: string; points: string[] }

export function ServiceBlocksListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<ServiceBlock[]>(() => parseJson<ServiceBlock>(value, []));
  function update(next: ServiceBlock[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<ServiceBlock>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader label={`Block ${i + 1}`} onRemove={() => update(items.filter((_, idx) => idx !== i))} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Label (badge)</Label><Input value={item.label} onChange={e => patch(i, { label: e.target.value })} placeholder="In-House" /></div>
              <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="Panel Manufacturing" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Image URL</Label><Input value={item.img} onChange={e => patch(i, { img: e.target.value })} placeholder="https://..." />{item.img && <img src={item.img} alt="" className="h-16 w-full rounded object-cover border mt-1" />}</div>
            <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={item.desc} onChange={e => patch(i, { desc: e.target.value })} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs">Points (one per line)</Label><Textarea value={(item.points || []).join("\n")} onChange={e => patch(i, { points: e.target.value.split("\n").filter(f => f.trim()) })} rows={4} placeholder={"Point 1\nPoint 2\nPoint 3"} /></div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { label: "", title: "", img: "", desc: "", points: [] }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Service Block</Button>
    </div>
  );
}

// ─── ANSPL: Products Editor (products_json) ───────────────────────────────────

interface Product { badge: string; title: string; img: string; desc: string; points: string[] }

export function ProductsListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Product[]>(() => parseJson<Product>(value, []));
  function update(next: Product[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Product>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader label={`Product ${i + 1}`} onRemove={() => update(items.filter((_, idx) => idx !== i))} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Badge</Label><Input value={item.badge} onChange={e => patch(i, { badge: e.target.value })} placeholder="Authorised Distributor" /></div>
              <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="VFD Drives" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Image URL</Label><Input value={item.img} onChange={e => patch(i, { img: e.target.value })} placeholder="https://..." />{item.img && <img src={item.img} alt="" className="h-16 w-full rounded object-cover border mt-1" />}</div>
            <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={item.desc} onChange={e => patch(i, { desc: e.target.value })} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs">Points (one per line)</Label><Textarea value={(item.points || []).join("\n")} onChange={e => patch(i, { points: e.target.value.split("\n").filter(f => f.trim()) })} rows={4} /></div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { badge: "", title: "", img: "", desc: "", points: [] }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Product</Button>
    </div>
  );
}

// ─── ANSPL: Projects Editor (projects_json) ───────────────────────────────────

interface Project { tag: string; title: string; client: string; loc: string; type: string; img: string }

export function ProjectsListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Project[]>(() => parseJson<Project>(value, []));
  function update(next: Project[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Project>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader label={`Project ${i + 1}`} onRemove={() => update(items.filter((_, idx) => idx !== i))} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Tag / Category</Label><Input value={item.tag} onChange={e => patch(i, { tag: e.target.value })} placeholder="Rolling Mill" /></div>
              <div className="space-y-1"><Label className="text-xs">Client</Label><Input value={item.client} onChange={e => patch(i, { client: e.target.value })} placeholder="Danieli Group" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Project Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="Danieli Rolling Mill SCADA" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={item.loc} onChange={e => patch(i, { loc: e.target.value })} placeholder="East India" /></div>
              <div className="space-y-1"><Label className="text-xs">Project Type</Label><Input value={item.type} onChange={e => patch(i, { type: e.target.value })} placeholder="PLC + SCADA" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Image URL</Label><Input value={item.img} onChange={e => patch(i, { img: e.target.value })} placeholder="https://..." />{item.img && <img src={item.img} alt="" className="h-16 w-full rounded object-cover border mt-1" />}</div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { tag: "", title: "", client: "", loc: "", type: "", img: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Project</Button>
    </div>
  );
}

// ─── ANSPL: Industries Editor (industries_json) ───────────────────────────────

interface Industry { n: string; title: string; sub: string; img: string }

export function IndustriesListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Industry[]>(() => parseJson<Industry>(value, []));
  function update(next: Industry[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Industry>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-4 gap-2 flex-1">
            <div className="space-y-1"><Label className="text-xs">No.</Label><Input value={item.n} onChange={e => patch(i, { n: e.target.value })} placeholder="01" /></div>
            <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="Rolling Mills" /></div>
            <div className="space-y-1"><Label className="text-xs">Subtitle</Label><Input value={item.sub} onChange={e => patch(i, { sub: e.target.value })} placeholder="Flying shear, SCADA" /></div>
            <div className="space-y-1"><Label className="text-xs">Image URL</Label><Input value={item.img} onChange={e => patch(i, { img: e.target.value })} placeholder="https://..." /></div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive shrink-0" onClick={() => update(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { n: String(items.length + 1).padStart(2, "0"), title: "", sub: "", img: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Industry</Button>
    </div>
  );
}

// ─── ANSPL: Milestones Editor (milestones_json) ───────────────────────────────

interface Milestone { year: string; title: string; desc: string }

export function MilestonesListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Milestone[]>(() => parseJson<Milestone>(value, []));
  function update(next: Milestone[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Milestone>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div className="space-y-1"><Label className="text-xs">Year / Period</Label><Input value={item.year} onChange={e => patch(i, { year: e.target.value })} placeholder="2004–05" /></div>
            <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="ABB System House" /></div>
            <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={item.desc} onChange={e => patch(i, { desc: e.target.value })} placeholder="Brief description..." /></div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive shrink-0" onClick={() => update(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { year: "", title: "", desc: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Milestone</Button>
    </div>
  );
}

// ─── ANSPL: Certifications Editor (certs_json) ───────────────────────────────

interface Cert { icon: string; title: string; desc: string }

export function CertificationsListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Cert[]>(() => parseJson<Cert>(value, []));
  function update(next: Cert[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Cert>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div className="space-y-1"><Label className="text-xs">Emoji Icon</Label><Input value={item.icon} onChange={e => patch(i, { icon: e.target.value })} placeholder="🏆" /></div>
            <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="ISO 9001:2015" /></div>
            <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={item.desc} onChange={e => patch(i, { desc: e.target.value })} placeholder="Certification details" /></div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive shrink-0" onClick={() => update(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { icon: "", title: "", desc: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Certification</Button>
    </div>
  );
}

// ─── ANSPL: Partners Editor (partners_json) ───────────────────────────────────

interface Partner { name: string; role: string }

export function PartnersListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Partner[]>(() => parseJson<Partner>(value, []));
  function update(next: Partner[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Partner>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="space-y-1"><Label className="text-xs">Partner Name</Label><Input value={item.name} onChange={e => patch(i, { name: e.target.value })} placeholder="ABB" /></div>
            <div className="space-y-1"><Label className="text-xs">Role / Description</Label><Input value={item.role} onChange={e => patch(i, { role: e.target.value })} placeholder="System House — Drives & Automation" /></div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive shrink-0" onClick={() => update(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { name: "", role: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Partner</Button>
    </div>
  );
}

// ─── ANSPL: Offices Editor (offices_json) ─────────────────────────────────────

interface Office { title: string; lines: string[]; map: string | null }

export function OfficesListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Office[]>(() => parseJson<Office>(value, []));
  function update(next: Office[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<Office>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader label={`Office ${i + 1}`} onRemove={() => update(items.filter((_, idx) => idx !== i))} />
            <div className="space-y-1"><Label className="text-xs">Office Title</Label><Input value={item.title} onChange={e => patch(i, { title: e.target.value })} placeholder="Head Office & Works" /></div>
            <div className="space-y-1"><Label className="text-xs">Address Lines (one per line)</Label><Textarea value={(item.lines || []).join("\n")} onChange={e => patch(i, { lines: e.target.value.split("\n") })} rows={3} placeholder={"Line 1\nLine 2\nCity, PIN"} /></div>
            <div className="space-y-1"><Label className="text-xs">Google Maps URL (optional)</Label><Input value={item.map || ""} onChange={e => patch(i, { map: e.target.value || null })} placeholder="https://maps.google.com/?q=..." /></div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { title: "", lines: ["", "", ""], map: null }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Office</Button>
    </div>
  );
}

// ─── ANSPL: Hero Slides Editor (slides_json) ──────────────────────────────────

interface HeroSlide { img: string; badge: string; pre: string; heading: string; body: string; pill: string }

export function HeroSlidesListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<HeroSlide[]>(() => parseJson<HeroSlide>(value, []));
  function update(next: HeroSlide[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<HeroSlide>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="pt-4 space-y-3">
            <ItemHeader label={`Slide ${i + 1}`} onRemove={() => update(items.filter((_, idx) => idx !== i))} />
            <div className="space-y-1"><Label className="text-xs">Background Image URL</Label><Input value={item.img} onChange={e => patch(i, { img: e.target.value })} placeholder="https://..." />{item.img && <img src={item.img} alt="" className="h-16 w-full rounded object-cover border mt-1" />}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Badge (category tag)</Label><Input value={item.badge} onChange={e => patch(i, { badge: e.target.value })} placeholder="Steel & Rolling Mills" /></div>
              <div className="space-y-1"><Label className="text-xs">Pre-heading (small line above)</Label><Input value={item.pre} onChange={e => patch(i, { pre: e.target.value })} placeholder="One Stop Solution" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Heading (use \n for line break)</Label><Input value={item.heading} onChange={e => patch(i, { heading: e.target.value })} placeholder="For Electrical &\nAutomation Projects" /></div>
            <div className="space-y-1"><Label className="text-xs">Body Text</Label><Textarea value={item.body} onChange={e => patch(i, { body: e.target.value })} rows={2} /></div>
            <div className="space-y-1"><Label className="text-xs">Pill / Trust Line</Label><Input value={item.pill} onChange={e => patch(i, { pill: e.target.value })} placeholder="Spirit of Innovation — Since 1997" /></div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { img: "", badge: "", pre: "", heading: "", body: "", pill: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Slide</Button>
    </div>
  );
}

// ─── ANSPL: Team Editor (anspl_team_json) ─────────────────────────────────────

interface AnsplTeamMember { init: string; name: string; role: string; edu: string; exp: string }

export function AnsplTeamListEditor({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const [items, setItems] = useState<AnsplTeamMember[]>(() => parseJson<AnsplTeamMember>(value, []));
  function update(next: AnsplTeamMember[]) { setItems(next); onChange(serialize(next)); }
  function patch(i: number, p: Partial<AnsplTeamMember>) { update(items.map((it, idx) => idx === i ? { ...it, ...p } : it)); }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-5 gap-2 flex-1">
            <div className="space-y-1"><Label className="text-xs">Initials</Label><Input value={item.init} onChange={e => patch(i, { init: e.target.value })} placeholder="RKS" /></div>
            <div className="space-y-1"><Label className="text-xs">Full Name</Label><Input value={item.name} onChange={e => patch(i, { name: e.target.value })} placeholder="Rajesh K. Sarkar" /></div>
            <div className="space-y-1"><Label className="text-xs">Role / Title</Label><Input value={item.role} onChange={e => patch(i, { role: e.target.value })} placeholder="Founder & CEO" /></div>
            <div className="space-y-1"><Label className="text-xs">Education</Label><Input value={item.edu} onChange={e => patch(i, { edu: e.target.value })} placeholder="B.Tech, IIT Delhi" /></div>
            <div className="space-y-1"><Label className="text-xs">Experience</Label><Input value={item.exp} onChange={e => patch(i, { exp: e.target.value })} placeholder="28 Years in Automation" /></div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive shrink-0" onClick={() => update(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => update([...items, { init: "", name: "", role: "", edu: "", exp: "" }])} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Team Member</Button>
    </div>
  );
}

// ─── String List Editor (credentials_json) ────────────────────────────────────

export function StringListEditor({
  value,
  onChange,
  placeholder = "Add item...",
}: {
  value: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(() =>
    parseJson<string>(value, [])
  );

  function update(next: string[]) {
    setItems(next);
    onChange(serialize(next));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) =>
              update(items.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
            onClick={() => update(items.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => update([...items, ""])}
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Item
      </Button>
    </div>
  );
}
