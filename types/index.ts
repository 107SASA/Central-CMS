export type Role = "admin" | "editor";
export type ContentStatus = "draft" | "published";
export type FieldType = "text" | "textarea" | "richtext" | "image" | "url" | "boolean" | "number";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Website {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  api_key: string;
  deploy_hook_url: string | null;
  revalidate_url: string | null;
  revalidate_secret: string | null;
  preview_url: string | null;
  preview_secret: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  website_id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  page_id: string;
  section_type: string;
  label: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  fields?: SectionField[];
}

export interface SectionField {
  id: string;
  section_id: string;
  field_key: string;
  field_type: FieldType;
  field_value: string | null;
  field_label: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  website_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_id: string | null;
  published_at: string | null;
  status: ContentStatus;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Media {
  id: string;
  website_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface ActivityLog {
  id: string;
  website_id: string | null;
  user_id: string | null;
  user_email: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_label: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  website?: { name: string; slug: string } | null;
}

// API response shapes
export interface ApiPageResponse {
  id: string;
  title: string;
  slug: string;
  meta: {
    title: string | null;
    description: string | null;
    og_image: string | null;
  };
  sections: ApiSection[];
}

export interface ApiSection {
  type: string;
  label: string | null;
  order: number;
  fields: Record<string, string | null>;
}

export interface ApiBlogResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  meta: {
    title: string | null;
    description: string | null;
  };
}
