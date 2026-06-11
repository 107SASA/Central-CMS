"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "About / Mission" },
  { value: "services", label: "Services" },
  { value: "team", label: "Team" },
  { value: "testimonials", label: "Testimonials" },
  { value: "stats", label: "Stats Strip" },
  { value: "cta", label: "CTA (Call to Action)" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
  { value: "gallery", label: "Gallery" },
  { value: "faq", label: "FAQ" },
  { value: "custom", label: "Custom" },
];

// JSON defaults for complex sections
const SERVICES_DEFAULT = JSON.stringify([
  { title: "Trade Marks", slug: "trademarks", pain: "Someone may already be using your brand name.", description: "We register and defend your trademark across India and internationally. Our trademark services cover availability searches, application filing, examination response, opposition and appeal proceedings.", features: ["Trademark Search & Clearance", "Application Filing (Classes 1–45)", "Examination Response", "Opposition Proceedings", "International Filing (Madrid Protocol)", "Trademark Renewal"] },
  { title: "Patents", slug: "patents", pain: "A competitor could file your invention before you do.", description: "Protect your invention before a competitor files it. We handle patent applications, prosecution, opposition and enforcement for inventors and businesses across all industries.", features: ["Patent Drafting & Filing", "Prior Art Search", "Examination Response", "PCT International Filing", "Patent Opposition", "Licensing & Assignment"] },
  { title: "Copyright", slug: "copyright", pain: "Your creative work can be copied without registration.", description: "Your creative work is your property. We register and enforce copyright for artists, authors, software companies and businesses across India.", features: ["Copyright Registration", "Infringement Notices", "DMCA & Online Enforcement", "Licensing Agreements", "Software Copyright", "Content Protection"] },
  { title: "IP Litigation", slug: "litigation", pain: "Infringers are counting on you not fighting back.", description: "When someone steals your IP, we fight back. From district courts to the Supreme Court of India, our litigation team has the expertise to protect your rights.", features: ["Injunction Applications", "District & High Court", "Supreme Court Appearances", "IP Infringement Cases", "Passing Off Actions", "Domain Disputes"] },
  { title: "Business Law", slug: "business-law", pain: "Contracts and compliance issues can derail your business.", description: "Company formation, MSME registration, ISO compliance, franchising and startup law — all under one roof. We make the legal side of running a business simple.", features: ["Company Incorporation", "MSME Registration", "Startup Legal Pack", "Franchise Agreements", "ISO Compliance", "Contract Drafting"] },
  { title: "Designs & GI", slug: "designs-gi", pain: "Your product's distinctive look deserves protection.", description: "Your product's look and geographical origin are just as protectable as its name. We handle industrial design registration and Geographical Indication applications.", features: ["Industrial Design Registration", "Design Infringement", "GI Application Filing", "GI Tag Protection", "Product Design Audit", "International Design"] },
], null, 2);

const TEAM_DEFAULT = JSON.stringify([
  { photo: "/shalini-arora.png", badge: "Founder & Director", name: "Adv. Shalini Arora", title: "B.A.LL.B · Intellectual Property Law Specialist", quote: "Every small business deserves the same IP protection that large corporates get. We built VS Arora & Co. to make that possible.", tags: ["Trademarks", "Patents", "Copyright", "15+ Yrs Exp"] },
  { photo: "/vimesh-arora.jpg", badge: "Co-Founder & Managing Partner", name: "Adv. Vimesh Arora", title: "LL.B · Corporate & Litigation Specialist", quote: "In India's fast-growing economy, your brand is your most valuable asset. Protecting it from day one is not optional — it is essential.", tags: ["Litigation", "Business Law", "Corporate Law", "High Court"] },
], null, 2);

