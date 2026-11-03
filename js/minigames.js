/* =====================================================================
   MINIGAMES TAMBAHAN — The Last Week of School
   Dipanggil dari game.js lewat:  window.MiniGames[tipe](namaSet, onSelesai)

   Tipe yang tersedia:
     cari    -> Cari barang di gudang      (set: "badminton", "basket")
     kabel   -> Sambungkan kabel warna     (set: "panel")
     listrik -> Hitung beban listrik (aljabar)    (set: "aula")
     net     -> Putar tali net di tiang           (set: "default")
     huruf   -> Tekan huruf acak (ring basket)    (set: "default")
     esport  -> Bagi beban daya ke 2 stopkontak   (set: "aula")

   Semua minigame punya: batas waktu, menang / kalah, tombol COBA LAGI,
   dan tombol LEWATI muncul setelah gagal 2 kali (biar cerita tidak macet).
   ===================================================================== */
(function () {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const el = (tag, cls, html) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html !== undefined) n.innerHTML = html;
        return n;
    };
    const shuffle = (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    // ------------------------------------------------------------------
    // KERANGKA UMUM: buka overlay, timer, menang/kalah, coba lagi
    // ------------------------------------------------------------------
    function launch(def, done) {
        const overlay = $("minigame-overlay");
        if (!overlay) { done(); return; }
        const title = $("minigame-title");
        const desc = $("minigame-desc");
        const area = $("minigame-action-area");
        const submit = $("btn-minigame-submit");
        const card = overlay.querySelector(".minigame-card");
        let fails = 0;
        let skipBtn = null;

        function cleanupButtons() {
            if (skipBtn) { skipBtn.remove(); skipBtn = null; }
            submit.classList.add("hidden");
            submit.textContent = "SELESAI";
        }

        function close() {
            cleanupButtons();
            overlay.classList.add("hidden");
            card.classList.remove("wide");
            area.classList.remove("mg-area", "mg-over");
            area.innerHTML = "";
            done();
        }

        function round() {
            cleanupButtons();
            card.classList.add("wide");
            area.classList.remove("mg-over");   // BUG LAMA: kelas ini tertinggal -> minigame berikutnya / coba lagi tidak bisa diklik
            area.classList.add("mg-area");
            area.innerHTML = "";
            title.textContent = def.title;
            desc.textContent = def.desc;
            overlay.classList.remove("hidden");

            let ended = false;
            const timers = [];
            const cleanups = [];
            const stopAll = () => {
                timers.forEach((t) => { clearInterval(t); clearTimeout(t); });
                cleanups.splice(0).forEach((f) => f());
            };

            // timer countdown dengan bar; penalty(detik) mengurangi waktu
            const makeTimer = (seconds, label, onEnd) => {
                const box = el("div", "mg-timer");
                const fill = el("div", "mg-timer-fill");
                const txt = el("span", "mg-timer-text");
                box.appendChild(fill); box.appendChild(txt);
                area.prepend(box);
                let left = seconds;
                const paint = () => {
                    fill.style.width = Math.max(0, (left / seconds) * 100) + "%";
                    fill.classList.toggle("low", left <= seconds * 0.3);
                    txt.textContent = label + " " + Math.max(0, Math.ceil(left)) + " dtk";
                };
                paint();
                const iv = setInterval(() => {
                    if (ended) return;
                    left -= 0.1;
                    paint();
                    if (left <= 0) onEnd();
                }, 100);
                timers.push(iv);
                return {
                    penalty(s) { left -= s; paint(); if (left <= 0 && !ended) onEnd(); },
                    left() { return left; }
                };
            };

            const api = {
                area, makeTimer,
                onCleanup(fn) { cleanups.push(fn); },
                later(fn, ms) { timers.push(setTimeout(fn, ms)); },
                win(msg) {
                    if (ended) return; ended = true; stopAll();
                    area.classList.add("mg-over");
                    desc.textContent = "✅ " + msg;
                    submit.textContent = "SELESAI ✔";
                    submit.classList.remove("hidden");
                    submit.onclick = close;
                },
                lose(msg) {
                    if (ended) return; ended = true; stopAll();
                    fails++;
                    area.classList.add("mg-over");
                    desc.textContent = "❌ " + msg;
                    submit.textContent = "COBA LAGI ↻";
                    submit.classList.remove("hidden");
                    submit.onclick = round;
                    if (fails >= 2 && !skipBtn) {
                        skipBtn = el("button", "minigame-btn mg-skip", "LEWATI ➔");
                        skipBtn.onclick = close;
                        submit.after(skipBtn);
                    }
                },
                isOver() { return ended; }
            };
            def.build(api);
        }

        round();
    }

    // ------------------------------------------------------------------
    // 1) CARI BARANG DI GUDANG
    // ------------------------------------------------------------------
    const CARI_SETS = {
        badminton: {
            title: "🔎 MINIGAME: CARI PERLENGKAPAN DI GUDANG",
            desc: "Temukan semua perlengkapan badminton di antara tumpukan barang! Salah klik = waktu berkurang.",
            time: 30,
            targets: [
                { id: "raket", name: "Raket", icon: "🏸" },
                { id: "net", name: "Net", icon: "🥅" },
                { id: "meteran", name: "Meteran", icon: "📏" },
                { id: "kunci", name: "Kunci Inggris", icon: "🔧" }
            ],
            decoys: ["⚽", "🏀", "🧹", "📦", "🥤", "👟", "🎒", "🔦", "🧢", "🏐", "🔌", "🎧"]
        },
        basket: {
            title: "🔎 MINIGAME: CARI PERLENGKAPAN BASKET",
            desc: "Cari bola, jaring ring, papan skor, dan megafon yang terselip di antara alat lain! Salah klik = waktu berkurang.",
            time: 30,
            targets: [
                { id: "bola", name: "Bola Basket", icon: "🏀" },
                { id: "jaring", name: "Jaring Ring", icon: "🥅" },
                { id: "skor", name: "Papan Skor", icon: "📋" },
                { id: "megafon", name: "Megafon", icon: "📣" }
            ],
            decoys: ["⚽", "📏", "🧹", "📦", "🥤", "👟", "🎒", "🔦", "🧢", "🏐", "🔌", "🎧"]
        }
    };

    function buildCari(set, api) {
        const area = api.area;
        const found = new Set();
        let timer;

        const wrap = el("div", "mg-wrap");
        const list = el("div", "mg-checklist");
        set.targets.forEach((t) => {
            list.appendChild(el("span", "mg-check", `<b>${t.icon}</b> ${t.name}`)).dataset.id = t.id;
        });
        const field = el("div", "mg-field");
        field.style.backgroundImage =
            "linear-gradient(rgba(10,10,18,0.5), rgba(10,10,18,0.5)), url('assets/background/gudang.png')";
        const msg = el("div", "mg-toast", "Klik barang yang ada di daftar di atas!");
        wrap.appendChild(list);
        wrap.appendChild(field);
        wrap.appendChild(msg);
        area.appendChild(wrap);

        timer = api.makeTimer(set.time, "⏱", () => api.lose("Waktu habis! Barangnya belum lengkap."));

        // sebar barang di grid dengan sedikit geser acak (kolom menyesuaikan lebar layar supaya tidak tumpang tindih)
        const total = set.targets.length + set.decoys.length;
        const COLS = (area.clientWidth || 650) < 520 ? 4 : 8;
        const ROWS = Math.ceil(total / COLS) + (COLS === 4 ? 0 : 1);
        field.style.height = Math.max(230, ROWS * 64) + "px";
        const cells = shuffle([...Array(COLS * ROWS).keys()]);
        const things = shuffle([
            ...set.targets.map((t) => ({ ...t, target: true })),
            ...set.decoys.map((d, i) => ({ id: "d" + i, icon: d, target: false }))
        ]);
        things.forEach((th, i) => {
            const c = cells[i];
            const col = c % COLS, row = Math.floor(c / COLS);
            const b = el("button", "mg-item", th.icon);
            b.type = "button";
            b.style.left = ((col + 0.5) / COLS) * 100 + (Math.random() * 2 - 1) + "%";
            b.style.top = ((row + 0.5) / ROWS) * 100 + (Math.random() * 4 - 2) + "%";
            const hit = () => {
                if (api.isOver() || b.classList.contains("found")) return;
                if (th.target) {
                    b.classList.add("found");
                    found.add(th.id);
                    const chk = list.querySelector(`[data-id="${th.id}"]`);
                    if (chk) chk.classList.add("done");
                    msg.className = "mg-toast";
                    msg.innerHTML = `✔ ${th.name} ketemu! (${found.size}/${set.targets.length})`;
                    if (found.size === set.targets.length) {
                        api.win("Semua perlengkapan ketemu! Sisa waktu " + Math.ceil(timer.left()) + " detik.");
                    }
                } else {
                    b.classList.add("wrong");
                    setTimeout(() => b.classList.remove("wrong"), 350);
                    msg.className = "mg-toast bad";
                    msg.innerHTML = "✖ Bukan itu! Waktu -3 detik.";
                    timer.penalty(3);
                }
            };
            // langsung kehitung saat ditekan (tidak perlu lepas di tempat yang sama)
            b.addEventListener("pointerdown", (e) => { e.preventDefault(); hit(); });
            // klik via keyboard (Tab + Enter) tetap bisa; detail===0 berarti bukan dari mouse
            b.addEventListener("click", (e) => { if (e.detail === 0) hit(); });
            field.appendChild(b);
        });
    }

    // ------------------------------------------------------------------
    // 2) SAMBUNGKAN KABEL (ala Among Us)
    // ------------------------------------------------------------------
    const KABEL_SETS = {
        panel: {
            title: "🔌 MINIGAME: SAMBUNGKAN KABEL PANEL",
            desc: "Tarik kabel dari kiri ke ujung yang warnanya SAMA di kanan. Semua harus tersambung sebelum waktu habis!",
            time: 30,
            colors: ["#ff4757", "#2e86de", "#ffd32a", "#2ed573", "#ff7ab8"]
        }
    };

    function buildKabel(set, api) {
        const NS = "http://www.w3.org/2000/svg";
        const area = api.area;
        const n = set.colors.length;
        const ys = set.colors.map((_, i) => 28 + i * 48);
        const rightOrder = shuffle([...Array(n).keys()]);
        // pastikan urutan kanan tidak sama persis dengan kiri
        if (rightOrder.every((v, i) => v === i)) rightOrder.push(rightOrder.shift());

        const wrap = el("div", "mg-wrap");
        const info = el("div", "mg-info", `Tersambung: <b id="kabel-count">0</b> / ${n}`);
        wrap.appendChild(info);

        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("viewBox", `0 0 600 ${ys[n - 1] + 28}`);
        svg.setAttribute("class", "mg-svg");
        wrap.appendChild(svg);
        area.appendChild(wrap);

        const mk = (name, attrs) => {
            const e = document.createElementNS(NS, name);
            Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
            svg.appendChild(e);
            return e;
        };

        // panel kiri & kanan
        mk("rect", { x: 0, y: 4, width: 26, height: ys[n - 1] + 20, rx: 6, fill: "#2b2b3a" });
        mk("rect", { x: 574, y: 4, width: 26, height: ys[n - 1] + 20, rx: 6, fill: "#2b2b3a" });

        const LX = 84, RX = 516;
        const leftPlugs = [], rightPlugs = [];
        set.colors.forEach((col, i) => {
            const y = ys[i];
            mk("line", { x1: 26, y1: y, x2: LX, y2: y, stroke: "#111", "stroke-width": 12, "stroke-linecap": "round" });
            mk("line", { x1: 26, y1: y, x2: LX, y2: y, stroke: col, "stroke-width": 7, "stroke-linecap": "round" });
            mk("circle", { cx: LX, cy: y, r: 11, fill: col, stroke: "#111", "stroke-width": 3 });
            const hit = mk("circle", { cx: LX, cy: y, r: 20, fill: "transparent", class: "mg-hit left" });
            hit.dataset.side = "L"; hit.dataset.idx = i;
            leftPlugs.push({ x: LX, y, col });
        });
        rightOrder.forEach((ci, row) => {
            const y = ys[row], col = set.colors[ci];
            mk("line", { x1: 574, y1: y, x2: RX, y2: y, stroke: "#111", "stroke-width": 12, "stroke-linecap": "round" });
            mk("line", { x1: 574, y1: y, x2: RX, y2: y, stroke: col, "stroke-width": 7, "stroke-linecap": "round" });
            mk("circle", { cx: RX, cy: y, r: 11, fill: col, stroke: "#111", "stroke-width": 3 });
            const hit = mk("circle", { cx: RX, cy: y, r: 20, fill: "transparent", class: "mg-hit right" });
            hit.dataset.side = "R"; hit.dataset.idx = ci;
            rightPlugs[ci] = { x: RX, y, col };
        });

        const timer = api.makeTimer(set.time, "⏱", () => api.lose("Waktu habis! Kabelnya belum tersambung semua."));
        const done = new Set();
        let drag = null;

        const toSvg = (e) => {
            const pt = svg.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        };
        const wirePair = (x1, y1, x2, y2, col) => {
            const dark = mk("line", { x1, y1, x2, y2, stroke: "#111", "stroke-width": 12, "stroke-linecap": "round" });
            const color = mk("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 7, "stroke-linecap": "round" });
            return { dark, color, set(px, py) {
                [dark, color].forEach((l) => { l.setAttribute("x2", px); l.setAttribute("y2", py); });
            }, remove() { dark.remove(); color.remove(); } };
        };

        svg.addEventListener("pointerdown", (e) => {
            if (api.isOver()) return;
            const t = e.target;
            if (!t.dataset || t.dataset.side !== "L") return;
            const i = Number(t.dataset.idx);
            if (done.has(i)) return;
            e.preventDefault();
            try { svg.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
            const p = leftPlugs[i];
            drag = { i, wire: wirePair(p.x, p.y, p.x, p.y, p.col) };
        });
        svg.addEventListener("pointermove", (e) => {
            if (!drag) return;
            const p = toSvg(e);
            drag.wire.set(p.x, p.y);
        });
        const release = (e) => {
            if (!drag) return;
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const ok = target && target.dataset && target.dataset.side === "R" &&
                Number(target.dataset.idx) === drag.i;
            if (ok) {
                const r = rightPlugs[drag.i];
                drag.wire.set(r.x, r.y);
                done.add(drag.i);
                const c = document.getElementById("kabel-count");
                if (c) c.textContent = done.size;
                if (done.size === n) api.win("Semua kabel tersambung! Sinyal panggung aman. Sisa " + Math.ceil(timer.left()) + " detik.");
            } else {
                drag.wire.remove();
                if (target && target.dataset && target.dataset.side === "R") timer.penalty(2); // salah warna
            }
            drag = null;
        };
        svg.addEventListener("pointerup", release);
        svg.addEventListener("pointercancel", () => { if (drag) { drag.wire.remove(); drag = null; } });
    }

    // ------------------------------------------------------------------
    // 3) HITUNG BEBAN LISTRIK (aljabar, angka diacak tiap main)
    // ------------------------------------------------------------------
    const LISTRIK_SETS = {
        aula: {
            title: "💡 MINIGAME: HITUNG BEBAN LISTRIK AULA",
            desc: "Listrik aula hampir kelebihan beban! Hitung pakai aljabar, lalu jawab sebelum lampu padam.",
            time: 90,
            rounds: 3
        }
    };
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const pick = (arr) => arr[rnd(0, arr.length - 1)];
    const r10 = (n) => Math.round(n / 10) * 10;

    function makeProblem(kind) {
        if (kind === 0) {
            // B - a.x <= L  ->  x minimal
            const L = pick([2400, 2600, 2800, 3000]);
            const a = pick([300, 350, 400, 500, 600, 700]);
            const x = rnd(3, 7);
            const r = r10(a * (0.25 + Math.random() * 0.5));
            const B = L + a * (x - 1) + r;
            return {
                before: B, limit: L, after: B - a * x, answer: x,
                text: `Beban listrik aula saat ini <b>${B} W</b>, batas maksimum <b>${L} W</b>.<br>` +
                      `Setiap <b>AC</b> yang dimatikan menghemat <b>${a} W</b>.<br>` +
                      `Berapa <b>unit AC minimal</b> yang harus dimatikan?`,
                hint: `Misalkan x = jumlah AC dimatikan → ${B} − ${a}x ≤ ${L}`,
                unit: "AC"
            };
        }
        if (kind === 1) {
            // B - (c+d).x <= L  ->  x minimal
            const L = pick([2500, 2700, 2900, 3100]);
            const c = pick([50, 100, 150]);
            const d = pick([100, 150, 200]);
            const s = c + d;
            const x = rnd(3, 7);
            const r = r10(s * (0.25 + Math.random() * 0.5));
            const B = L + s * (x - 1) + r;
            return {
                before: B, limit: L, after: B - s * x, answer: x,
                text: `Beban saat ini <b>${B} W</b>, batas maksimum <b>${L} W</b>.<br>` +
                      `Kamu mematikan <b>x lampu</b> (${c} W/unit) dan <b>x kipas</b> (${d} W/unit) sekaligus, jumlahnya sama.<br>` +
                      `Berapa <b>x minimal</b> supaya beban aman?`,
                hint: `${B} − (${c}x + ${d}x) ≤ ${L}  →  ${B} − ${s}x ≤ ${L}`,
                unit: "lampu+kipas"
            };
        }
        // F + p.y <= L  ->  y maksimal
        const F = pick([1500, 1700, 1850]);
        const p = pick([80, 100, 120, 150, 200]);
        const y = rnd(4, 9);
        const r = r10(p * (0.25 + Math.random() * 0.5));
        const L = F + p * y + r;
        const N = y + rnd(2, 4);
        return {
            before: F + p * N, limit: L, after: F + p * y, answer: y,
            text: `Beban tetap panggung (proyektor, sound, dll) <b>${F} W</b>. Batas maksimum aula <b>${L} W</b>.<br>` +
                  `Ada <b>${N} lampu sorot</b> menyala, masing-masing <b>${p} W</b>.<br>` +
                  `Berapa <b>lampu sorot maksimal</b> yang boleh tetap menyala?`,
            hint: `Misalkan y = lampu menyala → ${F} + ${p}y ≤ ${L}`,
            unit: "lampu sorot"
        };
    }

    function buildListrik(set, api) {
        const area = api.area;
        const wrap = el("div", "mg-wrap mg-math");
        const head = el("div", "mg-meter-text");
        const meter = el("div", "mg-meter");
        const fill = el("div", "mg-meter-fill");
        const mark = el("div", "mg-meter-mark");
        meter.appendChild(fill); meter.appendChild(mark);
        const card = el("div", "mg-problem");
        const row = el("div", "mg-answer-row");
        const input = el("input", "mg-input");
        input.type = "number"; input.inputMode = "numeric"; input.placeholder = "x = ?"; input.min = "0";
        const go = el("button", "minigame-btn", "MATIKAN ⚡");
        go.type = "button";
        row.appendChild(el("span", "mg-x", "x =")); row.appendChild(input); row.appendChild(go);
        const toast = el("div", "mg-toast", "&nbsp;");
        wrap.appendChild(head); wrap.appendChild(meter); wrap.appendChild(card); wrap.appendChild(row); wrap.appendChild(toast);
        area.appendChild(wrap);

        const timer = api.makeTimer(set.time, "⚡ Lampu mati dalam", () => {
            api.lose("BLACKOUT! Hitungannya kelamaan, lampu aula padam.");
        });

        const kinds = shuffle([0, 1, 2]).slice(0, set.rounds);
        let round = 0, prob = null, wrongs = 0, locked = false;

        const paint = (load) => {
            const scale = prob.before * 1.05;
            fill.style.width = Math.min(100, (load / scale) * 100) + "%";
            mark.style.left = (prob.limit / scale) * 100 + "%";
            const over = load > prob.limit;
            fill.classList.toggle("over", over);
            head.innerHTML = `Soal <b>${round + 1}/${kinds.length}</b> — Beban: <b>${load} W</b> / Batas: <b>${prob.limit} W</b> ` +
                (over ? "⚠️ <span class='over'>KELEBIHAN</span>" : "✅ <span class='ok'>AMAN</span>");
        };

        const next = () => {
            prob = makeProblem(kinds[round]);
            wrongs = 0; locked = false;
            card.innerHTML = prob.text;
            input.value = ""; input.disabled = false; go.disabled = false;
            toast.className = "mg-toast"; toast.innerHTML = "&nbsp;";
            paint(prob.before);
            input.focus();
        };

        const submit = () => {
            if (api.isOver() || locked) return;
            const v = parseInt(input.value, 10);
            if (isNaN(v)) { toast.className = "mg-toast bad"; toast.innerHTML = "Isi jawabannya dulu (angka bulat)."; return; }
            if (v === prob.answer) {
                locked = true; input.disabled = true; go.disabled = true;
                paint(prob.after);
                toast.className = "mg-toast";
                toast.innerHTML = `✔ Benar! x = <b>${prob.answer}</b>. Beban turun ke <b>${prob.after} W</b>.`;
                round++;
                if (round >= kinds.length) {
                    api.later(() => api.win("Semua hitungan benar! Lampu aula selamat dari blackout. Sisa " + Math.ceil(timer.left()) + " detik."), 900);
                } else {
                    api.later(next, 1400);
                }
            } else {
                wrongs++;
                toast.className = "mg-toast bad";
                toast.innerHTML = "✖ Belum tepat (-5 detik)." + (wrongs >= 1 ? "<br>Petunjuk: <b>" + prob.hint + "</b>" : "");
                input.select();
                timer.penalty(5);
            }
        };
        go.onclick = submit;
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.stopPropagation(); submit(); } });
        next();
    }

    // ------------------------------------------------------------------
    // 4) PASANG NET: tahan ujung tali, putar mengelilingi tiang
    // ------------------------------------------------------------------
    const NET_SETS = {
        default: {
            title: "🏸 MINIGAME: KENCANGKAN NET BADMINTON",
            desc: "Tahan ujung tali net (bulatan kuning), lalu putar mengelilingi tiang searah jarum jam sampai net tegang!",
            time: 25,
            turns: 3
        }
    };

    function buildNet(set, api) {
        const NS = "http://www.w3.org/2000/svg";
        const area = api.area;
        const CX = 380, CY = 130, R = 82;
        const wrap = el("div", "mg-wrap");
        const info = el("div", "mg-info", `Putaran: <b id="net-turns">0.0</b> / ${set.turns}`);
        wrap.appendChild(info);
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("viewBox", "0 0 600 260");
        svg.setAttribute("class", "mg-svg");
        wrap.appendChild(svg);
        area.appendChild(wrap);
        const mk = (name, attrs) => {
            const e = document.createElementNS(NS, name);
            Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
            svg.appendChild(e);
            return e;
        };

        // lapangan + net di kiri
        mk("rect", { x: 0, y: 0, width: 600, height: 260, rx: 10, fill: "#16323a" });
        for (let i = 0; i <= 5; i++) mk("line", { x1: 30, y1: 60 + i * 28, x2: 140, y2: 60 + i * 28, stroke: "#cfe8ee", "stroke-width": 1.5, opacity: 0.8 });
        for (let i = 0; i <= 6; i++) mk("line", { x1: 30 + i * 18.3, y1: 60, x2: 30 + i * 18.3, y2: 200, stroke: "#cfe8ee", "stroke-width": 1.5, opacity: 0.8 });
        mk("text", { x: 85, y: 222, "text-anchor": "middle", fill: "#9fc7d0", "font-size": 13 }).textContent = "NET";
        // panduan lingkaran
        mk("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: "#ffffff", "stroke-opacity": 0.25, "stroke-width": 2, "stroke-dasharray": "6 8" });
        // tali
        const rope = mk("line", { x1: 140, y1: CY, x2: CX - R, y2: CY, stroke: "#c8a26a", "stroke-width": 5, "stroke-linecap": "round" });
        // lilitan di tiang
        const circ = 2 * Math.PI * 34;
        const wind = mk("circle", { cx: CX, cy: CY, r: 34, fill: "none", stroke: "#ffd54f", "stroke-width": 7,
            "stroke-dasharray": `0 ${circ}`, transform: `rotate(-90 ${CX} ${CY})` });
        // tiang
        mk("circle", { cx: CX, cy: CY, r: 24, fill: "#7a7f8c", stroke: "#2b2e38", "stroke-width": 4 });
        mk("text", { x: CX, y: CY + 4, "text-anchor": "middle", fill: "#fff", "font-size": 11, "font-weight": "bold" }).textContent = "TIANG";
        // pegangan
        let ang = Math.PI;   // mulai di sisi kiri tiang
        const handle = mk("circle", { cx: CX + R * Math.cos(ang), cy: CY + R * Math.sin(ang), r: 15, fill: "#ffd54f", stroke: "#111", "stroke-width": 3 });
        const hit = mk("circle", { cx: handle.getAttribute("cx"), cy: handle.getAttribute("cy"), r: 30, fill: "transparent", class: "mg-hit" });

        const timer = api.makeTimer(set.time, "⏱", () => api.lose("Waktu habis! Netnya masih kendur."));
        let total = 0, drag = false, prev = 0;
        const need = set.turns * 2 * Math.PI;

        const toSvg = (e) => {
            const pt = svg.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        };
        const place = () => {
            const x = CX + R * Math.cos(ang), y = CY + R * Math.sin(ang);
            [handle, hit].forEach((c) => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
            rope.setAttribute("x2", x); rope.setAttribute("y2", y);
        };
        const paintProgress = () => {
            const t = Math.max(0, total) / (2 * Math.PI);
            const el2 = document.getElementById("net-turns");
            if (el2) el2.textContent = Math.min(t, set.turns).toFixed(1);
            const frac = Math.min(1, Math.max(0, total) / need);
            wind.setAttribute("stroke-dasharray", `${frac * circ} ${circ}`);
            wind.setAttribute("stroke-width", 7 + frac * 6);
            rope.setAttribute("stroke", frac > 0.85 ? "#ff7a45" : "#c8a26a");
        };

        svg.addEventListener("pointerdown", (e) => {
            if (api.isOver() || e.target !== hit) return;
            e.preventDefault();
            try { svg.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
            drag = true;
            const p = toSvg(e);
            prev = Math.atan2(p.y - CY, p.x - CX);
        });
        svg.addEventListener("pointermove", (e) => {
            if (!drag || api.isOver()) return;
            const p = toSvg(e);
            const a = Math.atan2(p.y - CY, p.x - CX);
            let d = a - prev;
            while (d > Math.PI) d -= 2 * Math.PI;
            while (d < -Math.PI) d += 2 * Math.PI;
            prev = a;
            ang = a;
            total += d;                   // searah jarum jam = bertambah, berlawanan = mengendur
            if (total < 0) total = 0;
            place();
            paintProgress();
            if (total >= need) {
                drag = false;
                api.win("Net terpasang kencang di tiang! Sisa " + Math.ceil(timer.left()) + " detik.");
            }
        });
        const up = () => { drag = false; };
        svg.addEventListener("pointerup", up);
        svg.addEventListener("pointercancel", up);
        place();
    }

    // ------------------------------------------------------------------
    // 5) DORONG RING BASKET: tekan huruf acak dengan cepat
    // ------------------------------------------------------------------
    const HURUF_SETS = {
        default: {
            title: "🏀 MINIGAME: DORONG RING BASKET",
            desc: "Tekan huruf yang menyala di keyboard secepat mungkin! Salah pencet = semua huruf diacak ulang dari awal.",
            time: 25,
            length: 8
        }
    };

    function buildHuruf(set, api) {
        const area = api.area;
        const LETTERS = "ABCDEGHIJKLMNOPQRSTUVWXYZ";   // tanpa F (dipakai tombol Lanjut)
        let seq = [], pos = 0, tries = 0;

        const wrap = el("div", "mg-wrap");
        const track = el("div", "mg-track");
        const ring = el("div", "mg-ring", "🏀");
        const goal = el("div", "mg-goal", "🏁");
        track.appendChild(ring); track.appendChild(goal);
        const keys = el("div", "mg-keys");
        const pad = el("div", "mg-pad");          // tombol huruf di layar (untuk HP / tanpa keyboard)
        const toast = el("div", "mg-toast", "Klik area ini lalu mulai menekan huruf!");
        wrap.appendChild(track); wrap.appendChild(keys); wrap.appendChild(pad); wrap.appendChild(toast);
        area.appendChild(wrap);

        const timer = api.makeTimer(set.time, "⏱", () => api.lose("Waktu habis! Ringnya belum sampai garis tengah."));

        const shuffleSeq = () => {
            seq = [];
            for (let i = 0; i < set.length; i++) {
                let c;
                do { c = LETTERS[rnd(0, LETTERS.length - 1)]; } while (i > 0 && c === seq[i - 1]);
                seq.push(c);
            }
            pos = 0;
            paintKeys();
        };
        const paintKeys = () => {
            keys.innerHTML = "";
            seq.forEach((c, i) => {
                const k = el("div", "mg-key" + (i < pos ? " done" : i === pos ? " now" : ""), c);
                keys.appendChild(k);
            });
            ring.style.left = (pos / set.length) * 88 + "%";
            paintPad();
        };
        const paintPad = () => {
            pad.innerHTML = "";
            if (pos >= seq.length) return;
            const opts = new Set([seq[pos]]);
            while (opts.size < 6) opts.add(LETTERS[rnd(0, LETTERS.length - 1)]);
            shuffle([...opts]).forEach((c) => {
                const b = el("button", "mg-padkey", c);
                b.type = "button";
                b.addEventListener("pointerdown", (e) => { e.preventDefault(); press(c); });
                pad.appendChild(b);
            });
        };

        const onKey = (e) => {
            if (api.isOver()) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (!/^[a-zA-Z]$/.test(e.key)) return;
            const k = e.key.toUpperCase();
            if (k === "F") return;
            e.preventDefault();
            press(k);
        };
        const press = (k) => {
            if (api.isOver()) return;
            if (k === seq[pos]) {
                pos++;
                toast.className = "mg-toast"; toast.innerHTML = "&nbsp;";
                paintKeys();
                if (pos >= seq.length) api.win("Ring basket terdorong ke garis tengah! Sisa " + Math.ceil(timer.left()) + " detik.");
            } else {
                tries++;
                toast.className = "mg-toast bad";
                toast.innerHTML = "✖ Salah pencet! Huruf diacak ulang dari awal.";
                keys.classList.add("shake");
                setTimeout(() => keys.classList.remove("shake"), 300);
                shuffleSeq();
            }
        };
        document.addEventListener("keydown", onKey);
        api.onCleanup(() => document.removeEventListener("keydown", onKey));
        shuffleSeq();
        toast.innerHTML = "Tekan huruf yang menyala (berwarna kuning)!";
    }


    // ------------------------------------------------------------------
    // 6) BAGI BEBAN DAYA: pindahkan alat ke 2 stopkontak agar tidak korslet
    // ------------------------------------------------------------------
    const ESPORT_SETS = {
        aula: {
            title: "🔌 MINIGAME: BAGI BEBAN STOPKONTAK AULA",
            desc: "Semua alat menumpuk di Stopkontak 1 dan hampir korslet! Klik alat untuk memindahkannya antar stopkontak sampai KEDUANYA di bawah batas daya.",
            time: 40,
            limit: 2000,
            devices: [
                { name: "Proyektor", icon: "📽️", w: 1200 },
                { name: "PC Caster", icon: "🖥️", w: 800 },
                { name: "Sound System", icon: "🔊", w: 700 },
                { name: "Monitor", icon: "📺", w: 500 },
                { name: "Lampu Sorot", icon: "💡", w: 400 },
                { name: "Router", icon: "📡", w: 300 }
            ]
        }
    };

    function buildEsport(set, api) {
        const area = api.area;
        const where = set.devices.map(() => 0);        // 0 = stopkontak 1, 1 = stopkontak 2
        const wrap = el("div", "mg-wrap");
        const sockets = [0, 1].map((i) => {
            const box = el("div", "mg-socket");
            const head = el("div", "mg-socket-head");
            const meter = el("div", "mg-meter");
            const fill = el("div", "mg-meter-fill");
            const mark = el("div", "mg-meter-mark");
            mark.style.left = "100%"; mark.style.marginLeft = "-3px";
            meter.appendChild(fill); meter.appendChild(mark);
            const list = el("div", "mg-socket-list");
            box.appendChild(head); box.appendChild(meter); box.appendChild(list);
            return { box, head, fill, list };
        });
        const cols = el("div", "mg-sockets");
        sockets.forEach((sk) => cols.appendChild(sk.box));
        const toast = el("div", "mg-toast", "Klik sebuah alat untuk memindahkannya ke stopkontak lain.");
        wrap.appendChild(cols); wrap.appendChild(toast);
        area.appendChild(wrap);

        const timer = api.makeTimer(set.time, "⚡", () => api.lose("KORSLET! Waktu habis sebelum bebannya terbagi."));

        const load = (i) => set.devices.reduce((sum, d, k) => sum + (where[k] === i ? d.w : 0), 0);
        const paint = () => {
            let ok = true;
            sockets.forEach((sk, i) => {
                const l = load(i), over = l > set.limit;
                if (over) ok = false;
                sk.head.innerHTML = `Stopkontak ${i + 1}: <b>${l} W</b> / ${set.limit} W ` +
                    (over ? "⚠️ <span class='over'>KELEBIHAN</span>" : "✅ <span class='ok'>AMAN</span>");
                sk.fill.style.width = Math.min(100, (l / (set.limit * 1.25)) * 100) + "%";
                sk.fill.classList.toggle("over", over);
                sk.list.innerHTML = "";
                set.devices.forEach((d, k) => {
                    if (where[k] !== i) return;
                    const b = el("button", "mg-device", `<span>${d.icon}</span><b>${d.name}</b><small>${d.w} W</small>`);
                    b.type = "button";
                    b.addEventListener("click", () => {
                        if (api.isOver()) return;
                        where[k] = 1 - where[k];
                        paint();
                    });
                    sk.list.appendChild(b);
                });
            });
            if (ok) {
                toast.className = "mg-toast";
                toast.innerHTML = "✔ Kedua stopkontak aman!";
                api.later(() => { if (!api.isOver()) api.win("Beban terbagi aman, proyektor bebas korslet! Sisa " + Math.ceil(timer.left()) + " detik."); }, 500);
            } else {
                toast.className = "mg-toast";
                toast.innerHTML = "Klik sebuah alat untuk memindahkannya ke stopkontak lain.";
            }
        };
        // meter: batas = 80% lebar bar
        sockets.forEach((sk) => { sk.box.querySelector(".mg-meter-mark").style.left = "80%"; });
        paint();
    }

    // ------------------------------------------------------------------
    // PINTU MASUK untuk game.js
    // ------------------------------------------------------------------
    window.MiniGames = {
        cari(setName, done) {
            const set = CARI_SETS[setName] || CARI_SETS.badminton;
            launch({ title: set.title, desc: set.desc, build: (api) => buildCari(set, api) }, done);
        },
        kabel(setName, done) {
            const set = KABEL_SETS[setName] || KABEL_SETS.panel;
            launch({ title: set.title, desc: set.desc, build: (api) => buildKabel(set, api) }, done);
        },
        net(setName, done) {
            const set = NET_SETS[setName] || NET_SETS.default;
            launch({ title: set.title, desc: set.desc, build: (api) => buildNet(set, api) }, done);
        },
        huruf(setName, done) {
            const set = HURUF_SETS[setName] || HURUF_SETS.default;
            launch({ title: set.title, desc: set.desc, build: (api) => buildHuruf(set, api) }, done);
        },
        esport(setName, done) {
            const set = ESPORT_SETS[setName] || ESPORT_SETS.aula;
            launch({ title: set.title, desc: set.desc, build: (api) => buildEsport(set, api) }, done);
        },
        listrik(setName, done) {
            const set = LISTRIK_SETS[setName] || LISTRIK_SETS.aula;
            launch({ title: set.title, desc: set.desc, build: (api) => buildListrik(set, api) }, done);
        }
    };
})();
