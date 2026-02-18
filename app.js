const books = [];
const members = [];
const loans = [];
const comments = [];
let announcementText = "";

let currentUserRole = null;
let currentMemberId = null;

const excelInput = document.getElementById("excel-input");
const booksBody = document.getElementById("books-body");
const totalBooksEl = document.getElementById("total-books");
const totalCategoriesEl = document.getElementById("total-categories");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const downloadTemplateBtn = document.getElementById("download-template");
const exportExcelBtn = document.getElementById("export-excel");
const addBookBtn = document.getElementById("add-book");
const toastEl = document.getElementById("toast");

const navItems = document.querySelectorAll(".nav-item");
const pageSections = document.querySelectorAll(".page-section");

const anggotaIdInput = document.getElementById("anggota-id");
const anggotaNamaInput = document.getElementById("anggota-nama");
const anggotaKelasInput = document.getElementById("anggota-kelas");
const anggotaJurusanInput = document.getElementById("anggota-jurusan");
const addMemberBtn = document.getElementById("add-member");
const membersBody = document.getElementById("members-body");

const kartuAnggotaSelect = document.getElementById("kartu-anggota-select");
const kartuNamaEl = document.getElementById("kartu-nama");
const kartuIdEl = document.getElementById("kartu-id");
const kartuKelasEl = document.getElementById("kartu-kelas");
const kartuJurusanEl = document.getElementById("kartu-jurusan");
const printCardBtn = document.getElementById("print-card");
const cardsGridEl = document.getElementById("cards-grid");
const printAllMembersBtn = document.getElementById("print-all-members");
const printSelectedMembersBtn = document.getElementById("print-selected-members");

const pinjamanAnggotaSelect = document.getElementById("pinjaman-anggota");
const pinjamanBukuInput = document.getElementById("pinjaman-buku");
const pinjamanTanggalPinjamInput = document.getElementById("pinjaman-tanggal-pinjam");
const pinjamanTanggalKembaliInput = document.getElementById("pinjaman-tanggal-kembali");
const addLoanBtn = document.getElementById("add-loan");
const loansBody = document.getElementById("loans-body");
const kartuBarcodeEl = document.getElementById("kartu-barcode");

const downloadTemplateMembersBtn = document.getElementById("download-template-members");
const exportMembersBtn = document.getElementById("export-members");
const importMembersInput = document.getElementById("import-members-input");
const downloadTemplateLoansBtn = document.getElementById("download-template-loans");
const exportLoansBtn = document.getElementById("export-loans");
const selectAllBooksCheckbox = document.getElementById("select-all-books");
const selectAllMembersCheckbox = document.getElementById("select-all-members");
const selectAllLoansCheckbox = document.getElementById("select-all-loans");
const deleteSelectedBooksBtn = document.getElementById("delete-selected-books");
const deleteSelectedMembersBtn = document.getElementById("delete-selected-members");
const deleteSelectedLoansBtn = document.getElementById("delete-selected-loans");

const pengembalianAnggotaIdInput = document.getElementById("pengembalian-anggota-id");
const pengembalianBukuInput = document.getElementById("pengembalian-buku");
const pengembalianTanggalInput = document.getElementById("pengembalian-tanggal");
const returnLoanBtn = document.getElementById("return-loan");

const appLogoImg = document.getElementById("app-logo-img");
const cardLogoImg = document.getElementById("card-logo-img");
const uploadLogoInput = document.getElementById("upload-logo-input");
const loginOverlay = document.getElementById("login-overlay");
const headerActionBars = document.querySelectorAll(".header-actions");
const mainNav = document.querySelector(".main-nav");
const pinjamanSidebar = document.getElementById("pinjaman-sidebar");
const loginTabs = document.querySelectorAll(".login-tab");
const loginAdminForm = document.getElementById("login-admin");
const loginMemberForm = document.getElementById("login-member");
const adminUsernameInput = document.getElementById("admin-username");
const adminPasswordInput = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const memberIdLoginInput = document.getElementById("member-id-login");
const memberLoginBtn = document.getElementById("member-login-btn");
const logoutBtn = document.getElementById("logout-btn");
const memberCommentBox = document.getElementById("member-comment-box");
const memberCommentText = document.getElementById("member-comment-text");
const memberCommentSendBtn = document.getElementById("member-comment-send");
const commentsListEl = document.getElementById("comments-list");
const announcementDisplayEl = document.getElementById("announcement-text-display");
const announcementAdminBox = document.getElementById("announcement-admin-box");
const announcementInput = document.getElementById("announcement-input");
const announcementSaveBtn = document.getElementById("announcement-save");
const adminSettingsCard = document.getElementById("admin-settings-card");
const adminOldPasswordInput = document.getElementById("admin-old-password");
const adminNewPasswordInput = document.getElementById("admin-new-password");
const adminNewPasswordConfirmInput = document.getElementById("admin-new-password-confirm");
const adminChangePasswordBtn = document.getElementById("admin-change-password-btn");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
let currentAdminPassword = ADMIN_PASSWORD;

function loadAdminPasswordFromStorage() {
  try {
    const stored = localStorage.getItem("perpustakaan_smkn4_admin_password");
    if (!stored) {
      currentAdminPassword = ADMIN_PASSWORD;
      return;
    }
    currentAdminPassword = String(stored);
  } catch (err) {
    currentAdminPassword = ADMIN_PASSWORD;
  }
}

function saveAdminPasswordToStorage(newPassword) {
  try {
    localStorage.setItem("perpustakaan_smkn4_admin_password", newPassword || "");
    currentAdminPassword = newPassword || ADMIN_PASSWORD;
  } catch (err) {
    showToast("Gagal menyimpan password admin.");
  }
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("visible");
  setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.add("hidden");
  }, 2200);
}

