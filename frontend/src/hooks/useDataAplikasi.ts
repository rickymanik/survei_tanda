import { useEffect, useState } from "react";
import { loadDataAplikasi } from "../api/client";
import type { DataAplikasi } from "../types/domain";
import { ambilDataAplikasi, simpanDataAplikasi } from "../utils/penyimpanan";

export function useDataAplikasi() {
  const [data, setData] = useState<DataAplikasi>(() => ambilDataAplikasi());
  const [sedangSinkron, setSedangSinkron] = useState(true);
  const [apiTersedia, setApiTersedia] = useState(false);

  async function refreshData() {
    setSedangSinkron(true);

    try {
      const nextData = await loadDataAplikasi();
      setData(nextData);
      simpanDataAplikasi(nextData);
      setApiTersedia(true);
      return nextData;
    } catch {
      setApiTersedia(false);
      return data;
    } finally {
      setSedangSinkron(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, []);

  function commit(nextData: DataAplikasi) {
    setData(nextData);
    simpanDataAplikasi(nextData);
  }

  return { data, commit, refreshData, sedangSinkron, apiTersedia };
}
