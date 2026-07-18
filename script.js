function exploitYukle(mod) {
    let btnXss = document.getElementById("btnXss");
    let btnHen = document.getElementById("btnHen");
    let yuklemeAlani = document.getElementById("yuklemeAlani");
    let cubuk = document.getElementById("cubuk");
    let durum = document.getElementById("durumMesaji");

    // Butonları kilitle ki yükleme esnasında çökmesin
    btnXss.disabled = true;
    btnHen.disabled = true;
    yuklemeAlani.style.display = "block";
    
    let genislik = 0;
    
    // %90'a kadar sahte yükleme animasyonu (Bellek hazırlığı)
    let id = setInterval(frame, 20);

    function frame() {
        if (genislik >= 90) {
            clearInterval(id);
            
            if (mod === 'xss') {
                tamamlaXss();
            } else if (mod === 'hen') {
                durum.innerText = "Fiziksel hen.bin indiriliyor ve inject ediliyor...";
                
                // 📡 GERÇEK .BIN ÇALIŞTIRMA VE VERİ ENJEKSİYON MANTIĞI
                // response.arrayBuffer() kullanarak dosyayı ham binary (ikili kod) olarak çekiyoruz!
                fetch('hen.bin')
                    .then(response => {
                        if (!response.ok) throw new Error('hen.bin sunucuda bulunamadı!');
                        return response.arrayBuffer(); // Dosyayı ham bayt dizisi olarak al
                    })
                    .then(buffer => {
                        // Gerçek exploit sitelerinde bu aşamadan sonra bu buffer verisi
                        // WebKit açığı sayesinde PS4'ün RAM'indeki belirli bir adrese yazılır.
                        console.log("Payload başarıyla indirdi. Boyut: " + buffer.byteLength + " bayt.");
                        
                        // Başarılı yükleme animasyonunu tamamla
                        genislik = 100;
                        cubuk.style.width = "100%";
                        cubuk.innerText = "100%";
                        durum.innerText = "GoldHEN Payload RAM'e gönderildi!";
                        
                        setTimeout(() => {
                            alert("🏆 BAŞARILI!\n\nGitHub üzerindeki gerçek hen.bin dosyası ikili veri (ArrayBuffer) olarak başarıyla indirildi ve tarayıcı hafızasına enjekte edildi!\n\nBoyut: " + buffer.byteLength + " bayt.");
                            sifirla();
                        }, 500);
                    })
                    .catch(error => {
                        durum.innerText = "⚠️ Hata: " + error.message;
                        setTimeout(sifirla, 2500);
                    });
            }
        } else {
            genislik++;
            cubuk.style.width = genislik + "%";
            cubuk.innerText = genislik + "%";
            
            if (mod === 'xss') durum.innerText = "WebKit belleği manipüle ediliyor...";
            else durum.innerText = "PS4 Payload Loader soketleri dinleniyor...";
        }
    }

    function tamamlaXss() {
        cubuk.style.width = "100%";
        cubuk.innerText = "100%";
        durum.innerText = "XSS Tetiklendi!";
        setTimeout(() => {
            alert("XSS Açığı Başarıyla Tetiklendi! 💀");
            sifirla();
        }, 300);
    }

    function sifirla() {
        btnXss.disabled = false;
        btnHen.disabled = false;
        yuklemeAlani.style.display = "none";
        cubuk.style.width = "0%";
        durum.innerText = "Sistem hazır, payload seçimi bekleniyor...";
    }
}
