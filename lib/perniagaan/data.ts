import {
  Announcement,
  Chapter,
  EduData,
  ExamPaper,
  PracticeQuestion,
  QuizQuestion,
} from "./types";

export const NEGERI_PERCUBAAN = [
  "Pahang",
  "Johor",
  "Selangor",
  "Kelantan",
  "Terengganu",
  "Perak",
  "Kedah",
  "Pulau Pinang",
  "Negeri Sembilan",
  "Melaka",
  "Sabah",
  "Sarawak",
];

export const TAHUN_SEMASA = new Date().getFullYear();

const chapters: Chapter[] = [
  {
    id: "t4-bab-1",
    tingkatan: "T4",
    nombor: 1,
    tajuk: "Tujuan Perniagaan dan Pemilikan Perniagaan",
    ringkasan: "Memahami tujuan perniagaan, bentuk pemilikan, klasifikasi serta skala perniagaan.",
    konsep: [
      "Perniagaan ialah aktiviti menghasilkan, membeli, menjual atau mengagihkan barang dan perkhidmatan bagi memenuhi keperluan pengguna.",
      "Tujuan utama perniagaan ialah memperoleh keuntungan, memenuhi keperluan masyarakat dan mengembangkan aktiviti ekonomi.",
      "Bentuk pemilikan merangkumi milikan tunggal, perkongsian, syarikat dan koperasi.",
      "Klasifikasi perniagaan boleh dibahagikan kepada perniagaan barter, e-dagang dan francais.",
    ],
    istilah: [
      { istilah: "Perniagaan", maksud: "Aktiviti ekonomi yang melibatkan pengeluaran, pengagihan dan penjualan barang atau perkhidmatan." },
      { istilah: "Pemilikan Tunggal", maksud: "Bentuk perniagaan yang dimiliki dan dikawal oleh seorang sahaja." },
      { istilah: "Perkongsian", maksud: "Bentuk perniagaan yang dimiliki oleh dua orang atau lebih." },
      { istilah: "Syarikat", maksud: "Entiti perniagaan yang mempunyai kewujudan berasingan daripada pemiliknya." },
    ],
    nota: [
      "Perniagaan bermula apabila seseorang atau sesebuah organisasi mengenal pasti keperluan masyarakat dan menyediakan barang atau perkhidmatan untuk memenuhi keperluan tersebut.",
      "Tujuan perniagaan merangkumi memperoleh keuntungan, menyediakan lapangan kerja, memenuhi keperluan pengguna dan menyumbang kepada pembangunan ekonomi negara.",
      "Pemilikan tunggal mudah ditubuhkan tetapi pemilik menanggung seluruh risiko. Perkongsian membolehkan modal dan kepakaran dikongsi, manakala syarikat mempunyai liabiliti terhad.",
      "Koperasi berasaskan prinsip keanggotaan sukarela, kawalan demokratik dan pengagihan pulangan mengikut penggunaan.",
    ],
    contoh: [
      "Kedai runcit milikan tunggal di kampung.",
      "Firma perakaunan yang dimiliki oleh dua orang rakan kongsi.",
      "Syarikat berhad awam seperti syarikat yang disenaraikan di Bursa Malaysia.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t4-bab-2",
    tingkatan: "T4",
    nombor: 2,
    tajuk: "Trend Semasa dalam Perniagaan",
    ringkasan: "Mengkaji peranan kerajaan, persekitaran perniagaan dan faktor perubahan dalam dunia perniagaan.",
    konsep: [
      "Persekitaran perniagaan terdiri daripada faktor dalaman dan luaran yang mempengaruhi keputusan organisasi.",
      "Kerajaan memainkan peranan melalui dasar, perundangan, insentif dan penyelarasan ekonomi.",
      "Trend semasa termasuk digitalisasi, kelestarian, perdagangan antarabangsa dan ekonomi gig.",
      "Perniagaan perlu menyesuaikan diri dengan perubahan untuk kekal kompetitif.",
    ],
    istilah: [
      { istilah: "Persekitaran Perniagaan", maksud: "Semua faktor dalaman dan luaran yang mempengaruhi aktiviti sesebuah organisasi perniagaan." },
      { istilah: "Digitalisasi", maksud: "Penggunaan teknologi digital untuk meningkatkan proses perniagaan." },
      { istilah: "Kelestarian", maksud: "Keupayaan perniagaan memenuhi keperluan semasa tanpa menjejaskan generasi akan datang." },
      { istilah: "Ekonomi Gig", maksud: "Sistem pekerjaan bebas yang membolehkan pekerja menawarkan perkhidmatan mengikut tugasan." },
    ],
    nota: [
      "Faktor luaran seperti ekonomi, sosial, teknologi, alam sekitar dan politik mempengaruhi permintaan, kos dan peluang perniagaan.",
      "Kerajaan memperkenalkan dasar untuk menggalakkan keusahawanan, melindungi pengguna dan memastikan persaingan sihat dalam pasaran.",
      "Perubahan pesat dalam teknologi maklumat mewujudkan model perniagaan baharu seperti e-dagang, rangkaian sosial dan pembayaran digital.",
      "Perniagaan yang responsif terhadap trend berkemungkinan besar dapat mengekalkan pelanggan dan meningkatkan kecekapan operasi.",
    ],
    contoh: [
      "Penggunaan platform e-dagang oleh perniagaan runcit.",
      "Amalan perniagaan mampan seperti pengurangan penggunaan plastik.",
      "Kerajaan menggalakkan usahawan muda melalui program dan geran.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t4-bab-3",
    tingkatan: "T4",
    nombor: 3,
    tajuk: "Penetapan Visi, Misi dan Objektif Perniagaan",
    ringkasan: "Memahami maksud, ciri dan kepentingan visi, misi serta objektif perniagaan.",
    konsep: [
      "Visi ialah gambaran masa depan yang aspiratif bagi sesebuah organisasi.",
      "Misi menerangkan tujuan utama dan cara organisasi mencapai cita-citanya.",
      "Objektif ialah sasaran khusus, boleh diukur dan mempunyai tempoh masa.",
      "Visi, misi dan objektif menjadi panduan untuk perancangan dan pembuatan keputusan.",
    ],
    istilah: [
      { istilah: "Visi", maksud: "Gambaran aspirasi organisasi pada masa hadapan." },
      { istilah: "Misi", maksud: "Pernyataan tujuan utama dan hala tuju operasi organisasi." },
      { istilah: "Objektif", maksud: "Sasaran khusus yang hendak dicapai dalam tempoh tertentu." },
      { istilah: "Matlamat", maksud: "Hasil yang dihasratkan oleh organisasi dalam jangka masa tertentu." },
    ],
    nota: [
      "Visi yang berkesan hendaklah jelas, memberi inspirasi dan selaras dengan nilai organisasi.",
      "Misi menjelaskan apa yang dilakukan oleh organisasi, untuk siapa, dan bagaimana organisasi berbeza daripada pesaing.",
      "Objektif yang baik mestilah spesifik, boleh diukur, realistik, relevan dan terhad masanya (SMART).",
      "Kegagalan menetapkan visi, misi dan objektif boleh menyebabkan organisasi hilang arah dan tidak cekap dalam mencapai matlamat.",
    ],
    contoh: [
      "Visi: Menjadi jenama makanan tempatan yang disegani di peringkat antarabangsa.",
      "Misi: Menyediakan makanan sihat dan berkualiti dengan harga berpatutan.",
      "Objektif: Meningkatkan jualan dalam talian sebanyak 25% dalam tempoh dua tahun.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t4-bab-4",
    tingkatan: "T4",
    nombor: 4,
    tajuk: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan",
    ringkasan: "Mengenal pasti fungsi pengeluaran, pemasaran, kewangan, sumber manusia dan sokongan dalam organisasi.",
    konsep: [
      "Organisasi perniagaan mempunyai bahagian fungsian yang saling bergantung untuk mencapai matlamat.",
      "Bahagian pengeluaran memastikan barang atau perkhidmatan dihasilkan mengikut standard.",
      "Bahagian pemasaran mengkaji pasaran, memasarkan produk dan membina hubungan pelanggan.",
      "Bahagian kewangan menguruskan modal, perbelanjaan, hasil dan laporan kewangan.",
      "Bahagian sumber manusia bertanggungjawab ke atas pengambilan, latihan dan motivasi pekerja.",
    ],
    istilah: [
      { istilah: "Fungsi Perniagaan", maksud: "Aktiviti utama yang dilakukan oleh organisasi untuk menghasilkan nilai kepada pelanggan." },
      { istilah: "Pemasaran", maksud: "Proses merancang, mengedarkan dan mempromosikan barang atau perkhidmatan." },
      { istilah: "Sumber Manusia", maksud: "Pekerja dan bakat yang menyumbang kepada pencapaian objektif organisasi." },
      { istilah: "Pengeluaran", maksud: "Proses menukar input kepada barang atau perkhidmatan siap untuk dijual." },
    ],
    nota: [
      "Setiap bahagian mempunyai tujuan tersendiri tetapi perlu berkoordinasi untuk memastikan operasi lancar.",
      "Bahagian pengeluaran mesti memastikan kualiti, kos dan masa pengeluaran yang cekap.",
      "Pemasaran perlu memahami keperluan pelanggan melalui kajian pasaran dan analisis pesaing.",
      "Bahagian kewangan menyediakan maklumat penting untuk perancangan, kawalan dan pengambilan keputusan.",
      "Interaksi antara bahagian membolehkan idea baharu dibangunkan dan masalah diselesaikan secara kolektif.",
    ],
    contoh: [
      "Jabatan pengeluaran kilang memastikan produk siap mengikut spesifikasi.",
      "Jabatan pemasaran menjalankan kempen media sosial untuk meningkatkan jualan.",
      "Jabatan kewangan menyediakan bajet dan penyata kewangan berkala.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-1",
    tingkatan: "T5",
    nombor: 1,
    tajuk: "Pengurusan Sumber Manusia",
    ringkasan: "Mempelajari pengurusan pekerja, struktur organisasi, sistem penggajian dan motivasi.",
    konsep: [
      "Pengurusan sumber manusia melibatkan perancangan, pengambilan, latihan, penilaian dan pembangunan pekerja.",
      "Sumber manusia yang kompeten meningkatkan produktiviti dan kecekapan organisasi.",
      "Struktur organisasi menentukan hierarki, tugas dan tanggungjawab pekerja.",
      "Sistem penggajian yang adil membantu mengekalkan dan memotivasi pekerja.",
    ],
    istilah: [
      { istilah: "Pengurusan Sumber Manusia", maksud: "Proses menguruskan pekerja daripada pengambilan hingga pembangunan dan pengekalan." },
      { istilah: "Struktur Organisasi", maksud: "Susunan peringkat dan hubungan jawatan dalam sesebuah organisasi." },
      { istilah: "Kebolehkerjaan", maksud: "Kemahiran, sikap dan pengetahuan yang membolehkan individu bekerja dengan berkesan." },
      { istilah: "Penggajian", maksud: "Sistem pemberian upah, gaji dan manfaat kepada pekerja." },
    ],
    nota: [
      "Pengurusan sumber manusia yang berkesan memastikan organisasi mempunyai pekerja yang mencukupi, berkualiti dan bermotivasi.",
      "Pekerja perlu dilatih dan dinilai secara berkala untuk menyesuaikan diri dengan perubahan teknologi dan pasaran.",
      "Struktur organisasi boleh berbentuk hierarki, matriks atau rangkaian; setiap bentuk mempunyai kelebihan dan kekurangan.",
      "Motivasi pekerja boleh ditingkatkan melalui penggajian adil, pengiktirafan, peluang pembangunan dan persekitaran kerja yang positif.",
    ],
    contoh: [
      "Program orientasi untuk pekerja baharu.",
      "Latihan kemahiran digital untuk kakitangan jualan.",
      "Penilaian prestasi tahunan bagi menentukan bonus atau promosi.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-2",
    tingkatan: "T5",
    nombor: 2,
    tajuk: "Pengurusan Sumber Fizikal dan Teknologi",
    ringkasan: "Menguruskan aset fizikal, peralatan dan teknologi untuk kecekapan operasi.",
    konsep: [
      "Sumber fizikal merangkumi bangunan, jentera, kenderaan dan inventori.",
      "Pengurusan sumber fizikal melibatkan perolehan, penggunaan, penyelenggaraan dan pelupusan.",
      "Teknologi membantu meningkatkan produktiviti, ketepatan dan komunikasi.",
      "Harta intelek seperti paten dan tanda dagangan mempunyai nilai strategik.",
    ],
    istilah: [
      { istilah: "Sumber Fizikal", maksud: "Aset ketara yang digunakan dalam operasi perniagaan." },
      { istilah: "Sumber Teknologi", maksud: "Sistem, perisian dan kemudahan digital yang menyokong aktiviti perniagaan." },
      { istilah: "Harta Intelek", maksud: "Ciptaan bukan ketara seperti paten, tanda dagangan dan hak cipta." },
      { istilah: "Penyelenggaraan", maksud: "Aktiviti memastikan aset berada dalam keadaan baik dan berfungsi dengan baik." },
    ],
    nota: [
      "Pengurusan sumber fizikal yang baik mengurangkan pembaziran, memastikan keselamatan dan memanjangkan hayat aset.",
      "Teknologi seperti sistem pengurusan inventori dan perisian perakaunan mempercepatkan proses operasi.",
      "Organisasi perlu menilai kos perolehan, kos operasi dan faedah sesuatu teknologi sebelum membuat pelaburan.",
      "Penggunaan teknologi mampan dapat mengurangkan jejak karbon dan meningkatkan kecekapan sumber.",
    ],
    contoh: [
      "Sistem pengurusan inventori berasaskan awan.",
      "Mesin pengeluaran yang diselenggara mengikut jadual.",
      "Pendaftaran tanda dagangan bagi melindungi jenama.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-3",
    tingkatan: "T5",
    nombor: 3,
    tajuk: "Sumber Pembiayaan Perniagaan",
    ringkasan: "Membezakan pembiayaan dalaman dan luaran serta faktor pemilihan sumber.",
    konsep: [
      "Pembiayaan dalaman diperoleh daripada pemilik seperti modal sendiri dan keuntungan ditahan.",
      "Pembiayaan luaran diperoleh daripada bank, pelabur, pinjaman dan geran.",
      "Setiap sumber mempunyai kos, risiko dan syarat yang berbeza.",
      "Pemilihan sumber pembiayaan bergantung pada keperluan, tempoh dan keupayaan membayar.",
    ],
    istilah: [
      { istilah: "Modal Sendiri", maksud: "Dana yang disumbangkan oleh pemilik perniagaan." },
      { istilah: "Pinjaman Bank", maksud: "Dana dipinjam daripada institusi kewangan dengan obligasi membayar balik." },
      { istilah: "Geran", maksud: "Bantuan kewangan yang tidak semestinya dipulangkan oleh pemberi." },
      { istilah: "Kadar Faedah", maksud: "Kos meminjam wang yang dinyatakan sebagai peratusan." },
    ],
    nota: [
      "Pembiayaan dalaman biasanya lebih mudah diperoleh tetapi mungkin terhad kepada jumlah modal sendiri.",
      "Pinjaman bank membolehkan perniagaan berkembang tetapi menambah liabiliti dan beban faedah.",
      "Perniagaan baharu sering bergantung pada modal sendiri, pinjaman keluarga atau modal teroka.",
      "Perancangan aliran tunai penting untuk memastikan perniagaan mampu membayar balik pembiayaan tepat pada masanya.",
    ],
    contoh: [
      "Tabungan peribadi digunakan untuk memulakan perniagaan kecil.",
      "Pinjaman SME daripada bank untuk pembelian peralatan.",
      "Geran kerajaan untuk perniagaan hijau atau digital.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-4",
    tingkatan: "T5",
    nombor: 4,
    tajuk: "Penyata Kewangan Perniagaan",
    ringkasan: "Mengenali penyata pendapatan, kunci kira-kira dan analisis nisbah kewangan.",
    konsep: [
      "Penyata pendapatan menunjukkan hasil, perbelanjaan dan untung atau rugi sesuatu tempoh.",
      "Kunci kira-kira menunjukkan aset, liabiliti dan ekuiti pada satu titik masa.",
      "Nisbah kewangan membantu menilai kecairan, kecekapan dan kebolehan membayar hutang.",
      "Penyata kewangan penting kepada pemilik, pelabur, pemiutang dan pihak berkepentingan.",
    ],
    istilah: [
      { istilah: "Penyata Pendapatan", maksud: "Laporan yang menunjukkan prestasi kewangan sesebuah perniagaan dalam tempoh tertentu." },
      { istilah: "Kunci Kira-kira", maksud: "Laporan yang menunjukkan kedudukan kewangan pada tarikh tertentu." },
      { istilah: "Aset", maksud: "Sumber yang dimiliki oleh perniagaan dan mempunyai nilai ekonomi." },
      { istilah: "Liabiliti", maksud: "Kewajipan kewangan yang perlu dibayar oleh perniagaan." },
    ],
    nota: [
      "Penyata pendapatan disediakan untuk mengukur keuntungan dan prestasi operasi.",
      "Kunci kira-kira mesti seimbang: Aset = Liabiliti + Ekuiti.",
      "Nisbah semasa mengukur keupayaan membayar liabiliti jangka pendek; nisbah leverage mengukur tahap hutang.",
      "Penyata kewangan membantu perniagaan membuat perancangan, kawalan dan keputusan pelaburan.",
    ],
    contoh: [
      "Penyata pendapatan menunjukkan jualan RM100,000 dan perbelanjaan RM70,000.",
      "Aset perniagaan RM500,000 dengan liabiliti RM200,000 dan ekuiti RM300,000.",
      "Nisbah semasa 2:1 menunjukkan kecairan yang sihat.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-5",
    tingkatan: "T5",
    nombor: 5,
    tajuk: "Persediaan Menjadi Usahawan",
    ringkasan: "Mengenali ciri keusahawanan, kekuatan diri dan kelebihan berniaga.",
    konsep: [
      "Usahawan ialah individu yang mengenal pasti peluang dan mengatur sumber untuk mencipta perniagaan.",
      "Ciri usahawan yang berjaya termasuk inovatif, berani mengambil risiko, tekun dan berorientasikan matlamat.",
      "Kekuatan diri seperti keyakinan, komunikasi dan ketahanan membantu usahawan mengatasi cabaran.",
      "Kelebihan menjadi usahawan merangkumi kebebasan, potensi pendapatan tinggi dan kepuasan mencipta nilai.",
    ],
    istilah: [
      { istilah: "Usahawan", maksud: "Individu yang memulakan dan menguruskan perniagaan dengan mengimbangi risiko dan ganjaran." },
      { istilah: "Inovasi", maksud: "Pengenalan idea, produk atau proses baharu yang memberi nilai tambah." },
      { istilah: "Risiko", maksud: "Ketidakpastian yang boleh memberi kesan positif atau negatif kepada perniagaan." },
      { istilah: "Peluang Perniagaan", maksud: "Keadaan pasaran yang boleh dimanfaatkan untuk mencapai keuntungan." },
    ],
    nota: [
      "Usahawan perlu mempunyai visi yang jelas dan keupayaan menilai peluang secara sistematik.",
      "Kekuatan diri seperti disiplin, empati dan kemahiran berkomunikasi amat penting dalam mengurus pasukan dan pelanggan.",
      "Kelebihan keusahawanan perlu diseimbangkan dengan cabaran seperti ketidakpastian pendapatan dan tekanan operasi.",
      "Persediaan awal termasuk mengenali minat, bakat, sumber dan bidang yang sesuai untuk diceburi.",
    ],
    contoh: [
      "Usahawan muda membangunkan aplikasi tempahan makanan.",
      "Usahawan memanfaatkan trend kesihatan untuk menghasilkan produk organik.",
      "Usahawan belajar daripada kegagalan dan memperbaiki model perniagaan.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-6",
    tingkatan: "T5",
    nombor: 6,
    tajuk: "Persediaan Memulakan Perniagaan",
    ringkasan: "Prosedur pendaftaran, lesen, pilihan lokasi dan persediaan operasi sebelum berniaga.",
    konsep: [
      "Perniagaan baharu perlu mematuhi keperluan undang-undang dan perlesenan.",
      "Pemilihan bentuk perniagaan mempengaruhi liabiliti, cukai dan kawal selia.",
      "Lokasi perniagaan mesti strategik dari segi akses, saingan dan kos.",
      "Perancangan awal merangkumi kajian pasaran, anggaran kos dan sumber modal.",
    ],
    istilah: [
      { istilah: "Pendaftaran Perniagaan", maksud: "Proses mendaftarkan perniagaan dengan Suruhanjaya Syarikat Malaysia atau pihak berkuasa berkaitan." },
      { istilah: "Lesen Perniagaan", maksud: "Kebenaran rasmi untuk menjalankan aktiviti perniagaan tertentu." },
      { istilah: "Kajian Pasaran", maksud: "Proses mengumpul dan menganalisis maklumat tentang pelanggan dan pesaing." },
      { istilah: "Modal Asas", maksud: "Jumlah minimum yang diperlukan untuk memulakan perniagaan." },
    ],
    nota: [
      "Pemilik perlu menentukan bentuk perniagaan seperti milikan tunggal, perkongsian atau syarikat mengikut keperluan.",
      "Lesen dan permit mesti diperoleh sebelum operasi bermula untuk mengelakkan masalah undang-undang.",
      "Kajian pasaran membantu mengenal pasti sasaran pelanggan, harga pasaran dan persaingan.",
      "Anggaran kos permulaan merangkumi modal, peralatan, sewa, lesen dan kos operasi awal.",
    ],
    contoh: [
      "Pendaftaran nama perniagaan di SSM.",
      "Memohon lesen perniagaan makanan daripada pihak berkuasa tempatan.",
      "Kajian lokasi untuk kedai kopi di kawasan tumpuan pelanggan.",
    ],
    dikemasKini: "2026-01-12",
  },
  {
    id: "t5-bab-7",
    tingkatan: "T5",
    nombor: 7,
    tajuk: "Merancang Pengendalian Perniagaan",
    ringkasan: "Menyusun pelan perniagaan, pengurusan risiko dan strategi pengendalian.",
    konsep: [
      "Pelan perniagaan ialah dokumen yang menerangkan visi, produk, pasaran, strategi dan unjuran kewangan.",
      "Pelan perniagaan membantu usahawan merancang, mendapatkan pembiayaan dan mengukur prestasi.",
      "Pengurusan risiko melibatkan mengenal pasti, menilai dan mengurangkan kesan risiko.",
      "Strategi pengendalian merangkumi pengurusan operasi, pemasaran, kewangan dan sumber manusia.",
    ],
    istilah: [
      { istilah: "Pelan Perniagaan", maksud: "Dokumen bertulis yang menerangkan matlamat dan strategi sesebuah perniagaan." },
      { istilah: "Unjuran Kewangan", maksud: "Anggaran hasil, perbelanjaan dan keuntungan pada masa hadapan." },
      { istilah: "Pengurusan Risiko", maksud: "Proses mengenal pasti dan mengendalikan ketidakpastian yang boleh menjejaskan perniagaan." },
      { istilah: "Strategi Operasi", maksud: "Rancangan untuk menguruskan proses pengeluaran dan perkhidmatan dengan cekap." },
    ],
    nota: [
      "Pelan perniagaan yang baik merangkumi ringkasan eksekutif, analisis pasaran, strategi pemasaran, operasi dan unjuran kewangan.",
      "Pelan ini berguna kepada pemilik untuk merancang tindakan, kepada pelabur untuk menilai potensi dan kepada pemiutang untuk menilai risiko.",
      "Risiko boleh diuruskan melalui insurans, kepelbagaian produk, kawalan kualiti dan perancangan kontingensi.",
      "Pengurusan yang efektif memerlukan pemantauan berterusan, penilaian prestasi dan penambahbaikan berterusan.",
    ],
    contoh: [
      "Pelan perniagaan untuk kafe yang menunjukkan sasaran pelanggan dan unjuran jualan.",
      "Insurans perniagaan untuk melindungi aset daripada risiko kebakaran atau kemalangan.",
      "Semakan prestasi bulanan untuk menyesuaikan strategi pemasaran.",
    ],
    dikemasKini: "2026-01-12",
  },
];

function noteResources(): NoteResource[] {
  const resources: NoteResource[] = [];
  for (const chapter of chapters) {
    resources.push({
      id: `${chapter.id}-nota`,
      chapterId: chapter.id,
      tingkatan: chapter.tingkatan,
      tajuk: `Nota Lengkap - ${chapter.tajuk}`,
      jenis: "Nota Lengkap",
      kandungan: chapter.nota.join("\n\n"),
      ringkasan: chapter.ringkasan,
      status: "contoh",
      dimuatNaikOleh: "Panitia Perniagaan",
      tarikhMuatNaik: chapter.dikemasKini,
      saiz: "Nota digital",
    });
    resources.push({
      id: `${chapter.id}-ringkasan`,
      chapterId: chapter.id,
      tingkatan: chapter.tingkatan,
      tajuk: `Ringkasan Ulang Kaji - ${chapter.tajuk}`,
      jenis: "Ringkasan",
      kandungan: chapter.konsep.join("\n\n"),
      ringkasan: chapter.ringkasan,
      status: "contoh",
      dimuatNaikOleh: "Panitia Perniagaan",
      tarikhMuatNaik: chapter.dikemasKini,
      saiz: "Nota digital",
    });
    resources.push({
      id: `${chapter.id}-istilah`,
      chapterId: chapter.id,
      tingkatan: chapter.tingkatan,
      tajuk: `Kad Istilah - ${chapter.tajuk}`,
      jenis: "Kad Istilah",
      kandungan: chapter.istilah.map((x) => `${x.istilah}: ${x.maksud}`).join("\n"),
      ringkasan: chapter.ringkasan,
      status: "contoh",
      dimuatNaikOleh: "Panitia Perniagaan",
      tarikhMuatNaik: chapter.dikemasKini,
      saiz: "Nota digital",
    });
  }
  return resources;
}

const quizQuestions: QuizQuestion[] = [
  { id: "q-t4-1", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "objektif", kesukaran: "mudah", soalan: "Antara berikut, yang manakah tujuan utama sesebuah perniagaan bermotifkan keuntungan?", pilihan: ["Menjadi kaya", "Memperoleh keuntungan", "Menjadi terkenal", "Mengurangkan cukai"], jawapan: 1, penerangan: "Perniagaan bermotifkan keuntungan bertujuan memperoleh pulangan kewangan daripada aktiviti ekonomi.", markah: 1, contoh: true },
  { id: "q-t4-2", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Bentuk perniagaan yang mempunyai kewujudan berasingan daripada pemiliknya ialah...", pilihan: ["Pemilikan tunggal", "Perkongsian", "Syarikat", "Koperasi"], jawapan: 2, penerangan: "Syarikat mempunyai entiti undang-undang yang berasingan daripada pemiliknya.", markah: 1, contoh: true },
  { id: "q-t4-3", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "benar_salah", kesukaran: "mudah", soalan: "Koperasi ditubuhkan atas dasar keanggotaan sukarela dan kawalan demokratik.", pilihan: ["Benar", "Palsu"], jawapan: 0, penerangan: "Koperasi beroperasi berdasarkan prinsip keanggotaan sukarela dan kawalan demokratik.", markah: 1, contoh: true },
  { id: "q-t4-4", tingkatan: "T4", bab: 2, tajukBab: "Trend Semasa dalam Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Faktor luaran yang mempengaruhi perniagaan termasuk...", pilihan: ["Hanya modal", "Ekonomi, sosial, teknologi dan politik", "Hanya peralatan", "Hanya pekerja"], jawapan: 1, penerangan: "Persekitaran luaran merangkumi pelbagai faktor yang mempengaruhi keputusan perniagaan.", markah: 1, contoh: true },
  { id: "q-t4-5", tingkatan: "T4", bab: 2, tajukBab: "Trend Semasa dalam Perniagaan", jenis: "objektif", kesukaran: "sukar", soalan: "Trend digitalisasi dalam perniagaan paling berkaitan dengan...", pilihan: ["Penggunaan teknologi digital untuk meningkatkan proses", "Pengurangan semua aktiviti dalam talian", "Penggunaan wang tunai sahaja", "Penutupan perniagaan fizikal"], jawapan: 0, penerangan: "Digitalisasi merujuk kepada penggunaan teknologi digital untuk menambah nilai proses perniagaan.", markah: 2, contoh: true },
  { id: "q-t4-6", tingkatan: "T4", bab: 3, tajukBab: "Penetapan Visi, Misi dan Objektif Perniagaan", jenis: "objektif", kesukaran: "mudah", soalan: "Gambaran aspirasi organisasi pada masa hadapan ialah...", pilihan: ["Visi", "Misi", "Objektif", "Strategi"], jawapan: 0, penerangan: "Visi ialah gambaran masa depan yang aspiratif bagi sesebuah organisasi.", markah: 1, contoh: true },
  { id: "q-t4-7", tingkatan: "T4", bab: 3, tajukBab: "Penetapan Visi, Misi dan Objektif Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Sasaran yang boleh diukur, realistik dan terhad masanya dikenali sebagai...", pilihan: ["Visi", "Misi", "Objektif", "Nilai"], jawapan: 2, penerangan: "Objektif yang berkesan mestilah SMART iaitu spesifik, boleh diukur, realistik, relevan dan terhad masa.", markah: 1, contoh: true },
  { id: "q-t4-8", tingkatan: "T4", bab: 3, tajukBab: "Penetapan Visi, Misi dan Objektif Perniagaan", jenis: "benar_salah", kesukaran: "sederhana", soalan: "Kegagalan menetapkan visi, misi dan objektif boleh menyebabkan organisasi hilang arah.", pilihan: ["Benar", "Palsu"], jawapan: 0, penerangan: "Tanpa hala tuju yang jelas, organisasi sukar merancang dan membuat keputusan dengan berkesan.", markah: 1, contoh: true },
  { id: "q-t4-9", tingkatan: "T4", bab: 4, tajukBab: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan", jenis: "objektif", kesukaran: "mudah", soalan: "Bahagian yang bertanggungjawab mengkaji pasaran dan memasarkan produk ialah...", pilihan: ["Pengeluaran", "Pemasaran", "Kewangan", "Pentadbiran"], jawapan: 1, penerangan: "Bahagian pemasaran menguruskan kajian pasaran, promosi dan hubungan pelanggan.", markah: 1, contoh: true },
  { id: "q-t4-10", tingkatan: "T4", bab: 4, tajukBab: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Penyata kewangan utama yang disediakan oleh bahagian kewangan termasuk...", pilihan: ["Penyata pendapatan dan kunci kira-kira", "Jadual gaji sahaja", "Senarai stok", "Surat minit"], jawapan: 0, penerangan: "Bahagian kewangan menyediakan penyata kewangan untuk perancangan dan kawalan.", markah: 1, contoh: true },
  { id: "q-t4-11", tingkatan: "T4", bab: 4, tajukBab: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan", jenis: "benar_salah", kesukaran: "sukar", soalan: "Setiap bahagian fungsian dalam organisasi boleh beroperasi secara berasingan tanpa koordinasi.", pilihan: ["Benar", "Palsu"], jawapan: 1, penerangan: "Bahagian-bahagian perlu berkoordinasi untuk memastikan operasi perniagaan lancar dan matlamat dicapai.", markah: 2, contoh: true },
  { id: "q-t4-12", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "objektif", kesukaran: "sukar", soalan: "Antara berikut, bentuk perniagaan yang sesuai untuk mengumpul modal daripada ramai pemegang saham ialah...", pilihan: ["Pemilikan tunggal", "Perkongsian", "Syarikat berhad", "Koperasi"], jawapan: 2, penerangan: "Syarikat berhad dapat mengumpul modal melalui jualan saham kepada pemegang saham.", markah: 2, contoh: true },
  { id: "q-t5-1", tingkatan: "T5", bab: 1, tajukBab: "Pengurusan Sumber Manusia", jenis: "objektif", kesukaran: "mudah", soalan: "Proses menguruskan pekerja daripada pengambilan hingga pembangunan dikenali sebagai...", pilihan: ["Pengurusan kewangan", "Pengurusan sumber manusia", "Pengurusan pemasaran", "Pengurusan operasi"], jawapan: 1, penerangan: "Pengurusan sumber manusia melibatkan semua aktiviti berkaitan pekerja.", markah: 1, contoh: true },
  { id: "q-t5-2", tingkatan: "T5", bab: 1, tajukBab: "Pengurusan Sumber Manusia", jenis: "objektif", kesukaran: "sederhana", soalan: "Susunan peringkat dan hubungan jawatan dalam sesebuah organisasi ialah...", pilihan: ["Struktur organisasi", "Pelan perniagaan", "Penyata kewangan", "Aliran tunai"], jawapan: 0, penerangan: "Struktur organisasi menentukan hierarki dan hubungan tugas dalam sesebuah organisasi.", markah: 1, contoh: true },
  { id: "q-t5-3", tingkatan: "T5", bab: 1, tajukBab: "Pengurusan Sumber Manusia", jenis: "benar_salah", kesukaran: "sederhana", soalan: "Motivasi pekerja boleh ditingkatkan melalui penggajian yang adil dan peluang pembangunan.", pilihan: ["Benar", "Palsu"], jawapan: 0, penerangan: "Penggajian adil, pengiktirafan dan pembangunan kerjaya membantu memotivasi pekerja.", markah: 1, contoh: true },
  { id: "q-t5-4", tingkatan: "T5", bab: 2, tajukBab: "Pengurusan Sumber Fizikal dan Teknologi", jenis: "objektif", kesukaran: "mudah", soalan: "Antara berikut, yang manakah sumber fizikal?", pilihan: ["Paten", "Bangunan kilang", "Tanda dagangan", "Hak cipta"], jawapan: 1, penerangan: "Bangunan kilang ialah aset ketara manakala paten, tanda dagangan dan hak cipta ialah harta intelek.", markah: 1, contoh: true },
  { id: "q-t5-5", tingkatan: "T5", bab: 2, tajukBab: "Pengurusan Sumber Fizikal dan Teknologi", jenis: "objektif", kesukaran: "sukar", soalan: "Teknologi yang membantu mengurus inventori dengan lebih cekap ialah...", pilihan: ["Sistem pengurusan inventori berasaskan awan", "Kunci manual", "Buku lejar", "Mesin taip"], jawapan: 0, penerangan: "Sistem digital membolehkan perniagaan menjejaki stok secara masa nyata dan mengurangkan kesilapan.", markah: 2, contoh: true },
  { id: "q-t5-6", tingkatan: "T5", bab: 3, tajukBab: "Sumber Pembiayaan Perniagaan", jenis: "objektif", kesukaran: "mudah", soalan: "Dana yang disumbangkan oleh pemilik perniagaan ialah...", pilihan: ["Pinjaman bank", "Modal sendiri", "Geran", "Saham"], jawapan: 1, penerangan: "Modal sendiri diperoleh daripada simpanan atau sumbangan pemilik.", markah: 1, contoh: true },
  { id: "q-t5-7", tingkatan: "T5", bab: 3, tajukBab: "Sumber Pembiayaan Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Pembiayaan luaran untuk perniagaan termasuk...", pilihan: ["Modal sendiri sahaja", "Pinjaman bank dan pelabur", "Hanya keuntungan", "Tiada pilihan"], jawapan: 1, penerangan: "Pembiayaan luaran diperoleh daripada pihak luar seperti bank dan pelabur.", markah: 1, contoh: true },
  { id: "q-t5-8", tingkatan: "T5", bab: 3, tajukBab: "Sumber Pembiayaan Perniagaan", jenis: "benar_salah", kesukaran: "sukar", soalan: "Setiap sumber pembiayaan mempunyai kos, risiko dan syarat yang berbeza.", pilihan: ["Benar", "Palsu"], jawapan: 0, penerangan: "Pemilihan sumber pembiayaan perlu mempertimbangkan kos, risiko dan keupayaan membayar balik.", markah: 1, contoh: true },
  { id: "q-t5-9", tingkatan: "T5", bab: 4, tajukBab: "Penyata Kewangan Perniagaan", jenis: "objektif", kesukaran: "mudah", soalan: "Laporan yang menunjukkan kedudukan kewangan pada tarikh tertentu ialah...", pilihan: ["Penyata pendapatan", "Kunci kira-kira", "Baucar", "Invois"], jawapan: 1, penerangan: "Kunci kira-kira menunjukkan aset, liabiliti dan ekuiti pada satu titik masa.", markah: 1, contoh: true },
  { id: "q-t5-10", tingkatan: "T5", bab: 4, tajukBab: "Penyata Kewangan Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Persamaan asas kunci kira-kira ialah...", pilihan: ["Hasil - Perbelanjaan = Untung", "Aset = Liabiliti + Ekuiti", "Jualan + Stok = Liabiliti", "Modal = Aset - Hutang"], jawapan: 1, penerangan: "Kunci kira-kira mesti seimbang mengikut persamaan Aset = Liabiliti + Ekuiti.", markah: 1, contoh: true },
  { id: "q-t5-11", tingkatan: "T5", bab: 5, tajukBab: "Persediaan Menjadi Usahawan", jenis: "objektif", kesukaran: "mudah", soalan: "Individu yang mengenal pasti peluang dan mengatur sumber untuk mencipta perniagaan ialah...", pilihan: ["Pekerja", "Usahawan", "Pemiutang", "Pengedar"], jawapan: 1, penerangan: "Usahawan ialah individu yang memulakan dan menguruskan perniagaan.", markah: 1, contoh: true },
  { id: "q-t5-12", tingkatan: "T5", bab: 5, tajukBab: "Persediaan Menjadi Usahawan", jenis: "benar_salah", kesukaran: "sederhana", soalan: "Usahawan perlu mempunyai ketahanan dan keupayaan mengatasi kegagalan.", pilihan: ["Benar", "Palsu"], jawapan: 0, penerangan: "Ketahanan emosi dan pembelajaran daripada kegagalan penting dalam keusahawanan.", markah: 1, contoh: true },
  { id: "q-t5-13", tingkatan: "T5", bab: 6, tajukBab: "Persediaan Memulakan Perniagaan", jenis: "objektif", kesukaran: "sederhana", soalan: "Proses mengumpul maklumat tentang pelanggan dan pesaing ialah...", pilihan: ["Pendaftaran", "Kajian pasaran", "Penggajian", "Pelan pengeluaran"], jawapan: 1, penerangan: "Kajian pasaran membantu usahawan memahami keperluan dan persaingan.", markah: 1, contoh: true },
  { id: "q-t5-14", tingkatan: "T5", bab: 7, tajukBab: "Merancang Pengendalian Perniagaan", jenis: "objektif", kesukaran: "sukar", soalan: "Dokumen yang menerangkan visi, strategi dan unjuran kewangan sesebuah perniagaan ialah...", pilihan: ["Surat berhenti kerja", "Pelan perniagaan", "Resit", "Kad stok"], jawapan: 1, penerangan: "Pelan perniagaan digunakan untuk merancang dan mendapatkan pembiayaan.", markah: 2, contoh: true },
];

const practiceQuestions: PracticeQuestion[] = [
  { id: "p-t4-1", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "Objektif", soalan: "Namakan dua tujuan perniagaan bermotifkan keuntungan.", markah: 2, skema: "Memperoleh keuntungan; memenuhi keperluan pengguna / mengembangkan aktiviti ekonomi.", contoh: true },
  { id: "p-t4-2", tingkatan: "T4", bab: 1, tajukBab: "Tujuan Perniagaan dan Pemilikan Perniagaan", jenis: "Struktur", soalan: "Terangkan perbezaan antara pemilikan tunggal dan syarikat.", markah: 4, skema: "Pemilikan tunggal dimiliki seorang; syarikat mempunyai entiti berasingan, liabiliti terhad dan boleh mengumpul modal melalui saham.", contoh: true },
  { id: "p-t4-3", tingkatan: "T4", bab: 2, tajukBab: "Trend Semasa dalam Perniagaan", jenis: "Objektif", soalan: "Nyatakan dua trend semasa dalam dunia perniagaan.", markah: 2, skema: "Digitalisasi; kelestarian; ekonomi gig; perdagangan antarabangsa.", contoh: true },
  { id: "p-t4-4", tingkatan: "T4", bab: 2, tajukBab: "Trend Semasa dalam Perniagaan", jenis: "Esei", soalan: "Bincangkan kesan perubahan persekitaran perniagaan terhadap organisasi.", markah: 6, skema: "Perubahan teknologi meningkatkan kecekapan; perubahan ekonomi mempengaruhi permintaan; organisasi perlu menyesuaikan strategi dan produk.", contoh: true },
  { id: "p-t4-5", tingkatan: "T4", bab: 3, tajukBab: "Penetapan Visi, Misi dan Objektif Perniagaan", jenis: "Objektif", soalan: "Bezakan visi dan misi.", markah: 2, skema: "Visi ialah gambaran aspirasi masa depan; misi menerangkan tujuan utama dan cara organisasi beroperasi.", contoh: true },
  { id: "p-t4-6", tingkatan: "T4", bab: 3, tajukBab: "Penetapan Visi, Misi dan Objektif Perniagaan", jenis: "Struktur", soalan: "Berikan tiga ciri objektif perniagaan yang berkesan.", markah: 3, skema: "Spesifik; boleh diukur; realistik / relevan / terhad masa.", contoh: true },
  { id: "p-t4-7", tingkatan: "T4", bab: 4, tajukBab: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan", jenis: "Objektif", soalan: "Nyatakan dua fungsi bahagian pengeluaran.", markah: 2, skema: "Menghasilkan barang/perkhidmatan; memastikan kualiti dan kecekapan pengeluaran.", contoh: true },
  { id: "p-t4-8", tingkatan: "T4", bab: 4, tajukBab: "Bahagian-bahagian Fungsian Utama dalam Organisasi Perniagaan", jenis: "Struktur", soalan: "Terangkan peranan bahagian kewangan dalam sesebuah organisasi.", markah: 4, skema: "Menguruskan modal, perbelanjaan dan hasil; menyediakan penyata kewangan; membantu perancangan dan kawalan.", contoh: true },
  { id: "p-t5-1", tingkatan: "T5", bab: 1, tajukBab: "Pengurusan Sumber Manusia", jenis: "Objektif", soalan: "Namakan dua aktiviti dalam pengurusan sumber manusia.", markah: 2, skema: "Pengambilan pekerja; latihan; penilaian prestasi; pembangunan pekerja.", contoh: true },
  { id: "p-t5-2", tingkatan: "T5", bab: 1, tajukBab: "Pengurusan Sumber Manusia", jenis: "Esei", soalan: "Bincangkan kepentingan sistem penggajian yang adil kepada sesebuah perniagaan.", markah: 6, skema: "Meningkatkan motivasi; mengekalkan pekerja berbakat; mengurangkan penarikan pekerja; menyokong produktiviti dan moral.", contoh: true },
  { id: "p-t5-3", tingkatan: "T5", bab: 2, tajukBab: "Pengurusan Sumber Fizikal dan Teknologi", jenis: "Objektif", soalan: "Bezakan sumber fizikal dan harta intelek.", markah: 2, skema: "Sumber fizikal ialah aset ketara; harta intelek ialah ciptaan bukan ketara seperti paten dan tanda dagangan.", contoh: true },
  { id: "p-t5-4", tingkatan: "T5", bab: 3, tajukBab: "Sumber Pembiayaan Perniagaan", jenis: "Objektif", soalan: "Nyatakan dua sumber pembiayaan dalaman.", markah: 2, skema: "Modal sendiri; keuntungan ditahan; simpanan pemilik.", contoh: true },
  { id: "p-t5-5", tingkatan: "T5", bab: 3, tajukBab: "Sumber Pembiayaan Perniagaan", jenis: "Struktur", soalan: "Bandingkan kelebihan dan kekurangan pembiayaan dalaman dan luaran.", markah: 5, skema: "Dalaman: tiada kos faedah tetapi terhad modal. Luaran: modal besar tetapi menambah liabiliti dan kos.", contoh: true },
  { id: "p-t5-6", tingkatan: "T5", bab: 4, tajukBab: "Penyata Kewangan Perniagaan", jenis: "Objektif", soalan: "Nyatakan persamaan asas kunci kira-kira.", markah: 1, skema: "Aset = Liabiliti + Ekuiti.", contoh: true },
  { id: "p-t5-7", tingkatan: "T5", bab: 4, tajukBab: "Penyata Kewangan Perniagaan", jenis: "Struktur", soalan: "Terangkan kegunaan penyata pendapatan kepada pemilik perniagaan.", markah: 4, skema: "Menilai prestasi; mengukur keuntungan; membantu perancangan dan kawalan; membuat keputusan.", contoh: true },
  { id: "p-t5-8", tingkatan: "T5", bab: 5, tajukBab: "Persediaan Menjadi Usahawan", jenis: "Objektif", soalan: "Namakan tiga ciri usahawan yang berjaya.", markah: 3, skema: "Inovatif; berani mengambil risiko; tekun / berorientasikan matlamat.", contoh: true },
  { id: "p-t5-9", tingkatan: "T5", bab: 6, tajukBab: "Persediaan Memulakan Perniagaan", jenis: "Struktur", soalan: "Huraikan tiga langkah penting sebelum memulakan perniagaan.", markah: 5, skema: "Kajian pasaran; pendaftaran dan lesen; anggaran modal dan lokasi.", contoh: true },
  { id: "p-t5-10", tingkatan: "T5", bab: 7, tajukBab: "Merancang Pengendalian Perniagaan", jenis: "Esei", soalan: "Bincangkan kepentingan pelan perniagaan kepada usahawan baharu.", markah: 6, skema: "Membantu perancangan; mendapatkan pembiayaan; mengukur prestasi; mengurangkan risiko.", contoh: true },
];

const announcements: Announcement[] = [
  { id: "ann-1", tajuk: "Portal Pembelajaran Perniagaan Dilancarkan", isi: "Semua nota, kuiz dan soalan latihan T4/T5 kini boleh diakses melalui portal PANITIA PERNIAGAAN.", tarikh: "2026-11-01", jenis: "Umum", disemat: true },
  { id: "ann-2", tajuk: "Kuiz Online Bab 1-4 T4 Dibuka", isi: "Murid digalakkan mencuba kuiz interaktif untuk menguji pemahaman asas perniagaan.", tarikh: "2026-11-03", jenis: "Peperiksaan", disemat: false },
  { id: "ann-3", tajuk: "Soalan Percubaan Negeri Dalam Proses Muat Naik", isi: "Guru diminta memuat naik kertas soalan dan skema yang sah untuk dikongsi kepada murid.", tarikh: "2026-11-05", jenis: "Penting", disemat: true },
  { id: "ann-4", tajuk: "Tips Ulang Kaji SPM Perniagaan", isi: "Fokus pada bab kewangan, sumber pembiayaan dan pengurusan sumber manusia untuk persediaan SPM.", tarikh: "2026-11-06", jenis: "Aktiviti", disemat: false },
];

const users = [
  { id: "u-admin", nama: "Pentadbir Panitia", email: "admin@panitia.my", kataLaluan: "admin123", peranan: "admin" as const },
  { id: "u-guru", nama: "Cikgu Aini", email: "guru@panitia.my", kataLaluan: "guru123", peranan: "guru" as const, kelas: "4 Amanah / 5 Bestari" },
  { id: "u-murid", nama: "Murid Demo", email: "murid@panitia.my", kataLaluan: "murid123", peranan: "murid" as const, kelas: "5 Bestari" },
];

function examPapers(): ExamPaper[] {
  const papers: ExamPaper[] = [];
  const states = NEGERI_PERCUBAAN;
  const years = [2023, 2024, 2025];
  for (const negeri of states) {
    for (const tahun of years) {
      for (const tingkatan of ["T4", "T5"] as const) {
        for (const kertas of ["Kertas 1", "Kertas 2"]) {
          papers.push({
            id: `trial-${negeri}-${tahun}-${tingkatan}-${kertas}`.replace(/\s+/g, "-"),
            kategori: "percubaan",
            negeri,
            tahun,
            tingkatan,
            kertas,
            tajuk: `Kertas Percubaan ${negeri} ${tahun} - Perniagaan ${tingkatan}`,
            jenisDokumen: "Kertas Percubaan",
            status: "placeholder",
            catatan: "Slot dokumen rasmi. Muat naik PDF dan skema pemarkahan oleh guru/admin.",
          });
        }
      }
    }
  }
  return papers;
}

function spmPapers(years: number[]): ExamPaper[] {
  const papers: ExamPaper[] = [];
  for (const tahun of years) {
    for (const kertas of ["Kertas 1", "Kertas 2"]) {
      papers.push({
        id: `spm-${tahun}-${kertas}`,
        kategori: "spm",
        tahun,
        tingkatan: "T5",
        kertas,
        tajuk: `Soalan SPM Perniagaan ${tahun} - ${kertas}`,
        jenisDokumen: "Soalan",
        status: "placeholder",
        catatan: "Rujukan rasmi SPM. Hanya dokumen sah yang dibenarkan dikongsi.",
      });
      papers.push({
        id: `spm-${tahun}-${kertas}-skema`,
        kategori: "spm",
        tahun,
        tingkatan: "T5",
        kertas,
        tajuk: `Skema Pemarkahan SPM Perniagaan ${tahun} - ${kertas}`,
        jenisDokumen: "Skema Pemarkahan",
        status: "placeholder",
        catatan: "Skema pemarkahan rasmi akan dipaparkan apabila dokumen dimuat naik.",
      });
    }
  }
  return papers;
}

export function seedEduData(): EduData {
  const spmYears = [2021, 2022, 2023, 2024, 2025];
  const percubaanYears = [2023, 2024, 2025];
  return {
    chapters,
    noteResources: noteResources(),
    quizQuestions,
    practiceQuestions,
    examPapers: [...examPapers(), ...spmPapers(spmYears)],
    announcements,
    users,
    attempts: [],
    bookmarks: [],
    recentItems: [],
    downloads: [],
    spmYears,
    percubaanYears,
  };
}

export const ESSENTIAL_T5_TOPICS = [
  "Penyata pendapatan dan kunci kira-kira",
  "Sumber pembiayaan dalaman dan luaran",
  "Pengurusan sumber manusia",
  "Persediaan memulakan perniagaan",
  "Pelan perniagaan",
];

export const SPM_REVISION_TIPS = [
  "Baca definisi dan istilah penting bagi setiap bab.",
  "Latih soalan struktur dan esei menggunakan skema pemarkahan.",
  "Fahami persamaan kewangan: Aset = Liabiliti + Ekuiti.",
  "Bandingkan bentuk pemilikan, sumber pembiayaan dan strategi perniagaan.",
  "Ulang kaji soalan percubaan negeri mengikut topik yang kerap keluar.",
];
