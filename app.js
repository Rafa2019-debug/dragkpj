function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <div class="file-name">${file.name}</div>
            <div class="extracted-text loader">Memproses OCR... <span class="progress">0%</span></div>
        `;
        resultsContainer.appendChild(resultItem);

        const progressText = resultItem.querySelector('.progress');
        const outputText = resultItem.querySelector('.extracted-text');

        Tesseract.recognize(
            file,
            'eng', 
            { 
                logger: m => {
                    if(m.status === 'recognizing text') {
                        progressText.innerText = Math.floor(m.progress * 100) + '%';
                    }
                } 
            }
        ).then(({ data: { text } }) => {
            // 1. CARA BARU: Cari baris/kumpulan teks yang murni berisi 11 digit angka berturut-turut
            // Menggunakan regex \b\d{11}\b untuk mendeteksi 11 angka pas.
            const matchNumber = text.match(/\b\d{11}\b/);

            if (matchNumber) {
                outputText.classList.remove('loader');
                outputText.innerText = `Hasil (11 Digit): ${matchNumber[0]}`;
            } else {
                // Alternatif fallback jika ada spasi tipis di antara angka:
                // Hapus semua karakter non-angka terlebih dahulu, lalu cari yang 11 digit
                const cleanDigits = text.replace(/[^0-9]/g, '');
                const fallbackMatch = cleanDigits.match(/\d{11}/);
                
                outputText.classList.remove('loader');
                if (fallbackMatch) {
                    outputText.innerText = `Hasil (11 Digit): ${fallbackMatch[0]}`;
                } else {
                    outputText.innerText = "Nomor 11 digit tidak ditemukan. Pastikan gambar jelas.";
                }
            }
        }).catch(err => {
            console.error(err);
            outputText.classList.remove('loader');
            outputText.innerText = "Gagal memproses gambar.";
        });
    });
}        // Buat elemen tampilan untuk file ini
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <div class="file-name">${file.name}</div>
            <div class="extracted-text loader">Memproses OCR... <span class="progress">0%</span></div>
        `;
        resultsContainer.appendChild(resultItem);

        const progressText = resultItem.querySelector('.progress');
        const outputText = resultItem.querySelector('.extracted-text');

        // Jalankan Tesseract.js OCR
        Tesseract.recognize(
            file,
            'eng', // Menggunakan bahasa Inggris/Karakter umum alfanumerik
            { 
                logger: m => {
                    if(m.status === 'recognizing text') {
                        progressText.innerText = Math.floor(m.progress * 100) + '%';
                    }
                } 
            }
        ).then(({ data: { text } }) => {
            // Bersihkan teks: hapus spasi, garis baru, dan karakter aneh
            // Menjaga karakter alfanumerik (huruf & angka) saja
            const cleanedText = text.replace(/[^a-zA-Z0-9]/g, '');
            
            // Ambil 11 karakter/digit pertama
            const elevenDigits = cleanedText.substring(0, 11);

            if (elevenDigits) {
                outputText.classList.remove('loader');
                outputText.innerText = `Hasil (11 Digit): ${elevenDigits}`;
            } else {
                outputText.classList.remove('loader');
                outputText.innerText = "Tidak ditemukan teks/angka.";
            }
        }).catch(err => {
            console.error(err);
            outputText.classList.remove('loader');
            outputText.innerText = "Gagal memproses gambar.";
        });
    });
}
