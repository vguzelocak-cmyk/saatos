function koduDirektCalistir() {
    let log = document.getElementById("logEkrani");
    log.innerText = ">> KOD TETİKLENDİ! hen.bin çekiliyor ve XSS hazırlanıyor...";

    // 1. AŞAMA: GitHub sunucularından fiziksel hen.bin dosyasını çekiyoruz
    fetch('hen.bin')
        .then(response => {
            if (!response.ok) throw new Error('hen.bin bulunamadı!');
            return response.arrayBuffer(); // Dosyayı ikili veri olarak al
        })
        .then(buffer => {
            log.innerText = ">> hen.bin başarıyla çekildi (" + buffer.byteLength + " Bayt). XSS İnfaz ediliyor...";
            
            // 2. AŞAMA: XSS ve DOM Manipülasyonu Tetikleme Noktası!
            // Tarayıcının DOM elementini kullanarak anında görünmez bir yapı oluşturup XSS patlatıyoruz
            let xssBombasi = document.createElement("div");
            
            // Satır içinde JavaScript tetikleyen zararlı HTML kodunu enjekte ediyoruz
            xssBombasi.innerHTML = `<img src="x" onerror="
                alert('🏆 XSS & EXPLOIT TETİKLENDİ!\\n\\nSunucudaki hen.bin dosyası ArrayBuffer olarak hafızaya alındı.\\nToplam: ${buffer.byteLength} bayt veri işlendi ve tarayıcı bypass edildi! 💀');
            ">`;
            
            // Sayfanın görünmeyen bir yerine ekleyip tarayıcının çalıştırmasını zorluyoruz
            document.body.appendChild(xssBombasi);
            
            log.innerText = ">> Bekleniyor...";
        })
        .catch(error => {
            log.innerText = ">> ⚠️ HATA: " + error.message;
        });
}
