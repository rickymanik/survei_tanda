import { useEffect, useMemo, useState } from "react";
import { TataLetak } from "./components/TataLetak";
import { Dialog } from "./components/Dialog";
import { LayarMuat } from "./components/LayarMuat";
import { useMetaHalaman } from "./hooks/useMetaHalaman";
import { useDataAplikasi } from "./hooks/useDataAplikasi";
import { useRute } from "./hooks/useRute";
import { Beranda } from "./pages/Beranda";
import { BuatSurvei } from "./pages/BuatSurvei";
import { Daftar } from "./pages/Daftar";
import { DetailSurvei } from "./pages/DetailSurvei";
import { Hadiah } from "./pages/Hadiah";
import { IsiSurvei } from "./pages/IsiSurvei";
import { Masuk } from "./pages/Masuk";
import { Profil } from "./pages/Profil";
import { SurveiSaya } from "./pages/SurveiSaya";
import type {
  TransaksiPoin,
  PenukaranHadiah,
  HasilPenukaran,
  Hadiah as DataHadiah,
  Survei,
  JawabanSurvei,
  Pengguna
} from "./types/domain";
import { buatIdBaru } from "./utils/id";
import { judulHalaman } from "./utils/rute";
import { hitungPoinSurvei, surveiMasihBuka } from "./utils/survei";
import { hapusSesiPengguna, ambilSesiPengguna, simpanSesiPengguna } from "./utils/penyimpanan";
import {
  changeUserPassword,
  createRedemption,
  createReward,
  createResponse,
  createSurvey as createSurveyApi,
  deleteSurvey as deleteSurveyApi,
  loginUser,
  registerUser,
  updateUserProfile
} from "./api/client";