function setActivePage(targetName) {
  navItems.forEach((btn) => {
    const target = btn.getAttribute("data-target");
    if (target === targetName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  pageSections.forEach((section) => {
    const id = section.id || "";
    if (id === "page-" + targetName) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}

function normalizeBookRow(row) {
  const kode = row["Kode"] || row["Kode Buku"] || row["kode"] || row["kode_buku"] || "";
  const judul = row["Judul"] || row["Judul Buku"] || row["judul"] || "";
  const penulis = row["Penulis"] || row["penulis"] || "";
  const kategori = row["Kategori"] || row["kategori"] || "";
  const tahun = row["Tahun"] || row["Tahun Terbit"] || row["tahun"] || "";
  const stok = row["Stok"] || row["stok"] || "";

  return {
    kode: String(kode || "").trim(),
    judul: String(judul || "").trim(),
    penulis: String(penulis || "").trim(),
    kategori: String(kategori || "").trim(),
    tahun: tahun ? Number(tahun) || "" : "",
    stok: stok === "" || stok === null || stok === undefined ? "" : Number(stok) || 0,
  };
}

function refreshCategoryOptions() {
  const current = categoryFilter.value;
  const categories = Array.from(
    new Set(
      books
        .map((b) => b.kategori)
        .filter((x) => x && x.trim() !== "")
    )
  ).sort((a, b) => a.localeCompare(b, "id"));

  categoryFilter.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "Semua Kategori";
  categoryFilter.appendChild(allOpt);

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  if (categories.includes(current)) {
    categoryFilter.value = current;
  }
}

function renderTable() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  let filtered = books;
  if (keyword) {
    filtered = filtered.filter((b) => {
      const combined = `${b.kode} ${b.judul} ${b.penulis} ${b.kategori}`.toLowerCase();
      return combined.includes(keyword);
    });
  }
  if (selectedCategory) {
    filtered = filtered.filter((b) => b.kategori === selectedCategory);
  }

  booksBody.innerHTML = "";

  if (!filtered.length) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 9;
    td.textContent = "Data tidak ditemukan. Coba kata kunci atau kategori lain.";
    tr.appendChild(td);
    booksBody.appendChild(tr);
  } else {
    filtered.forEach((b, index) => {
      const tr = document.createElement("tr");

      const globalIndex = books.indexOf(b);
      const selectTd = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "row-select-book";
      if (globalIndex !== -1) {
        checkbox.dataset.index = String(globalIndex);
      }
      selectTd.appendChild(checkbox);
      tr.appendChild(selectTd);

      const cells = [
        index + 1,
        b.kode || "-",
        b.judul || "-",
        b.penulis || "-",
        b.kategori || "-",
        b.tahun || "-",
        typeof b.stok === "number" ? b.stok : "-",
      ];

      cells.forEach((val) => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      const actionTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Hapus";
      deleteBtn.className = "table-btn danger";
      deleteBtn.addEventListener("click", () => {
        const globalIndex = books.indexOf(b);
        if (globalIndex !== -1) {
          books.splice(globalIndex, 1);
          saveToStorage();
          refreshCategoryOptions();
          renderTable();
          showToast("Buku berhasil dihapus.");
        }
      });
      const wrapper = document.createElement("div");
      wrapper.className = "table-actions";
      wrapper.appendChild(deleteBtn);
      actionTd.appendChild(wrapper);
      tr.appendChild(actionTd);

      booksBody.appendChild(tr);
    });
  }

  totalBooksEl.textContent = books.length.toString();
  const categoryCount = new Set(
    books.map((b) => b.kategori).filter((x) => x && x.trim() !== "")
  ).size;
  totalCategoriesEl.textContent = categoryCount.toString();
}

function saveToStorage() {
  try {
    const payload = JSON.stringify(books);
    localStorage.setItem("perpustakaan_smkn4_buku", payload);
  } catch (err) {
    showToast("Gagal menyimpan ke penyimpanan browser.");
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("perpustakaan_smkn4_buku");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    books.length = 0;
    parsed.forEach((item) => {
      books.push({
        kode: item.kode || "",
        judul: item.judul || "",
        penulis: item.penulis || "",
        kategori: item.kategori || "",
        tahun: item.tahun || "",
        stok: item.stok === undefined || item.stok === null ? "" : item.stok,
      });
    });
    refreshCategoryOptions();
    renderTable();
  } catch (err) {
    showToast("Data tersimpan tidak bisa dibaca. Akan diabaikan.");
  }
}

function saveMembersToStorage() {
  try {
    const payload = JSON.stringify(members);
    localStorage.setItem("perpustakaan_smkn4_anggota", payload);
  } catch (err) {
    showToast("Gagal menyimpan data anggota.");
  }
}

function loadMembersFromStorage() {
  try {
    const raw = localStorage.getItem("perpustakaan_smkn4_anggota");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    members.length = 0;
    parsed.forEach((item) => {
      members.push({
        id: item.id || "",
        nama: item.nama || "",
        kelas: item.kelas || "",
        jurusan: item.jurusan || "",
      });
    });
    renderMembers();
    refreshMemberOptions();
    updateCardPreview(-1);
  } catch (err) {
    showToast("Data anggota tersimpan tidak bisa dibaca.");
  }
}

function saveLoansToStorage() {
  try {
    const payload = JSON.stringify(loans);
    localStorage.setItem("perpustakaan_smkn4_pinjaman", payload);
  } catch (err) {
    showToast("Gagal menyimpan data pinjaman.");
  }
}

function loadLoansFromStorage() {
  try {
    const raw = localStorage.getItem("perpustakaan_smkn4_pinjaman");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    loans.length = 0;
    parsed.forEach((item) => {
      loans.push({
        anggotaId: item.anggotaId || "",
        anggotaNama: item.anggotaNama || "",
        buku: item.buku || "",
        tanggalPinjam: item.tanggalPinjam || "",
        tanggalKembali: item.tanggalKembali || "",
        status: item.status || "Dipinjam",
      });
    });
    renderLoans();
  } catch (err) {
    showToast("Data pinjaman tersimpan tidak bisa dibaca.");
  }
}

function saveCommentsToStorage() {
  try {
    const payload = JSON.stringify(comments);
    localStorage.setItem("perpustakaan_smkn4_komentar", payload);
  } catch (err) {
    showToast("Gagal menyimpan komentar.");
  }
}

function loadCommentsFromStorage() {
  try {
    const raw = localStorage.getItem("perpustakaan_smkn4_komentar");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    comments.length = 0;
    parsed.forEach((item) => {
      comments.push({
        id: item.id || "",
        memberId: item.memberId || "",
        memberName: item.memberName || "",
        text: item.text || "",
        reply: item.reply || "",
        createdAt: item.createdAt || "",
      });
    });
  } catch (err) {
    showToast("Data komentar tersimpan tidak bisa dibaca.");
  }
}

function saveAnnouncementToStorage() {
  try {
    localStorage.setItem("perpustakaan_smkn4_pengumuman", announcementText || "");
  } catch (err) {
    showToast("Gagal menyimpan pesan admin.");
  }
}

function loadAnnouncementFromStorage() {
  try {
    const raw = localStorage.getItem("perpustakaan_smkn4_pengumuman");
    if (!raw) {
      announcementText = "";
      return;
    }
    announcementText = String(raw);
  } catch (err) {
    announcementText = "";
    showToast("Pesan admin tersimpan tidak bisa dibaca.");
  }
}

function applyLogoFromStorage() {
  try {
    const dataUrl = localStorage.getItem("perpustakaan_smkn4_logo");
    if (!dataUrl) {
      return;
    }
    if (appLogoImg) {
      appLogoImg.src = dataUrl;
      appLogoImg.style.display = "block";
      const fallback = appLogoImg.parentElement && appLogoImg.parentElement.querySelector(".brand-logo-fallback");
      if (fallback) {
        fallback.style.display = "none";
      }
    }
    if (cardLogoImg) {
      cardLogoImg.src = dataUrl;
      cardLogoImg.style.display = "block";
      const fallbackCard = cardLogoImg.parentElement && cardLogoImg.parentElement.querySelector(".card-logo-fallback");
      if (fallbackCard) {
        fallbackCard.style.display = "none";
      }
    }
  } catch (err) {
    showToast("Logo tidak bisa dimuat dari penyimpanan.");
  }
}

function handleLogoFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const result = e.target && e.target.result;
    if (!result || typeof result !== "string") {
      showToast("Gagal membaca file logo.");
      return;
    }
    try {
      localStorage.setItem("perpustakaan_smkn4_logo", result);
    } catch (err) {
      showToast("Gagal menyimpan logo ke penyimpanan.");
    }
    if (appLogoImg) {
      appLogoImg.src = result;
      appLogoImg.style.display = "block";
      const fallback = appLogoImg.parentElement && appLogoImg.parentElement.querySelector(".brand-logo-fallback");
      if (fallback) {
        fallback.style.display = "none";
      }
    }
    if (cardLogoImg) {
      cardLogoImg.src = result;
      cardLogoImg.style.display = "block";
      const fallbackCard = cardLogoImg.parentElement && cardLogoImg.parentElement.querySelector(".card-logo-fallback");
      if (fallbackCard) {
        fallbackCard.style.display = "none";
      }
    }
    showToast("Logo berhasil diperbarui.");
  };
  reader.readAsDataURL(file);
}

function setRole(role, memberId) {
  currentUserRole = role;
  currentMemberId = memberId || null;

  if (loginOverlay) {
    loginOverlay.style.display = "none";
  }

  if (role === "admin") {
    document.body.classList.remove("member-view");
    if (mainNav) {
      mainNav.style.display = "flex";
    }
    navItems.forEach((btn) => {
      btn.style.display = "";
    });
    headerActionBars.forEach((bar) => {
      bar.style.display = "flex";
    });
    if (memberCommentBox) {
      memberCommentBox.style.display = "none";
    }
    if (pinjamanSidebar) {
      pinjamanSidebar.style.display = "";
    }
    if (adminSettingsCard) {
      adminSettingsCard.style.display = "flex";
    }
    renderComments();
    renderAnnouncement();
    setActivePage("beranda");
  } else if (role === "member") {
    document.body.classList.add("member-view");
    if (mainNav) {
      mainNav.style.display = "flex";
    }
    navItems.forEach((btn) => {
      const target = btn.getAttribute("data-target");
      if (target === "pinjaman") {
        btn.style.display = "inline-flex";
      } else {
        btn.style.display = "none";
      }
    });
    if (pinjamanSidebar) {
      pinjamanSidebar.style.display = "none";
    }
    headerActionBars.forEach((bar) => {
      bar.style.display = "none";
    });
    if (memberCommentBox) {
      memberCommentBox.style.display = "flex";
    }
    if (adminSettingsCard) {
      adminSettingsCard.style.display = "none";
    }
    setActivePage("pinjaman");
    renderLoans();
    renderComments();
    renderAnnouncement();
  }
}

function handleAdminLogin() {
  const username = adminUsernameInput ? adminUsernameInput.value.trim() : "";
  const password = adminPasswordInput ? adminPasswordInput.value : "";
  if (!username || !password) {
    showToast("Username dan password admin wajib diisi.");
    return;
  }
  if (username !== ADMIN_USERNAME || password !== currentAdminPassword) {
    showToast("Username atau password admin salah.");
    return;
  }
  setRole("admin");
  showToast("Login admin berhasil.");
}

function handleAdminChangePassword() {
  if (currentUserRole !== "admin") {
    showToast("Login sebagai admin terlebih dahulu.");
    return;
  }
  if (!adminOldPasswordInput || !adminNewPasswordInput || !adminNewPasswordConfirmInput) {
    return;
  }
  const oldPass = adminOldPasswordInput.value;
  const newPass = adminNewPasswordInput.value;
  const confirmPass = adminNewPasswordConfirmInput.value;
  if (!oldPass || !newPass || !confirmPass) {
    showToast("Lengkapi semua kolom password.");
    return;
  }
  if (oldPass !== currentAdminPassword) {
    showToast("Password lama tidak sesuai.");
    return;
  }
  if (newPass.length < 4) {
    showToast("Password baru minimal 4 karakter.");
    return;
  }
  if (newPass !== confirmPass) {
    showToast("Konfirmasi password baru tidak sama.");
    return;
  }
  saveAdminPasswordToStorage(newPass);
  adminOldPasswordInput.value = "";
  adminNewPasswordInput.value = "";
  adminNewPasswordConfirmInput.value = "";
  showToast("Password admin berhasil diganti.");
}

function handleMemberLogin() {
  const id = memberIdLoginInput ? memberIdLoginInput.value.trim() : "";
  if (!id) {
    showToast("ID anggota wajib diisi.");
    return;
  }
  const found = members.find((m) => (m.id || "").trim() === id);
  if (!found) {
    showToast("ID anggota tidak ditemukan di data anggota.");
    return;
  }
  setRole("member", id);
  showToast("Login anggota berhasil.");
}

function renderAnnouncement() {
  if (!announcementDisplayEl) {
    return;
  }
  const text = (announcementText || "").trim();
  if (!text) {
    announcementDisplayEl.textContent = "Tidak ada pesan khusus dari admin.";
  } else {
    announcementDisplayEl.textContent = text;
  }
  if (announcementInput && currentUserRole === "admin") {
    announcementInput.value = announcementText || "";
  }
  if (announcementAdminBox) {
    if (currentUserRole === "admin") {
      announcementAdminBox.style.display = "flex";
    } else {
      announcementAdminBox.style.display = "none";
    }
  }
}

function renderComments() {
  if (!commentsListEl) {
    return;
  }

  commentsListEl.innerHTML = "";

  let visible = comments;
  if (currentUserRole === "member" && currentMemberId) {
    visible = comments.filter((c) => (c.memberId || "").trim() === currentMemberId.trim());
  }

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "comment-item";
    empty.textContent = "Belum ada komentar.";
    commentsListEl.appendChild(empty);
    return;
  }

  visible.forEach((comment) => {
    const item = document.createElement("div");
    item.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";
    const left = document.createElement("span");
    left.textContent = comment.memberName
      ? comment.memberName + (comment.memberId ? " (" + comment.memberId + ")" : "")
      : comment.memberId || "-";
    const right = document.createElement("span");
    right.textContent = comment.createdAt || "";
    meta.appendChild(left);
    meta.appendChild(right);

    const textEl = document.createElement("div");
    textEl.className = "comment-text";
    textEl.textContent = comment.text || "";

    item.appendChild(meta);
    item.appendChild(textEl);

    if (comment.reply) {
      const replyEl = document.createElement("div");
      replyEl.className = "comment-reply";
      const label = document.createElement("span");
      label.className = "comment-reply-label";
      label.textContent = "Balasan admin: ";
      const content = document.createElement("span");
      content.textContent = comment.reply;
      replyEl.appendChild(label);
      replyEl.appendChild(content);
      item.appendChild(replyEl);
    } else if (currentUserRole === "admin") {
      const box = document.createElement("div");
      box.className = "admin-reply-box";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Tulis balasan singkat...";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Balas";
      button.className = "table-btn";
      button.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) {
          showToast("Isi balasan terlebih dahulu.");
          return;
        }
        const found = comments.find((c) => c.id === comment.id);
        if (!found) {
          return;
        }
        found.reply = value;
        saveCommentsToStorage();
        renderComments();
        showToast("Balasan admin tersimpan.");
      });
      box.appendChild(input);
      box.appendChild(button);
      item.appendChild(box);
    }

    if (currentUserRole === "admin") {
      const actions = document.createElement("div");
      actions.className = "comment-actions";
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Hapus";
      deleteBtn.className = "table-btn danger";
      deleteBtn.addEventListener("click", () => {
        const idx = comments.findIndex((c) => c.id === comment.id);
        if (idx === -1) {
          return;
        }
        comments.splice(idx, 1);
        saveCommentsToStorage();
        renderComments();
        showToast("Komentar berhasil dihapus.");
      });
      actions.appendChild(deleteBtn);
      item.appendChild(actions);
    }

    commentsListEl.appendChild(item);
  });
}

