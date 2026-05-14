import type { RuteAplikasi } from "../types/domain";

export function uraiRute(pathname: string): RuteAplikasi {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/masuk" || path === "/login") return { name: "masuk" };
  if (path === "/daftar" || path === "/register") return { name: "daftar" };
  if (path === "/" || path === "/beranda" || path === "/home") return { name: "beranda" };
  if (path === "/survei" || path === "/surveys") return { name: "survei-saya" };
  if (path === "/survei/baru" || path === "/surveys/new") return { name: "buat-survei" };
  if (path === "/hadiah" || path === "/rewards") return { name: "hadiah" };
  if (path === "/profil" || path === "/profile") return { name: "profil" };

  const fillMatch = path.match(/^\/(?:survei|surveys)\/([^/]+)\/(?:isi|fill)$/);
  if (fillMatch) return { name: "isi-survei", surveyId: fillMatch[1] };

  const detailMatch = path.match(/^\/(?:survei|surveys)\/([^/]+)$/);
  if (detailMatch) return { name: "detail-survei", surveyId: detailMatch[1] };

  return { name: "beranda" };
}

export function jalurRute(route: RuteAplikasi) {
  if (route.name === "masuk") return "/masuk";
  if (route.name === "daftar") return "/daftar";
  if (route.name === "beranda") return "/beranda";
  if (route.name === "survei-saya") return "/survei";
  if (route.name === "buat-survei") return "/survei/baru";
  if (route.name === "isi-survei") return `/survei/${route.surveyId}/isi`;
  if (route.name === "detail-survei") return `/survei/${route.surveyId}`;
  if (route.name === "hadiah") return "/hadiah";
  return "/profil";
}

export function judulHalaman(route: RuteAplikasi) {
  if (route.name === "masuk") return "Masuk";
  if (route.name === "daftar") return "Daftar";
  if (route.name === "beranda") return "Beranda";
  if (route.name === "survei-saya") return "Survei Saya";
  if (route.name === "buat-survei") return "Buat Survei";
  if (route.name === "isi-survei") return "Isi Survei";
  if (route.name === "detail-survei") return "Detail Survei";
  if (route.name === "hadiah") return "Hadiah";
  return "Profil";
}
