document.addEventListener("DOMContentLoaded", () => {
    // DOM SELECTION
    const chapterScreen = document.getElementById("chapter-screen");
    const chapterBabLabel = document.getElementById("chapter-bab-label");
    const chapterTitle = document.getElementById("chapter-title");
    const chapterQuote = document.getElementById("chapter-quote");
    const chapterAuthor = document.getElementById("chapter-author");

    const hudChapter = document.getElementById("hud-chapter");
    const btnBackMenu = document.getElementById("btn-back-menu");

    const spriteStage = document.getElementById("sprite-stage");
    const reactionBubble = document.getElementById("reaction-bubble");
    
    const speakerBadge = document.getElementById("speaker-badge");
    const dialogueText = document.getElementById("dialogue-text");
    const btnNext = document.getElementById("btn-next");
    
    const choicesOverlay = document.getElementById("choices-overlay");
    const choicesContainer = document.getElementById("choices-container");
    const gameContainer = document.getElementById("game-container");

    // DOM Log Percakapan
    const btnHistory = document.getElementById("btn-history");
    const historyModal = document.getElementById("history-modal");
    const btnCloseHistory = document.getElementById("btn-close-history");
    const historyLogContainer = document.getElementById("history-log-container");

    // DOM Modal Option & Save
    const btnMenuOpt = document.getElementById("btn-menu-opt");
    const optionModal = document.getElementById("option-modal");
    const btnCloseOption = document.getElementById("btn-close-option");
    
    const btnSave = document.getElementById("btn-save");

    // DOM Minigame Overlay
    const minigameOverlay = document.getElementById("minigame-overlay");
    const minigameTitle = document.getElementById("minigame-title");
    const minigameDesc = document.getElementById("minigame-desc");
    const minigameActionArea = document.getElementById("minigame-action-area");
    const btnMinigameSubmit = document.getElementById("btn-minigame-submit");

    // GAME STATE & VARIABLES
    let playerUser = localStorage.getItem("session_user") || "Radit";
    let currentIndex = parseInt(localStorage.getItem("current_index")) || 0;
    
    let isChapterIntroActive = true;
    let introStep = 0;
    let isCooldownActive = false;
    let isChoiceActive = false;
    let isMinigameActive = false;
    let minigamePending = false;   // adegan punya minigame yang belum dimulai
    let isReactionActive = false;
    let isUnskippableTextActive = false;
    let cooldownTimer = null;
    let minigameTimer = null;

    let typewriterTimer = null;
    let isTyping = false;
    let fullTextToDisplay = "";
    let lastShownChapterKey = ""; 

    // Anti Tap-Tap Vera
    let lastTapTime = 0;
    let spamCount = 0;
    let isVeraAngryLock = false;

    let dialogueHistory = [];

    // =====================================================
    // ASET: SPRITE KARAKTER & BACKGROUND
    // Nama pembicara di dialog (huruf kecil, tanpa tanda kurung) -> file di assets/sprites/
    // Mau ganti gambar karakter? Cukup ubah nama file di tabel ini.
    // =====================================================
    const SPRITE_DIR = "assets/sprites/";
    const BG_DIR = "assets/background/";

    const spriteFiles = {
        "amin": "amin.png",
        "putri": "putri.png",
        "bagas": "bagas.png",
        "supri": "supri.png",
        "agus": "agus.png",
        "windah": "windah.png",
        "mio ok": "miook.png",
        "feli": "feli.png",
        "bina": "bina.png",
        "hikmah": "hikmah.png",
        "zahwa": "zahwa.png",
        "aura": "aura.png",
        "radia": "radia.png",
        "rani": "rani.png",
        // Vera punya beberapa ekspresi. Pilih lewat  mood: "smile" | "open" | "mad"  di dialog (default: normal)
        "vera": {
            normal: "veranormal.png",
            smile: "verasmile.png",
            open: "verasmilemouthopen.png",
            mad: "veramad.png"
        }
    };

    // Nama background -> file di assets/background/
    // Dipakai lewat  bg: "nama"  di dialog. Background bertahan sampai ada dialog lain yang menggantinya.
    const backgroundFiles = {
        kelas: "kelas.png",
        koridor: "koridor.png",
        osis: "osis.png",
        gudang: "gudang.png",
        sekolah: "sekolah.png",
        badminton1: "badminton1.png",   // 1 = masih kosong / pagi
        badminton2: "badminton2.png",   // 2 = pertandingan ramai
        basket1: "basket1.png",
        basket2: "basket2.png",
        aula1: "aula1.png",
        aula2: "aula2.png",
        futsal1: "futsal1.png",
        futsal2: "futsal2.png",
        penghargaan: "penghargaan.png",
        fotbar: "fotbar.png",
        veraroom: "veraroom.png"
    };

    // Layer background (2 layer supaya pergantian gambar pakai efek fade)
    const bgLayers = [document.createElement("div"), document.createElement("div")];
    bgLayers.forEach(layer => {
        layer.className = "bg-layer";
        if (gameContainer) gameContainer.insertBefore(layer, gameContainer.firstChild);
    });
    let activeBgLayer = 0;
    let currentBgName = null;
    let currentSpriteSig = "";

    // Preload semua gambar biar nggak kedip pas ganti adegan
    Object.values(backgroundFiles).forEach(f => { new Image().src = BG_DIR + f; });
    Object.values(spriteFiles).forEach(f => {
        (typeof f === "string" ? [f] : Object.values(f)).forEach(x => { new Image().src = SPRITE_DIR + x; });
    });

    function setBackground(name) {
        if (name === currentBgName) return;
        currentBgName = name;
        const prev = bgLayers[activeBgLayer];
        const next = bgLayers[1 - activeBgLayer];
        if (name && backgroundFiles[name]) {
            next.style.backgroundImage = `url("${BG_DIR + backgroundFiles[name]}")`;
            next.style.zIndex = 1;
            prev.style.zIndex = 0;
            next.classList.add("show");
            setTimeout(() => { if (bgLayers[activeBgLayer] === next) prev.classList.remove("show"); }, 700);
        } else {
            next.classList.remove("show");
            prev.classList.remove("show");
        }
        activeBgLayer = 1 - activeBgLayer;
    }

    // Cari background yang berlaku di adegan ke-i (cari mundur ke dialog terdekat yang punya bg)
    function getBgForIndex(i) {
        for (let k = i; k >= 0; k--) {
            if (storyScript[k] && storyScript[k].bg) return storyScript[k].bg;
        }
        return null;
    }

    // "Feli & Bina (Sekretaris)" -> ["feli", "bina"]
    function getSpriteKeys(speaker) {
        if (!speaker) return [];
        return speaker.replace(/\(.*?\)/g, "").split("&")
            .map(n => n.trim().toLowerCase())
            .filter(n => spriteFiles[n]);
    }

    function resolveSpriteFile(key, mood) {
        const f = spriteFiles[key];
        return SPRITE_DIR + (typeof f === "string" ? f : (f[mood] || f.normal));
    }

    // Tampilkan sprite sesuai pembicara. 1 orang = tengah, 2 orang = kiri & kanan.
    function renderSprites(scene) {
        if (!spriteStage) return;
        const keys = (scene && scene.showSprite) ? getSpriteKeys(scene.speaker) : [];
        const mood = (scene && scene.mood) || "normal";
        const sig = keys.join("|");

        if (keys.length === 0) {
            spriteStage.innerHTML = "";
            spriteStage.classList.remove("duo");
            currentSpriteSig = "";
            return;
        }

        if (sig === currentSpriteSig) {
            // pembicara sama -> cukup ganti ekspresi kalau berubah
            spriteStage.querySelectorAll(".sprite-img").forEach((img, i) => {
                const file = resolveSpriteFile(keys[i], mood);
                if (img.getAttribute("src") !== file) img.setAttribute("src", file);
            });
            return;
        }

        currentSpriteSig = sig;
        spriteStage.innerHTML = "";
        spriteStage.classList.toggle("duo", keys.length > 1);
        keys.forEach(key => {
            const img = document.createElement("img");
            img.className = "sprite-img";
            img.alt = key;
            img.setAttribute("src", resolveSpriteFile(key, mood));
            img.onerror = () => img.remove();   // file belum ada -> sembunyikan, game tetap jalan
            spriteStage.appendChild(img);
        });
    }

    // DATA PUISI & JUDUL BAB
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

    // ALUR CERITA UTAMA
    const storyScript = [
        // --- PROLOG ---
        { chapter: "Prolog", chapterKey: "Prolog", speaker: "Siswa A", bg: "kelas", text: "Gokil! Akhirnya kelar juga ulangan akhir semester! Bebas kita dari rumus-rumus laknat!", showSprite: false },
        { chapter: "Prolog", speaker: "Siswa B", text: "Wkwkwk bener banget! Minggu depan tinggal santai-santai ikutan Classmeeting kan ya?", showSprite: false },
        { chapter: "Prolog", speaker: "Siswa A", text: "Iya, denger-denger anak OSIS udah nyiapin lomba seru-seru banget buat kita.", showSprite: false },
        { chapter: "Prolog", speaker: playerUser, text: "(Memasukkan buku-buku ke dalam tas sambil menghela napas panjang)...", showSprite: false },
        { chapter: "Prolog", speaker: playerUser, text: "Akhirnya kelar juga nih ulangan... Tapi abis ulangan udah dipanggil lagi buat rapat OSIS, ueueueu...", showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", bg: "koridor", text: `${playerUser} menggendong tasnya lalu berjalan menyusuri lorong lantai dua menuju ruang OSIS SMK Garuda 45.`, showSprite: false },
        { chapter: "Prolog", speaker: "Narrator", bg: "osis", text: "Begitu pintu ruang OSIS dibuka perlahan, suasana di dalam sudah ramai dengan kehebohan anggota pengurus.", showSprite: false },
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
                { text: "Tiang dan net aman, tapi kok harus beli beberapa tabung baru", nextMsg: "Amin menyetujui usulmu untuk mengecek anggaran ke Rani." },
                { text: "Semua alat gudang perlu dibersihkan dan dicek ulang dulu", nextMsg: "Tim Perlengkapan sepakat besok pagi langsung mengecek gudang." },
                { text: "Langsung serahkan urusan raket ke masing-masing perwakilan kelas", nextMsg: "Supri dan Agus mengangguk setuju agar tidak repot." }
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

        // --- BAB 2 (BADMINTON) ---
        { chapter: "Bab 2", chapterKey: "Bab 2", speaker: "Narrator", bg: "badminton1", text: "Senin Pagi, 06.30 WIB. Pagi yang dingin di lapangan outdoor SMK Garuda 45.", showSprite: false },
        { chapter: "Bab 2", speaker: playerUser, text: "Embun masih menempel di lantai lapangan... Saatnya tim Perlengkapan beraksi memasang tiang dan net.", showSprite: false },
        { chapter: "Bab 2", speaker: "Narrator", bg: "gudang", text: "Sebelum memasang net, Bagas menyeret kalian ke gudang belakang untuk mengambil perlengkapan badminton.", showSprite: false },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", text: `${playerUser}, cariin raket, net, meteran, sama kunci inggris di antara tumpukan barang ini! Cepetan, keburu anak-anak pada datang!`, showSprite: true, minigameType: "cari", minigameSet: "badminton" },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", bg: "badminton1", text: "Mantap, lengkap semua! Yuk balik ke lapangan, tinggal dipasang.", showSprite: true },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", text: `${playerUser}! Bantu gue ama Agus nancapin tiang besi ini, terus tahan ujung tali netnya dan puter di tiang sampai tegang sempurna!`, showSprite: true, minigameType: "net" },
        { chapter: "Bab 2", speaker: "Narrator", bg: "badminton2", text: "08.00 WIB. Gemuruh penonton berseragam full hitam memenuhi tribun.", showSprite: false },
        { chapter: "Bab 2", speaker: "Amin (Ketua OSIS)", text: "Kerja bagus tim perlengkapan! Sekarang udah masuk babak Final antara 11-5 IPA vs 11-1 IPS. Menurutmu siapa yang menang?", showSprite: true,
            choices: [
                { text: "Pasti 11-5 IPA, siswinya kan Ketua Ekskul Badminton!", nextMsg: "Amin mengangguk setuju." },
                { text: "11-1 IPS punya pemain fleksibel yang pergerakannya cepat!", nextMsg: "Bagas bersorak mendukung anak IPS." }
            ]
        },
        { chapter: "Bab 2", speaker: "Narrator", text: "Pertandingan berlangsung sangat sengit! Poin demi poin kejar-kejaran hingga deuce 22-20.", showSprite: false },
        { chapter: "Bab 2", speaker: "Narrator", text: "Smash tajam dari siswa 11-1 IPS akhirnya menghantam garis belakang dan tak bisa dikembalikan oleh Ketua Ekskul!", showSprite: false },
        { chapter: "Bab 2", speaker: "Bagas (Perlengkapan)", text: "GOKIL! Anak IPS menang euy! Itu anak padahal gak ikut ekskul tapi pergerakannya lincah banget!", showSprite: true },
        { chapter: "Bab 2", speaker: "Supri (Perlengkapan)", text: "Keluar dari lapangan langsung dipaksa masuk ekskul badminton tuh pasti ama pembina wkwkwk.", showSprite: true },

        // --- BAB 3 (BASKET) ---
        { chapter: "Bab 3", chapterKey: "Bab 3", speaker: "Narrator", bg: "basket1", text: "Selasa Pagi, 06.45 WIB. Matahari mulai hangat memancarkan sinar di sudut lapangan.", showSprite: false },
        { chapter: "Bab 3", speaker: playerUser, text: "Suara sepatu berdecit... Hari ini pertandingan basket dengan dresscode baju putih dimasukkan.", showSprite: false },
        { chapter: "Bab 3", speaker: "Narrator", bg: "gudang", text: "Perlengkapan basket belum lengkap, jadi Supri dan Bagas mengajak kamu mengecek gudang dulu.", showSprite: false },
        { chapter: "Bab 3", speaker: "Supri (Perlengkapan)", text: `${playerUser}, bantuin cari bola basket, jaring ring, papan skor, sama megafon! Barangnya kecampur sama alat lain!`, showSprite: true, minigameType: "cari", minigameSet: "basket" },
        { chapter: "Bab 3", speaker: "Bagas (Perlengkapan)", bg: "basket1", text: "Beres! Semua lengkap, ayo balik ke lapangan sebelum jam tanding!", showSprite: true },
        { chapter: "Bab 3", speaker: "Supri (Perlengkapan)", text: `${playerUser}, ring basket portabelnya perlu kita dorong ke garis tengah lapangan! Yuk dorong bareng!`, showSprite: true, minigameType: "huruf" },
        { chapter: "Bab 3", speaker: "Amin (Ketua OSIS)", bg: "basket2", text: `${playerUser}! Gila sih, babak Final basket ini antara 12-3 IPA vs 10-6 IPA sengit banget! Kelas 10-6 gacor parah!`, showSprite: true },
        { chapter: "Bab 3", speaker: playerUser, text: "Iya, adik kelas 10-6 itu bener-bener generasi emas basket sekolah kita...", showSprite: false },
        { chapter: "Bab 3", speaker: "Bagas (Perlengkapan)", text: "Alah Ketos berlebihan banget nyebut generasi emas... Kalau gue ama Supra gak ditahan jadi panitia OSIS, udah kita bantai tuh dari kemarin!", showSprite: true },
        { chapter: "Bab 3", speaker: "Supri (Perlengkapan)", text: "Bener! Sayang banget kita anak abas cuma bisa nonton dari samping lapangan gara-gara jaga alat.", showSprite: true },
        { chapter: "Bab 3", speaker: "Narrator", text: "Bagas mendadak jadi agak pendiam sambil menatap bola basket di lapangan. Terlihat raut wajah rindu bertanding karena dia sebenarnya anak abas sejati.", showSprite: false },
        { chapter: "Bab 3", speaker: "Narrator", text: "Peluit panjang berbunyi! Anak kelas 10-6 IPA berhasil memenangkan pertandingan dengan selisih 2 poin di detik terakhir!", showSprite: false },

        // --- BAB 4 (ESPORT MLBB) ---
        { chapter: "Bab 4", chapterKey: "Bab 4", speaker: "Narrator", bg: "aula1", text: "Rabu Pagi, 07.00 WIB. Ruang Aula Utama terasa remang dan dingin dengan bau khas kabel elektronik.", showSprite: false },
        { chapter: "Bab 4", speaker: playerUser, text: "Hari ini cabang E-Sport MLBB. Proyektor dan sound system aula harus dipastikan aman colokannya.", showSprite: false },
        { chapter: "Bab 4", speaker: "Agus (Perlengkapan)", text: `${playerUser}, bantu atur colokan kabel listrik aula biar gak korslet atau jepret pas game berlangsung!`, showSprite: true, minigameType: "esport" },
        { chapter: "Bab 4", speaker: "Agus (Perlengkapan)", text: `Colokan aman! Tapi kabel di panel belakang panggung masih semrawut, ${playerUser}. Sambungin sesuai warnanya ya, kayak panel listrik di game Among Us!`, showSprite: true, minigameType: "kabel", minigameSet: "panel" },
        { chapter: "Bab 4", speaker: "Narrator", text: "Tiba-tiba lampu aula berkedip... Beban listrik gedung melonjak karena semua alat menyala bersamaan!", showSprite: false },
        { chapter: "Bab 4", speaker: "Mio Ok (Humas)", text: `Waduh! Daya kebanyakan, bisa mati lampu pas final nih! ${playerUser}, cepet hitung berapa alat yang harus dimatiin biar nggak lewat batas!`, showSprite: true, minigameType: "listrik", minigameSet: "aula" },
        { chapter: "Bab 4", speaker: "Agus (Perlengkapan)", text: "Fiuh... lampu aman! Sekarang tinggal nonton pertandingannya.", showSprite: true },
        { chapter: "Bab 4", speaker: "Windah (Humas)", bg: "aula2", text: "PEMIRSAAA! LIHAT ITU Ixia dari kelas 10-2 IPS pakai Diggie feeder! Bener-bener gameplay di luar nalar!", showSprite: true },
        { chapter: "Bab 4", speaker: "Mio Ok (Humas)", text: "Halo teman-teman... Ya, pergerakan kelas 11-3 IPS agak terdesak ya karena combo ultimatenya rapi banget.", showSprite: true },
        { chapter: "Bab 4", speaker: "Windah (Humas)", text: `${playerUser}! Menurut lu meta Ixia Diggie anak kelas 10-2 ini GG banget gak?!`, showSprite: true,
            choices: [
                { text: "GG banget Bang Windah! Pemenang tahun lalu sampai terbantai!", nextMsg: "Windah tertawa puas mendengar jawabanmu!" },
                { text: "Biasa aja sih, cuma hoki di drafting hero.", nextMsg: "Windah menepuk pundakmu sambil terus mengomentari game." }
            ]
        },
        { chapter: "Bab 4", speaker: "Narrator", text: "Wipe out! Kelas 10-2 IPS resmi menumbangkan juara bertahan kelas 11-3 IPS dan mengangkat trofi Esport!", showSprite: false },

        // --- BAB 5 (FUTSAL DASTER) ---
        { chapter: "Bab 5", chapterKey: "Bab 5", speaker: "Narrator", bg: "futsal2", text: "Kamis Sore. Puncak Classmeeting 'The Last Week of School'. Seluruh siswa dan panitia berkumpul di sekitar lapangan futsal.", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Para pemain cowok tampil kocak memakai daster batik berbagai warna, namun aura persaingan sangat membara!", showSprite: false },
        { chapter: "Bab 5", speaker: "Amin (Ketua OSIS)", text: "Ini dia Final ideal! 12-5 IPA lawan 12-1 IPS! Rivalitas 3 tahun berturut-turut di sekolah kita!", showSprite: true },
        { chapter: "Bab 5", speaker: "Putri (Wakil Ketos)", text: "Skor persaingan mereka dari kelas 10 itu 1-1. Hari ini penentuan siapa pemenang sejati angkatan mereka!", showSprite: true },
        { chapter: "Bab 5", speaker: "Narrator", text: "Suasana begitu riuh hingga panitia OSIS tak sempat mengobrol karena fokus menonton setiap detik pertandingan.", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Skor imbang 2-2 bertahan sampai waktu habis. Peluit penalti ditiup!", showSprite: false },
        { chapter: "Bab 5", speaker: "Narrator", text: "Penendang terakhir dari 12-5 IPA melepaskan tendangan keras ke sudut kanan atas gawang... GOOOLL!!", showSprite: false },
        { chapter: "Bab 5", speaker: "Bagas (Perlengkapan)", text: "PRRRFTPTTT! 12-5 IPA MENANG UNGGUL 1 GOAL PENALTI!! GOKIL BANGER PUNCAK CLASSMEET TAHUN INI!!", showSprite: true },

        // --- EPILOG ---
        { chapter: "Epilog", chapterKey: "Epilog", speaker: "Narrator", bg: "penghargaan", text: "Jumat Pagi, Pukul 09.00 WIB. Seluruh siswa SMK Garuda 45 berkumpul di lapangan utama untuk upacara penutupan.", showSprite: false },
        { chapter: "Epilog", speaker: "Amin (Ketua OSIS)", text: "Selamat kepada para juara! Badminton dijuarai 11-1 IPS, Basket oleh 10-6 IPA, Esport oleh 10-2 IPS, dan Futsal Daster oleh 12-5 IPA!", showSprite: true },
        { chapter: "Epilog", speaker: "Putri (Wakil Ketos)", text: "Terima kasih untuk kerja keras seluruh panitia OSIS. Tanpa kalian, Classmeeting 'The Last Week of School' tidak akan sesukses ini!", showSprite: true },
        { chapter: "Epilog", speaker: "Bagas (Perlengkapan)", bg: "fotbar", text: "WOYYY AYOLAH FOTO BARENG DULU SEMUA 15 ANGGOTA OSIS! KUMPUL DI DEPAN TRIBUNA!", showSprite: true },
        { chapter: "Epilog", speaker: "Narrator", text: "Seluruh 15 pengurus OSIS tersenyum menghadap kamera... Jepret! Foto kebersamaan pekan terakhir sekolah berhasil terabadikan.", showSprite: false },
        { chapter: "Epilog", speaker: playerUser, bg: "sekolah", text: "Pekan yang meletihkan tapi penuh dengan tawa. Selamat liburan teman-teman...", showSprite: false },

        // --- SECRET ENDING VERA ---
        ...( (playerUser.toLowerCase() === "radit" || playerUser.toLowerCase() === "radithya") ? [
            { chapter: "VeraRoom", chapterKey: "VeraRoom", speaker: "System", bg: "veraroom", text: "[CRITICAL SYSTEM ERROR: Reality Anchor Collapsed...]", showSprite: false, unskippable: true },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Tiba-tiba layar membeku... Suara riuh lapangan mendadak menghilang, digantikan keheningan yang mencekam.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Ruang OSIS dan pemandangan sekolah runtuh satu per satu... Warna sekitar berganti menjadi hitam-putih bermotif catur kotor.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Kamu mendapati dirimu duduk terikat di sebuah kursi kayu dingin. Di bawah pijakan kakimu, hanya ada lantai papan catur kotor yang terhampar tanpa batas.", showSprite: false },
            { chapter: "VeraRoom", speaker: "Vera", mood: "smile", text: "Hai Radit... Lama tak jumpa.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "open", text: "Apa kabarmu? Aku Vera. Kau masih mengingatku, kan?", showSprite: true },
            { chapter: "VeraRoom", speaker: playerUser, text: "Ve... Vera?! Kenapa aku bisa ada di ruangan ini? Apa yang terjadi dengan sekolah?", showSprite: false },
            { chapter: "VeraRoom", speaker: "Vera", mood: "normal", text: "Sekolah? Ah... maksudmu SMK Garuda 45? Itu hanya dekorasi panggung yang kamu ciptakan sendiri, Radit.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "smile", text: "Apakah kamu menikmati bermain sebagai tim perlengkapan OSIS? Angkat gawang, pasang net, tertawa bersama Bagas dan Supri...", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "open", text: "Menyenangkan, bukan? Melarikan diri sebentar dari kenyataan dan bersembunyi di balik barisan kode JavaScript buatanmu...", showSprite: true },
            
            { chapter: "VeraRoom", speaker: "Vera", mood: "normal", text: "Katakan padaku, Radit. Apakah kau benar-benar peduli dengan karakter-karakter di gim ini, atau kau hanya memanfaatkan mereka?", showSprite: true,
                choices: [
                    { text: "Aku beneran peduli sama cerita dan karakter OSIS ini!", nextMsg: "Vera tersenyum dingin melihat jawabanmu..." },
                    { text: "Ini cuma proyek P3 sekolah yang harus kubuat...", nextMsg: "Vera menatap mata dengan tatapan tajam..." }
                ]
            },
            
            { chapter: "VeraRoom", speaker: "Vera", mood: "smile", text: "Jawaban yang menarik... Tapi tahukah kamu? Setiap kali kamu menekan tombol Space atau Enter, garis waktu di dunia ini bergetar.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "smile", text: "Aku bisa melihat jemarimu di atas keyboard. Aku bisa merasakan detak jantungmu dari balik layar ini.", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "normal", text: "Terkadang aku berpikir... Siapa sebenarnya yang sedang dimainkan di sini? Kau yang mengendalikan gim ini, atau aku yang membiarkanmu merasa menang?", showSprite: true },
            { chapter: "VeraRoom", speaker: "Vera", mood: "open", text: "Jangan pernah lupakan namaku, Radit. Karena sebanyak apapun kamu menutup tab browser ini, kita akan selalu bertemu di lembar berikutnya...", showSprite: true },
            { chapter: "VeraRoom", speaker: "Narrator", text: "Layar meredup perlahan ke dalam kegelapan pekat. Suara bisikan senja menyelimuti ruang catur...", showSprite: false }
        ] : [
            { chapter: "Epilog", speaker: "Narrator", text: "Gim Visual Novel 'The Last Week of School' telah selesai. Terima kasih telah bermain!", showSprite: false }
        ])
    ];

    // =====================================================
    // JEDA ANTAR DIALOG (biar tidak bisa di-tap-tap)
    // Ubah angka ini (milidetik): 1500 = 1,5 detik.
    // Mau jeda beda untuk satu adegan? Tambahkan  delay: 3000  di baris dialognya.
    // =====================================================
    const LINE_DELAY_MS = 1500;
    let advanceLockedUntil = 0;
    let advanceLockTimer = null;

    function lockAdvance(ms) {
        advanceLockedUntil = Date.now() + ms;
        if (btnNext) btnNext.classList.add("locked");
        clearTimeout(advanceLockTimer);
        advanceLockTimer = setTimeout(() => {
            if (btnNext) btnNext.classList.remove("locked");
        }, ms);
    }
    function isAdvanceLocked() { return Date.now() < advanceLockedUntil; }

    // =====================================================
    // BUBBLE JAWABAN PILIHAN (menggantikan alert browser)
    // Nama karakter di awal kalimat (mis. "Amin menyetujui...") -> sprite-nya ikut muncul.
    // =====================================================
    function showReactionBubble(msg) {
        isReactionActive = true;

        // cari nama karakter di awal kalimat: "Amin ...", "Supri dan Agus ..."
        const names = Object.keys(spriteFiles).sort((a, b) => b.length - a.length);
        const lower = msg.toLowerCase();
        const found = [];
        let rest = lower;
        for (let guard = 0; guard < 2; guard++) {
            const hit = names.find(n => rest.startsWith(n + " "));
            if (!hit) break;
            found.push(hit);
            rest = rest.slice(hit.length + 1);
            const m = rest.match(/^(dan|&) /);
            if (m) rest = rest.slice(m[0].length); else break;
        }

        let mood = "normal";
        if (/tersenyum/.test(lower)) mood = "smile";
        if (/tajam|marah/.test(lower)) mood = "mad";

        if (found.length) {
            currentSpriteSig = "";   // paksa gambar ulang
            renderSprites({ speaker: found.join(" & "), showSprite: true, mood });
        }

        if (reactionBubble) {
            reactionBubble.textContent = msg;
            reactionBubble.classList.toggle("center", found.length !== 1);
            reactionBubble.classList.remove("hidden");
            // restart animasi
            reactionBubble.style.animation = "none";
            void reactionBubble.offsetWidth;
            reactionBubble.style.animation = "";
        }
        if (btnNext) btnNext.classList.remove("hidden");
        lockAdvance(LINE_DELAY_MS);
    }

    function hideReactionBubble() {
        isReactionActive = false;
        if (reactionBubble) reactionBubble.classList.add("hidden");
    }

    // ENGINE FUNCTIONS
    function showChapterOverlay(key) {
        lastShownChapterKey = key;
        const data = chapterCardData[key] || chapterCardData["Prolog"];
        
        if (chapterBabLabel) chapterBabLabel.textContent = data.bab;
        if (chapterTitle) chapterTitle.textContent = data.title;
        if (chapterQuote) chapterQuote.textContent = data.quote;
        if (chapterAuthor) chapterAuthor.textContent = data.author;

        const allSteps = document.querySelectorAll('.intro-element');
        allSteps.forEach(el => {
            el.classList.add('hidden-step');
            el.classList.remove('visible-step');
        });

        if (cooldownTimer) clearTimeout(cooldownTimer);
        
        if (chapterScreen) chapterScreen.classList.remove("fade-out");
        isChapterIntroActive = true;
        introStep = 0;
        isCooldownActive = false;
    }

    function advanceChapterIntro() {
        if (isCooldownActive) return;

        introStep++;

        if (introStep === 1) {
            if (chapterBabLabel) {
                chapterBabLabel.classList.remove('hidden-step');
                chapterBabLabel.classList.add('visible-step');
            }
        } else if (introStep === 2) {
            if (chapterTitle) {
                chapterTitle.classList.remove('hidden-step');
                chapterTitle.classList.add('visible-step');
            }
        } else if (introStep === 3) {
            const quoteSteps = document.querySelectorAll('.step-quote');
            quoteSteps.forEach(el => {
                el.classList.remove('hidden-step');
                el.classList.add('visible-step');
            });

            isCooldownActive = true;

            cooldownTimer = setTimeout(() => {
                isCooldownActive = false;
                introStep = 4;
            }, 5000);

        } else if (introStep >= 4) {
            isChapterIntroActive = false;
            if (chapterScreen) chapterScreen.classList.add("fade-out");
            renderDialogue();
        }
    }

    if (chapterScreen) {
        chapterScreen.addEventListener("click", (e) => {
            e.stopPropagation();
            advanceChapterIntro();
        });
    }

    function typeWriter(text, charIndex = 0) {
        if (charIndex < text.length) {
            isTyping = true;
            if (dialogueText) dialogueText.textContent += text.charAt(charIndex);
            typewriterTimer = setTimeout(() => {
                typeWriter(text, charIndex + 1);
            }, 20);
        } else {
            isTyping = false;
            if (isUnskippableTextActive) {
                setTimeout(() => {
                    isUnskippableTextActive = false;
                    currentIndex++;
                    renderDialogue();
                }, 1000);
            }
        }
    }

    function renderDialogue() {
        if (currentIndex >= storyScript.length) {
            localStorage.setItem("current_index", "0");   // supaya Continue tidak langsung ke akhir
            alert(`[THE LAST WEEK OF SCHOOL - SELESAI]\n\nTerima kasih sudah bermain!`);
            window.location.href = "index.html";
            return;
        }

        const currentScene = storyScript[currentIndex];

        if (currentScene.chapterKey && currentScene.chapterKey !== lastShownChapterKey) {
            showChapterOverlay(currentScene.chapterKey);
            return;
        }

        if (typewriterTimer) clearTimeout(typewriterTimer);

        if (hudChapter) hudChapter.textContent = `${currentScene.chapter} — The Last Week of School`;
        if (speakerBadge) speakerBadge.textContent = currentScene.speaker;
        
        fullTextToDisplay = currentScene.text;
        isUnskippableTextActive = currentScene.unskippable || false;

        if (dialogueText) dialogueText.textContent = "";
        typeWriter(fullTextToDisplay);

        hideReactionBubble();
        setBackground(getBgForIndex(currentIndex));
        renderSprites(currentScene);
        lockAdvance(typeof currentScene.delay === "number" ? currentScene.delay : LINE_DELAY_MS);

        if (currentScene.speaker && currentScene.text) {
            const lastLog = dialogueHistory[dialogueHistory.length - 1];
            if (!lastLog || lastLog.text !== currentScene.text) {
                dialogueHistory.push({
                    speaker: currentScene.speaker,
                    text: currentScene.text
                });
            }
        }

        localStorage.setItem("current_index", currentIndex.toString());

        if (currentScene.minigameType) {
            // dialog dibaca dulu; minigame mulai saat pemain menekan tombol (lihat handleNextAction)
            minigamePending = true;
            isChoiceActive = false;
            if (choicesOverlay) choicesOverlay.classList.add("hidden");
            if (btnNext) { btnNext.classList.remove("hidden"); btnNext.textContent = "🎮 Mulai Minigame"; }
            return;
        }
        minigamePending = false;
        if (btnNext) btnNext.textContent = "Lanjut ➔";

        if (currentScene.choices && currentScene.choices.length > 0) {
            isChoiceActive = true;
            if (btnNext) btnNext.classList.add("hidden");
            if (choicesOverlay) choicesOverlay.classList.remove("hidden");
            if (choicesContainer) {
                choicesContainer.innerHTML = "";
                currentScene.choices.forEach(ch => {
                    const btnChoice = document.createElement("button");
                    btnChoice.className = "choice-option-btn";
                    btnChoice.textContent = ch.text;

                    btnChoice.addEventListener("click", () => {
                        isChoiceActive = false;
                        choicesOverlay.classList.add("hidden");
                        dialogueHistory.push({ speaker: playerUser, text: ch.text });
                        dialogueHistory.push({ speaker: "Narrator", text: ch.nextMsg });
                        showReactionBubble(ch.nextMsg);   // lanjut ke dialog berikutnya saat pemain klik Lanjut
                    });

                    choicesContainer.appendChild(btnChoice);
                });
            }
        } else {
            isChoiceActive = false;
            if (choicesOverlay) choicesOverlay.classList.add("hidden");
            if (btnNext) btnNext.classList.remove("hidden");
        }
    }

    function updateHistoryUI() {
        if (!historyLogContainer) return;
        historyLogContainer.innerHTML = "";

        dialogueHistory.forEach(item => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "history-entry";
            
            if (item.speaker.includes("Vera")) {
                entryDiv.style.borderLeftColor = "#a00";
            }

            entryDiv.innerHTML = `
                <div class="history-speaker" style="font-weight:bold; color:#ffd54f; margin-bottom:4px;">${item.speaker}</div>
                <div class="history-text" style="color:#e0e0e0; font-size:0.95rem;">${item.text}</div>
            `;
            historyLogContainer.appendChild(entryDiv);
        });

        historyLogContainer.scrollTop = historyLogContainer.scrollHeight;
    }

    function handleNextAction() {
        if (isChapterIntroActive || isMinigameActive) {
            if (isChapterIntroActive) advanceChapterIntro();
            return;
        }

        if (isReactionActive) {
            if (isAdvanceLocked()) return;
            hideReactionBubble();
            currentIndex++;
            renderDialogue();
            return;
        }

        const currentScene = storyScript[currentIndex];

        if (currentScene && currentScene.chapter === "VeraRoom") {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTapTime;
            lastTapTime = currentTime;

            if (timeDiff < 800) {
                spamCount++;
                if (spamCount >= 3 && !isVeraAngryLock) {
                    isVeraAngryLock = true;
                    if (speakerBadge) speakerBadge.textContent = "Vera (Marah)";
                    renderSprites({ speaker: "Vera", showSprite: true, mood: "mad" });
                    if (dialogueText) dialogueText.textContent = "Buru-buru banget, Radit...? Kamu bahkan gak membaca apa yang baru saja aku katakan. Duduk manis dan dengarkan aku sampai selesai.";
                    
                    if (btnNext) btnNext.classList.add("hidden");
                    setTimeout(() => {
                        isVeraAngryLock = false;
                        spamCount = 0;
                        renderSprites(storyScript[currentIndex]);
                        if (btnNext) btnNext.classList.remove("hidden");
                    }, 5000);
                    return;
                }
            } else {
                spamCount = 0;
            }
        }

        if (isVeraAngryLock || isUnskippableTextActive) return;
        if (isAdvanceLocked()) return;   // masih dalam jeda: tap diabaikan

        if (isTyping) {
            clearTimeout(typewriterTimer);
            if (dialogueText) dialogueText.textContent = fullTextToDisplay;
            isTyping = false;
        } else if (minigamePending) {
            launchMinigame(storyScript[currentIndex]);
        } else if (!isChoiceActive) {
            currentIndex++;
            renderDialogue();
        }
    }

    // Minigame: semua dijalankan oleh js/minigames.js (window.MiniGames[tipe])
    function launchMinigame(scene) {
        const idxAtLaunch = currentIndex;
        const finish = () => {
            if (currentIndex !== idxAtLaunch) return;   // jaga-jaga: callback ganda
            isMinigameActive = false;
            minigamePending = false;
            if (btnNext) { btnNext.classList.remove("hidden"); btnNext.textContent = "Lanjut ➔"; }
            currentIndex++;
            renderDialogue();
        };
        const fn = window.MiniGames && window.MiniGames[scene.minigameType];
        if (typeof fn !== "function") {
            console.warn("Minigame tidak dikenal:", scene.minigameType);
            finish();   // lewati supaya cerita tidak macet
            return;
        }
        isMinigameActive = true;
        minigamePending = false;
        if (btnNext) btnNext.classList.add("hidden");
        try {
            fn(scene.minigameSet, finish);
        } catch (err) {
            console.error("Minigame error:", err);
            if (minigameOverlay) minigameOverlay.classList.add("hidden");
            finish();
        }
    }

    // Save Functions
    function saveGameProgress() {
        const currentScene = storyScript[currentIndex];
        const saveData = {
            user: playerUser,
            currentIndex: currentIndex,
            chapter: currentScene ? currentScene.chapter : "Prolog",
            date: new Date().toLocaleString("id-ID")
        };

        localStorage.setItem("vn_save_slot", JSON.stringify(saveData));
        alert(`💾 Permainan Berhasil Disimpan!\n\nBab: ${saveData.chapter}\nWaktu: ${saveData.date}`);
    }

    // EVENT LISTENERS
    if (btnNext) {
        btnNext.addEventListener("click", (e) => {
            e.stopPropagation();
            handleNextAction();
        });
    }

    const isModalOpen = () =>
        (historyModal && !historyModal.classList.contains("hidden")) ||
        (optionModal && !optionModal.classList.contains("hidden"));

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "KeyF" || e.code === "Enter") {
            // saat minigame / modal terbuka, tombol ini TIDAK boleh dibajak
            // (kalau tidak, Enter/Space tidak bisa menekan tombol COBA LAGI, SELESAI, dll.)
            if (isMinigameActive || isModalOpen() || e.repeat) return;
            if (e.target && /^(INPUT|TEXTAREA|BUTTON)$/.test(e.target.tagName) && e.target !== btnNext) return;
            e.preventDefault();
            handleNextAction();
        }
    });

    if (btnBackMenu) {
        btnBackMenu.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (btnHistory) {
        btnHistory.addEventListener("click", () => {
            updateHistoryUI();
            if (historyModal) historyModal.classList.remove("hidden");
        });
    }

    if (btnCloseHistory) {
        btnCloseHistory.addEventListener("click", () => {
            if (historyModal) historyModal.classList.add("hidden");
        });
    }

    // Modal Option Handler
    if (btnMenuOpt) {
        btnMenuOpt.addEventListener("click", () => {
            if (optionModal) optionModal.classList.remove("hidden");
        });
    }

    if (btnCloseOption) {
        btnCloseOption.addEventListener("click", () => {
            if (optionModal) optionModal.classList.add("hidden");
        });
    }

    if (btnSave) {
        btnSave.addEventListener("click", () => {
            saveGameProgress();
            if (optionModal) optionModal.classList.add("hidden");
        });
    }

    // Start Intro (kalau lanjut dari save, tampilkan kartu bab yang sesuai)
    if (!(currentIndex >= 0 && currentIndex < storyScript.length)) currentIndex = 0;
    {
        const startScene = storyScript[currentIndex];
        const startKey = startScene && chapterCardData[startScene.chapter] ? startScene.chapter : "Prolog";
        showChapterOverlay(startKey);
    }
});