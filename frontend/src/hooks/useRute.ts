import { useEffect, useState } from "react";
import type { RuteAplikasi } from "../types/domain";
import { uraiRute, jalurRute } from "../utils/rute";

export function useRute() {
  const [route, setRoute] = useState<RuteAplikasi>(() => uraiRute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(uraiRute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextRoute: RuteAplikasi) {
    const path = jalurRute(nextRoute);
    window.history.pushState({}, "", path);
    setRoute(nextRoute);
  }

  return { route, navigate };
}
