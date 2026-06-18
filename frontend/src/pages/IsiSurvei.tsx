import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Survei } from "../types/domain";
import { hitungPoinSurvei } from "../utils/survei";

type IsiSurveiProps = {
  survey: Survei;
  onKembaliBeranda: () => void;
  onSubmit: (surveyId: string, answers: Record<string, string | string[]>) => void;
};

export function IsiSurvei({ survey, onKembaliBeranda, onSubmit }: IsiSurveiProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  function toggleMultiple(questionId: string, option: string, checked: boolean) {
    const current = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : [];
    setAnswers({
      ...answers,
      [questionId]: checked ? [...current, option] : current.filter((item) => item !== option)
    });
  }

  return (
    <section className="section-block">
      <button className="ghost-button back-button" onClick={onKembaliBeranda}>
        <ArrowLeft size={18} />
        Kembali ke Beranda
      </button>

      <div className="detail-hero">
        <div>
          <p className="eyebrow">{survey.category || "Survei"}</p>
          <h2>{survey.title}</h2>
          <p>{survey.description}</p>
        </div>
        <div className="detail-stat">
          <strong>+{hitungPoinSurvei(survey)}</strong>
          <span>Poin</span>
        </div>
      </div>

      <form
        className="form-stack wide-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(survey.id, answers);
        }}
      >
        {survey.questions.map((question) => (
          <fieldset className="question-answer" key={question.id}>
            <legend>{question.text}</legend>
            {question.type === "text" && (
              <textarea
                rows={4}
                required={question.required}
                value={(answers[question.id] as string) ?? ""}
                onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
              />
            )}
            {question.type === "single" &&
              question.options.map((option) => (
                <label className="choice-label" key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    required={question.required}
                    value={option}
                    onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
                  />
                  {option}
                </label>
              ))}
            {question.type === "multiple" &&
              question.options.map((option) => (
                <label className="choice-label" key={option}>
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(event) => toggleMultiple(question.id, option, event.target.checked)}
                  />
                  {option}
                </label>
              ))}
          </fieldset>
        ))}
        <button className="primary-button">Kirim Jawaban dan Ambil Poin</button>
      </form>
    </section>
  );
}
