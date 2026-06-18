import { useState } from "react";
import type { DataAplikasi } from "../types/domain";
import { ambilDataAplikasi, simpanDataAplikasi } from "../utils/penyimpanan";

export function useDataAplikasi() {
  const [data, setData] = useState<DataAplikasi>(() => ambilDataAplikasi());

  function commit(nextData: DataAplikasi) {
    setData(nextData);
    simpanDataAplikasi(nextData);
  }

  return { data, commit };
}
