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

export default function App() {
  const { data, commit } = useDataAplikasi();
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

  function masuk(email: string, password: string) {
    const user = data.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password
    );

    if (!user) {
      beriNotifikasi("Email atau password tidak valid.");
      return;
    }

    simpanSesiPengguna(user.id);
    setIdPenggunaAktif(user.id);
    navigate({ name: "beranda" });
  }

  function daftar(form: Omit<Pengguna, "id" | "points">) {
    if (data.users.some((user) => user.email.toLowerCase() === form.email.toLowerCase().trim())) {
      beriNotifikasi("Email sudah digunakan.");
      return;
    }

    if (form.password.length < 6) {
      beriNotifikasi("Password minimal 6 karakter.");
      return;
    }

    const user: Pengguna = {
      ...form,
      id: buatIdBaru("u"),
      email: form.email.toLowerCase().trim(),
      points: 0
    };

    commit({ ...data, users: [...data.users, user] });
    simpanSesiPengguna(user.id);
    setIdPenggunaAktif(user.id);
    navigate({ name: "beranda" });
  }

  function keluar() {
    hapusSesiPengguna();
    setIdPenggunaAktif(null);
    window.history.replaceState({}, "", "/masuk");
  }

  function buatSurvei(payload: Omit<Survei, "id" | "ownerId" | "createdAt" | "pointsReward">) {
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

    const survey: Survei = {
      ...payload,
      id: buatIdBaru("s"),
      ownerId: penggunaAktif.id,
      createdAt: new Date().toISOString(),
      pointsReward: hitungPoinSurvei(payload)
    };

    commit({ ...data, surveys: [survey, ...data.surveys] });
    navigate({ name: "survei-saya" });
    beriNotifikasi("Survei sudah tampil di beranda.");
  }

  function kirimJawaban(surveyId: string, answers: Record<string, string | string[]>) {
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

    navigate({ name: "beranda" });
    beriNotifikasi(`Jawaban terkirim. Kamu mendapat ${poinHadiah} poin.`);
  }

  function tukarHadiah(hadiah: DataHadiah): HasilPenukaran {
    if (!penggunaAktif) return { ok: false, pesan: "Silakan masuk terlebih dahulu." };
    if (hadiah.stock <= 0) {
      beriNotifikasi("Stok hadiah habis.");
      return { ok: false, pesan: "Stok hadiah habis." };
    }
    if (penggunaAktif.points < hadiah.pointsCost) {
      beriNotifikasi("Poin kamu belum cukup.");
      return { ok: false, pesan: "Poin kamu belum cukup." };
    }

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

    return { ok: true, pesan: "Hadiah berhasil ditukar dan sedang diproses." };
  }

  function perbaruiProfil(form: Pick<Pengguna, "name" | "age" | "gender" | "city" | "occupation">) {
    if (!penggunaAktif) return;
    commit({
      ...data,
      users: data.users.map((user) => (user.id === penggunaAktif.id ? { ...user, ...form } : user))
    });
    beriNotifikasi("Profil berhasil diperbarui.");
  }

  function gantiPassword(currentPassword: string, nextPassword: string) {
    if (!penggunaAktif) return false;
    if (penggunaAktif.password !== currentPassword) {
      beriNotifikasi("Password saat ini tidak sesuai.");
      return false;
    }
    if (nextPassword.length < 6) {
      beriNotifikasi("Password baru minimal 6 karakter.");
      return false;
    }

    commit({
      ...data,
      users: data.users.map((user) => (user.id === penggunaAktif.id ? { ...user, password: nextPassword } : user))
    });
    beriNotifikasi("Password berhasil diganti.");
    return true;
  }

  function hapusSurvei(surveyId: string) {
    commit({
      ...data,
      surveys: data.surveys.filter((survey) => survey.id !== surveyId),
      responses: data.responses.filter((response) => response.surveyId !== surveyId)
    });
    setIdSurveiDihapus(null);
    beriNotifikasi("Survei berhasil dihapus.");
  }

  if (sedangMemuat) return <LayarMuat />;

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

      {route.name === "hadiah" && <Hadiah data={data} penggunaAktif={penggunaAktif} onTukar={tukarHadiah} />}

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
