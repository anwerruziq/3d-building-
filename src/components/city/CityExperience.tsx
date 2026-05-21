import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";

const CityScene = lazy(() => import("./CityScene"));

export default function CityExperience() {
  const scrollRef = useRef(0);
  const lookRef = useRef(0);

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingScreen />}>
          <CityScene scrollRef={scrollRef} lookRef={lookRef} />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.08_0.04_260/_0.7)_100%)]" />
      </div>
      <Overlay scrollRef={scrollRef} lookRef={lookRef} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-mono text-xs tracking-[0.4em] text-primary/80 mb-4 flicker">
          جاري تحميل الجولة الافتراضية للمشروع...
        </div>
        <div className="h-px w-64 bg-primary/20 mx-auto overflow-hidden">
          <div className="h-full w-1/3 bg-primary shadow-[0_0_10px_var(--primary)] animate-[slide-in-right_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
