// DOM refs
const mainBtn = document.getElementById("main-btn");
const messageEl = document.getElementById("message");
const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-bar-fill");
const progressText = document.getElementById("progress-text");
const progressStatus = document.getElementById("progress-status");
const progressBarBg = document.getElementById("progress-bar-bg");
const flashImg = document.getElementById("flash-img");
const bsodEl = document.getElementById("bsod");
const mainStage = document.getElementById("main-stage");
const finalStage = document.getElementById("final-stage");
const typewriterEl = document.getElementById("typewriter");
const carouselContainer = document.getElementById("carousel-container");
const carouselImg = document.getElementById("carousel-img");
const videoCarouselPlayer = document.getElementById("video-carousel-player");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const carouselCounter = document.getElementById("carousel-counter");
const carouselCaption = document.getElementById("carousel-caption");

// config
const FRIEND_NAME = "nevra";
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// photos and videos in one array
const MEDIA_ARRAY = [
    { type: "image", src: "photos/bir.jpeg", alt: "", caption: "döner uğruna ölme keyfi" },
    { type: "image", src: "photos/iki.jpeg", alt: "", caption: "500 tl makarna?!?!" },
    { type: "image", src: "photos/uc.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/dort.jpeg", alt: "", caption: "malum kişiyle gün" },
    { type: "image", src: "photos/bes.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/alti.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/yedi.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/sekiz.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/onuc.jpeg", alt: "", caption: "" },
    { type: "image", src: "photos/ondort.jpeg", alt: "", caption: "" },
    { type: "video", src: "videos/oniki.mp4", caption: "" },
    { type: "video", src: "videos/dokuz.mp4", caption: "" },
    { type: "video", src: "videos/onbir.mp4", caption: "" }
];

const RUNAWAY_DURATION = 6000;
const RUNAWAY_MOVE_INTERVAL = 700;

// state
let clickCount = 0;
let lastClickTime = 0;
let keyBuffer = [];
let idleTimer = null;
let currentMediaIndex = 0;
let isRunawayActive = false;
let runawayTimer = null;
let runawayTimeout = null;

// story steps
const story = [
    { message: "", btnText: "DO NOT CLICK" },
    { message: "Tamam, daha büyük yazmam gerekiyormuş sanırım.", btnText: "SERIOUSLY, DON'T CLICK", style: { transform: "scale(1.3)" } },
    { message: "Merakına yenildin.", btnText: "...", style: { transform: "scale(0.8)" } },
    { message: "Basma diyoruz alo >:(", btnText: "Neden basıyorsun?", style: { transform: "scale(1)" } },
    { message: "Hainnn", btnText: "Hmm?", style: { backgroundColor: "#a24f66", color: "#fbdce6", borderColor: "#a24f66" } },
    { message: "Seni test ediyorum.", btnText: "Tıkla bakalım", style: { backgroundColor: "transparent", color: "#a24f66", borderColor: "#a24f66" } },
    { message: "Yakala da görelim nevroş", btnText: "Hadi!", action: "runaway" },
    { message: "Tamam tamam, pes.", btnText: "Normale dön.", action: "stop_runaway" },
    { message: "Bu arada...", btnText: "Ne oldu?", action: "flash_photo" },
    { message: "Hayır görmedin.", btnText: "Emin misin?", action: "flash_photo" },
    { message: "meow", btnText: "", action: "start_progress", style: { display: "none" } },
    { message: "Tebrikler! Tüm uyarıları görmezden geldin", btnText: "OPEN", action: "prepare_final" }
];

// main click handler
mainBtn.addEventListener("click", () => {
    const currentTime = Date.now();

    if (currentTime - lastClickTime < 250 && clickCount < 10) {
        messageEl.innerText = "Sakin ol.";
        return;
    }
    lastClickTime = currentTime;

    if (isRunawayActive) {
        catchSucceeded();
        return;
    }

    clickCount++;

    if (clickCount >= story.length) {
        startFinalStage();
        return;
    }

    const currentStep = story[clickCount];

    messageEl.innerText = currentStep.message;
    if (currentStep.btnText !== "") mainBtn.innerText = currentStep.btnText;

    if (currentStep.style) {
        Object.assign(mainBtn.style, currentStep.style);
    }

    if (currentStep.action) {
        triggerAction(currentStep.action);
    }
});

