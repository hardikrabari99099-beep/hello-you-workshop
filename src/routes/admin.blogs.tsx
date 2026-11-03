import { createFileRoute } from "@tanstack/react-router";
import { AdminBlogs } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/blogs")({
  ssr: false,
  head: () => ({ meta: [{ title: "Blogs — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin blogs management." }, { property: "og:title", content: "Blogs — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin blogs management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminBlogs,
});