function handleMemberCommentSend() {
  if (!memberCommentText) {
    return;
  }
  if (!currentMemberId) {
    showToast("Login sebagai anggota terlebih dahulu.");
    return;
  }
  const text = memberCommentText.value.trim();
  if (!text) {
    showToast("Komentar tidak boleh kosong.");
    return;
  }
  const member = members.find((m) => (m.id || "").trim() === currentMemberId.trim());
  const now = new Date();
  const createdAt = now.toLocaleString("id-ID");
  const comment = {
    id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
    memberId: currentMemberId,
    memberName: member ? member.nama || "" : "",
    text,
    reply: "",
    createdAt,
  };
  comments.push(comment);
  memberCommentText.value = "";
  saveCommentsToStorage();
  renderComments();
  showToast("Komentar berhasil dikirim.");
}

function handleLogout() {
  currentUserRole = null;
  currentMemberId = null;
  if (mainNav) {
    mainNav.style.display = "flex";
    navItems.forEach((btn) => {
      btn.style.display = "";
    });
  }
  headerActionBars.forEach((bar) => {
    bar.style.display = "flex";
  });
  if (pinjamanSidebar) {
    pinjamanSidebar.style.display = "";
  }
  document.body.classList.remove("member-view");
  if (loginOverlay) {
    loginOverlay.style.display = "flex";
  }
  if (adminSettingsCard) {
    adminSettingsCard.style.display = "none";
  }
}

