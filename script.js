function startSandboxEscape() {
    let btn = document.getElementById("btnEscape");
    let logBox = document.getElementById("terminalLog");
    
    btn.disabled = true;
    logBox.innerHTML = ""; // Eski logları temizle

    function addLog(text, type = "normal") {
        let className = "text-white";
        if (type === "warn") className = "text-yellow";
        if (type === "alert") className = "text-red";
        
        let p = document.createElement("div");
        p.className = `log-line ${className}`;
        p.innerText = text;
        logBox.appendChild(p);
    }

    // Adım 1: Dosyayı Çek
    addLog(">> [STEP 1] GitHub üzerinden hen.bin indiriliyor...");
    
    fetch('hen.bin')
        .then(response => {
            if (!response.ok) throw new Error('hen.bin bulunamadı!');
            return response.arrayBuffer();
        })
        .then(buffer => {
            addLog(`>> [SUCCESS] hen.bin belleğe alındı (${buffer.byteLength} bayt).`, "warn");
            
            // Adım 2: WebKit Manipülasyonu Simülasyonu
            setTimeout(() => {
                addLog(">> [STEP 2] WebKit JIT (Just-In-Time) derleyicisine sızılıyor...");
                addLog(">> Bellek adresi taranıyor: 0x3ff8a1000b...", "warn");
            }, 1000);

            // Adım 3: Sandbox Sınırlarını Zorlama
            setTimeout(() => {
                addLog(">> [STEP 3] OOB (Out-of-Bounds) okuma/yazma açığı tetiklendi!", "alert");
                addLog(">> UYARI: Tarayıcı kum havuzu (Sandbox) sınırları aşılıyor...", "alert");
            }, 2500);

            // Adım 4: Kernel Çağrısı ve İnfaz
            setTimeout(() => {
                addLog(">> [STEP 4] KUTUDAN KAÇILDI! Sistem çağrıları (syscall) ele geçirildi.", "warn");
                addLog(">> Orbis OS Kernel seviyesine enjeksiyon yapılıyor...", "warn");
            }, 4000);

            // Adım 5: XSS Bombası ve Bitiş
            setTimeout(() => {
                addLog(">> [FINAL] Başarılı! Cihaz manipüle edildi.", "alert");
                
                // Gerçek XSS bombasını DOM'a çakıyoruz
                let bomb = document.createElement("div");
                bomb.innerHTML = `<img src="x" onerror="
                    alert('🏆 SANDBOX ESCAPE SUCCESS!\\n\\nTarayıcı kum havuzundan başarıyla kaçıldı (Simüle edildi).\\n${buffer.byteLength} baytlık hen.bin verisi infaz edildi! 💀');
                ">`;
                document.body.appendChild(bomb);
                
                btn.disabled = false;
            }, 5500);
        })
        .catch(error => {
            addLog(">> ⚠️ HATA: " + error.message, "alert");
            btn.disabled = false;
        });
}
