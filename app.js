const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultsContainer = document.getElementById('results');

// Trigger klik input file saat drop zone diklik
dropZone.addEventListener('click', () => fileInput.click());

// Efek visual saat file diseret di atas drop zone
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});

// Saat file di-drop
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// Saat file dipilih via tombol browser
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

// Memproses daftar file yang diupload
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return; // Hanya proses file gambar

        // Buat elemen tampilan untuk file ini
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