import { WalletCards } from "lucide-react";
import { useState } from "react";
import { TabelData } from "../components/TabelData";
import { KartuMetrik } from "../components/KartuMetrik";
import { Dialog } from "../components/Dialog";
import type { DataAplikasi, HasilPenukaran, Hadiah, Pengguna } from "../types/domain";
import { labelTanggal } from "../utils/survei";

type HadiahProps = {
  data: DataAplikasi;
  penggunaAktif: Pengguna;
  onTukar: (hadiah: Hadiah) => HasilPenukaran;
};

export function Hadiah({ data, penggunaAktif, onTukar }: HadiahProps) {
  const [hadiahDipilih, setHadiahDipilih] = useState<Hadiah | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const redemptions = data.redemptions.filter((item) => item.userId === penggunaAktif.id);
  const transactions = data.transactions.filter((item) => item.userId === penggunaAktif.id);

  function confirmRedeem() {
    if (!hadiahDipilih) return;
    const result = onTukar(hadiahDipilih);
    setHadiahDipilih(null);
    if (result.ok) {
      setSuccessMessage(result.pesan);
    }
  }

  return (
    <>
      <section className="metric-row">
        <KartuMetrik label="Poin Tersedia" value={String(penggunaAktif.points)} />
        <KartuMetrik label="Hadiah Bisa Ditukar" value={String(data.rewards.length)} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Katalog</p>
          <h2>Tukar poin dengan hadiah</h2>
        </div>
        <div className="hadiah-grid">
          {data.rewards.map((hadiah) => (
            <article className="hadiah-card" key={hadiah.id}>
              <div className="hadiah-icon">
                <WalletCards size={28} />
              </div>
              <h3>{hadiah.name}</h3>
              <p>{hadiah.description}</p>
              <div className="meta-row">
                <strong>{hadiah.pointsCost} poin</strong>
                <span>Stok {hadiah.stock}</span>
              </div>
              <button
                className="primary-button full"
                disabled={penggunaAktif.points < hadiah.pointsCost || hadiah.stock <= 0}
                onClick={() => setHadiahDipilih(hadiah)}
              >
                Tukar Hadiah
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block two-column">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Penukaran</p>
            <h2>Riwayat hadiah</h2>
          </div>
          <TabelData
            headers={["Hadiah", "Poin", "Status", "Tanggal"]}
            rows={redemptions.map((item) => {
              const hadiah = data.rewards.find((entry) => entry.id === item.rewardId);
              return [hadiah?.name ?? "-", String(item.pointsSpent), item.status, labelTanggal(item.createdAt)];
            })}
            empty="Belum ada penukaran hadiah."
          />
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Poin</p>
            <h2>Riwayat transaksi</h2>
          </div>
          <TabelData
            headers={["Keterangan", "Poin"]}
            rows={transactions.map((item) => [item.description, String(item.amount)])}
            empty="Belum ada transaksi poin."
          />
        </div>
      </section>

      {hadiahDipilih && (
        <Dialog
          title="Konfirmasi penukaran"
          confirmText="Ya, tukar hadiah"
          onClose={() => setHadiahDipilih(null)}
          onConfirm={confirmRedeem}
        >
          <p>
            Kamu akan menukar <strong>{hadiahDipilih.pointsCost} poin</strong> dengan{" "}
            <strong>{hadiahDipilih.name}</strong>.
          </p>
        </Dialog>
      )}

      {successMessage && (
        <Dialog title="Penukaran berhasil" confirmText="Mengerti" onClose={() => setSuccessMessage("")}>
          <p>{successMessage}</p>
        </Dialog>
      )}
    </>
  );
}
