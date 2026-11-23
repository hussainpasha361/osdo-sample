"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Studio local time, e.g. "KHI 14:32". Renders a stable placeholder on the server. */
export default function Clock({ seconds = false }: { seconds?: boolean }) {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: seconds ? "2-digit" : undefined,
      hour12: false,
      timeZone: site.timeZone,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);
  return (
    <span className="clock">
      {site.cityCode} <time suppressHydrationWarning>{t ?? (seconds ? "--:--:--" : "--:--")}</time>
    </span>
  );
}
