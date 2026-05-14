import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TabelData } from "../components/TabelData";
import { KartuMetrik } from "../components/KartuMetrik";
import type { DataAplikasi, Pengguna } from "../types/domain";
import { hitungJawaban, labelTanggal, hitungPoinSurvei, surveiMasihBuka } from "../utils/survei";

type BerandaProps = {
  data: DataAplikasi;
  penggunaAktif: Pengguna;
  onBuat: () => void;
  onIsi: (surveyId: string) => void;
  onDetail: (surveyId: string) => void;
};

export function Beranda({ data, penggunaAktif, onBuat, onIsi, onDetail }: BerandaProps) {
  const [query, setQuery] = useState("");
  const mySurveys = data.surveys.filter((survey) => survey.ownerId === penggunaAktif.id);
  const transactions = data.transactions.filter((item) => item.userId === penggunaAktif.id).slice(0, 5);

  const visibleSurveys = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return data.surveys
      .filter((survey) => surveiMasihBuka(survey, hitungJawaban(data, survey.id)))
      .filter((survey) => {
        if (!normalizedQuery) return true;
        const owner = data.users.find((user) => user.id === survey.ownerId);
        return [survey.title, survey.description, survey.category, owner?.name]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [data, query]);

  return (
    <>
      <section className="metric-row">
        <KartuMetrik label="Poin Saya" value={String(penggunaAktif.points)} />
        <KartuMetrik label="Survei Saya" value={String(mySurveys.length)} />
        <KartuMetrik label="Hadiah Tersedia" value={String(data.rewards.length)} />
      </section>

      <section className="section-block">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Survei publik</p>
            <h2>Isi survei dan dapatkan poin</h2>
          </div>
          <button className="primary-button icon-button" onClick={onBuat}>
            <Plus size={18} />
            Buat Survei
          </button>
        </div>

        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari survei berdasarkan judul, kategori, deskripsi, atau pembuat"
          />
        </label>

        <div className="survey-grid">
          {visibleSurveys.map((survey) => {
            const owner = data.users.find((user) => user.id === survey.ownerId);
            const responseCount = hitungJawaban(data, survey.id);
            const answeredByMe = data.responses.some(
              (response) => response.surveyId === survey.id && response.userId === penggunaAktif.id
            );
            const mine = survey.ownerId === penggunaAktif.id;
            const poinHadiah = hitungPoinSurvei(survey);

            return (
              <article className="survey-card" key={survey.id}>
                <div className="survey-card-top">
                  <span className="pill">{survey.category || "Umum"}</span>
                  <strong>+{poinHadiah} poin</strong>
                </div>
                <h3>{survey.title}</h3>
                <p>{survey.description}</p>
                <div className="meta-row">
                  <span>{owner?.name ?? "Pengguna"}</span>
                  <span>
                    {responseCount}/{survey.targetCount} responden
                  </span>
                </div>
                <div className="meta-row muted-row">
                  <span>{survey.questions.length} pertanyaan</span>
                  <span>Tutup: {labelTanggal(survey.closeDate)}</span>
                </div>
                {mine ? (
                  <button className="ghost-button full" onClick={() => onDetail(survey.id)}>
                    Lihat Survei Saya
                  </button>
                ) : answeredByMe ? (
                  <button className="ghost-button full" disabled>
                    Sudah Diisi
                  </button>
                ) : (
                  <button className="primary-button full" onClick={() => onIsi(survey.id)}>
                    Isi Survei
                  </button>
                )}
              </article>
            );
          })}
          {visibleSurveys.length === 0 && <p className="empty-state">Tidak ada survei yang cocok dengan pencarian.</p>}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Aktivitas</p>
          <h2>Riwayat poin terbaru</h2>
        </div>
        <TabelData
          headers={["Keterangan", "Poin", "Tanggal"]}
          rows={transactions.map((item) => [item.description, String(item.amount), labelTanggal(item.createdAt)])}
          empty="Belum ada transaksi poin."
        />
      </section>
    </>
  );
}
