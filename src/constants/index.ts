export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  role: "Role",
  password: "Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  role: "select",
  email: "email",
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

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/resources",
    text: "All Resources",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/borrow-records",
    text: "Borrow Records",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];