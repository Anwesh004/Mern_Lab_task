import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/components/AuthPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Account Portal — Create your account" },
      { name: "description", content: "Create or access your account in a moment." },
      { property: "og:title", content: "Account Portal" },
      { property: "og:description", content: "Create or access your account in a moment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});
