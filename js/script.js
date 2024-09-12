// Handle input event to allow large numbers 
function handleInput(input) {
    // Remove any formatting
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Format currency when input loses focus
function formatCurrency(input) {
    // Remove non-numeric characters except comma and dot
    let value = input.value.replace(/[^0-9]/g, '');

    // Convert to a number
    let number = parseFloat(value);

    // Format as currency if it's a valid number
    if (!isNaN(number)) {
        input.value = formatRupiah(number);
    } else {
        input.value = '';
    }
}

// Convert number to Rupiah format
function formatRupiah(angka) {
    if (isNaN(angka)) return '';

    let reverse = angka.toString().split('').reverse().join('');
    let ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return `Rp ${ribuan}`;
}

function unformatCurrency(value) {
    // Remove the 'Rp. ' formatting and convert to number
    return parseFloat(value.replace(/[^0-9]/g, ''));
}

document.getElementById('warisForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Unformat and convert to number for calculations
    let totalAset = unformatCurrency(document.getElementById('totalAset').value);
    let istri = parseInt(document.getElementById('istri').value) || 0;
    let anakLaki = parseInt(document.getElementById('anakLaki').value) || 0;
    let anakPerempuan = parseInt(document.getElementById('anakPerempuan').value) || 0;
    let nenek = parseInt(document.getElementById('nenek').value) || 0;
    let kakek = parseInt(document.getElementById('kakek').value) || 0;
    let saudara = parseInt(document.getElementById('saudara').value) || 0;
    let saudari = parseInt(document.getElementById('saudari').value) || 0;

    let bagianIstri = 0, bagianAnakLaki = 0, bagianAnakPerempuan = 0, bagianNenek = 0, bagianKakek = 0, bagianSaudara = 0, bagianSaudari = 0;
    let persenIstri = 0, persenAnakLaki = 0, persenAnakPerempuan = 0, persenNenek = 0, persenKakek = 0, persenSaudara = 0, persenSaudari = 0;

    // Pembagian bagian istri
    if (istri > 0) {
        if (anakLaki > 0 || anakPerempuan > 0) {
            bagianIstri = totalAset * 0.125; // 1/8 jika ada anak
            persenIstri = 12.5;
        } else {
            bagianIstri = totalAset * 0.25; // 1/4 jika tidak ada anak
            persenIstri = 25;
        }
        totalAset -= bagianIstri;
    }

    // Pembagian untuk Nenek dan Kakek
    if (kakek > 0) {
        if (anakLaki === 0 && anakPerempuan === 0) {
            bagianKakek = parseFloat((totalAset * 0.1667).toFixed(2)); // 1/6 jika tidak ada anak
            persenKakek = 16.67;
        } else {
            bagianKakek = 0; // Kakek tidak mendapatkan bagian jika ada anak
            persenKakek = 0;
        }
        totalAset -= bagianKakek;
    }

// Bagian Nenek
if (nenek > 0) {
    if (anakLaki === 0 && anakPerempuan === 0) {
        bagianNenek = parseFloat((totalAset * 0.1667).toFixed(2)); // 1/6 jika tidak ada anak
        persenNenek = 16.67;
    } else {
        bagianNenek = 0; // Jika ada anak, nenek tidak mendapatkan bagian
        persenNenek = 0;
    }
    totalAset -= bagianNenek;
}

    // Pembagian anak laki-laki dan perempuan
    if (anakLaki > 0 || anakPerempuan > 0) {
        // Total bagian yang diperhitungkan, anak laki-laki mendapatkan 2 bagian, anak perempuan 1 bagian
        let totalBagianAnak = (anakLaki * 2) + anakPerempuan;

        // Jika total bagian valid
        if (totalBagianAnak > 0) {
            // Bagian untuk satu bagian (dasar perhitungan)
            let bagianPerBagian = totalAset / totalBagianAnak;

            // Bagian anak laki-laki (mendapatkan 2 kali bagian per anak laki-laki), bulatkan hasil
            bagianAnakLaki = Math.round(bagianPerBagian * 2 * anakLaki);
            persenAnakLaki = (bagianAnakLaki / (totalAset + bagianAnakLaki)) * 100;

            // Bagian anak perempuan (mendapatkan 1 kali bagian per anak perempuan), bulatkan hasil
            bagianAnakPerempuan = Math.round(bagianPerBagian * anakPerempuan);
            persenAnakPerempuan = (bagianAnakPerempuan / (totalAset + bagianAnakPerempuan)) * 100;

            // Kurangi total aset dengan bagian anak-anak
            totalAset -= (bagianAnakLaki + bagianAnakPerempuan);
        }
    }

    // Pembagian Saudara dan Saudari jika ada
    if (saudara > 0 || saudari > 0) {
        let totalSaudara = saudara + saudari;
    
        // Pastikan total aset yang tersisa cukup untuk dibagikan
        if (totalAset > 0 && totalSaudara > 0) {
            let bagianPerSaudara = totalAset / totalSaudara;
    
            // Hitung bagian untuk saudara dan saudari
            bagianSaudara = parseFloat((bagianPerSaudara * saudara).toFixed(2));
            persenSaudara = parseFloat(((bagianSaudara / totalAset) * 100).toFixed(2));
    
            bagianSaudari = parseFloat((bagianPerSaudara * saudari).toFixed(2));
            persenSaudari = parseFloat(((bagianSaudari / totalAset) * 100).toFixed(2));
    
            // Kurangi total aset dengan bagian saudara dan saudari
            totalAset -= (bagianSaudara + bagianSaudari);
        } else {
            // Jika tidak ada total aset tersisa, bagian saudara dan saudari adalah 0
            bagianSaudara = 0;
            bagianSaudari = 0;
            persenSaudara = 0;
            persenSaudari = 0;
        }
    }
    

    // Menampilkan hasil
    let hasil = '';
    if (istri > 0) hasil += `Bagian Istri: ${formatRupiah(bagianIstri)}<br>`;
    if (anakLaki > 0) hasil += `Bagian Anak Laki-laki: ${formatRupiah(bagianAnakLaki)}<br>`;
    if (anakPerempuan > 0) hasil += `Bagian Anak Perempuan: ${formatRupiah(bagianAnakPerempuan)}<br>`;
    if (nenek > 0) hasil += `Bagian Nenek: ${formatRupiah(bagianNenek)}<br>`;
    if (kakek > 0) hasil += `Bagian Kakek: ${formatRupiah(bagianKakek)}<br>`;
    if (saudara > 0) hasil += `Bagian Saudara: ${formatRupiah(bagianSaudara)}<br>`;
    if (saudari > 0) hasil += `Bagian Saudari: ${formatRupiah(bagianSaudari)}<br>`;

    // Detailed explanation
    let detailExplanation = `
        <strong>Detail Pembagian Waris:</strong><br>
        <b>Istri:</b> ${istri > 0 ? formatRupiah(bagianIstri) + ' (' + persenIstri + '%)' : 'Tidak ada'}<br>
        <b>Anak Laki-laki:</b> ${anakLaki > 0 ? formatRupiah(bagianAnakLaki) + ' (' + persenAnakLaki.toFixed(2) + '%)' : 'Tidak ada'}<br>
        <b>Anak Perempuan:</b> ${anakPerempuan > 0 ? formatRupiah(bagianAnakPerempuan) + ' (' + persenAnakPerempuan.toFixed(2) + '%)' : 'Tidak ada'}<br>
        <b>Nenek:</b> ${nenek > 0 ? formatRupiah(bagianNenek) + ' (' + persenNenek + '%)' : 'Tidak ada'}<br>
        <b>Kakek:</b> ${kakek > 0 ? formatRupiah(bagianKakek) + ' (' + persenKakek + '%)' : 'Tidak ada'}<br>
        <b>Saudara:</b> ${saudara > 0 ? formatRupiah(bagianSaudara) + ' (' + persenSaudara.toFixed(2) + '%)' : 'Tidak ada'}<br>
        <b>Saudari:</b> ${saudari > 0 ? formatRupiah(bagianSaudari) + ' (' + persenSaudari.toFixed(2) + '%)' : 'Tidak ada'}<br>
    `;

    Swal.fire({
        title: 'Hasil Pembagian Waris',
        html: hasil,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Detail'
    }).then((result) => {
        if (result.isDismissed) { // 'Detail' button clicked
            Swal.fire({
                title: 'Detail Pembagian Waris',
                html: detailExplanation,
                confirmButtonText: 'OK'
            });
        }
    });
});

// Display an alert when the page loads
document.addEventListener('DOMContentLoaded', function() {
    Swal.fire({
        icon: 'info',
        title: 'Website dalam Pengembangan',
        text: 'Laporkan Bug di Instagram @chasoul.uix',
        confirmButtonText: 'OK'
    });
});
