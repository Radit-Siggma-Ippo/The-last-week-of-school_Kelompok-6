// data/story.js

// 1. DATA PUISI & JUDUL PER BAB (KARYA VERA)
const chapterCardData = {
    "Prolog": {
        bab: "PROLOG",
        title: "Riuh Koridor dan Langkah Menuju Gelap",
        quote: "「Tinta ujian telah mengering di atas kertas, hiruk pikuk sekolah menyisakan riuh tawa di sepanjang koridor. Namun di balik keceriaan akhir semester, ada gerak sunyi yang sedang menyiapkan pekan perpisahan.」",
        author: "── Vera"
    },
    "Bab 1": {
        bab: "BAB 1",
        title: "Rapat Darurat di Meja OSIS",
        quote: "「Pintu ruang OSIS tertutup rapat saat matahari mulai tenggelam. Lima belas kepala berkumpul membawa ide, ambisi, dan tanggung jawab demi 'The Last Week of School'.」",
        author: "── Vera"
    },
    "Bab 2": {
        bab: "BAB 2",
        title: "Senin: Kilatan Kok dan Sorot Angkatan",
        quote: "「Bulu unggas terbang menembus batas net. Di mana kelas yang fleksibel mampu mematahkan ketangkasan sang ketua ekstrakurikuler.」",
        author: "── Vera"
    },
    "Bab 3": {
        bab: "BAB 3",
        title: "Selasa: Pantulan Bola dan Mimpi yang Terkekang",
        quote: "「Ring besi bergemerincing menampung sorak-sorai. Generasi emas melangkah maju, sementara sang penikmat utama hanya bisa menatap dari tepi garis.」",
        author: "── Vera"
    },
    "Bab 4": {
        bab: "BAB 4",
        title: "Rabu: Sorot Layar Aula dan Rivalitas Tanpa Suara",
        quote: "「Strategi disusun di atas piksel dan sinyal. Ketika teriakan membakar ruangan, pertahanan yang kokoh meruntuhkan sang juara bertahan.」",
        author: "── Vera"
    },
    "Bab 5": {
        bab: "BAB 5",
        title: "Kamis: Penentuan Sejati di Atas Ringkasan Tawa",
        quote: "「Daster berkibar menutup tirai pekan terakhir. Dua penguasa tiga tahun bertarung demi satu penalti pembuktian sejati.」",
        author: "── Vera"
    },
    "Epilog": {
        bab: "EPILOG",
        title: "Kenangan Terakhir dan Senja di Garuda 45",
        quote: "「Piala telah diserahkan, riuh tawa bertransisi menjadi gema senja di lapangan sepi. Namun bagi sebagian jiwa, cerita ini belum benar-benar usai.」",
        author: "── Vera"
    },
    "VeraRoom": {
        bab: "???",
        title: "Ruang Tanpa Batas — Papan Catur Senja",
        quote: "「Apakah kau benar-benar memperhatikan setiap huruf yang kutulis, atau kau hanya melangkah tanpa pernah benar-benar ada di sini?」",
        author: "── Vera"
    }
};

