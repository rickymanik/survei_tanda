import { dataAwal } from "../data/dataAwal";
import type { DataAplikasi } from "../types/domain";

const STORAGE_KEY = "tanda_survei_data";
const BACKUP_KEY = "tanda_survei_cadangan";
const SESSION_KEY = "tanda_sesi_pengguna";
const LEGACY_STORAGE_KEY = "tanda-survey-tsx-data";
const LEGACY_BACKUP_KEY = "tanda-survey-tsx-data-backup";
const LEGACY_SESSION_KEY = "tanda-survey-tsx-user";

function isAppData(value: unknown): value is DataAplikasi {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DataAplikasi>;
  return (
    Array.isArray(candidate.users) &&
    Array.isArray(candidate.surveys) &&
    Array.isArray(candidate.responses) &&
    Array.isArray(candidate.rewards) &&
    Array.isArray(candidate.transactions) &&
    Array.isArray(candidate.redemptions)
  );
}

function parseStoredData(raw: string | null) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isAppData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeData(data: DataAplikasi): DataAplikasi {
  return {
    users: data.users ?? [],
    surveys: (data.surveys ?? []).map((survey) => ({
      ...survey,
      pointsReward: Math.max(10, survey.questions.length * 10)
    })),
    responses: data.responses ?? [],
    rewards: data.rewards ?? [],
    transactions: data.transactions ?? [],
    redemptions: data.redemptions ?? []
  };
}

export function ambilDataAplikasi() {
  const primary = parseStoredData(localStorage.getItem(STORAGE_KEY));
  const backup = parseStoredData(localStorage.getItem(BACKUP_KEY));
  const legacyPrimary = parseStoredData(localStorage.getItem(LEGACY_STORAGE_KEY));
  const legacyBackup = parseStoredData(localStorage.getItem(LEGACY_BACKUP_KEY));
  return normalizeData(primary ?? backup ?? legacyPrimary ?? legacyBackup ?? dataAwal);
}

export function simpanDataAplikasi(data: DataAplikasi) {
  const normalized = normalizeData(data);
  const serialized = JSON.stringify(normalized);
  localStorage.setItem(STORAGE_KEY, serialized);
  localStorage.setItem(BACKUP_KEY, serialized);
}

export function ambilSesiPengguna() {
  return localStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LEGACY_SESSION_KEY);
}

export function simpanSesiPengguna(userId: string) {
  localStorage.setItem(SESSION_KEY, userId);
}

export function hapusSesiPengguna() {
  localStorage.removeItem(SESSION_KEY);
}