const TESTIMONIALS_DEFAULT = JSON.stringify([
  { name: "Usha Sharma", business: "Usha's Frosting Cakes", location: "Kolkata", service: "Trademark", quote: "I launched my bakery brand and VS Arora filed my trademark within days. When a competitor tried to copy my name, we had full legal protection to fight back.", initial: "U", rating: 5 },
  { name: "Naacho Kids", business: "Children's Brand", location: "West Bengal", service: "Trademark", quote: "Filing trademarks for our kids brand was surprisingly easy with VS Arora & Co. The whole procedure went smoothly and I can now rest knowing our brand is safe and protected.", initial: "N", rating: 5 },
  { name: "Rohit Agarwal", business: "Tech Startup Founder", location: "Kolkata", service: "Business Law", quote: "Adv. Vimesh guided us through the entire company registration and IP filing process. Professional, prompt, and always available to explain what was happening.", initial: "R", rating: 5 },
  { name: "Priya Mehta", business: "Fashion Label", location: "Mumbai", service: "Trademark", quote: "We approached VS Arora & Co. for international trademark filing. They handled the Madrid Protocol application seamlessly. The team is knowledgeable and truly client-first.", initial: "P", rating: 5 },
  { name: "Sandeep Joshi", business: "Software Startup", location: "Bangalore", service: "Copyright", quote: "Our software copyright registration was handled efficiently and on time. VS Arora & Co. explained every step clearly — I always knew exactly where things stood.", initial: "S", rating: 5 },
  { name: "Amit Bose", business: "Manufacturing Co.", location: "Kolkata", service: "Patent", quote: "We had a unique industrial design we needed to protect quickly. The team filed our design application promptly and got us the protection we needed before our product launch.", initial: "A", rating: 5 },
], null, 2);

// default_value = the actual current content from the live site.
// When a section is added, fields are pre-filled so the user immediately sees
// what's currently on the site and can edit from there.
const DEFAULT_FIELDS: Record<string, Array<{ key: string; label: string; type: string; default_value?: string }>> = {
  hero: [
    { key: "headline", label: "Headline", type: "text", default_value: "Your Brand Is Worth Protecting. We Make Sure It Is." },
    { key: "subheadline", label: "Subheadline", type: "textarea", default_value: "VS Arora & Co. helps entrepreneurs, startups and businesses across India register and defend their trademarks, patents, and copyrights — before someone else takes what's rightfully yours." },
    { key: "cta_text", label: "CTA Button Text", type: "text", default_value: "Book Free Consultation" },
    { key: "cta_url", label: "CTA Button URL", type: "url", default_value: "/contact" },
    { key: "background_image", label: "Background Image", type: "image" },
  ],
  about: [
    { key: "title", label: "Section Heading", type: "text", default_value: "IP Protection Should Not Be a Privilege" },
    { key: "content", label: "Body Text", type: "richtext", default_value: "<p>VS Arora &amp; Co. was founded on the belief that every entrepreneur and small business deserves world-class intellectual property protection — not just large corporations with deep pockets.</p><p>Since our founding, we have helped hundreds of businesses across India register and defend their trademarks, patents, and copyrights. We operate with full transparency: no hidden fees, no legal jargon, and no obligation consultations.</p>" },
    { key: "credentials_json", label: "Credentials List (JSON array of strings)", type: "textarea", default_value: JSON.stringify(["Bar Council of India", "PAN India Filing Network", "Madrid Protocol Registered", "SAARC Regional Network", "IPAB Registered Practitioners", "High Court Appearances"], null, 2) },
    { key: "image", label: "Image", type: "image" },
  ],
  services: [
    { key: "title", label: "Section Title", type: "text", default_value: "Our Practice Areas" },
    { key: "subtitle", label: "Subtitle", type: "textarea", default_value: "Comprehensive IP protection — from registration to enforcement." },
    { key: "services_json", label: "Services (JSON array)", type: "textarea", default_value: SERVICES_DEFAULT },
  ],
  team: [
    { key: "title", label: "Section Title", type: "text", default_value: "Meet the People Behind VS Arora & Co." },
    { key: "team_json", label: "Team Members (JSON array)", type: "textarea", default_value: TEAM_DEFAULT },
  ],
  testimonials: [
    { key: "title", label: "Section Title", type: "text", default_value: "What Our Clients Say" },
    { key: "testimonials_json", label: "Testimonials (JSON array)", type: "textarea", default_value: TESTIMONIALS_DEFAULT },
  ],
  stats: [
    { key: "s1_num", label: "Stat 1 — Number", type: "text", default_value: "500+" },
    { key: "s1_label", label: "Stat 1 — Label", type: "text", default_value: "Trademarks Filed" },
    { key: "s2_num", label: "Stat 2 — Number", type: "text", default_value: "15+" },
    { key: "s2_label", label: "Stat 2 — Label", type: "text", default_value: "Years Experience" },
    { key: "s3_num", label: "Stat 3 — Number", type: "text", default_value: "8+" },
    { key: "s3_label", label: "Stat 3 — Label", type: "text", default_value: "Countries Covered" },
    { key: "s4_num", label: "Stat 4 — Number", type: "text", default_value: "100%" },
    { key: "s4_label", label: "Stat 4 — Label", type: "text", default_value: "Free First Consult" },
  ],
  cta: [
    { key: "headline", label: "Headline", type: "text", default_value: "Is Your Brand Protected? Let's Find Out — Free." },
    { key: "description", label: "Description", type: "textarea", default_value: "No obligation. No legal jargon. Just a clear conversation about protecting what you've built." },
    { key: "button_text", label: "Button Text", type: "text", default_value: "Book Free Consultation" },
    { key: "button_url", label: "Button URL", type: "url", default_value: "/contact" },
  ],
  contact: [
    { key: "title", label: "Title", type: "text", default_value: "Contact Us" },
    { key: "email", label: "Email", type: "text", default_value: "trademarks@vsarora.com" },
    { key: "phone", label: "Phone", type: "text", default_value: "+91 9123650220" },
    { key: "address", label: "Address", type: "textarea", default_value: "43/C Sri Gopal Mullick Lane, Kolkata – 700012, West Bengal, India" },
  ],
  footer: [
    { key: "copyright", label: "Copyright Text", type: "text", default_value: "© 2024 V.S. Arora & Co. All rights reserved." },
    { key: "links_json", label: "Footer Links (JSON)", type: "textarea" },
  ],
  gallery: [
    { key: "title", label: "Title", type: "text" },
    { key: "images_json", label: "Images (JSON)", type: "textarea" },
  ],
  faq: [
    { key: "title", label: "Title", type: "text" },
    { key: "faqs_json", label: "FAQs (JSON)", type: "textarea" },
  ],
  custom: [
    { key: "title", label: "Title", type: "text" },
    { key: "content", label: "Content", type: "richtext" },
  ],
};

