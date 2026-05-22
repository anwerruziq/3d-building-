import { createFileRoute } from "@tanstack/react-router";
import CityExperience from "@/components/city/CityExperience";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "الأفق العقارية — تطوير عقاري برؤية عصرية" },
      {
        name: "description",
        content:
          "جولة افتراضية في مشاريع الأفق العقارية. اكتشف الفخامة والتصميم العصري في مشاريعنا العقارية.",
      },
      { property: "og:title", content: "الأفق العقارية — حيث تبدأ استثماراتك بخطوة واثقة" },
      { property: "og:description", content: "جولة افتراضية في مشاريع الأفق العقارية." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
});

function Index() {
  return <CityExperience />;
}
