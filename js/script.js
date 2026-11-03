document.addEventListener("DOMContentLoaded", () => {
    // 1. ELEMEN SIDEBAR & TOMBOL MENU
    const btnNewGame = document.getElementById("btn-newgame");
    const btnContinue = document.getElementById("btn-continue");
    const btnAbout = document.getElementById("btn-about");
    const btnCredits = document.getElementById("btn-credits");
    
    const sidebarUserName = document.getElementById("sidebar-user-name");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const accountBtn = document.getElementById("account-btn");
    const accountStatus = document.getElementById("account-status");

    // 2. MODAL AUTH (LOGIN / REGIS)
    const authModal = document.getElementById("auth-modal");
    const closeAuth = document.getElementById("close-auth");
    const loginForm = document.getElementById("login-form");
    const regisForm = document.getElementById("regis-form");
    const userLoggedInfo = document.getElementById("user-logged-info");
    
    const switchToRegis = document.getElementById("switch-to-regis");
    const switchToLogin = document.getElementById("switch-to-login");
    
    const doLoginBtn = document.getElementById("do-login-btn");
    const doRegisBtn = document.getElementById("do-regis-btn");
    const doLogoutBtn = document.getElementById("do-logout-btn");
    
    const loginUsernameInput = document.getElementById("login-username");
    const loggedUserName = document.getElementById("logged-user-name");

    // 3. MODAL ABOUT & CREDITS
    const aboutModal = document.getElementById("about-modal");
    const closeAbout = document.getElementById("close-about");
    
    const creditsModal = document.getElementById("credits-modal");
    const closeCredits = document.getElementById("close-credits");

    // ==========================================
    // INISIALISASI AKUN / SESSION USER
    // ==========================================
    function checkUserSession() {
        const currentUser = localStorage.getItem("session_user");
        if (currentUser) {
            if (sidebarUserName) sidebarUserName.textContent = currentUser;
            if (accountStatus) accountStatus.textContent = currentUser;
            if (loggedUserName) loggedUserName.textContent = currentUser;
        } else {
            if (sidebarUserName) sidebarUserName.textContent = "Guest Mode";
            if (accountStatus) accountStatus.textContent = "Akun";
        }
    }
    checkUserSession();

    // ==========================================
    // NAVIGASI TOMBOL MENU
    // ==========================================

    // Tombol New Game -> Langsung Masuk Ke Layar Game
    if (btnNewGame) {
        btnNewGame.addEventListener("click", () => {
            const currentUser = localStorage.getItem("session_user");
            if (!currentUser) {
                // Jika belum login / guest, beri nama default atau buka modal login
                localStorage.setItem("session_user", "Radit");
            }
            localStorage.setItem("current_index", "0");
            window.location.href = "game.html";
        });
    }

    // Tombol Continue -> Lanjut Progress Terakhir
    if (btnContinue) {
        btnContinue.addEventListener("click", () => {
            const savedIndex = localStorage.getItem("current_index");
            if (savedIndex !== null) {
                window.location.href = "game.html";
            } else {
                alert("Belum ada progres permainan tersimpan!");
            }
        });
    }

    // Tombol About -> Buka Modal About
    if (btnAbout) {
        btnAbout.addEventListener("click", () => {
            if (aboutModal) aboutModal.classList.remove("hidden");
        });
    }
    if (closeAbout) {
        closeAbout.addEventListener("click", () => {
            if (aboutModal) aboutModal.classList.add("hidden");
        });
    }

    // Tombol Credits -> Buka Modal Credits Kelompok 6
    if (btnCredits) {
        btnCredits.addEventListener("click", () => {
            if (creditsModal) creditsModal.classList.remove("hidden");
        });
    }
    if (closeCredits) {
        closeCredits.addEventListener("click", () => {
            if (creditsModal) creditsModal.classList.add("hidden");
        });
    }

    // ==========================================
    // HANDLER AKUN & AUTHENTICATION MODAL
    // ==========================================
    if (accountBtn) {
        accountBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("session_user");
            if (authModal) authModal.classList.remove("hidden");

            if (currentUser && currentUser !== "Guest Mode") {
                if (loginForm) loginForm.classList.add("hidden");
                if (regisForm) regisForm.classList.add("hidden");
                if (userLoggedInfo) userLoggedInfo.classList.remove("hidden");
            } else {
                if (loginForm) loginForm.classList.remove("hidden");
                if (regisForm) regisForm.classList.add("hidden");
                if (userLoggedInfo) userLoggedInfo.classList.add("hidden");
            }
        });
    }

    if (closeAuth) {
        closeAuth.addEventListener("click", () => {
            if (authModal) authModal.classList.add("hidden");
        });
    }

    if (switchToRegis) {
        switchToRegis.addEventListener("click", (e) => {
            e.preventDefault();
            if (loginForm) loginForm.classList.add("hidden");
            if (regisForm) regisForm.classList.remove("hidden");
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            if (regisForm) regisForm.classList.add("hidden");
            if (loginForm) loginForm.classList.remove("hidden");
        });
    }

    // Login Action
    if (doLoginBtn) {
        doLoginBtn.addEventListener("click", () => {
            const val = loginUsernameInput.value.trim();
            if (!val) {
                alert("Ketik username kamu!");
                return;
            }
            localStorage.setItem("session_user", val);
            checkUserSession();
            if (authModal) authModal.classList.add("hidden");
            alert(`Selamat datang kembali, ${val}!`);
        });
    }

    // Logout Action
    if (doLogoutBtn) {
        doLogoutBtn.addEventListener("click", () => {
            localStorage.removeItem("session_user");
            checkUserSession();
            if (authModal) authModal.classList.add("hidden");
            alert("Berhasil logout!");
        });
    }

    // Fullscreen Toggle Button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`Error Fullscreen: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
});