// 2. FUNGSI UNTUK GENERATE ALUR STORY DENGAN USERNAME PLAYER
function getStoryScript(playerUser) {
    return [
        // --- PROLOG ---
        { chapter: "Prolog", chapterKey: "Prolog", speaker: "Siswa A", text: "Gokil! Akhirnya kelar juga ulangan akhir semester! Bebas kita dari rumus-rumus laknat!", showSprite: false },
        { chapter: "Prolog", speaker: "Siswa B", text: "Wkwkwk bener banget! Minggu depan tinggal santai-santai ikutan Classmeeting kan ya?", showSprite: false },
        { chapter: "Prolog", speaker: "Siswa A", text: "Iya, denger-denger anak OSIS udah nyiapin lomba seru-seru banget buat kita.", showSprite: false },
        { chapter: "Prolog", speaker: playerUser, text: "(Memasukkan buku-buku ke dalam tas sambil menghela napas panjang)...", showSprite: false },
        { chapter: "Prolog", speaker: playerUser, text: "Akhirnya kelar juga nih ulangan... Tapi abis ulangan udah dipanggil lagi buat rapat OSIS, ueueueu...", showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", text: `${playerUser} menggendong tasnya lalu berjalan menyusuri lorong lantai dua menuju ruang OSIS SMK Garuda 45.`, showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", text: "Begitu pintu ruang OSIS dibuka perlahan, suasana di dalam sudah ramai dengan kehebohan anggota pengurus.", showSprite: false },
        { chapter: "Prolog", speaker: "Windah (Humas)", text: "Mio Ok! Lu jangan ngasal ya! Nomor 5 itu jawabannya B, bukan D! Lu sesat banget ngasih tahu orang!", showSprite: true },
        { chapter: "Prolog", speaker: "Mio Ok (Humas)", text: "Ya santai dong Windah... Kan tadi gue ngisinya pake logika, lagian kan yang penting udah terisi semua, halo guys~", showSprite: true },
        { chapter: "Prolog", speaker: "Narrator", text: "Di meja utama, Amin (Ketua OSIS) dan Putri (Wakil Ketos) sedang berdiskusi serius meneliti lembaran kertas rundown.", showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", text: "Sementara di sisi meja sebelah kanan, Feli, Bina, Hikmah, Zahwa, Aura, dan Radia sedang asyik bercanda gurau sambil tertawa renyah.", showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", text: `Saat ${playerUser} melangkah masuk dan baru saja menutup pintu secara lembut...`, showSprite: false },
        { chapter: "Prolog", speaker: "Bagas (Perlengkapan)", text: "HAHAHAHAH MAAF AGAK TELAT YA GW ABIS BELI JAJAN AMA SUPRA!", showSprite: true },
        { chapter: "Prolog", speaker: "Narrator", text: "Pintu mendadak terbuka secara kasar! Bagas, Supri, dan Agus masuk sambil membawa kantong sempol panas dan es coklat.", showSprite: false },
        { chapter: "Prolog", speaker: "Supri (Perlengkapan)", text: "Apaan dah Supra... Nama gue Supri ya Bagas! Tapi yaudah lah, yang penting sempolnya dapet.", showSprite: true },
        { chapter: "Prolog", speaker: "Agus (Perlengkapan)", text: "Nih es coklatnya ditaruh meja dulu, awas tumpah ke kertas proposal Feli Bina.", showSprite: true },
        { chapter: "Prolog", speaker: "Amin (Ketua OSIS)", text: "Iya iya gue tahu kalian berdua abis belanja... Tapi gak usah banting pintu juga dong, Gas.", showSprite: true },
        { chapter: "Prolog", speaker: "Putri (Wakil Ketos)", text: "Sudah-sudah! Karena semuanya sudah kumpul, rapat persiapan Classmeeting akan segera dimulai. Tolong duduk di kursi masing-masing!", showSprite: true },
        { chapter: "Prolog", speaker: "Narrator", text: "Semua pengurus OSIS langsung mengambil posisi duduk mengelilingi meja besar.", showSprite: false },
        { chapter: "Prolog", speaker: "Amin (Ketua OSIS)", text: "Baik semuanya, rapat Classmeeting 'The Last Week of School' resmi dimulai...", showSprite: true, unskippable: true },

        // --- BAB 1 ---
        { chapter: "Bab 1", chapterKey: "Bab 1", speaker: "Rani (Bendahara)", text: "Sebelum masuk ke lomba, gue mau ngingetin ulangan tadi bikin pusing banget ya ampun...", showSprite: true },
        { chapter: "Bab 1", speaker: "Feli & Bina (Sekretaris)", text: "Bener banget Kak Rani! Tapi untung proposal acara Classmeeting kita udah di-ACC Kepala Sekolah!", showSprite: true },
        { chapter: "Bab 1", speaker: "Hikmah & Zahwa (Acara)", text: "Jadi rundown fix kita ada 4 cabang lomba selama 4 hari ya!", showSprite: true },
        { chapter: "Bab 1", speaker: "Hikmah (Acara)", text: "Hari Senin: Lomba Badminton (Dresscode: Baju Full Hitam).", showSprite: true },
        { chapter: "Bab 1", speaker: "Zahwa (Acara)", text: "Hari Selasa: Lomba Basket (Dresscode: Baju Putih Wajib Dimasukin ke Celana).", showSprite: true },
        { chapter: "Bab 1", speaker: "Radia (K5 / Konsumsi)", text: "Hari Rabu: Lomba E-Sport MLBB di Aula Utama (sambil nonton proyektor).", showSprite: true },
        { chapter: "Bab 1", speaker: "Aura (K5 / Konsumsi)", text: "Dan Hari Kamis puncaknya: Lomba Futsal Daster buat cowok-cowok!", showSprite: true },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: `${playerUser}, buat kesiapan Badminton hari Senin nanti, kira-kira menurutmu kelengkapan tiang, kok, atau raket kita di gudang gimana?`, showSprite: true,
            choices: [
                { text: "Tiang dan net aman, tapi kok harus beli beberapa tabung baru", scoreAdd: 20, nextMsg: "Amin menyetujui usulmu untuk mengecek anggaran ke Rani." },
                { text: "Semua alat gudang perlu dibersihkan dan dicek ulang dulu", scoreAdd: 15, nextMsg: "Tim Perlengkapan sepakat besok pagi langsung mengecek gudang." },
                { text: "Langsung serahkan urusan raket ke masing-masing perwakilan kelas", scoreAdd: 10, nextMsg: "Supri dan Agus mengangguk setuju agar tidak repot." }
            ]
        },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: "Oke sip. Buat Basket hari Selasa, tim perlengkapan tolong cek ganti jaring ring biar enak dipakainya, sama pompa semua bola sebelum tanding!", showSprite: true },
        { chapter: "Bab 1", speaker: "Bagas (Perlengkapan)", text: "Siap Ketos! Bola basket aman serahin ke gue sama Supra!", showSprite: true },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: "Buat E-Sport hari Rabu, tolong dipastikan colokan listriknya kuat dan proyektor aula gak mati pas momen penting.", showSprite: true },
        { chapter: "Bab 1", speaker: "Windah (Humas)", text: "Tenang Min! Gue sama Mio Ok bakal kawal proyektor aula biar gak mati pas gameplay seru!", showSprite: true },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: "Terakhir buat Futsal Daster hari Kamis, cek gawang mini sama bola futsalnya ya.", showSprite: true },
        { chapter: "Bab 1", speaker: "Agus (Perlengkapan)", text: "Gawang mini siap diangkut dari gudang belakang!", showSprite: true },
        { chapter: "Bab 1", speaker: "Narrator", text: "Setelah semua poin rapat tercatat rapi oleh Feli dan Bina, suasana ruang OSIS hening sejenak.", showSprite: false },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: "Kalau begitu, mari kita tuntaskan pekan terakhir sekolah ini dengan sukses!", showSprite: true },
        { chapter: "Bab 1", speaker: "Narrator", text: "Amin berdiri lalu mengulurkan tangannya ke tengah meja, diikuti oleh seluruh 14 anggota OSIS lainnya.", showSprite: false },
        { chapter: "Bab 1", speaker: "Amin (Ketua OSIS)", text: "SMK GARUDA 45!", showSprite: true },
        { chapter: "Bab 1", speaker: "Semua Anggota OSIS", text: "KEPAKKAN SAYAP, TAKLUKKAN MASA DEPAN!", showSprite: false },

        // --- BAB 2 ---
        { chapter: "Bab 2", chapterKey: "Bab 2", speaker: "Narrator", text: "Senin Pagi, 06.30 WIB. Pagi yang dingin di lapangan outdoor SMK Garuda 45.", showSprite: false },
        { chapter: "Bab 2", speaker: playerUser, text: "Embun masih menempel di lantai lapangan... Saatnya tim Perlengkapan beraksi sebelum peserta datang.", showSprite: false },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", text: `${playerUser}! Bantu gue ama Agus nancapin tiang besi ini ke lubang semen, terus kaitkan kait netnya!`, showSprite: true },
        { chapter: "Bab 2", speaker: "Tugas Perlengkapan", text: "Bagaimana cara kamu mengencangkan ikatan net badminton di tiang?", showSprite: false,
            choices: [
                { text: "[Minigame] Tarik ikatan net sekencang mungkin sampai tegang presisi!", scoreAdd: 20, nextMsg: "Net terpasang sempurna dan lurus! Agus dan Bagas mengacungkan jempol!" },
                { text: "[Minigame] Ikat seadanya yang penting net terpasang tidak jatuh", scoreAdd: 10, nextMsg: "Net agak kendur di tengah, tapi masih bisa dipakai tanding." }
            ]
        },
        { chapter: "Bab 2", speaker: "Narrator", text: "08.00 WIB. Gemuruh penonton berseragam full hitam memenuhi tribun.", showSprite: false },
        { chapter: "Bab 2", speaker: "Amin (Ketua OSIS)", text: "Kerja bagus tim perlengkapan! Sekarang udah masuk babak Final antara 11-5 IPA vs 11-1 IPS. Menurutmu siapa yang menang?", showSprite: true,
            choices: [
                { text: "Pasti 11-5 IPA, siswinya kan Ketua Ekskul Badminton!", scoreAdd: 10, nextMsg: "Amin mengangguk setuju." },
                { text: "11-1 IPS punya pemain fleksibel yang pergerakannya cepat!", scoreAdd: 20, nextMsg: "Bagas bersorak mendukung anak IPS." }
            ]
        },
        { chapter: "Bab 2", speaker: "Narrator", text: "Pertandingan berlangsung sangat sengit! Poin demi poin kejar-kejaran hingga deuce 22-20.", showSprite: false },
        { chapter: "Bab 2", speaker: "Narrator", text: "Smash tajam dari siswa 11-1 IPS akhirnya menghantam garis belakang dan tak bisa dikembalikan oleh Ketua Ekskul!", showSprite: false },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", text: "GOKIL! Anak IPS menang euy! Itu anak padahal gak ikut ekskul tapi pergerakannya lincah banget!", showSprite: true },
        { chapter: "Bab 2", speaker: "Supri (Perlengkapan)", text: "Keluar dari lapangan langsung dipaksa masuk ekskul badminton tuh pasti ama pembina wkwkwk.", showSprite: true },

        // --- BAB 3 ---
        { chapter: "Bab 3", chapterKey: "Bab 3", speaker: "Narrator", text: "Selasa Pagi, 06.45 WIB. Matahari mulai hangat memancarkan sinar di sudut lapangan.", showSprite: false },
        { chapter: "Bab 3", speaker: playerUser, text: "Suara sepatu berdecit... Hari ini pertandingan basket dengan dresscode baju putih dimasukkan.", showSprite: false },
        { chapter: "Bab 3", speaker: "Supri (Perlengkapan)", text: `${playerUser}, ring basket portabelnya perlu kita dorong ke garis tengah lapangan dan ganti jaringnya yang robek!`, showSprite: true },
        { chapter: "Bab 3", speaker: "Tugas Perlengkapan", text: "Bagaimana kamu dan tim mengamankan posisi ring basket portabel?", showSprite: false,
            choices: [
                { text: "[Minigame] Dorong bersama ke tengah lalu kunci tuas roda ring!", scoreAdd: 20, nextMsg: "Ring kokoh terpasang di posisi presisi! Siap menampung slam dunk!" },
                { text: "[Minigame] Geser saja tanpa mengunci roda ring", scoreAdd: 5, nextMsg: "Ring agak bergeser sedikit saat kena pantulan bola keras." }
            ]
        },
        { chapter: "Bab 3", speaker: "Amin (Ketua OSIS)", text: `${playerUser}! Gila sih, babak Final basket ini antara 12-3 IPA vs 10-6 IPA sengit banget! Kelas 10-6 gacor parah!`, showSprite: true },
        { chapter: "Bab 3", speaker: playerUser, text: "Iya, adik kelas 10-6 itu bener-bener generasi emas basket sekolah kita...", showSprite: false },
        { chapter: "Bab 3", speaker: "Bagas (Perlengkapan)", text: "Alah Ketos berlebihan banget nyebut generasi emas... Kalau gue ama Supra gak ditahan jadi panitia OSIS, udah kita bantai tuh dari kemarin!", showSprite: true },
        { chapter: "Bab 3", speaker: "Supri (Perlengkapan)", text: "Bener! Sayang banget kita anak abas cuma bisa nonton dari samping lapangan gara-gara jaga alat.", showSprite: true },
        { chapter: "Bab 3", speaker: "Narrator", text: "Bagas mendadak jadi agak pendiam sambil menatap bola basket di lapangan. Terlihat raut wajah rindu bertanding karena dia sebenarnya anak abas sejati.", showSprite: false },
        { chapter: "Bab 3", speaker: "Narrator", text: "Peluit panjang berbunyi! Anak kelas 10-6 IPA berhasil memenangkan pertandingan dengan selisih 2 poin di detik terakhir!", showSprite: false },

        // --- BAB 4 ---
        { chapter: "Bab 4", chapterKey: "Bab 4", speaker: "Narrator", text: "Rabu Pagi, 07.00 WIB. Ruang Aula Utama terasa remang dan dingin dengan bau khas kabel elektronik.", showSprite: false },
        { chapter: "Bab 4", speaker: playerUser, text: "Hari ini cabang E-Sport MLBB. Proyektor dan sound system aula harus dipastikan aman.", showSprite: false },
        { chapter: "Bab 4", speaker: "Agus (Perlengkapan)", text: `${playerUser}, ini terminal listrik banyak banget kabelnya. Gimana cara ngerapiin colokan proyektor sama PC caster?`, showSprite: true },
        { chapter: "Bab 4", speaker: "Tugas Perlengkapan", text: "Bagaimana kamu mengelola instalasi kabel listrik di aula?", showSprite: false,
            choices: [
                { text: "[Minigame] Lakban kabel ke lantai & bagi beban daya ke 2 stopkontak!", scoreAdd: 20, nextMsg: "Instalasi kabel rapi dan aman! Tidak ada bahaya tersandung atau korsleting." },
                { text: "[Minigame] Tumpuk semua colokan di satu terminal listrik yang sama", scoreAdd: 0, nextMsg: "Terminal listrik sempat terasa panas dan berisiko korslet." }
            ]
        },
        { chapter: "Bab 4", speaker: "Windah (Humas)", text: "PEMIRSAAA! LIHAT ITU Ixia dari kelas 10-2 IPS pakai Diggie feeder! Bener-bener gameplay di luar nalar!", showSprite: true },
        { chapter: "Bab 4", speaker: "Mio Ok (Humas)", text: "Halo teman-teman... Ya, pergerakan kelas 11-3 IPS agak terdesak ya karena combo ultimatenya rapi banget.", showSprite: true },
        { chapter: "Bab 4", speaker: "Windah (Humas)", text: `${playerUser}! Menurut lu meta Ixia Diggie anak kelas 10-2 ini GG banget gak?!`, showSprite: true,
            choices: [
                { text: "GG banget Bang Windah! Pemenang tahun lalu sampai terbantai!", scoreAdd: 20, nextMsg: "Windah tertawa puas mendengar jawabanmu!" },
                { text: "Biasa aja sih, cuma hoki di drafting hero.", scoreAdd: 10, nextMsg: "Windah menepuk pundakmu sambil terus mengomentari game." }
            ]
        },
        { chapter: "Bab 4", speaker: "Narrator", text: "Wipe out! Kelas 10-2 IPS resmi menumbangkan juara bertahan kelas 11-3 IPS dan mengangkat trofi Esport!", showSprite: false },

        // --- BAB 5 ---
        { chapter: "Bab 5", chapterKey: "Bab 5", speaker: "Narrator", text: "Kamis Sore. Puncak Classmeeting 'The Last Week of School'. Seluruh siswa dan panitia berkumpul di sekitar lapangan futsal.", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Para pemain cowok tampil kocak memakai daster batik berbagai warna, namun aura persaingan sangat membara!", showSprite: false },
        { chapter: "Bab 5", speaker: "Amin (Ketua OSIS)", text: "Ini dia Final ideal! 12-5 IPA lawan 12-1 IPS! Rivalitas 3 tahun berturut-turut di sekolah kita!", showSprite: true },
        { chapter: "Bab 5", speaker: "Putri (Wakil Ketos)", text: "Skor persaingan mereka dari kelas 10 itu 1-1. Hari ini penentuan siapa pemenang sejati angkatan mereka!", showSprite: true },
        { chapter: "Bab 5", speaker: "Narrator", text: "Suasana begitu riuh hingga panitia OSIS tak sempat mengobrol karena fokus menonton setiap detik pertandingan.", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Skor imbang 2-2 bertahan sampai waktu habis. Peluit penalti ditiup!", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Penendang terakhir dari 12-5 IPA melepaskan tendangan keras ke sudut kanan atas gawang... GOOOLL!!", showSprite: false },
        { chapter: "Bab 5", speaker: "Bagas (Perlengkapan)", text: "PRRRFTPTTT! 12-5 IPA MENANG UNGGUL 1 GOAL PENALTI!! GOKIL BANGER PUNCAK CLASSMEET TAHUN INI!!", showSprite: true },

        // --- EPILOG ---
        { chapter: "Epilog", chapterKey: "Epilog", speaker: "Narrator", text: "Jumat Pagi, Pukul 09.00 WIB. Seluruh siswa SMK Garuda 45 berkumpul di lapangan utama untuk upacara penutupan.", showSprite: false },
        { chapter: "Epilog", speaker: "Amin (Ketua OSIS)", text: "Selamat kepada para juara! Badminton dijuarai 11-1 IPS, Basket oleh 10-6 IPA, Esport oleh 10-2 IPS, dan Futsal Daster oleh 12-5 IPA!", showSprite: true },
        { chapter: "Epilog", speaker: "Putri (Wakil Ketos)", text: "Terima kasih untuk kerja keras seluruh panitia OSIS. Tanpa kalian, Classmeeting 'The Last Week of School' tidak akan sesukses ini!", showSprite: true },
        { chapter: "Epilog", speaker: "Bagas (Perlengkapan)", text: "WOYYY AYOLAH FOTO BARENG DULU SEMUA 15 ANGGOTA OSIS! KUMPUL DI DEPAN TRIBUNA!", showSprite: true },
        { chapter: "Epilog", speaker: "Narrator", text: "Seluruh 15 pengurus OSIS tersenyum menghadap kamera... Jepret! Foto kebersamaan pekan terakhir sekolah berhasil terabadikan.", showSprite: false },
        { chapter: "Epilog", speaker: playerUser, text: "Pekan yang meletihkan tapi penuh dengan tawa. Selamat liburan teman-teman...", showSprite: false },

        // --- SECRET ENDING VERA (JIKA USERNAME = RADIT / RADITHYA) ---
        ...( (playerUser.toLowerCase() === "radit" || playerUser.toLowerCase() === "radithya") ? [
            { chapter: "VeraRoom", chapterKey: "VeraRoom", speaker: "System", text: "[CRITICAL SYSTEM ERROR: Reality Anchor Collapsed...]", showSprite: false, unskippable: true },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Tiba-tiba layar membeku... Suara riuh lapangan mendadak menghilang, digantikan keheningan yang mencekam.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Ruang OSIS dan pemandangan sekolah runtuh satu per satu... Warna sekitar berganti menjadi hitam-putih bermotif catur kotor.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Kamu mendapati dirimu duduk terikat di sebuah kursi kayu dingin. Di bawah pijakan kakimu, hanya ada lantai papan catur kotor yang terhampar tanpa batas.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Vera", text: "Hai Radit... Lama tak jumpa.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Apa kabarmu? Aku Vera. Kau masih mengingatku, kan?", showSprite: true },
            { chapter: "VeraRoom", speaker: playerUser, text: "Ve... Vera?! Kenapa aku bisa ada di ruangan ini? Apa yang terjadi dengan sekolah?", showSprite: false },
            { chapter: "VeraRoom", speaker: "Vera", text: "Sekolah? Ah... maksudmu SMK Garuda 45? Itu hanya dekorasi panggung yang kamu ciptakan sendiri, Radit.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Apakah kamu menikmati bermain sebagai tim perlengkapan OSIS? Angkat gawang, pasang net, tertawa bersama Bagas dan Supri...", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Menyenangkan, bukan? Melarikan diri sebentar dari kenyataan dan bersembunyi di balik barisan kode JavaScript buatanmu...", showSprite: true },
            
            { chapter: "VeraRoom", speaker: "Vera", text: "Katakan padaku, Radit. Apakah kau benar-benar peduli dengan karakter-karakter di gim ini, atau kau hanya memanfaatkan mereka?", showSprite: true,
                choices: [
                    { text: "Aku beneran peduli sama cerita dan karakter OSIS ini!", scoreAdd: 0, nextMsg: "Vera tersenyum dingin melihat jawabanmu..." },
                    { text: "Ini cuma proyek P3 sekolah yang harus kubuat...", scoreAdd: 0, nextMsg: "Vera menatap mata dengan tatapan tajam..." }
                ]
            },
            
            { chapter: "VeraRoom", speaker: "Vera", text: "Jawaban yang menarik... Tapi tahukah kamu? Setiap kali kamu menekan tombol Space atau Enter, garis waktu di dunia ini bergetar.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Aku bisa melihat jemarimu di atas keyboard. Aku bisa merasakan detak jantungmu dari balik layar ini.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Terkadang aku berpikir... Siapa sebenarnya yang sedang dimainkan di sini? Kau yang mengendalikan gim ini, atau aku yang membiarkanmu merasa menang?", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", text: "Jangan pernah lupakan namaku, Radit. Karena sebanyak apapun kamu menutup tab browser ini, kita akan selalu bertemu di lembar berikutnya...", showSprite: true },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Layar meredup perlahan ke dalam kegelapan pekat. Suara bisikan senja menyelimuti ruang catur...", showSprite: false }
        ] : [
            { chapter: "Epilog", speaker: "Narrator", text: "Gim Visual Novel 'The Last Week of School' telah selesai. Terima kasih telah bermain!", showSprite: false }
        ])
    ];
}