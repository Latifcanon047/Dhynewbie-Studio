<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mini Blog CRUD JSON</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">

  <h1 class="text-3xl font-bold text-teal-400 mb-6">🧩 Mini Blog JSON - CRUD</h1>

  <!-- Form tambah posting -->
  <div class="bg-gray-800 p-6 rounded-xl w-full max-w-md mb-8">
    <h2 class="text-xl font-semibold mb-3 text-teal-300">Tambah / Edit Postingan</h2>

    <input id="judul" type="text" placeholder="Judul"
      class="w-full mb-3 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none" />

    <textarea id="isi" rows="4" placeholder="Isi konten..."
      class="w-full mb-3 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"></textarea>

    <div class="flex gap-2">
      <button onclick="tambahPost()" class="flex-1 bg-teal-600 hover:bg-teal-700 py-2 rounded font-semibold">
        Simpan
      </button>
      <button onclick="resetForm()" class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded font-semibold">
        Reset
      </button>
    </div>

    <p id="status" class="text-sm text-gray-400 mt-3"></p>
  </div>

  <!-- Container untuk daftar post -->
  <div id="postContainer" class="w-full max-w-2xl space-y-4"></div>

  <script>
    const API_URL = "https://jsonplaceholder.typicode.com/posts";
    let editingId = null; // untuk menandai apakah sedang edit

    // --- READ: ambil data dari server
    async function ambilData() {
      const container = document.getElementById("postContainer");
      container.innerHTML = "<p class='text-gray-400 text-center'>⏳ Mengambil data...</p>";

      try {
        const res = await fetch(API_URL);
        const posts = await res.json();
        const dataTampil = posts.slice(0, 5);
        container.innerHTML = dataTampil.map(post => buatCard(post)).join("");
      } catch (err) {
        container.innerHTML = "<p class='text-red-400 text-center'>❌ Gagal mengambil data.</p>";
      }
    }

    // --- CREATE & UPDATE: tambah atau ubah data
    async function tambahPost() {
      const judul = document.getElementById("judul").value.trim();
      const isi = document.getElementById("isi").value.trim();
      const status = document.getElementById("status");

      if (!judul || !isi) {
        status.textContent = "⚠️ Harap isi judul dan isi konten.";
        return;
      }

      const data = { title: judul, body: isi, userId: 1 };
      status.textContent = "⏳ Mengirim data ke server...";

      try {
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (editingId) {
          document.querySelector(`#post-${editingId}`).outerHTML = buatCard(result);
          status.textContent = "✅ Postingan berhasil diperbarui!";
          editingId = null;
        } else {
          document.getElementById("postContainer").insertAdjacentHTML("afterbegin", buatCard(result));
          status.textContent = "✅ Postingan berhasil ditambahkan!";
        }

        resetForm();
      } catch (err) {
        status.textContent = "❌ Gagal menyimpan data.";
      }
    }

    // --- DELETE: hapus postingan
    async function hapusPost(id) {
      const konfirmasi = confirm("Yakin ingin menghapus postingan ini?");
      if (!konfirmasi) return;

      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        document.querySelector(`#post-${id}`).remove();
      } catch (err) {
        alert("Gagal menghapus postingan.");
      }
    }

    // --- EDIT: ambil data dan tampilkan di form
    function editPost(id, title, body) {
      document.getElementById("judul").value = title;
      document.getElementById("isi").value = body;
      document.getElementById("status").textContent = `✏️ Sedang mengedit postingan #${id}`;
      editingId = id;
    }

    // --- Fungsi bantu buat tampilan card
    function buatCard(post) {
      return `
        <div id="post-${post.id}" class="bg-gray-800 p-5 rounded-xl shadow-md hover:bg-gray-700 transition">
          <h2 class="text-xl font-semibold text-teal-300">#${post.id} — ${post.title}</h2>
          <p class="text-gray-300 mt-2">${post.body}</p>
          <div class="flex gap-2 mt-4">
            <button onclick="editPost(${post.id}, '${post.title.replace(/'/g, "\\'")}', '${post.body.replace(/'/g, "\\'")}')" 
              class="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded font-semibold">Edit</button>
            <button onclick="hapusPost(${post.id})" 
              class="bg-red-600 hover:bg-red-700 px-4 py-1 rounded font-semibold">Hapus</button>
          </div>
        </div>
      `;
    }

    // --- Reset form
    function resetForm() {
      document.getElementById("judul").value = "";
      document.getElementById("isi").value = "";
      document.getElementById("status").textContent = "";
      editingId = null;
    }

    // --- Jalankan saat halaman dibuka
    ambilData();
  </script>

</body>
</html>

