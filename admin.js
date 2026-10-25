// ===== ADMIN PAGE (login + add / edit / delete news) =====
// This page uses the full Firebase library (the public pages don't need it).
// Who may write is decided by the Firestore security rules in the Firebase
// console, not by this file: even if someone edits this code in their browser,
// the database refuses any write that doesn't come from Kakha's login.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
    getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    getFirestore, collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(window.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);
const newsRef = collection(db, "news");

const $ = (id) => document.getElementById(id);

// The list of posts and a single post are read through Firestore's public REST address
// (the same way the public pages do it). That lets the list ask for just the title, date
// and thumbnail, instead of downloading every full-size photo.
const DB_URL = "https://firestore.googleapis.com/v1/projects/" + window.FIREBASE_CONFIG.projectId + "/databases/(default)/documents";
const KEY = "?key=" + encodeURIComponent(window.FIREBASE_CONFIG.apiKey);

function fieldValue(f) {
    if (!f) return "";
    if (f.stringValue !== undefined) return f.stringValue;
    if (f.timestampValue !== undefined) return f.timestampValue;
    return "";
}

function parseDoc(d) {
    const f = d.fields || {};
    return {
        id: d.name.split("/").pop(),
        title: fieldValue(f.title),
        text: fieldValue(f.text),
        image: fieldValue(f.image),
        thumb: fieldValue(f.thumb),
        date: fieldValue(f.date)
    };
}

// ----- small helpers -----
function setStatus(el, type, text) {
    el.textContent = text || "";
    el.className = "admin-status" + (type ? " " + type : "");
}

const MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];

function formatDate(date) {
    const t = new Date(date.getTime() + 4 * 60 * 60 * 1000); // Tbilisi time (UTC+4)
    return t.getUTCDate() + " " + MONTHS[t.getUTCMonth()] + ", " + t.getUTCFullYear();
}

function authMessage(err) {
    switch (err && err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-email":
            return "ელფოსტა ან პაროლი არასწორია.";
        case "auth/too-many-requests":
            return "ძალიან ბევრი მცდელობა. სცადეთ რამდენიმე წუთში.";
        case "auth/network-request-failed":
            return "ინტერნეტთან კავშირი ვერ მოხერხდა.";
        default:
            return "შეცდომა. სცადეთ ხელახლა.";
    }
}

function dbMessage(err) {
    if (err && err.code === "permission-denied") {
        return "ამ მოქმედების უფლება არ გაქვთ. შედით სწორი ანგარიშით.";
    }
    if (err && err.code === "unavailable") {
        return "ინტერნეტთან კავშირი ვერ მოხერხდა.";
    }
    return "შეცდომა. სცადეთ ხელახლა.";
}

// ----- login / logout -----
$("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("loginBtn");
    btn.disabled = true;
    setStatus($("loginStatus"), "", "");
    try {
        await signInWithEmailAndPassword(auth, $("loginEmail").value.trim(), $("loginPassword").value);
        $("loginPassword").value = "";
    } catch (err) {
        setStatus($("loginStatus"), "error", authMessage(err));
    } finally {
        btn.disabled = false;
    }
});

$("resetBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    if (!email) {
        setStatus($("loginStatus"), "error", "ჯერ ჩაწერეთ ელფოსტა ზემოთ.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (err) {
        // Say the same thing either way, so this can't be used to find out which emails exist
    }
    setStatus($("loginStatus"), "success", "თუ ეს ელფოსტა რეგისტრირებულია, პაროლის აღდგენის ბმული გაიგზავნა.");
});

$("logoutBtn").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
    $("loginBox").hidden = Boolean(user);
    $("panel").hidden = !user;
    if (user) {
        $("userEmail").textContent = user.email;
        resetForm();
        loadList();
    } else {
        $("postList").textContent = "";
    }
});

// ----- photo: shrink it in the browser so it fits inside the database -----
// A phone photo can be 5 MB; the database holds up to 1 MB per post. So each photo is
// saved twice, both resized and compressed in the browser:
//   image = the full photo for the post's own page (up to 1000px on its longest side)
//   thumb = a small copy for the cards on the home and news pages (up to 640px)
const IMAGE_SIDES = [1000, 800, 600, 450];
const IMAGE_MAX_CHARS = 450000;
const THUMB_SIDES = [640, 480];
const THUMB_MAX_CHARS = 90000;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("not-an-image"));
        img.src = src;
    });
}

