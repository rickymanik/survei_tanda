import type {
  DataAplikasi,
  Hadiah,
  JawabanSurvei,
  Pengguna,
  Pertanyaan,
  PenukaranHadiah,
  Survei,
  TransaksiPoin
} from "../types/domain";
import { hitungPoinSurvei } from "../utils/survei";
import { apiRequest } from ".";

type ApiUser = {
  id: number | string;
  name: string;
  email: string;
  age?: string | null;
  gender?: string | null;
  city?: string | null;
  occupation?: string | null;
  points?: number | null;
  is_admin?: boolean | null;
};

type ApiQuestion = {
  id: number | string;
  text: string;
  question_type: Pertanyaan["type"];
  required?: boolean | null;
  options?: string[] | null;
};

type ApiSurvey = {
  id: number | string;
  user_id: number | string;
  title: string;
  description: string;
  category?: string | null;
  target_count?: number | null;
  close_date?: string | null;
  points_reward?: number | null;
  created_at?: string | null;
  questions?: ApiQuestion[];
  responses?: ApiResponse[];
};

type ApiResponse = {
  id: number | string;
  survey_id: number | string;
  user_id: number | string;
  answers?: Record<string, string | string[]> | null;
  created_at?: string | null;
};

type ApiReward = {
  id: number | string;
  name: string;
  description: string;
  points_cost: number;
  stock: number;
};

type ApiRedemption = {
  id: number | string;
  user_id: number | string;
  reward_id: number | string;
  points_spent: number;
  status: PenukaranHadiah["status"];
  created_at?: string | null;
};

type ApiPointTransaction = {
  id: number | string;
  user_id: number | string;
  amount: number;
  description: string;
  created_at?: string | null;
};

function id(value: number | string) {
  return String(value);
}

function toUser(user: ApiUser): Pengguna {
  return {
    id: id(user.id),
    name: user.name,
    email: user.email,
    password: "",
    age: user.age ?? "",
    gender: user.gender ?? "",
    city: user.city ?? "",
    occupation: user.occupation ?? "",
    points: user.points ?? 0,
    isAdmin: Boolean(user.is_admin)
  };
}

function toQuestion(question: ApiQuestion): Pertanyaan {
  return {
    id: id(question.id),
    text: question.text,
    type: question.question_type,
    required: Boolean(question.required),
    options: question.options ?? []
  };
}

function toResponse(response: ApiResponse): JawabanSurvei {
  return {
    id: id(response.id),
    surveyId: id(response.survey_id),
    userId: id(response.user_id),
    answers: response.answers ?? {},
    createdAt: response.created_at ?? new Date().toISOString()
  };
}

function toSurvey(survey: ApiSurvey): Survei {
  const questions = (survey.questions ?? []).map(toQuestion);

  return {
    id: id(survey.id),
    ownerId: id(survey.user_id),
    title: survey.title,
    description: survey.description,
    category: survey.category ?? "",
    targetCount: survey.target_count ?? 0,
    closeDate: survey.close_date ?? "",
    pointsReward: survey.points_reward ?? hitungPoinSurvei({ questions }),
    createdAt: survey.created_at ?? new Date().toISOString(),
    questions
  };
}

function toReward(reward: ApiReward): Hadiah {
  return {
    id: id(reward.id),
    name: reward.name,
    description: reward.description,
    pointsCost: reward.points_cost,
    stock: reward.stock
  };
}

function toRedemption(redemption: ApiRedemption): PenukaranHadiah {
  return {
    id: id(redemption.id),
    userId: id(redemption.user_id),
    rewardId: id(redemption.reward_id),
    pointsSpent: redemption.points_spent,
    status: redemption.status,
    createdAt: redemption.created_at ?? new Date().toISOString()
  };
}

function toTransaction(transaction: ApiPointTransaction): TransaksiPoin {
  return {
    id: id(transaction.id),
    userId: id(transaction.user_id),
    amount: transaction.amount,
    description: transaction.description,
    createdAt: transaction.created_at ?? new Date().toISOString()
  };
}

function surveyPayload(ownerId: string, payload: Omit<Survei, "id" | "ownerId" | "createdAt" | "pointsReward">) {
  return {
    user_id: ownerId,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    target_count: payload.targetCount,
    close_date: payload.closeDate || null,
    questions_attributes: payload.questions.map((question) => ({
      text: question.text,
      question_type: question.type,
      required: question.required,
      options: question.options
    }))
  };
}

export async function loadDataAplikasi(): Promise<DataAplikasi> {
  const [users, surveys, responses, rewards, redemptions, transactions] = await Promise.all([
    apiRequest<ApiUser[]>("/users"),
    apiRequest<ApiSurvey[]>("/surveys"),
    apiRequest<ApiResponse[]>("/responses"),
    apiRequest<ApiReward[]>("/rewards"),
    apiRequest<ApiRedemption[]>("/redemptions"),
    apiRequest<ApiPointTransaction[]>("/point_transactions")
  ]);

  return {
    users: users.map(toUser),
    surveys: surveys.map(toSurvey),
    responses: responses.map(toResponse),
    rewards: rewards.map(toReward),
    redemptions: redemptions.map(toRedemption),
    transactions: transactions.map(toTransaction)
  };
}

export async function loginUser(payload: { email: string; password: string }) {
  return toUser(await apiRequest<ApiUser>("/login", { method: "POST", body: JSON.stringify(payload) }));
}

export async function registerUser(payload: Omit<Pengguna, "id" | "points" | "isAdmin">) {
  return toUser(await apiRequest<ApiUser>("/register", { method: "POST", body: JSON.stringify({ user: payload }) }));
}

export async function updateUserProfile(
  userId: string,
  payload: Pick<Pengguna, "name" | "age" | "gender" | "city" | "occupation">
) {
  return toUser(await apiRequest<ApiUser>(`/users/${userId}`, { method: "PATCH", body: JSON.stringify({ user: payload }) }));
}

export async function changeUserPassword(userId: string, currentPassword: string, nextPassword: string) {
  await apiRequest(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify({ current_password: currentPassword, password: nextPassword })
  });
}

export async function createSurvey(ownerId: string, payload: Omit<Survei, "id" | "ownerId" | "createdAt" | "pointsReward">) {
  return toSurvey(
    await apiRequest<ApiSurvey>("/surveys", {
      method: "POST",
      body: JSON.stringify({ survey: surveyPayload(ownerId, payload) })
    })
  );
}

export async function deleteSurvey(surveyId: string) {
  await apiRequest(`/surveys/${surveyId}`, { method: "DELETE" });
}

export async function createResponse(surveyId: string, userId: string, answers: Record<string, string | string[]>) {
  return toResponse(
    await apiRequest<ApiResponse>(`/surveys/${surveyId}/responses`, {
      method: "POST",
      body: JSON.stringify({ response: { user_id: userId, answers } })
    })
  );
}

export async function createRedemption(userId: string, rewardId: string) {
  return toRedemption(
    await apiRequest<ApiRedemption>("/redemptions", {
      method: "POST",
      body: JSON.stringify({ redemption: { user_id: userId, reward_id: rewardId } })
    })
  );
}

export async function createReward(
  adminId: string,
  payload: Pick<Hadiah, "name" | "description" | "pointsCost" | "stock">
) {
  return toReward(
    await apiRequest<ApiReward>("/rewards", {
      method: "POST",
      body: JSON.stringify({
        admin_id: adminId,
        reward: {
          name: payload.name,
          description: payload.description,
          points_cost: payload.pointsCost,
          stock: payload.stock
        }
      })
    })
  );
}
