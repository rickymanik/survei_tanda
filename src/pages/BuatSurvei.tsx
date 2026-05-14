import { useState } from "react";
import type { Pertanyaan, JenisPertanyaan, Survei } from "../types/domain";
import { buatIdBaru } from "../utils/id";
import { hitungPoinSurvei, tanggalHariIniUntukInput } from "../utils/survei";

type BuatSurveiProps = {
  onSubmit: (survey: Omit<Survei, "id" | "ownerId" | "createdAt" | "pointsReward">) => void;
};

export function BuatSurvei({ onSubmit }: BuatSurveiProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetCount, setTargetCount] = useState(50);
  const [closeDate, setCloseDate] = useState(tanggalHariIniUntukInput());
  const [questions, setQuestions] = useState<Pertanyaan[]>([
    { id: buatIdBaru("q"), text: "", type: "single", required: true, options: [""] }
  ]);

  const estimasiPoin = hitungPoinSurvei({ questions: questions.filter((question) => question.text.trim()) });

  function updateQuestion(questionId: string, patch: Partial<Pertanyaan>) {
    setQuestions((items) => items.map((item) => (item.id === questionId ? { ...item, ...patch } : item)));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({
      title,
      description,
      category,
      targetCount,
      closeDate,
      questions: questions
        .filter((question) => question.text.trim())
        .map((question) => ({
          ...question,
          options: question.type === "text" ? [] : question.options.map((option) => option.trim()).filter(Boolean)
        }))
    });
  }

  return (
    <section className="section-block">
      <div className="section-heading row-heading">
        <div>
          <p className="eyebrow">Survei baru</p>
          <h2>Informasi survei</h2>
          <p>Survei langsung diposting ke beranda setelah disimpan.</p>
        </div>
        <div className="detail-stat compact-stat">
          <strong>{estimasiPoin}</strong>
          <span>Estimasi poin responden</span>
        </div>
      </div>

      <form className="form-stack wide-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Judul Survei
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Kategori
            <input value={category} onChange={(event) => setCategory(event.target.value)} />
          </label>
        </div>
        <label>
          Deskripsi
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} required />
        </label>
        <div className="form-grid">
          <label>
            Target Responden
            <input
              type="number"
              min={1}
              value={targetCount}
              onChange={(event) => setTargetCount(Number(event.target.value))}
              required
            />
          </label>
          <label>
            Tanggal Tutup
            <input
              type="date"
              min={tanggalHariIniUntukInput()}
              value={closeDate}
              onChange={(event) => setCloseDate(event.target.value)}
              required
            />
          </label>
        </div>

        <div className="section-heading compact">
          <p className="eyebrow">Pertanyaan</p>
          <h2>Susun pertanyaan survei</h2>
          <p>Bobot poin dihitung otomatis: 1 pertanyaan bernilai 10 poin.</p>
        </div>

        <div className="question-builder">
          {questions.map((question, index) => (
            <article className="question-item" key={question.id}>
              <div className="form-grid">
                <label>
                  Teks Pertanyaan
                  <input
                    value={question.text}
                    onChange={(event) => updateQuestion(question.id, { text: event.target.value })}
                    required={index === 0}
                  />
                </label>
                <label>
                  Jenis Jawaban
                  <select
                    value={question.type}
                    onChange={(event) => updateQuestion(question.id, { type: event.target.value as JenisPertanyaan })}
                  >
                    <option value="single">Pilihan Ganda</option>
                    <option value="multiple">Kotak Centang</option>
                    <option value="text">Jawaban Teks</option>
                  </select>
                </label>
              </div>
              {question.type !== "text" && (
                <label>
                  Opsi Jawaban
                  <textarea
                    rows={4}
                    value={question.options.join("\n")}
                    onChange={(event) => updateQuestion(question.id, { options: event.target.value.split("\n") })}
                    placeholder="Satu opsi per baris"
                  />
                </label>
              )}
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(event) => updateQuestion(question.id, { required: event.target.checked })}
                />
                Wajib diisi
              </label>
            </article>
          ))}
        </div>

        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              setQuestions([...questions, { id: buatIdBaru("q"), text: "", type: "single", required: true, options: [""] }])
            }
          >
            Tambah Pertanyaan
          </button>
          <button className="primary-button">Posting Survei</button>
        </div>
      </form>
    </section>
  );
}
