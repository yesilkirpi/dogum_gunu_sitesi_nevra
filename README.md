# DO NOT CLICK 🎂

Bir arkadaşım için hazırladığım, etkileşimli bir doğum günü sürprizi. Sayfa "basma" diyen bir butonla başlıyor, her tıklamada hikâye bir adım ilerliyor: kaçan buton, sahte "Trust Level" çubuğu, sahte Windows hata ekranı, daktilo efekti ve anılardan oluşan bir foto/video galerisi.

*An interactive birthday surprise built with vanilla HTML, CSS and JavaScript: a story-driven "do not click" button, a runaway button, a fake loading bar and BSOD, a typewriter effect and a photo/video gallery.*

**🔗 Canlı demo:** https://yesilkirpi.github.io/nevros_icin/

## Özellikler

- **Hikâye motoru:** Tüm senaryo tek bir `story` dizisinde tutuluyor (mesaj, buton yazısı, stil, aksiyon). Yeni bir adım eklemek için diziye bir satır eklemek yeterli.
- **Kaçan buton:** Buton 6 saniye boyunca ekranda rastgele zıplıyor. Yakalanırsa hikâye devam ediyor, yakalanamazsa tekrar deneniyor.
- **Sahte yükleme çubuğu ve hata ekranı:** Çubuk her tıklamada rastgele ilerliyor, %100'de sahte bir mavi ekran açılıyor, ardından konfeti patlıyor.
- **Daktilo efekti** ve **foto + video galerisi** (10 fotoğraf, 3 video). Galeride ok tuşlarıyla gezilebiliyor.
- **Gizli sürprizler:** Belirli bir ismi yazınca ve Konami koduyla (↑ ↑ ↓ ↓ ← → ← → B A) çıkan mesajlar (klavyeli cihazlarda).
- **Mobil uyumlu** arayüz.

## Kullanılan teknolojiler

- HTML5, CSS3, vanilla JavaScript (framework yok)
- [canvas-confetti](https://github.com/catdad/canvas-confetti) (CDN üzerinden)
- Google Fonts: Pixelify Sans
- GitHub Pages ile yayınlandı

## Proje yapısı

```
├── index.html   # sayfa iskeleti
├── style.css    # tüm stiller (mobil uyumlu)
├── script.js    # hikâye motoru, kaçan buton, galeri, gizli kodlar
├── photos/      # galeri fotoğrafları
└── videos/      # galeri videoları
```

## Yeni hikâye adımı eklemek

`script.js` içindeki `story` dizisine bir satır eklemek yeterli:

```js
{ message: "Yeni bir mesaj", btnText: "Tamam", style: { transform: "scale(1.2)" } },
```

Özel davranış gereken adımlar `action` alanıyla işaretleniyor (`runaway`, `stop_runaway`, `flash_photo`, `start_progress`, `prepare_final`). Kod, bu adımların yerini sabit sayılarla değil `action` üzerinden buluyor (`STEP` nesnesi), yani adımları araya ekleyip yerini değiştirmek mantığı bozmuyor.

## Çalıştırma

Derleme adımı yok. Repoyu indirip `index.html` dosyasını tarayıcıda açmak yeterli:

```bash
git clone https://github.com/yesilkirpi/nevros_icin.git
cd nevros_icin
# index.html dosyasını tarayıcıda aç
```

## Teknik notlar: neleri düzelttim?

Projeyi yayınladıktan sonra kodu gözden geçirip şu sorunları düzelttim:

- **Font mirası:** `*` seçicisiyle verilen `font-family` sahte mavi ekranın fontunu eziyordu. Fontu `body`'ye taşıyıp butonlara `font: inherit` verdim.
- **Sabit sayılar:** Hikâye adımları koda `5`, `7`, `11` gibi indekslerle bağlıydı ve bir adım hiç gösterilmiyordu. İndeksleri `action` alanından bulan bir `STEP` nesnesine çevirdim.
- **Flaş fotoğraf:** Fotoğraf inmeden gösterildiği için ilk seferde boş görünebiliyordu. Önce `Image` nesnesiyle yükleyip `onload`'da gösterdim, üst üste binen zamanlayıcıları `clearTimeout` ile temizledim.
- **Konami kodu:** Shift/CapsLock ile ve tuş basılı tutulunca çalışmıyordu. Tuşları normalize edip modifier tuşlarını ve `repeat` olaylarını filtreledim.
- **Erişilebilirlik:**
  - İlerleme çubuğu `div` olduğu için klavyeyle kullanılamıyordu, `button`'a çevirdim.
  - Boş `<h1>` yerine `role="status"` ve `aria-live` olan bir mesaj alanı kullandım.
  - Boş `src=""` değerlerini kaldırdım, galeri alt metnini Türkçeleştirdim.
  - `prefers-reduced-motion` ayarı olan kullanıcılar için geçişleri ve konfetiyi kapattım.
- **Yükleme:** Confetti scriptine `defer` ekledim, videolara `preload="metadata"` verdim.

## İleride yapılacaklar

- [ ] Fotoğrafları WebP'ye çevirip boyutlarını küçültmek
- [ ] Galeride sıradaki görseli önceden yüklemek
- [ ] Fotoğraflara tek tek açıklayıcı `alt` metinleri yazmak