// Tries bigger sizes and better quality first; returns the first result that is small enough
function makeJpeg(img, sides, qualities, maxChars) {
    for (const side of sides) {
        const scale = Math.min(1, side / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; // PNGs with transparency would otherwise turn black
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        for (const quality of qualities) {
            const data = canvas.toDataURL("image/jpeg", quality);
            if (data.length <= maxChars) return data;
        }
    }
    throw new Error("too-big");
}

function makeThumb(img) {
    return makeJpeg(img, THUMB_SIDES, [0.72, 0.6, 0.5], THUMB_MAX_CHARS);
}

async function shrinkImage(file) {
    const url = URL.createObjectURL(file);
    try {
        const img = await loadImage(url);
        return {
            image: makeJpeg(img, IMAGE_SIDES, [0.8, 0.7, 0.55], IMAGE_MAX_CHARS),
            thumb: makeThumb(img)
        };
    } finally {
        URL.revokeObjectURL(url);
    }
}

let currentImage = ""; // the full photo that will be saved with the post ("" = no photo)
let currentThumb = ""; // its small copy for the cards

function showPhoto() {
    $("photoPreview").hidden = !currentImage;
    $("photoImg").src = currentImage || "";
}

$("postPhoto").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus($("postStatus"), "", "ფოტო მუშავდება…");
    try {
        const result = await shrinkImage(file);
        currentImage = result.image;
        currentThumb = result.thumb;
        setStatus($("postStatus"), "", "");
    } catch (err) {
        setStatus($("postStatus"), "error", err.message === "too-big"
            ? "ფოტო ძალიან დიდია. სცადეთ სხვა ფოტო."
            : "ფაილი ვერ წაიკითხა. აირჩიეთ ფოტო (JPG ან PNG).");
    }
    e.target.value = "";
    showPhoto();
});

$("photoRemove").addEventListener("click", () => {
    currentImage = "";
    currentThumb = "";
    showPhoto();
});

// ----- add / edit form -----
let editingId = null;

function resetForm() {
    editingId = null;
    $("postForm").reset();
    currentImage = "";
    currentThumb = "";
    showPhoto();
    $("formTitle").textContent = "ახალი სიახლე";
    $("saveBtn").textContent = "გამოქვეყნება";
    $("cancelBtn").hidden = true;
}

$("cancelBtn").addEventListener("click", () => {
    resetForm();
    setStatus($("postStatus"), "", "");
});

$("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = $("postTitle").value.trim();
    const text = $("postText").value.trim();
    if (!title || !text) {
        setStatus($("postStatus"), "error", "შეავსეთ სათაური და ტექსტი.");
        return;
    }

    const btn = $("saveBtn");
    btn.disabled = true;
    setStatus($("postStatus"), "", "ინახება…");
    try {
        // A post saved before thumbnails existed has a photo but no thumb: make one now
        if (currentImage && !currentThumb) {
            currentThumb = makeThumb(await loadImage(currentImage));
        }
        const photos = { image: currentImage, thumb: currentThumb };
        if (editingId) {
            await updateDoc(doc(db, "news", editingId), { title, text, ...photos });
        } else {
            await addDoc(newsRef, { title, text, ...photos, date: Timestamp.now() });
        }
        const wasEditing = Boolean(editingId);
        resetForm();
        setStatus($("postStatus"), "success", wasEditing ? "ცვლილებები შენახულია ✓" : "სიახლე გამოქვეყნდა ✓");
        await loadList();
    } catch (err) {
        setStatus($("postStatus"), "error", err && err.code ? dbMessage(err) : "ფოტოს დამუშავება ვერ მოხერხდა. სცადეთ სხვა ფოტო.");
    } finally {
        btn.disabled = false;
    }
});

// ----- list of existing posts -----
let loadedPosts = [];

