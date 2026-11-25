import { type LinkOptions } from "@tanstack/react-router";
import { FileText, Pin, Trash, type LucideIcon } from "lucide-react";

type NavLink = {
  label: string;
  icon: LucideIcon;
  search: LinkOptions["search"];
};

export const navLinks: NavLink[] = [
  {
    search: { p: "all" },
    label: "Pages",
    icon: FileText,
  },
  {
    search: { p: "pinned" },
    label: "Pinned",
    icon: Pin,
  },
  {
    search: { p: "trash" },
    label: "Trash",
    icon: Trash,
  },
] as const;