function applyLogoFromStorage() {
  try {
    const dataUrl = localStorage.getItem("perpustakaan_smkn4_logo");
    if (!dataUrl) {
      return;
    }
    if (appLogoImg) {
      appLogoImg.src = dataUrl;
      appLogoImg.style.display = "block";
      const fallback = appLogoImg.parentElement && appLogoImg.parentElement.querySelector(".brand-logo-fallback");
      if (fallback) {
        fallback.style.display = "none";
      }
    }
    if (cardLogoImg) {
      cardLogoImg.src = dataUrl;
      cardLogoImg.style.display = "block";
      const fallbackCard = cardLogoImg.parentElement && cardLogoImg.parentElement.querySelector(".card-logo-fallback");
      if (fallbackCard) {
        fallbackCard.style.display = "none";
      }
    }
  } catch (err) {
    showToast("Logo tidak bisa dimuat dari penyimpanan.");
  }
}

function handleLogoFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const result = e.target && e.target.result;
    if (!result || typeof result !== "string") {
      showToast("Gagal membaca file logo.");
      return;
    }
    try {
      localStorage.setItem("perpustakaan_smkn4_logo", result);
    } catch (err) {
      showToast("Gagal menyimpan logo ke penyimpanan.");
    }
    if (appLogoImg) {
      appLogoImg.src = result;
      appLogoImg.style.display = "block";
      const fallback = appLogoImg.parentElement && appLogoImg.parentElement.querySelector(".brand-logo-fallback");
      if (fallback) {
        fallback.style.display = "none";
      }
    }
    if (cardLogoImg) {
      cardLogoImg.src = result;
      cardLogoImg.style.display = "block";
      const fallbackCard = cardLogoImg.parentElement && cardLogoImg.parentElement.querySelector(".card-logo-fallback");
      if (fallbackCard) {
        fallbackCard.style.display = "none";
      }
    }
    showToast("Logo berhasil diperbarui.");
  };
  reader.readAsDataURL(file);
}

function handleExcelFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      books.length = 0;
      rows.forEach((row) => {
        const normalized = normalizeBookRow(row);
        if (normalized.judul || normalized.kode) {
          books.push(normalized);
        }
      });

      refreshCategoryOptions();
      renderTable();
      saveToStorage();
      showToast("Data buku berhasil dimuat dari Excel.");
    } catch (err) {
      showToast("Gagal membaca file Excel. Pastikan format sesuai template.");
    }
  };
  reader.readAsArrayBuffer(file);
}

function downloadTemplate() {
  const header = [
    ["Kode", "Judul", "Penulis", "Kategori", "Tahun", "Stok"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(header);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Buku");
  XLSX.writeFile(wb, "Template_Buku_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Template Excel berhasil di-download.");
}

function exportExcel() {
  if (!books.length) {
    showToast("Belum ada data untuk diexport.");
    return;
  }

  const rows = books.map((b) => [
    b.kode || "",
    b.judul || "",
    b.penulis || "",
    b.kategori || "",
    b.tahun || "",
    typeof b.stok === "number" ? b.stok : b.stok || "",
  ]);

  const header = ["Kode", "Judul", "Penulis", "Kategori", "Tahun", "Stok"];
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Buku");
  XLSX.writeFile(wb, "Data_Buku_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Data buku berhasil diexport ke Excel.");
}

function handleImportMembersFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      members.length = 0;
      rows.forEach((row) => {
        const id = row["ID"] || row["Id"] || row["id"] || "";
        const nama = row["Nama"] || row["Nama Lengkap"] || row["nama"] || "";
        const kelas = row["Kelas"] || row["kelas"] || "";
        const jurusan = row["Jurusan"] || row["jurusan"] || "";

        if ((id && String(id).trim() !== "") || (nama && String(nama).trim() !== "")) {
          members.push({
            id: String(id || "").trim(),
            nama: String(nama || "").trim(),
            kelas: String(kelas || "").trim(),
            jurusan: String(jurusan || "").trim(),
          });
        }
      });

      renderMembers();
      refreshMemberOptions();
      updateCardPreview(-1);
      saveMembersToStorage();
      showToast("Data anggota berhasil dimuat dari Excel.");
    } catch (err) {
      showToast("Gagal membaca file Excel anggota. Pastikan format sesuai template.");
    }
  };
  reader.readAsArrayBuffer(file);
}

function downloadTemplateMembers() {
  const header = [["ID", "Nama", "Kelas", "Jurusan"]];
  const ws = XLSX.utils.aoa_to_sheet(header);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Anggota");
  XLSX.writeFile(wb, "Template_Anggota_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Template Excel anggota berhasil di-download.");
}

