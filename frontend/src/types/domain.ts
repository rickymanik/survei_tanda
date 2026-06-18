export type JenisPertanyaan = "single" | "multiple" | "text";

export type Pengguna = {
  id: string;
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  city: string;
  occupation: string;
  points: number;
};

export type Pertanyaan = {
  id: string;
  text: string;
  type: JenisPertanyaan;
  required: boolean;
  options: string[];
};

export type Survei = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  targetCount: number;
  closeDate: string;
  pointsReward: number;
  createdAt: string;
  questions: Pertanyaan[];
};

export type JawabanSurvei = {
  id: string;
  surveyId: string;
  userId: string;
  createdAt: string;
  answers: Record<string, string | string[]>;
};

export type Hadiah = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
};

export type TransaksiPoin = {
  id: string;
  userId: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type PenukaranHadiah = {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  status: "diproses" | "selesai";
  createdAt: string;
};

export type DataAplikasi = {
  users: Pengguna[];
  surveys: Survei[];
  responses: JawabanSurvei[];
  rewards: Hadiah[];
  transactions: TransaksiPoin[];
  redemptions: PenukaranHadiah[];
};

export type RuteAplikasi =
  | { name: "masuk" }
  | { name: "daftar" }
  | { name: "beranda" }
  | { name: "survei-saya" }
  | { name: "buat-survei" }
  | { name: "isi-survei"; surveyId: string }
  | { name: "detail-survei"; surveyId: string }
  | { name: "hadiah" }
  | { name: "profil" };

export type HasilPenukaran = {
  ok: boolean;
  pesan: string;
};
