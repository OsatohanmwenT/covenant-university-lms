export interface Resource {
  resourceId: number;
  title: string;
  author: string | null;
  description: string | null;
  resourceImage: string | null;
  category: string | null;
  format: string | null;
  location: string | null;
  status: string | null;
  publicationDate: Date | null
}