function exportMembersExcel() {
  if (!members.length) {
    showToast("Belum ada data anggota untuk diexport.");
    return;
  }

  const rows = members.map((m) => [
    m.id || "",
    m.nama || "",
    m.kelas || "",
    m.jurusan || "",
  ]);

  const header = ["ID", "Nama", "Kelas", "Jurusan"];
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Anggota");
  XLSX.writeFile(wb, "Data_Anggota_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Data anggota berhasil diexport ke Excel.");
}

function downloadTemplateLoans() {
  const header = [
    ["ID Anggota", "Nama Anggota", "Buku", "Tanggal Pinjam", "Tanggal Kembali", "Status"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(header);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Pinjaman");
  XLSX.writeFile(wb, "Template_Pinjaman_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Template Excel pinjaman berhasil di-download.");
}

function exportLoansExcel() {
  if (!loans.length) {
    showToast("Belum ada data pinjaman untuk diexport.");
    return;
  }

  const rows = loans.map((loan) => [
    loan.anggotaId || "",
    loan.anggotaNama || "",
    loan.buku || "",
    loan.tanggalPinjam || "",
    loan.tanggalKembali || "",
    loan.status || "",
  ]);

  const header = ["ID Anggota", "Nama Anggota", "Buku", "Tanggal Pinjam", "Tanggal Kembali", "Status"];
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Pinjaman");
  XLSX.writeFile(wb, "Data_Pinjaman_Perpustakaan_SMKN4_Manado.xlsx");
  showToast("Data pinjaman berhasil diexport ke Excel.");
}

function refreshMemberOptions() {
  if (!kartuAnggotaSelect && !pinjamanAnggotaSelect) {
    return;
  }

  if (kartuAnggotaSelect) {
    kartuAnggotaSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Pilih salah satu anggota";
    kartuAnggotaSelect.appendChild(opt);
  }

  if (pinjamanAnggotaSelect) {
    pinjamanAnggotaSelect.innerHTML = "";
    const opt2 = document.createElement("option");
    opt2.value = "";
    opt2.textContent = "Pilih anggota";
    pinjamanAnggotaSelect.appendChild(opt2);
  }

  members.forEach((m, index) => {
    if (kartuAnggotaSelect) {
      const o = document.createElement("option");
      o.value = String(index);
      o.textContent = `${m.id || "-"} - ${m.nama}`;
      kartuAnggotaSelect.appendChild(o);
    }
    if (pinjamanAnggotaSelect) {
      const o2 = document.createElement("option");
      o2.value = String(index);
      o2.textContent = `${m.id || "-"} - ${m.nama}`;
      pinjamanAnggotaSelect.appendChild(o2);
    }
  });
}

function renderMembers() {
  if (!membersBody) {
    return;
  }

  membersBody.innerHTML = "";

  if (!members.length) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 7;
    td.textContent = "Belum ada data anggota.";
    tr.appendChild(td);
    membersBody.appendChild(tr);
    return;
  }

  members.forEach((m, index) => {
    const tr = document.createElement("tr");

    const selectTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "row-select-member";
    checkbox.dataset.index = String(index);
    selectTd.appendChild(checkbox);
    tr.appendChild(selectTd);

    const cells = [
      index + 1,
      m.id || "-",
      m.nama || "-",
      m.kelas || "-",
      m.jurusan || "-",
    ];

    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    const actionTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Hapus";
    deleteBtn.className = "table-btn danger";
    deleteBtn.addEventListener("click", () => {
      members.splice(index, 1);
      renderMembers();
      refreshMemberOptions();
      updateCardPreview(-1);
      saveMembersToStorage();
      showToast("Anggota berhasil dihapus.");
    });
    const wrapper = document.createElement("div");
    wrapper.className = "table-actions";
    wrapper.appendChild(deleteBtn);
    actionTd.appendChild(wrapper);
    tr.appendChild(actionTd);

    membersBody.appendChild(tr);
  });
}

function updateCardPreview(index) {
  if (!kartuNamaEl || !kartuIdEl || !kartuKelasEl || !kartuJurusanEl) {
    return;
  }

  if (index < 0 || index >= members.length) {
    kartuNamaEl.textContent = "-";
    kartuIdEl.textContent = "-";
    kartuKelasEl.textContent = "-";
    kartuJurusanEl.textContent = "-";
    if (kartuBarcodeEl) {
      kartuBarcodeEl.innerHTML = "";
    }
    return;
  }

  const member = members[index];
  kartuNamaEl.textContent = member.nama || "-";
  kartuIdEl.textContent = member.id || "-";
  kartuKelasEl.textContent = member.kelas || "-";
  kartuJurusanEl.textContent = member.jurusan || "-";

  if (kartuBarcodeEl) {
    kartuBarcodeEl.innerHTML = "";
    kartuBarcodeEl.classList.remove("kartu-barcode-fallback");
    if (member.id) {
      if (typeof JsBarcode === "function") {
        try {
          JsBarcode("#kartu-barcode", String(member.id), {
            format: "CODE128",
            displayValue: true,
            margin: 4,
            lineColor: "#000000",
            width: 2,
            height: 48,
            fontSize: 12,
            textMargin: 2,
            background: "#ffffff",
          });
        } catch (err) {
          kartuBarcodeEl.textContent = member.id;
          kartuBarcodeEl.classList.add("kartu-barcode-fallback");
        }
      } else {
        kartuBarcodeEl.textContent = member.id;
        kartuBarcodeEl.classList.add("kartu-barcode-fallback");
      }
    }
  }
}

function renderLoans() {
  if (!loansBody) {
    return;
  }

  loansBody.innerHTML = "";

  let data = loans;
  if (currentUserRole === "member" && currentMemberId) {
    data = loans.filter((loan) => (loan.anggotaId || "").trim() === currentMemberId.trim());
  }

  if (!data.length) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 8;
    td.textContent = "Belum ada data pinjaman.";
    tr.appendChild(td);
    loansBody.appendChild(tr);
    return;
  }

  data.forEach((loan, index) => {
    const tr = document.createElement("tr");

    const globalIndex = loans.indexOf(loan);
    if (currentUserRole !== "member") {
      const selectTd = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "row-select-loan";
      if (globalIndex !== -1) {
        checkbox.dataset.index = String(globalIndex);
      }
      selectTd.appendChild(checkbox);
      tr.appendChild(selectTd);
    }

    const cells = [
      index + 1,
      loan.anggotaNama || "-",
      loan.buku || "-",
      loan.tanggalPinjam || "-",
      loan.tanggalKembali || "-",
      loan.status || "Dipinjam",
    ];

    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    if (currentUserRole !== "member") {
      const actionTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Hapus";
      deleteBtn.className = "table-btn danger";
      deleteBtn.addEventListener("click", () => {
        const targetIndex = loans.indexOf(loan);
        if (targetIndex !== -1) {
          loans.splice(targetIndex, 1);
          saveLoansToStorage();
          renderLoans();
          showToast("Data pinjaman berhasil dihapus.");
        }
      });
      const wrapper = document.createElement("div");
      wrapper.className = "table-actions";
      wrapper.appendChild(deleteBtn);
      actionTd.appendChild(wrapper);
      tr.appendChild(actionTd);
    }

    loansBody.appendChild(tr);
  });
}

