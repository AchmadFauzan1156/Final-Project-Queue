let kapasitas = 4;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-pasien');
    const listContainer = document.getElementById('antrianList');
    const cekRuangBtn = document.getElementById('cekRuangBtn');
    const cariPasienBtn = document.getElementById('cariPasienBtn');
    const pasienTerlamaBtn = document.getElementById('pasienTerlamaBtn');
    const estimasiWaktuBtn = document.getElementById('estimasiWaktuBtn');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            tambahPasien();
        });
    }

    if (listContainer) {
        lihatAntrian();
    }

    // Event listeners for popup buttons
    cekRuangBtn.addEventListener('click', function() {
        showPopup('cekRuang');
    });
    cariPasienBtn.addEventListener('click', function() {
        showPopup('cariPasien');
    });
    pasienTerlamaBtn.addEventListener('click', function() {
        showPopup('pasienTerlama');
    });
    estimasiWaktuBtn.addEventListener('click', function() {
        showPopup('estimasiWaktu');
    });
});

function getAntrian() {
    return JSON.parse(localStorage.getItem('antrian')) || [];
}

function saveAntrian(data) {
    localStorage.setItem('antrian', JSON.stringify(data));
}

function tambahPasien() {
    let nama = document.getElementById('nama').value.trim();
    let idPasien = document.getElementById('idPasien').value.trim();
    let antrian = getAntrian();

    if (nama && idPasien) {
        if (antrian.length < kapasitas) {
            let pasien = {
                nama: nama,
                id: idPasien,
                waktuMasuk: new Date().toLocaleString()
            };
            antrian.push(pasien);
            saveAntrian(antrian);
            alert(`Pasien ${nama} berhasil masuk antrian.`);
            document.getElementById('form-pasien').reset();
            lihatAntrian(); // Update the list after adding patient
        } else {
            alert("Antrian sudah penuh!");
        }
    } else {
        alert("Harap lengkapi nama dan ID.");
    }
}

function lihatAntrian() {
    const listContainer = document.getElementById('antrianList');
    if (!listContainer) return;

    let antrian = getAntrian();
    listContainer.innerHTML = "";

    if (antrian.length === 0) {
        listContainer.innerHTML = "<li>Antrian kosong.</li>";
        return;
    }

    antrian.forEach((pasien, index) => {
        let li = document.createElement('li');
        li.textContent = `#${index + 1}: ${pasien.nama} (ID: ${pasien.id}) - Masuk: ${pasien.waktuMasuk}`;
        listContainer.appendChild(li);
    });
}

function keluarPasien() {
    let antrian = getAntrian();
    if (antrian.length > 0) {
        let keluar = antrian.shift();
        saveAntrian(antrian);
        alert(`Pasien ${keluar.nama} keluar dari antrian.`);
        lihatAntrian();
    } else {
        alert("Antrian kosong.");
    }
}

function clearAntrian() {
    localStorage.removeItem('antrian');
    alert("Semua pasien telah dikeluarkan.");
    lihatAntrian();
}

function showPopup(type) {
    const popup = document.getElementById('popup');
    const title = document.getElementById('popup-title');
    const message = document.getElementById('popup-message');
    let antrian = getAntrian();
    
    // Set title and message based on the action clicked
    if (type === 'cekRuang') {
        title.textContent = 'Cek Ruang Tersedia';
        message.textContent = `Ruang yang tersedia saat ini: ${kapasitas - antrian.length}`;
    } else if (type === 'cariPasien') {
        title.textContent = 'Cari Pasien Berdasarkan ID';
        message.innerHTML = `
            <label for="searchId">Masukkan ID Pasien:</label>
            <input type="text" id="searchId" placeholder="ID Pasien" />
            <button onclick="cariPasien()">Cari</button>
            <div id="cariHasil"></div>
        `;
    } else if (type === 'pasienTerlama') {
        title.textContent = 'Pasien Terlama dalam Antrian';
        if (antrian.length > 0) {
            const pasienTerlama = antrian[0]; // Pasien pertama masuk adalah yang terlama
            message.innerHTML = `<p>Pasien pertama yang masuk: ${pasienTerlama.nama} (ID: ${pasienTerlama.id}), Masuk: ${pasienTerlama.waktuMasuk}</p>`;
        } else {
            message.innerHTML = `<p>Belum ada pasien dalam antrian.</p>`;
        }
    } else if (type === 'estimasiWaktu') {
        title.textContent = 'Estimasi Waktu Tunggu Pasien';
        const waktuTunggu = antrian.length * 10; // 10 menit per pasien
        message.innerHTML = `<p>Estimasi waktu tunggu: ${waktuTunggu} menit</p>`;
    }

    // Show the popup
    popup.style.display = 'flex';
}

// Close the popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Cari pasien berdasarkan ID
function cariPasien() {
    const searchId = document.getElementById('searchId').value.trim();
    const hasilDiv = document.getElementById('cariHasil');
    
    if (!searchId) {
        hasilDiv.textContent = "Harap masukkan ID pasien untuk pencarian.";
        return;
    }

    let antrian = getAntrian();
    let pasien = antrian.find(p => p.id === searchId);

    if (pasien) {
        hasilDiv.innerHTML = `
            <p>Pasien ditemukan: ${pasien.nama}, ID: ${pasien.id}, Waktu Masuk: ${pasien.waktuMasuk}</p>
        `;
    } else {
        hasilDiv.textContent = "Pasien dengan ID tersebut tidak ditemukan.";
    }
}