// actions
function triggerAction(actionName) {
    switch (actionName) {
        case "runaway":
            startRunaway();
            break;
        case "stop_runaway":
            break;
        case "flash_photo":
            showFlashPhoto();
            break;
        case "start_progress":
            startProgressBar();
            break;
        case "prepare_final":
            mainBtn.style.display = "inline-block";
            mainBtn.style.transform = "scale(1.2)";
            mainBtn.style.backgroundColor = "#fff";
            mainBtn.style.color = "#a24f66";
            mainBtn.style.borderColor = "#fff";
            break;
    }
}

// runaway button
function startRunaway() {
    isRunawayActive = true;
    // keep the stage height so the message doesn't jump when the button leaves the flow
    mainStage.style.minHeight = mainStage.offsetHeight + "px";
    mainBtn.classList.add("runaway");
    moveButtonRandomly();

    runawayTimer = setInterval(() => {
        if (isRunawayActive) moveButtonRandomly();
    }, RUNAWAY_MOVE_INTERVAL);

    runawayTimeout = setTimeout(() => {
        if (isRunawayActive) {
            catchFailed();
        }
    }, RUNAWAY_DURATION);
}

function moveButtonRandomly() {
    const btnWidth = mainBtn.clientWidth;
    const btnHeight = mainBtn.clientHeight;

    const maxX = window.innerWidth - btnWidth - 20;
    const maxY = window.innerHeight - btnHeight - 20;

    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    mainBtn.style.left = randomX + "px";
    mainBtn.style.top = randomY + "px";
}

function stopRunaway() {
    isRunawayActive = false;
    clearInterval(runawayTimer);
    clearTimeout(runawayTimeout);
    mainBtn.classList.remove("runaway");
    mainBtn.style.left = "auto";
    mainBtn.style.top = "auto";
    mainBtn.style.transform = "translate(0,0)";
    mainStage.style.minHeight = "";
}

function catchSucceeded() {
    stopRunaway();
    messageEl.innerText = "Yakaladın! 🎉";
    mainBtn.innerText = "Devam et";
    clickCount = 7;
}

function catchFailed() {
    stopRunaway();
    messageEl.innerText = "Oops, kaçırdın. Tekrar dene?";
    mainBtn.innerText = "Tekrar dene";
    clickCount = 5;
}

// flash photo
function showFlashPhoto() {
    const images = MEDIA_ARRAY.filter(item => item.type === "image");
    const randomImage = images[Math.floor(Math.random() * images.length)];
    flashImg.src = randomImage.src;

    messageEl.classList.add("hidden");
    flashImg.classList.remove("hidden");
    setTimeout(() => {
        flashImg.classList.add("hidden");
        messageEl.classList.remove("hidden");
    }, 500);
}

// trust level bar
function startProgressBar() {
    progressContainer.classList.remove("hidden");
    progressBarBg.style.cursor = "pointer";
    let progress = 0;
    progressFill.style.width = "0%";
    progressText.innerText = "0%";
    progressStatus.innerText = "Anıları yüklemek için çubuğa tıkla...";

    function handleProgressClick() {
        progress += Math.floor(Math.random() * 10) + 5;

        if (progress >= 40 && progress < 55) progressStatus.innerText = "Error 404: Birthday not found.";
        if (progress >= 70 && progress < 85) progressStatus.innerText = "Retrying...";

        if (progress >= 100) {
            progress = 100;
            progressFill.style.width = "100%";
            progressText.innerText = "100%";
            progressBarBg.removeEventListener("click", handleProgressClick);
            progressBarBg.style.cursor = "default";

            setTimeout(() => {
                progressContainer.classList.add("hidden");
                triggerBSOD();
            }, 500);
            return;
        }

        progressFill.style.width = progress + "%";
        progressText.innerText = progress + "%";
    }

    progressBarBg.addEventListener("click", handleProgressClick);
}