function handleAddBook() {
  const kodeEl = document.getElementById("kode-buku");
  const judulEl = document.getElementById("judul-buku");
  const penulisEl = document.getElementById("penulis-buku");
  const kategoriEl = document.getElementById("kategori-buku");
  const tahunEl = document.getElementById("tahun-buku");
  const stokEl = document.getElementById("stok-buku");

  const kode = kodeEl.value.trim();
  const judul = judulEl.value.trim();
  const penulis = penulisEl.value.trim();
  const kategori = kategoriEl.value.trim();
  const tahun = tahunEl.value ? Number(tahunEl.value) : "";
  const stok = stokEl.value ? Number(stokEl.value) : 0;

  if (!judul) {
    showToast("Judul buku wajib diisi.");
    return;
  }

  books.push({
    kode,
    judul,
    penulis,
    kategori,
    tahun,
    stok,
  });

  kodeEl.value = "";
  judulEl.value = "";
  penulisEl.value = "";
  kategoriEl.value = "";
  tahunEl.value = "";
  stokEl.value = "";

  refreshCategoryOptions();
  renderTable();
  saveToStorage();
  showToast("Buku berhasil ditambahkan.");
}

function handleAddMember() {
  if (!anggotaNamaInput || !anggotaKelasInput) {
    return;
  }

  const id = anggotaIdInput ? anggotaIdInput.value.trim() : "";
  const nama = anggotaNamaInput.value.trim();
  const kelas = anggotaKelasInput.value.trim();
  const jurusan = anggotaJurusanInput ? anggotaJurusanInput.value.trim() : "";

  if (!nama || !kelas) {
    showToast("Nama dan kelas anggota wajib diisi.");
    return;
  }

  members.push({
    id,
    nama,
    kelas,
    jurusan,
  });

  if (anggotaIdInput) {
    anggotaIdInput.value = "";
  }
  anggotaNamaInput.value = "";
  anggotaKelasInput.value = "";
  if (anggotaJurusanInput) {
    anggotaJurusanInput.value = "";
  }

  renderMembers();
  refreshMemberOptions();
  updateCardPreview(-1);
  saveMembersToStorage();
  showToast("Anggota berhasil ditambahkan.");
}

function handleAddLoan() {
  if (!pinjamanAnggotaSelect || !pinjamanBukuInput) {
    return;
  }

  const selectedIndex = pinjamanAnggotaSelect.value ? Number(pinjamanAnggotaSelect.value) : -1;
  if (selectedIndex < 0 || selectedIndex >= members.length) {
    showToast("Silakan pilih anggota.");
    return;
  }

  const anggota = members[selectedIndex];
  const buku = pinjamanBukuInput.value.trim();
  const tanggalPinjam = pinjamanTanggalPinjamInput && pinjamanTanggalPinjamInput.value ? pinjamanTanggalPinjamInput.value : "";
  const tanggalKembali = pinjamanTanggalKembaliInput && pinjamanTanggalKembaliInput.value ? pinjamanTanggalKembaliInput.value : "";

  if (!buku) {
    showToast("Nama atau kode buku wajib diisi.");
    return;
  }

  const loan = {
    anggotaId: anggota.id || "",
    anggotaNama: anggota.nama || "",
    buku,
    tanggalPinjam,
    tanggalKembali,
    status: "Dipinjam",
  };

  loans.push(loan);

  pinjamanAnggotaSelect.value = "";
  pinjamanBukuInput.value = "";
  if (pinjamanTanggalPinjamInput) {
    pinjamanTanggalPinjamInput.value = "";
  }
  if (pinjamanTanggalKembaliInput) {
    pinjamanTanggalKembaliInput.value = "";
  }

  renderLoans();
  saveLoansToStorage();
  showToast("Data pinjaman berhasil disimpan.");
}

function handleReturnLoan() {
  if (!pengembalianAnggotaIdInput || !pengembalianBukuInput) {
    return;
  }

  const anggotaId = pengembalianAnggotaIdInput.value.trim();
  const bukuText = pengembalianBukuInput.value.trim();
  const tanggalPengembalian = pengembalianTanggalInput && pengembalianTanggalInput.value ? pengembalianTanggalInput.value : "";

  if (!anggotaId || !bukuText) {
    showToast("ID anggota dan buku wajib diisi untuk pengembalian.");
    return;
  }

  const matchIndex = loans.findIndex((loan) => {
    const sameAnggota = (loan.anggotaId || "").trim() === anggotaId;
    const sameBuku = (loan.buku || "").trim().toLowerCase() === bukuText.toLowerCase();
    return sameAnggota && sameBuku && loan.status === "Dipinjam";
  });

  if (matchIndex === -1) {
    showToast("Data pinjaman tidak ditemukan atau sudah dikembalikan.");
    return;
  }

  const loan = loans[matchIndex];
  const effectiveTanggal = tanggalPengembalian || loan.tanggalKembali || new Date().toISOString().slice(0, 10);

  loan.status = "Kembali";
  loan.tanggalKembali = effectiveTanggal;

  const target = bukuText;
  const book = books.find((b) => {
    const kode = (b.kode || "").trim();
    const judul = (b.judul || "").trim();
    return kode === target || judul.toLowerCase() === target.toLowerCase();
  });

  if (book && typeof book.stok === "number") {
    book.stok += 1;
  }

  pengembalianAnggotaIdInput.value = "";
  pengembalianBukuInput.value = "";
  if (pengembalianTanggalInput) {
    pengembalianTanggalInput.value = "";
  }

  renderLoans();
  saveLoansToStorage();
  renderTable();
  saveToStorage();
  showToast("Pengembalian berhasil dicatat.");
}

function handleAddMember() {
  if (!anggotaNamaInput || !anggotaKelasInput) {
    return;
  }

  const id = anggotaIdInput ? anggotaIdInput.value.trim() : "";
  const nama = anggotaNamaInput.value.trim();
  const kelas = anggotaKelasInput.value.trim();
  const jurusan = anggotaJurusanInput ? anggotaJurusanInput.value.trim() : "";

  if (!nama || !kelas) {
    showToast("Nama dan kelas anggota wajib diisi.");
    return;
  }

  members.push({
    id,
    nama,
    kelas,
    jurusan,
  });

  if (anggotaIdInput) {
    anggotaIdInput.value = "";
  }
  anggotaNamaInput.value = "";
  anggotaKelasInput.value = "";
  if (anggotaJurusanInput) {
    anggotaJurusanInput.value = "";
  }

  renderMembers();
  refreshMemberOptions();
  updateCardPreview(-1);
  saveMembersToStorage();
  showToast("Anggota berhasil ditambahkan.");
}