export default function App() {
  const { data, commit, refreshData, sedangSinkron, apiTersedia } = useDataAplikasi();
  const { route, navigate } = useRute();
  const [idPenggunaAktif, setIdPenggunaAktif] = useState<string | null>(() => ambilSesiPengguna());
  const [pesan, setPesan] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [idSurveiDihapus, setIdSurveiDihapus] = useState<string | null>(null);

  const penggunaAktif = useMemo(
    () => data.users.find((user) => user.id === idPenggunaAktif) ?? null,
    [idPenggunaAktif, data.users]
  );
  const surveiAktif =
    route.name === "isi-survei" || route.name === "detail-survei"
      ? data.surveys.find((survey) => survey.id === route.surveyId)
      : undefined;

  useMetaHalaman(
    judulHalaman(route),
    "Aplikasi survei online t.anda untuk membuat survei, mengisi survei, dan menukar poin hadiah."
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setSedangMemuat(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!penggunaAktif && !sedangMemuat && route.name !== "masuk" && route.name !== "daftar") {
      navigate({ name: "masuk" });
    }
  }, [penggunaAktif, sedangMemuat, route.name]);

  useEffect(() => {
    if (penggunaAktif && (route.name === "masuk" || route.name === "daftar")) {
      navigate({ name: "beranda" });
    }
  }, [penggunaAktif, route.name]);

  function beriNotifikasi(text: string) {
    setPesan(text);
    window.setTimeout(() => setPesan(""), 3200);
  }

  async function masuk(email: string, password: string) {
    let user: Pengguna | null = null;

    if (apiTersedia) {
      try {
        user = await loginUser({ email: email.toLowerCase().trim(), password });
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Email atau password tidak valid.");
        return;
      }
    } else {
      user =
        data.users.find(
          (item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password
        ) ?? null;
    }

    if (!user) {
      beriNotifikasi("Email atau password tidak valid.");
      return;
    }

    simpanSesiPengguna(user.id);
    setIdPenggunaAktif(user.id);
    await refreshData();
    navigate({ name: "beranda" });
  }

  async function daftar(form: Omit<Pengguna, "id" | "points" | "isAdmin">) {
    if (data.users.some((user) => user.email.toLowerCase() === form.email.toLowerCase().trim())) {
      beriNotifikasi("Email sudah digunakan.");
      return;
    }

    if (form.password.length < 6) {
      beriNotifikasi("Password minimal 6 karakter.");
      return;
    }

    let user: Pengguna;

    if (apiTersedia) {
      try {
        user = await registerUser({ ...form, email: form.email.toLowerCase().trim() });
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Pendaftaran gagal.");
        return;
      }
    } else {
      user = {
        ...form,
        id: buatIdBaru("u"),
        email: form.email.toLowerCase().trim(),
        points: 0,
        isAdmin: false
      };

      commit({ ...data, users: [...data.users, user] });
    }

    simpanSesiPengguna(user.id);
    setIdPenggunaAktif(user.id);
    await refreshData();
    navigate({ name: "beranda" });
  }

  function keluar() {
    hapusSesiPengguna();
    setIdPenggunaAktif(null);
    window.history.replaceState({}, "", "/masuk");
  }

  async function buatSurvei(payload: Omit<Survei, "id" | "ownerId" | "createdAt" | "pointsReward">) {
    if (!penggunaAktif) return;

    const invalidChoice = payload.questions.some(
      (question) => question.type !== "text" && question.options.filter(Boolean).length === 0
    );

    if (payload.questions.length === 0) {
      beriNotifikasi("Tambahkan minimal satu pertanyaan.");
      return;
    }

    if (invalidChoice) {
      beriNotifikasi("Pertanyaan pilihan harus memiliki minimal satu opsi.");
      return;
    }

    if (apiTersedia) {
      try {
        await createSurveyApi(penggunaAktif.id, payload);
        await refreshData();
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Survei gagal disimpan.");
        return;
      }
    } else {
      const survey: Survei = {
        ...payload,
        id: buatIdBaru("s"),
        ownerId: penggunaAktif.id,
        createdAt: new Date().toISOString(),
        pointsReward: hitungPoinSurvei(payload)
      };

      commit({ ...data, surveys: [survey, ...data.surveys] });
    }

    navigate({ name: "survei-saya" });
    beriNotifikasi("Survei sudah tampil di beranda.");
  }

  async function kirimJawaban(surveyId: string, answers: Record<string, string | string[]>) {
    if (!penggunaAktif) return;

    const survey = data.surveys.find((item) => item.id === surveyId);
    if (!survey) return;

    const alreadyAnswered = data.responses.some(
      (response) => response.surveyId === survey.id && response.userId === penggunaAktif.id
    );

    if (survey.ownerId === penggunaAktif.id) {
      beriNotifikasi("Kamu tidak bisa mengisi survei milik sendiri.");
      return;
    }

    if (alreadyAnswered) {
      beriNotifikasi("Kamu sudah mengisi survei ini.");
      return;
    }

    const responseCount = data.responses.filter((response) => response.surveyId === survey.id).length;
    if (!surveiMasihBuka(survey, responseCount)) {
      beriNotifikasi("Survei sudah ditutup atau kuota responden penuh.");
      return;
    }

    const missingRequired = survey.questions.some((question) => {
      if (!question.required) return false;
      const value = answers[question.id];
      if (Array.isArray(value)) return value.length === 0;
      return !value;
    });

    if (missingRequired) {
      beriNotifikasi("Lengkapi semua pertanyaan wajib sebelum mengirim.");
      return;
    }

    const poinHadiah = hitungPoinSurvei(survey);
    if (apiTersedia) {
      try {
        await createResponse(surveyId, penggunaAktif.id, answers);
        await refreshData();
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Jawaban gagal dikirim.");
        return;
      }
    } else {
      const response: JawabanSurvei = {
        id: buatIdBaru("resp"),
        surveyId,
        userId: penggunaAktif.id,
        answers,
        createdAt: new Date().toISOString()
      };

      const transaction: TransaksiPoin = {
        id: buatIdBaru("pt"),
        userId: penggunaAktif.id,
        amount: poinHadiah,
        description: `Poin pengisian survei "${survey.title}"`,
        createdAt: new Date().toISOString()
      };

      commit({
        ...data,
        users: data.users.map((user) =>
          user.id === penggunaAktif.id ? { ...user, points: user.points + poinHadiah } : user
        ),
        responses: [...data.responses, response],
        transactions: [transaction, ...data.transactions]
      });
    }

    navigate({ name: "beranda" });
    beriNotifikasi(`Jawaban terkirim. Kamu mendapat ${poinHadiah} poin.`);
  }

  async function tukarHadiah(hadiah: DataHadiah): Promise<HasilPenukaran> {
    if (!penggunaAktif) return { ok: false, pesan: "Silakan masuk terlebih dahulu." };
    if (hadiah.stock <= 0) {
      beriNotifikasi("Stok hadiah habis.");
      return { ok: false, pesan: "Stok hadiah habis." };
    }
    if (penggunaAktif.points < hadiah.pointsCost) {
      beriNotifikasi("Poin kamu belum cukup.");
      return { ok: false, pesan: "Poin kamu belum cukup." };
    }

    if (apiTersedia) {
      try {
        await createRedemption(penggunaAktif.id, hadiah.id);
        await refreshData();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Penukaran hadiah gagal.";
        beriNotifikasi(message);
        return { ok: false, pesan: message };
      }
    } else {
      const redemption: PenukaranHadiah = {
        id: buatIdBaru("rd"),
        userId: penggunaAktif.id,
        rewardId: hadiah.id,
        pointsSpent: hadiah.pointsCost,
        status: "diproses",
        createdAt: new Date().toISOString()
      };

      const transaction: TransaksiPoin = {
        id: buatIdBaru("pt"),
        userId: penggunaAktif.id,
        amount: -hadiah.pointsCost,
        description: `Penukaran ${hadiah.name}`,
        createdAt: new Date().toISOString()
      };

      commit({
        ...data,
        users: data.users.map((user) =>
          user.id === penggunaAktif.id ? { ...user, points: user.points - hadiah.pointsCost } : user
        ),
        rewards: data.rewards.map((item) => (item.id === hadiah.id ? { ...item, stock: item.stock - 1 } : item)),
        redemptions: [redemption, ...data.redemptions],
        transactions: [transaction, ...data.transactions]
      });
    }

    return { ok: true, pesan: "Hadiah berhasil ditukar dan sedang diproses." };
  }

  async function tambahHadiah(payload: Pick<DataHadiah, "name" | "description" | "pointsCost" | "stock">) {
    if (!penggunaAktif?.isAdmin) {
      beriNotifikasi("Hanya administrator yang dapat menambahkan hadiah.");
      return;
    }

    if (!payload.name.trim() || !payload.description.trim()) {
      beriNotifikasi("Nama dan deskripsi hadiah wajib diisi.");
      return;
    }

    if (payload.pointsCost <= 0 || payload.stock < 0) {
      beriNotifikasi("Biaya poin dan stok hadiah tidak valid.");
      return;
    }

    if (apiTersedia) {
      try {
        await createReward(penggunaAktif.id, payload);
        await refreshData();
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Hadiah gagal ditambahkan.");
        return;
      }
    } else {
      const reward: DataHadiah = {
        ...payload,
        id: buatIdBaru("r")
      };

      commit({ ...data, rewards: [reward, ...data.rewards] });
    }

    beriNotifikasi("Hadiah baru berhasil ditambahkan ke katalog.");
  }

  async function perbaruiProfil(form: Pick<Pengguna, "name" | "age" | "gender" | "city" | "occupation">) {
    if (!penggunaAktif) return;

    if (apiTersedia) {
      try {
        await updateUserProfile(penggunaAktif.id, form);
        await refreshData();
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Profil gagal diperbarui.");
        return;
      }
    } else {
      commit({
        ...data,
        users: data.users.map((user) => (user.id === penggunaAktif.id ? { ...user, ...form } : user))
      });
    }

    beriNotifikasi("Profil berhasil diperbarui.");
  }

  async function gantiPassword(currentPassword: string, nextPassword: string) {
    if (!penggunaAktif) return false;
    if (!apiTersedia && penggunaAktif.password !== currentPassword) {
      beriNotifikasi("Password saat ini tidak sesuai.");
      return false;
    }
    if (nextPassword.length < 6) {
      beriNotifikasi("Password baru minimal 6 karakter.");
      return false;
    }

    if (apiTersedia) {
      try {
        await changeUserPassword(penggunaAktif.id, currentPassword, nextPassword);
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Password gagal diganti.");
        return false;
      }
    } else {
      commit({
        ...data,
        users: data.users.map((user) => (user.id === penggunaAktif.id ? { ...user, password: nextPassword } : user))
      });
    }

    beriNotifikasi("Password berhasil diganti.");
    return true;
  }

  async function hapusSurvei(surveyId: string) {
    if (apiTersedia) {
      try {
        await deleteSurveyApi(surveyId);
        await refreshData();
      } catch (error) {
        beriNotifikasi(error instanceof Error ? error.message : "Survei gagal dihapus.");
        return;
      }
    } else {
      commit({
        ...data,
        surveys: data.surveys.filter((survey) => survey.id !== surveyId),
        responses: data.responses.filter((response) => response.surveyId !== surveyId)
      });
    }

    setIdSurveiDihapus(null);
    beriNotifikasi("Survei berhasil dihapus.");
  }

  if (sedangMemuat || sedangSinkron) return <LayarMuat />;

  if (!penggunaAktif) {
    if (route.name === "daftar") {
      return <Daftar pesan={pesan} onDaftar={daftar} onKeMasuk={() => navigate({ name: "masuk" })} />;
    }

    return <Masuk pesan={pesan} onMasuk={masuk} onKeDaftar={() => navigate({ name: "daftar" })} />;
  }

  return (
    <TataLetak penggunaAktif={penggunaAktif} route={route} pesan={pesan} onNavigate={navigate} onKeluar={keluar}>
      {route.name === "beranda" && (
        <Beranda
          data={data}
          penggunaAktif={penggunaAktif}
          onBuat={() => navigate({ name: "buat-survei" })}
          onIsi={(surveyId) => navigate({ name: "isi-survei", surveyId })}
          onDetail={(surveyId) => navigate({ name: "detail-survei", surveyId })}
        />
      )}

      {route.name === "survei-saya" && (
        <SurveiSaya
          data={data}
          penggunaAktif={penggunaAktif}
          onBuat={() => navigate({ name: "buat-survei" })}
          onDetail={(surveyId) => navigate({ name: "detail-survei", surveyId })}
          onHapus={setIdSurveiDihapus}
        />
      )}

      {route.name === "buat-survei" && <BuatSurvei onSubmit={buatSurvei} />}

      {route.name === "isi-survei" &&
        (surveiAktif ? (
          <IsiSurvei survey={surveiAktif} onKembaliBeranda={() => navigate({ name: "beranda" })} onSubmit={kirimJawaban} />
        ) : (
          <NotFound onBack={() => navigate({ name: "beranda" })} />
        ))}

      {route.name === "detail-survei" &&
        (surveiAktif ? (
          <DetailSurvei
            data={data}
            penggunaAktif={penggunaAktif}
            survey={surveiAktif}
            onKembaliKeSurvei={() => navigate({ name: "survei-saya" })}
          />
        ) : (
          <NotFound onBack={() => navigate({ name: "survei-saya" })} />
        ))}

      {route.name === "hadiah" && (
        <Hadiah data={data} penggunaAktif={penggunaAktif} onTukar={tukarHadiah} onTambahHadiah={tambahHadiah} />
      )}

      {route.name === "profil" && (
        <Profil penggunaAktif={penggunaAktif} onSubmit={perbaruiProfil} onGantiPassword={gantiPassword} />
      )}

      {idSurveiDihapus && (
        <Dialog
          title="Hapus survei?"
          confirmText="Hapus Survei"
          variant="danger"
          onClose={() => setIdSurveiDihapus(null)}
          onConfirm={() => hapusSurvei(idSurveiDihapus)}
        >
          <p>Survei dan semua jawaban yang sudah masuk akan dihapus.</p>
        </Dialog>
      )}
    </TataLetak>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Tidak ditemukan</p>
        <h2>Survei tidak ditemukan</h2>
        <p>Data survei belum ada atau sudah dihapus.</p>
      </div>
      <button className="primary-button" onClick={onBack}>
        Kembali
      </button>
    </section>
  );
}