async function loadList() {
    setStatus($("listStatus"), "", "იტვირთება…");
    try {
        const response = await fetch(DB_URL + ":runQuery" + KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                structuredQuery: {
                    select: { fields: ["title", "thumb", "date"].map((name) => ({ fieldPath: name })) },
                    from: [{ collectionId: "news" }],
                    orderBy: [{ field: { fieldPath: "date" }, direction: "DESCENDING" }],
                    limit: 100
                }
            })
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const rows = await response.json();
        loadedPosts = rows.filter((row) => row.document).map((row) => parseDoc(row.document));
        renderList();
        setStatus($("listStatus"), "", loadedPosts.length ? "" : "სიახლეები ჯერ არ არის.");
    } catch (err) {
        setStatus($("listStatus"), "error", "სიახლეების ჩატვირთვა ვერ მოხერხდა.");
    }
}

function renderList() {
    const list = $("postList");
    list.textContent = "";
    loadedPosts.forEach((post) => {
        const item = document.createElement("div");
        item.className = "admin-item";

        if (post.thumb && post.thumb.indexOf("data:image/") === 0) {
            const img = document.createElement("img");
            img.src = post.thumb;
            img.alt = "";
            item.appendChild(img);
        }

        const main = document.createElement("div");
        main.className = "admin-item-main";

        const title = document.createElement("div");
        title.className = "admin-item-title";
        title.textContent = post.title;
        main.appendChild(title);

        if (post.date && !isNaN(new Date(post.date))) {
            const date = document.createElement("div");
            date.className = "admin-item-date";
            date.textContent = formatDate(new Date(post.date));
            main.appendChild(date);
        }

        const buttons = document.createElement("div");
        buttons.className = "admin-item-buttons";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "link-btn";
        edit.textContent = "რედაქტირება";
        edit.addEventListener("click", () => startEdit(post));

        const del = document.createElement("button");
        del.type = "button";
        del.className = "link-btn danger";
        del.textContent = "წაშლა";
        del.addEventListener("click", () => removePost(post));

        buttons.append(edit, del);
        main.appendChild(buttons);
        item.appendChild(main);
        list.appendChild(item);
    });
}

async function startEdit(listed) {
    setStatus($("postStatus"), "", "იტვირთება…");
    let post;
    try {
        // The list only holds titles and thumbnails; fetch the whole post (text + full photo)
        const response = await fetch(DB_URL + "/news/" + encodeURIComponent(listed.id) + KEY);
        if (!response.ok) throw new Error("HTTP " + response.status);
        post = parseDoc(await response.json());
    } catch (err) {
        setStatus($("postStatus"), "error", "სიახლის ჩატვირთვა ვერ მოხერხდა.");
        return;
    }
    editingId = post.id;
    $("postTitle").value = post.title;
    $("postText").value = post.text;
    currentImage = post.image;
    currentThumb = post.thumb;
    showPhoto();
    $("formTitle").textContent = "სიახლის რედაქტირება";
    $("saveBtn").textContent = "ცვლილებების შენახვა";
    $("cancelBtn").hidden = false;
    setStatus($("postStatus"), "", "");
    $("formTitle").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removePost(post) {
    if (!window.confirm("წავშალოთ სიახლე „" + post.title + "“? ამის გაუქმება შეუძლებელია.")) return;
    try {
        await deleteDoc(doc(db, "news", post.id));
        if (editingId === post.id) resetForm();
        await loadList();
        setStatus($("listStatus"), "success", "სიახლე წაიშალა ✓");
    } catch (err) {
        setStatus($("listStatus"), "error", dbMessage(err));
    }
}

// ----- backup: download every post as a file -----
$("exportBtn").addEventListener("click", async () => {
    setStatus($("listStatus"), "", "ასლი მზადდება…");
    try {
        const snap = await getDocs(query(newsRef, orderBy("date", "desc")));
        const data = snap.docs.map((d) => {
            const p = d.data();
            return {
                title: p.title,
                text: p.text,
                date: p.date && p.date.toDate ? p.date.toDate().toISOString() : null,
                image: p.image || ""
            };
        });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "hcdgroup-news-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
        setStatus($("listStatus"), "success", "ასლი გადმოიწერა ✓ (" + data.length + ")");
    } catch (err) {
        setStatus($("listStatus"), "error", dbMessage(err));
    }
});
