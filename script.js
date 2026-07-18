// Başlangıçta güvenlik koruması kapalı (Zafiyetli mod)
let guvenlikAcik = false;

function aramaYap() {
    let girdi = document.getElementById("aramaKutusu").value;
    let cikis = document.getElementById("cikisEkrani");
    let sonucKutusu = document.getElementById("sonuc");

    if (guvenlikAcik) {
        // 🛡️ BEYAZ ŞAPKALI YAMASI (Güvenli Yöntem):
        // textContent kullanıldığında, tarayıcı girdiyi KOD olarak değil, düz METİN olarak okur.
        cikis.textContent = girdi;
        sonucKutusu.classList.add("safe");
    } else {
        // 💥 ZAFİYETLİ SATIR (Hackerların Sevgilisi):
        // innerHTML kullanıldığında, tarayıcı girdinin içindeki HTML/JS kodlarını doğrudan ÇALIŞTIRIR!
        cikis.innerHTML = girdi;
        sonucKutusu.classList.remove("safe");
    }
}

// Güvenlik modunu açıp kapatmaya yarayan fonksiyon
function guvenlikModuDegistir() {
    guvenlikAcik = !guvenlikAcik;
    let btn = document.getElementById("btnGuvenric");
    btn = document.getElementById("btnGuvenlik");
    
    if (guvenlikAcik) {
        btn.innerText = "Güvenlik Modu: AÇIK (Yamalandı)";
        btn.style.background = "#00adb5";
    } else {
        btn.innerText = "Güvenlik Modu: KAPALI (Zafiyetli)";
        btn.style.background = "#ff2e63";
    }
}