function handleAddLoan() {
  if (!pinjamanAnggotaSelect || !pinjamanBukuInput) {
    return;
  }

  const selectedIndex = pinjamanAnggotaSelect.value ? Number(pinjamanAnggotaSelect.value) : -1;
  if (selectedIndex < 0 || selectedIndex >= members.length) {
    showToast("Silakan pilih anggota.");
    return;
  }

  const anggota = members[selectedIndex];
  const buku = pinjamanBukuInput.value.trim();
  const tanggalPinjam = pinjamanTanggalPinjamInput && pinjamanTanggalPinjamInput.value ? pinjamanTanggalPinjamInput.value : "";
  const tanggalKembali = pinjamanTanggalKembaliInput && pinjamanTanggalKembaliInput.value ? pinjamanTanggalKembaliInput.value : "";

  if (!buku) {
    showToast("Nama atau kode buku wajib diisi.");
    return;
  }

  const loan = {
    anggotaId: anggota.id || "",
    anggotaNama: anggota.nama || "",
    buku,
    tanggalPinjam,
    tanggalKembali,
    status: "Dipinjam",
  };

  loans.push(loan);

  pinjamanAnggotaSelect.value = "";
  pinjamanBukuInput.value = "";
  if (pinjamanTanggalPinjamInput) {
    pinjamanTanggalPinjamInput.value = "";
  }
  if (pinjamanTanggalKembaliInput) {
    pinjamanTanggalKembaliInput.value = "";
  }

  renderLoans();
  saveLoansToStorage();
  showToast("Data pinjaman berhasil disimpan.");
}

function handlePrintCard() {
  if (!kartuNamaEl) {
    return;
  }
  window.print();
}

function renderBulkCards(mode) {
  if (!cardsGridEl) {
    return;
  }
  cardsGridEl.innerHTML = "";
  let selectedIndexes = [];
  if (mode === "all") {
    selectedIndexes = members.map((_, index) => index);
  } else if (mode === "checked") {
    const checkedBoxes = Array.from(document.querySelectorAll(".row-select-member:checked"));
    selectedIndexes = checkedBoxes
      .map((el) => Number(el.dataset.index))
      .filter((n) => !Number.isNaN(n) && n >= 0 && n < members.length);
  }
  if (!selectedIndexes.length) {
    return;
  }
  selectedIndexes.forEach((idx) => {
    const m = members[idx];
    const card = document.createElement("div");
    card.className = "kartu-anggota";
    const header = document.createElement("div");
    header.className = "kartu-header";
    const logo = document.createElement("div");
    logo.className = "kartu-logo";
    const img = document.createElement("img");
    img.alt = "Logo SMK Negeri 4 Manado";
    const fallback = document.createElement("span");
    fallback.className = "card-logo-fallback";
    fallback.textContent = "4";
    logo.appendChild(img);
    logo.appendChild(fallback);
    const title = document.createElement("div");
    title.className = "kartu-title";
    const school = document.createElement("span");
    school.textContent = "SMK Negeri 4 Manado";
    const strongTitle = document.createElement("strong");
    strongTitle.textContent = "Kartu Anggota Perpustakaan";
    title.appendChild(school);
    title.appendChild(strongTitle);
    header.appendChild(logo);
    header.appendChild(title);
    const body = document.createElement("div");
    body.className = "kartu-body";
    const main = document.createElement("div");
    main.className = "kartu-main";
    const fotoWrap = document.createElement("div");
    fotoWrap.className = "kartu-foto-wrapper";
    const fotoKotak = document.createElement("div");
    fotoKotak.className = "kartu-foto-kotak";
    const fotoText = document.createElement("span");
    fotoText.textContent = "Foto";
    fotoKotak.appendChild(fotoText);
    fotoWrap.appendChild(fotoKotak);
    const info = document.createElement("div");
    info.className = "kartu-info";
    const rowNama = document.createElement("div");
    rowNama.className = "kartu-row";
    const labelNama = document.createElement("span");
    labelNama.className = "kartu-label";
    labelNama.textContent = "Nama";
    const sepNama = document.createElement("span");
    sepNama.className = "kartu-separator";
    sepNama.textContent = ":";
    const valNama = document.createElement("strong");
    valNama.className = "kartu-value";
    valNama.textContent = m.nama || "-";
    rowNama.appendChild(labelNama);
    rowNama.appendChild(sepNama);
    rowNama.appendChild(valNama);
    const rowId = document.createElement("div");
    rowId.className = "kartu-row";
    const labelId = document.createElement("span");
    labelId.className = "kartu-label";
    labelId.textContent = "ID";
    const sepId = document.createElement("span");
    sepId.className = "kartu-separator";
    sepId.textContent = ":";
    const valId = document.createElement("strong");
    valId.className = "kartu-value";
    valId.textContent = m.id || "-";
    rowId.appendChild(labelId);
    rowId.appendChild(sepId);
    rowId.appendChild(valId);
    const rowKelas = document.createElement("div");
    rowKelas.className = "kartu-row";
    const labelKelas = document.createElement("span");
    labelKelas.className = "kartu-label";
    labelKelas.textContent = "Kelas";
    const sepKelas = document.createElement("span");
    sepKelas.className = "kartu-separator";
    sepKelas.textContent = ":";
    const valKelas = document.createElement("strong");
    valKelas.className = "kartu-value";
    valKelas.textContent = m.kelas || "-";
    rowKelas.appendChild(labelKelas);
    rowKelas.appendChild(sepKelas);
    rowKelas.appendChild(valKelas);
    const rowJur = document.createElement("div");
    rowJur.className = "kartu-row";
    const labelJur = document.createElement("span");
    labelJur.className = "kartu-label";
    labelJur.textContent = "Jurusan";
    const sepJur = document.createElement("span");
    sepJur.className = "kartu-separator";
    sepJur.textContent = ":";
    const valJur = document.createElement("strong");
    valJur.className = "kartu-value";
    valJur.textContent = m.jurusan || "-";
    rowJur.appendChild(labelJur);
    rowJur.appendChild(sepJur);
    rowJur.appendChild(valJur);
    info.appendChild(rowNama);
    info.appendChild(rowId);
    info.appendChild(rowKelas);
    info.appendChild(rowJur);
    main.appendChild(fotoWrap);
    main.appendChild(info);
    const barcodeWrap = document.createElement("div");
    barcodeWrap.className = "kartu-barcode-wrapper";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    barcodeWrap.appendChild(svg);
    body.appendChild(main);
    body.appendChild(barcodeWrap);
    card.appendChild(header);
    card.appendChild(body);
    if (cardLogoImg && cardLogoImg.src) {
      img.src = cardLogoImg.src;
      img.style.display = "block";
      fallback.style.display = "none";
    }
    if (typeof JsBarcode === "function" && m.id) {
      try {
        JsBarcode(svg, String(m.id), {
          format: "CODE128",
          displayValue: true,
          margin: 4,
          lineColor: "#000000",
          width: 2,
          height: 48,
          fontSize: 12,
          textMargin: 2,
          background: "#ffffff",
        });
      } catch (e) {
        const fallbackText = document.createElement("div");
        fallbackText.className = "kartu-barcode-fallback";
        fallbackText.textContent = m.id;
        barcodeWrap.innerHTML = "";
        barcodeWrap.appendChild(fallbackText);
      }
    }
    cardsGridEl.appendChild(card);
  });
}

