import type { DataAplikasi, Pertanyaan, Survei } from "../types/domain";

export function hitungPoinSurvei(survey: Pick<Survei, "questions">) {
  return Math.max(10, survey.questions.length * 10);
}

export function hitungJawaban(data: DataAplikasi, surveyId: string) {
  return data.responses.filter((response) => response.surveyId === surveyId).length;
}

export function surveiMasihBuka(survey: Survei, responseCount: number) {
  if (responseCount >= survey.targetCount) return false;
  if (!survey.closeDate) return true;

  const close = new Date(`${survey.closeDate}T23:59:59`);
  return close >= new Date();
}

export function tanggalHariIniUntukInput() {
  return new Date().toISOString().slice(0, 10);
}

export function labelTanggal(dateIso: string) {
  if (!dateIso) return "Tidak ditentukan";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateIso));
}

export function formatJawaban(value: string | string[] | undefined) {
  if (!value) return "-";
  return Array.isArray(value) ? value.join(", ") : value;
}

export function persentaseOpsi(question: Pertanyaan, answers: Array<string | string[] | undefined>) {
  const respondentCount = answers.length || 1;

  return question.options.map((option) => {
    const count = answers.filter((answer) => {
      if (Array.isArray(answer)) return answer.includes(option);
      return answer === option;
    }).length;

    return {
      option,
      count,
      percent: Math.round((count / respondentCount) * 100)
    };
  });
}