function triggerBSOD() {
    bsodEl.classList.remove("hidden");

    setTimeout(() => {
        bsodEl.classList.add("hidden");

        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }

        clickCount = 11;
        const nextStep = story[clickCount];
        messageEl.innerText = "Şaka.\n\n" + nextStep.message;
        mainBtn.innerText = nextStep.btnText;
        triggerAction(nextStep.action);
    }, 2500);
}

// final stage (typewriter + gallery)
function startFinalStage() {
    mainStage.classList.add("hidden");
    finalStage.classList.remove("hidden");

    const lines = [
        "Buraya kadar gelebildiysen tebrikler!!",
        "Ve...",
        "İyi ki doğduuuun",
        "YIPPPEEEE."
    ];

    let lineIdx = 0;

    function playTypewriter() {
        if (lineIdx < lines.length) {
            const text = lines[lineIdx];
            let charIdx = 0;
            typewriterEl.innerHTML = "";

            const typeInterval = setInterval(() => {
                typewriterEl.innerHTML += text.charAt(charIdx);
                charIdx++;

                if (charIdx >= text.length) {
                    clearInterval(typeInterval);
                    lineIdx++;
                    setTimeout(playTypewriter, 1200);
                }
            }, 60);
        } else {
            carouselContainer.classList.remove("hidden");
            updateCarousel();

            if (typeof confetti === "function") {
                confetti({ particleCount: 100, spread: 100, origin: { y: 0.4 } });
            }
        }
    }

    playTypewriter();
}

// gallery
function updateCarousel() {
    if (MEDIA_ARRAY.length === 0) return;
    const item = MEDIA_ARRAY[currentMediaIndex];

    videoCarouselPlayer.pause();
    carouselCounter.textContent = `${currentMediaIndex + 1} / ${MEDIA_ARRAY.length}`;
    carouselCaption.textContent = item.caption || "";

    if (item.type === "image") {
        videoCarouselPlayer.classList.add("hidden");
        videoCarouselPlayer.removeAttribute("src");
        videoCarouselPlayer.load(); // stop buffering the old video
        carouselImg.classList.remove("hidden");
        carouselImg.src = item.src;
        carouselImg.alt = item.alt || `Memory photo ${currentMediaIndex + 1}`;
    } else {
        carouselImg.classList.add("hidden");
        videoCarouselPlayer.classList.remove("hidden");
        videoCarouselPlayer.src = item.src;
        videoCarouselPlayer.load();
        // browsers can block autoplay with sound, the user just hits play
    }
}

function showPrevMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + MEDIA_ARRAY.length) % MEDIA_ARRAY.length;
    updateCarousel();
}

function showNextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % MEDIA_ARRAY.length;
    updateCarousel();
}

prevBtn.addEventListener("click", showPrevMedia);
nextBtn.addEventListener("click", showNextMedia);

// easter eggs
function resetIdleTimer() {
    clearTimeout(idleTimer);

    if (clickCount > 0 && clickCount < 10) {
        idleTimer = setTimeout(() => {
            messageEl.innerText = "Uyudun mu?";
        }, 10000);
    }
}

window.addEventListener("mousemove", resetIdleTimer);
window.addEventListener("click", resetIdleTimer);
window.addEventListener("touchstart", resetIdleTimer);

window.addEventListener("keydown", (e) => {
    resetIdleTimer();

    // arrow keys flip through the gallery
    if (!carouselContainer.classList.contains("hidden")) {
        if (e.key === "ArrowLeft") showPrevMedia();
        if (e.key === "ArrowRight") showNextMedia();
        return;
    }

    keyBuffer.push(e.key);

    if (keyBuffer.length > 10) {
        keyBuffer.shift();
    }

    const currentString = keyBuffer.join("").toLowerCase();

    if (currentString.includes(FRIEND_NAME)) {
        messageEl.innerText = "İsmini yazmayı bırak da butona odaklan :)";
        keyBuffer = [];
    }

    const konamiString = KONAMI_CODE.join("");
    if (keyBuffer.join("") === konamiString) {
        messageEl.innerText = "GİZLİ KOD BULUNDU! +1000 Güven Puanı!";
        if (typeof confetti === "function") {
            confetti({ particleCount: 200, spread: 120 });
        }
        keyBuffer = [];
    }
});

resetIdleTimer();