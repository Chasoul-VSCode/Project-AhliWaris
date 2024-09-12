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
    let ibu = parseInt(document.getElementById('ibu').value) || 0;
    let bapak = parseInt(document.getElementById('bapak').value) || 0;
    let saudara = parseInt(document.getElementById('saudara').value) || 0;
    let saudari = parseInt(document.getElementById('saudari').value) || 0;

    let bagianIstri = 0, bagianAnakLaki = 0, bagianAnakPerempuan = 0, bagianIbu = 0, bagianBapak = 0, bagianSaudara = 0, bagianSaudari = 0;

    // Pembagian bagian istri
    if (istri > 0) {
        if (anakLaki > 0 || anakPerempuan > 0) {
            bagianIstri = totalAset * 0.125; // 1/8 jika ada anak
        } else {
            bagianIstri = totalAset * 0.25; // 1/4 jika tidak ada anak
        }
        totalAset -= bagianIstri;
    }

    // Pembagian untuk Ibu dan Bapak
if (ibu === 1) {
    if (anakLaki > 0 || anakPerempuan > 0) {
        bagianIbu = totalAset * 0.1667; // 1/6 jika ada anak
    } else {
        bagianIbu = totalAset * 0.3333; // 1/3 jika tidak ada anak
    }
    // Membatasi bagianIbu menjadi 2 desimal
    bagianIbu = parseFloat(bagianIbu.toFixed(2));
    totalAset -= bagianIbu;
}

if (bapak === 1) {
    // Jika ada sisa aset setelah membagikan kepada ibu dan anak-anak, kakek mendapat sisa total aset
    if (totalAset > 0) {
        bagianBapak = parseFloat(totalAset.toFixed(2)); // Kakek mendapatkan sisa dari total aset
        totalAset = 0; // Set totalAset to 0 after Bapak
    }
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

        // Bagian anak perempuan (mendapatkan 1 kali bagian per anak perempuan), bulatkan hasil
        bagianAnakPerempuan = Math.round(bagianPerBagian * anakPerempuan);

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
        bagianSaudari = parseFloat((bagianPerSaudara * saudari).toFixed(2));

        // Kurangi total aset dengan bagian saudara dan saudari
        totalAset -= (bagianSaudara + bagianSaudari);
    } else {
        // Jika tidak ada total aset tersisa, bagian saudara dan saudari adalah 0
        bagianSaudara = 0;
        bagianSaudari = 0;
    }
}


    // Menampilkan hasil
    let hasil = '';
    if (istri > 0) hasil += `Bagian Istri: ${formatRupiah(bagianIstri)}<br>`;
    if (anakLaki > 0) hasil += `Bagian Anak Laki-laki: ${formatRupiah(bagianAnakLaki)}<br>`;
    if (anakPerempuan > 0) hasil += `Bagian Anak Perempuan: ${formatRupiah(bagianAnakPerempuan)}<br>`;
    if (ibu > 0) hasil += `Bagian Ibu: ${formatRupiah(bagianIbu)}<br>`;
    if (bapak > 0) hasil += `Bagian Bapak: ${formatRupiah(bagianBapak)}<br>`;
    if (saudara > 0) hasil += `Bagian Saudara: ${formatRupiah(bagianSaudara)}<br>`;
    if (saudari > 0) hasil += `Bagian Saudari: ${formatRupiah(bagianSaudari)}<br>`;

   

    if (hasil === '') {
        Swal.fire({
            icon: 'info',
            title: 'Tidak ada bagian yang dihitung',
            text: 'Pastikan Anda memasukkan jumlah yang valid.'
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Hasil Pembagian Waris',
            html: hasil
        });
    }
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
