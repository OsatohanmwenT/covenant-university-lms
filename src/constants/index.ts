export const FIELD_NAMES = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
};

export const FIELD_TYPES = {
  firstName: "text",
  lastName: "text",
  email: "email",
  universityId: "string",
  password: "password",
};

export const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Web Development", value: "Web Development" },
  { label: "Programming", value: "Programming" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "System Design", value: "System Design" },
  { label: "Software", value: "Software" },
  // Add more categories as needed
];

export const formatOptions = [
  { label: "All Formats", value: " " },
  { label: "Book", value: "Book" },
  { label: "eBook", value: "eBook" },
  { label: "Audio", value: "Audio" },
  // Add more formats as needed
];

export type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

export const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};