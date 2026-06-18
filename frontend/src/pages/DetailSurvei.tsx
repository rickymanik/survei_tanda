import { ArrowLeft } from "lucide-react";
import type { DataAplikasi, Survei, Pengguna } from "../types/domain";
import { labelTanggal, formatJawaban, hitungPoinSurvei, persentaseOpsi } from "../utils/survei";

type DetailSurveiProps = {
  data: DataAplikasi;
  penggunaAktif: Pengguna;
  survey: Survei;
  onKembaliKeSurvei: () => void;
};

export function DetailSurvei({ data, penggunaAktif, survey, onKembaliKeSurvei }: DetailSurveiProps) {
  const responses = data.responses.filter((response) => response.surveyId === survey.id);
  const isOwner = survey.ownerId === penggunaAktif.id;

  return (
    <>
      <section className="section-block">
        <button className="ghost-button back-button" onClick={onKembaliKeSurvei}>
          <ArrowLeft size={18} />
          Kembali ke Survei Saya
        </button>

        <div className="detail-hero">
          <div>
            <p className="eyebrow">{survey.category || "Survei"}</p>
            <h2>{survey.title}</h2>
            <p>{survey.description}</p>
          </div>
          <div className="detail-stat">
            <strong>
              {responses.length}/{survey.targetCount}
            </strong>
            <span>Responden</span>
          </div>
        </div>

        <div className="detail-meta-grid">
          <span>Hadiah responden: {hitungPoinSurvei(survey)} poin</span>
          <span>Jumlah pertanyaan: {survey.questions.length}</span>
          <span>Tanggal tutup: {labelTanggal(survey.closeDate)}</span>
        </div>

        <div className="question-preview">
          {survey.questions.map((question, index) => (
            <article className="question-read" key={question.id}>
              <p className="eyebrow">Pertanyaan {index + 1}</p>
              <h3>{question.text}</h3>
              {question.type === "text" ? (
                <p className="muted">Jawaban teks bebas</p>
              ) : (
                <div className="option-list">
                  {question.options.map((option) => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {isOwner && (
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Laporan</p>
            <h2>Persentase hasil survei</h2>
          </div>
          {responses.length === 0 && <p className="empty-state">Belum ada data untuk dibuat laporan.</p>}
          {responses.length > 0 && (
            <div className="report-list">
              {survey.questions.map((question, index) => {
                const answers = responses.map((response) => response.answers[question.id]);
                return (
                  <article className="report-card" key={question.id}>
                    <h3>
                      Pertanyaan {index + 1}: {question.text}
                    </h3>
                    {question.type === "text" ? (
                      <p>{answers.filter(Boolean).length} jawaban teks terkumpul.</p>
                    ) : (
                      <div className="report-options">
                        {persentaseOpsi(question, answers).map((item) => (
                          <div className="report-option" key={item.option}>
                            <div className="meta-row">
                              <span>{item.option}</span>
                              <strong>{item.percent}%</strong>
                            </div>
                            <div className="progress-bar">
                              <span style={{ width: `${item.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {isOwner && (
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Hasil</p>
            <h2>Jawaban responden</h2>
          </div>
          {responses.length === 0 && <p className="empty-state">Belum ada responden yang mengisi survei ini.</p>}
          {responses.map((response) => {
            const respondent = data.users.find((user) => user.id === response.userId);
            return (
              <details className="response-item" key={response.id}>
                <summary>
                  {respondent?.name ?? "Responden"} - {respondent?.city || "Kota tidak diisi"} -{" "}
                  {labelTanggal(response.createdAt)}
                </summary>
                {survey.questions.map((question) => (
                  <div className="answer-row" key={question.id}>
                    <strong>{question.text}</strong>
                    <p>{formatJawaban(response.answers[question.id])}</p>
                  </div>
                ))}
              </details>
            );
          })}
        </section>
      )}
    </>
  );
}
