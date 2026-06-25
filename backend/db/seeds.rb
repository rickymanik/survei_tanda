responden = User.find_or_initialize_by(email: "respondensurvei@gmail.com")
responden.update!(
  name: "Responden Survei demo",
  password: "password",
  age: "22",
  gender: "Laki-laki",
  city: "Medan",
  occupation: "Mahasiswa",
  points: 1000
)

pembuat = User.find_or_initialize_by(email: "pembuatsurvei@gmail.com")
pembuat.update!(
  name: "Pembuat Survei demo",
  password: "password",
  age: "29",
  gender: "Perempuan",
  city: "Jakarta",
  occupation: "Peneliti",
  points: 0
)

admin = User.find_or_initialize_by(email: "admin@surveitanda.com")
admin.update!(
  name: "Administrator Survei Tanda",
  password: "password",
  age: "30",
  gender: "",
  city: "Jakarta",
  occupation: "Administrator",
  points: 0,
  is_admin: true
)

Reward.find_or_create_by!(name: "Voucher Pulsa 25K") do |reward|
  reward.description = "Pulsa digital senilai Rp25.000 yang dapat digunakan untuk seluruh operator seluler di Indonesia."
  reward.points_cost = 100
  reward.stock = 20
end

Reward.find_or_create_by!(name: "Voucher Belanja 50K") do |reward|
  reward.description = "Voucher belanja digital senilai Rp50.000 untuk membantu memenuhi kebutuhan belanja."
  reward.points_cost = 200
  reward.stock = 12
end

Reward.find_or_create_by!(name: "Saldo E-Wallet 100K") do |reward|
  reward.description = "Saldo dompet digital senilai Rp100.000 yang dapat dikirim langsung ke akun e-wallet terdaftar."
  reward.points_cost = 400
  reward.stock = 8
end

survey = Survey.find_or_initialize_by(title: "Kebiasaan Belanja Online", user: pembuat)
survey.assign_attributes(
  description: "Survei singkat tentang preferensi platform dan faktor keputusan saat belanja online.",
  category: "Konsumen",
  target_count: 80,
  close_date: nil
)
survey.questions.destroy_all if survey.persisted?
survey.questions.build([
  {
    text: "Seberapa sering kamu belanja online dalam satu bulan?",
    question_type: "single",
    required: true,
    options: ["1-2 kali", "3-5 kali", "Lebih dari 5 kali"]
  },
  {
    text: "Faktor apa yang paling memengaruhi keputusan belanja?",
    question_type: "multiple",
    required: true,
    options: ["Harga", "Gratis ongkir", "Ulasan pembeli", "Kecepatan pengiriman"]
  },
  {
    text: "Ceritakan pengalaman belanja online terbaik kamu.",
    question_type: "text",
    required: true,
    options: []
  }
])
survey.save!

PointTransaction.find_or_create_by!(user: responden, description: "Bonus akun demo") do |transaction|
  transaction.amount = 75
end
