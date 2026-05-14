import type { DataAplikasi } from "../types/domain";

export const dataAwal: DataAplikasi = {
  users: [
    {
      id: "u-demo",
      name: "Responden Survei demo",
      email: "respondensurvei@gmail.com",
      password: "password",
      age: "22",
      gender: "Laki-laki",
      city: "Medan",
      occupation: "Mahasiswa",
      points: 1000
    },
    {
      id: "u-creator",
      name: "Pembuat Survei demo",
      email: "pembuatsurvei@gmail.com",
      password: "password",
      age: "29",
      gender: "Perempuan",
      city: "Jakarta",
      occupation: "Peneliti",
      points: 0
    }
  ],
  surveys: [
    {
      id: "s-belanja",
      ownerId: "u-creator",
      title: "Kebiasaan Belanja Online",
      description: "Survei singkat tentang preferensi platform dan faktor keputusan saat belanja online.",
      category: "Konsumen",
      targetCount: 80,
      closeDate: "",
      pointsReward: 30,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: "q-frequency",
          text: "Seberapa sering kamu belanja online dalam satu bulan?",
          type: "single",
          required: true,
          options: ["1-2 kali", "3-5 kali", "Lebih dari 5 kali"]
        },
        {
          id: "q-factors",
          text: "Faktor apa yang paling memengaruhi keputusan belanja?",
          type: "multiple",
          required: true,
          options: ["Harga", "Gratis ongkir", "Ulasan pembeli", "Kecepatan pengiriman"]
        },
        {
          id: "q-story",
          text: "Ceritakan pengalaman belanja online terbaik kamu.",
          type: "text",
          required: true,
          options: []
        }
      ]
    }
  ],
  responses: [],
  rewards: [
    {
      id: "r-pulsa",
      name: "Voucher Pulsa 25K",
      description: "Pulsa digital senilai Rp25.000 yang dapat digunakan untuk seluruh operator seluler di Indonesia.",
      pointsCost: 100,
      stock: 20
    },
    {
      id: "r-belanja",
      name: "Voucher Belanja 50K",
      description: "Voucher belanja digital senilai Rp50.000 untuk membantu memenuhi kebutuhan belanja.",
      pointsCost: 200,
      stock: 12
    },
    {
      id: "r-wallet",
      name: "Saldo E-Wallet 100K",
      description: "Saldo dompet digital senilai Rp100.000 yang dapat dikirim langsung ke akun e-wallet terdaftar.",
      pointsCost: 400,
      stock: 8
    }
  ],
  transactions: [
    {
      id: "pt-seed",
      userId: "u-demo",
      amount: 75,
      description: "Bonus akun demo",
      createdAt: new Date().toISOString()
    }
  ],
  redemptions: []
};
