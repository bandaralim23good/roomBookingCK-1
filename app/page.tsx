import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
              SR
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Sewa Ruang
              </p>
              <p className="text-xs text-slate-400">
                Room Booking System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Mulai Booking
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-100 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sistem Booking Ruangan
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Booking Ruangan Jadi{" "}
              <span className="text-indigo-600">Lebih Mudah.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Sewa Ruang adalah sistem pemesanan ruangan yang membantu pengguna
              melihat jadwal, memilih waktu yang tersedia, dan melakukan
              booking ruangan dengan lebih cepat dan terorganisir.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Mulai Sekarang →
              </Link>

              <Link
                href="/schedule"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Lihat Jadwal
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ Jadwal terorganisir</span>
              <span>✓ Cek ketersediaan</span>
              <span>✓ Booking lebih mudah</span>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/60">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Jadwal Ruangan
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      Hari Ini
                    </h3>
                  </div>

                  <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
                    5 Jadwal
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">
                          Ruang Meeting A
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Rapat Produksi
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Terjadwal
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <span>09:00</span>
                      <span className="text-slate-300">—</span>
                      <span>11:00</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">
                          Ruang Meeting B
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Tim Administrasi
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Terjadwal
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <span>13:00</span>
                      <span className="text-slate-300">—</span>
                      <span>15:00</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-400">
                    Waktu tersedia dapat digunakan untuk booking
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl sm:block">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Sistem aktif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Tentang Sistem
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Satu tempat untuk mengatur penggunaan ruangan
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              Sewa Ruang dirancang untuk mempermudah proses peminjaman ruangan
              di lingkungan kerja. Pengguna dapat melihat jadwal yang sudah
              terisi, memilih ruangan dan waktu, kemudian melakukan booking
              tanpa harus melakukan pencatatan secara manual.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard
              number="01"
              title="Lihat Jadwal"
              description="Periksa jadwal penggunaan ruangan berdasarkan tanggal dan ruangan sebelum melakukan booking."
            />

            <FeatureCard
              number="02"
              title="Booking Ruangan"
              description="Pilih ruangan, tanggal, waktu mulai, dan waktu selesai sesuai kebutuhan penggunaan."
            />

            <FeatureCard
              number="03"
              title="Kelola Ruangan"
              description="Administrator dapat mengatur data pengguna, ruangan, serta jam operasional setiap ruangan."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Cara Menggunakan
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Booking ruangan dalam beberapa langkah
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Proses dibuat sederhana agar pengguna dapat menemukan waktu dan
              ruangan yang sesuai tanpa proses yang rumit.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Step
              number="1"
              title="Login"
              description="Masuk menggunakan akun yang telah terdaftar."
            />

            <Step
              number="2"
              title="Pilih Ruangan"
              description="Pilih ruangan yang ingin digunakan."
            />

            <Step
              number="3"
              title="Pilih Waktu"
              description="Tentukan tanggal, jam mulai, dan jam selesai."
            />

            <Step
              number="4"
              title="Booking"
              description="Simpan booking dan lihat jadwal penggunaan."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Fitur Utama
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Semua yang dibutuhkan untuk pengelolaan ruangan
              </h2>

              <p className="mt-5 leading-7 text-slate-500">
                Sistem menyediakan fitur untuk pengguna maupun administrator
                agar proses penggunaan ruangan dapat dikelola secara lebih
                terstruktur.
              </p>

              <div className="mt-8 space-y-5">
                <FeatureItem
                  title="Pengecekan jadwal"
                  description="Lihat booking yang sudah terjadwal sebelum menentukan waktu penggunaan."
                />

                <FeatureItem
                  title="Pencegahan jadwal bentrok"
                  description="Sistem melakukan pemeriksaan terhadap booking yang sudah ada sebelum menyimpan booking baru."
                />

                <FeatureItem
                  title="Jam operasional ruangan"
                  description="Setiap ruangan dapat memiliki jadwal operasional yang berbeda berdasarkan hari."
                />

                <FeatureItem
                  title="Manajemen pengguna dan ruangan"
                  description="Administrator dapat mengelola akun pengguna dan data ruangan dari sistem."
                />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 shadow-xl">
              <p className="text-sm font-semibold text-indigo-300">
                Room Booking System
              </p>

              <h3 className="mt-4 text-3xl font-bold leading-tight text-white">
                Ruangan tersedia,
                <br />
                jadwal lebih teratur.
              </h3>

              <p className="mt-5 leading-7 text-slate-400">
                Dengan sistem booking terpusat, informasi penggunaan ruangan
                dapat diakses dengan lebih mudah dan mengurangi risiko
                terjadinya jadwal yang bertabrakan.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Akses sistem
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-2xl font-bold text-white">Real-time</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Data booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Siap menggunakan ruangan?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-indigo-100">
            Login ke sistem dan mulai lakukan booking ruangan sesuai jadwal
            yang tersedia.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-600 shadow-lg transition hover:bg-indigo-50"
          >
            Login & Mulai Booking →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-700">Sewa Ruang</p>
            <p className="mt-1">
              Room Booking System
            </p>
          </div>

          <p>
            © {new Date().getFullYear()} Sewa Ruang. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
        {number}
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
        ✓
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}