interface Props {
  pageId: string;
  currentCount: number;
}

export function AddSectionDialog({ pageId, currentCount }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectionType, setSectionType] = useState("");
  const [label, setLabel] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sectionType) return;

    setLoading(true);
    const supabase = createClient();

    const { data: section, error: sectionError } = await supabase
      .from("sections")
      .insert({
        page_id: pageId,
        section_type: sectionType,
        label: label || SECTION_TYPES.find((t) => t.value === sectionType)?.label,
        order_index: currentCount,
      })
      .select()
      .single();

    if (sectionError || !section) {
      toast({ title: "Failed to add section", description: sectionError?.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const defaultFields = DEFAULT_FIELDS[sectionType] || [];
    if (defaultFields.length > 0) {
      const fieldsToInsert = defaultFields.map((f, i) => ({
        section_id: section.id,
        field_key: f.key,
        field_label: f.label,
        field_type: f.type,
        field_value: f.default_value ?? null,  // pre-fill with current live content
        order_index: i,
      }));

      const { error: fieldsError } = await supabase
        .from("section_fields")
        .insert(fieldsToInsert);

      if (fieldsError) {
        toast({ title: "Section created but fields failed", description: fieldsError.message, variant: "destructive" });
      }
    }

    toast({ title: "Section added — fields pre-filled with current site content" });
    setOpen(false);
    setSectionType("");
    setLabel("");
    router.refresh();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Fields are pre-filled with the current live content — edit only what you want to change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Section Type</Label>
              <Select value={sectionType} onValueChange={setSectionType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type..." />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Label (optional)</Label>
              <Input
                placeholder="Custom label..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !sectionType}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