function handlePrintAllMembers() {
  if (!members.length) {
    showToast("Belum ada data anggota untuk dicetak.");
    return;
  }
  renderBulkCards("all");
  window.print();
}

function handlePrintSelectedMembers() {
  const anyChecked = document.querySelector(".row-select-member:checked");
  if (!anyChecked) {
    showToast("Pilih anggota di tabel Anggota terlebih dahulu.");
    return;
  }
  renderBulkCards("checked");
  window.print();
}

excelInput.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  handleExcelFile(file);
  excelInput.value = "";
});

downloadTemplateBtn.addEventListener("click", downloadTemplate);
exportExcelBtn.addEventListener("click", exportExcel);
addBookBtn.addEventListener("click", handleAddBook);
searchInput.addEventListener("input", renderTable);
categoryFilter.addEventListener("change", renderTable);
navItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (!target) {
      return;
    }
    if (currentUserRole === "member" && target !== "pinjaman") {
      return;
    }
    setActivePage(target);
  });
});

if (addMemberBtn) {
  addMemberBtn.addEventListener("click", handleAddMember);
}
if (kartuAnggotaSelect) {
  kartuAnggotaSelect.addEventListener("change", () => {
    const value = kartuAnggotaSelect.value;
    const index = value ? Number(value) : -1;
    updateCardPreview(index);
  });
}
if (printCardBtn) {
  printCardBtn.addEventListener("click", handlePrintCard);
}
if (printAllMembersBtn) {
  printAllMembersBtn.addEventListener("click", handlePrintAllMembers);
}
if (printSelectedMembersBtn) {
  printSelectedMembersBtn.addEventListener("click", handlePrintSelectedMembers);
}
if (addLoanBtn) {
  addLoanBtn.addEventListener("click", handleAddLoan);
}
if (returnLoanBtn) {
  returnLoanBtn.addEventListener("click", handleReturnLoan);
}
if (downloadTemplateMembersBtn) {
  downloadTemplateMembersBtn.addEventListener("click", downloadTemplateMembers);
}
if (exportMembersBtn) {
  exportMembersBtn.addEventListener("click", exportMembersExcel);
}
if (importMembersInput) {
  importMembersInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    handleImportMembersFile(file);
    importMembersInput.value = "";
  });
}
if (downloadTemplateLoansBtn) {
  downloadTemplateLoansBtn.addEventListener("click", downloadTemplateLoans);
}
if (exportLoansBtn) {
  exportLoansBtn.addEventListener("click", exportLoansExcel);
}
if (uploadLogoInput) {
  uploadLogoInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    handleLogoFile(file);
    uploadLogoInput.value = "";
  });
}

loginTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-target");
    loginTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    if (target === "admin") {
      if (loginAdminForm) {
        loginAdminForm.classList.add("active");
      }
      if (loginMemberForm) {
        loginMemberForm.classList.remove("active");
      }
    } else if (target === "anggota") {
      if (loginMemberForm) {
        loginMemberForm.classList.add("active");
      }
      if (loginAdminForm) {
        loginAdminForm.classList.remove("active");
      }
    }
  });
});

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", handleAdminLogin);
}
if (adminChangePasswordBtn) {
  adminChangePasswordBtn.addEventListener("click", handleAdminChangePassword);
}
if (memberLoginBtn) {
  memberLoginBtn.addEventListener("click", handleMemberLogin);
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}
if (memberCommentSendBtn) {
  memberCommentSendBtn.addEventListener("click", handleMemberCommentSend);
}
if (announcementSaveBtn) {
  announcementSaveBtn.addEventListener("click", () => {
    if (!announcementInput) {
      return;
    }
    const value = announcementInput.value.trim();
    announcementText = value;
    saveAnnouncementToStorage();
    renderAnnouncement();
    showToast("Pesan admin diperbarui.");
  });
}
if (selectAllBooksCheckbox) {
  selectAllBooksCheckbox.addEventListener("change", () => {
    const checked = selectAllBooksCheckbox.checked;
    document.querySelectorAll(".row-select-book").forEach((el) => {
      el.checked = checked;
    });
  });
}
if (selectAllMembersCheckbox) {
  selectAllMembersCheckbox.addEventListener("change", () => {
    const checked = selectAllMembersCheckbox.checked;
    document.querySelectorAll(".row-select-member").forEach((el) => {
      el.checked = checked;
    });
  });
}
if (selectAllLoansCheckbox) {
  selectAllLoansCheckbox.addEventListener("change", () => {
    const checked = selectAllLoansCheckbox.checked;
    document.querySelectorAll(".row-select-loan").forEach((el) => {
      el.checked = checked;
    });
  });
}
if (deleteSelectedBooksBtn) {
  deleteSelectedBooksBtn.addEventListener("click", () => {
    const checkedBoxes = Array.from(document.querySelectorAll(".row-select-book:checked"));
    if (!checkedBoxes.length) {
      showToast("Pilih buku yang akan dihapus.");
      return;
    }
    const indexes = checkedBoxes
      .map((el) => Number(el.dataset.index))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a);
    indexes.forEach((idx) => {
      if (idx >= 0 && idx < books.length) {
        books.splice(idx, 1);
      }
    });
    saveToStorage();
    refreshCategoryOptions();
    renderTable();
    showToast("Buku terpilih berhasil dihapus.");
  });
}
if (deleteSelectedMembersBtn) {
  deleteSelectedMembersBtn.addEventListener("click", () => {
    const checkedBoxes = Array.from(document.querySelectorAll(".row-select-member:checked"));
    if (!checkedBoxes.length) {
      showToast("Pilih anggota yang akan dihapus.");
      return;
    }
    const indexes = checkedBoxes
      .map((el) => Number(el.dataset.index))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a);
    indexes.forEach((idx) => {
      if (idx >= 0 && idx < members.length) {
        members.splice(idx, 1);
      }
    });
    renderMembers();
    refreshMemberOptions();
    updateCardPreview(-1);
    saveMembersToStorage();
    showToast("Anggota terpilih berhasil dihapus.");
  });
}
if (deleteSelectedLoansBtn) {
  deleteSelectedLoansBtn.addEventListener("click", () => {
    const checkedBoxes = Array.from(document.querySelectorAll(".row-select-loan:checked"));
    if (!checkedBoxes.length) {
      showToast("Pilih pinjaman yang akan dihapus.");
      return;
    }
    const indexes = checkedBoxes
      .map((el) => Number(el.dataset.index))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a);
    indexes.forEach((idx) => {
      if (idx >= 0 && idx < loans.length) {
        loans.splice(idx, 1);
      }
    });
    saveLoansToStorage();
    renderLoans();
    showToast("Pinjaman terpilih berhasil dihapus.");
  });
}

loadAdminPasswordFromStorage();
loadAdminPasswordFromStorage();
loadFromStorage();
loadMembersFromStorage();
loadLoansFromStorage();
loadCommentsFromStorage();
loadAnnouncementFromStorage();
applyLogoFromStorage();
renderTable();
renderMembers();
renderLoans();
updateCardPreview(-1);
