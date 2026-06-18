import { Plus, Trash2 } from "lucide-react";
import { TabelData } from "../components/TabelData";
import type { DataAplikasi, Pengguna } from "../types/domain";
import { hitungJawaban, hitungPoinSurvei } from "../utils/survei";

type SurveiSayaProps = {
  data: DataAplikasi;
  penggunaAktif: Pengguna;
  onBuat: () => void;
  onDetail: (surveyId: string) => void;
  onHapus: (surveyId: string) => void;
};

export function SurveiSaya({ data, penggunaAktif, onBuat, onDetail, onHapus }: SurveiSayaProps) {
  const surveys = data.surveys.filter((survey) => survey.ownerId === penggunaAktif.id);

  return (
    <section className="section-block">
      <div className="section-heading row-heading">
        <div>
          <p className="eyebrow">Kelola survei</p>
          <h2>Survei yang kamu buat</h2>
        </div>
        <button className="primary-button icon-button" onClick={onBuat}>
          <Plus size={18} />
          Buat Survei
        </button>
      </div>

      <TabelData
        headers={["Judul", "Kategori", "Responden", "Hadiah", "Status", "Aksi"]}
        rows={surveys.map((survey) => [
          survey.title,
          survey.category || "Umum",
          `${hitungJawaban(data, survey.id)}/${survey.targetCount}`,
          `${hitungPoinSurvei(survey)} poin`,
          "Diposting",
          <div className="table-actions" key={survey.id}>
            <button className="ghost-button table-action" onClick={() => onDetail(survey.id)}>
              Detail
            </button>
            <button className="danger-button table-action" onClick={() => onHapus(survey.id)}>
              <Trash2 size={15} />
              Hapus
            </button>
          </div>
        ])}
        empty="Belum ada survei. Buat survei pertamamu."
      />
    </section>
  );
}
