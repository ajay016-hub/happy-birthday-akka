/* =========================================================
   PAGE SYSTEM
========================================================= */

const pages = document.querySelectorAll(".page");

const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");

const dots = document.querySelectorAll(".dot");

const chapterCurrent =
    document.getElementById("chapterCurrent");

let currentPage = 0;

const totalPages = pages.length;


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        document
            .getElementById("loader")
            .classList.add("hide");

    }, 900);

});


/* =========================================================
   CREATE STARS
========================================================= */

const starsContainer =
    document.getElementById("stars");

for (let i = 0; i < 90; i++) {

    const star = document.createElement("span");

    star.className = "star";

    star.style.left =
        Math.random() * 100 + "%";

    star.style.top =
        Math.random() * 100 + "%";

    const size =
        Math.random() * 2 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.animationDelay =
        Math.random() * 3 + "s";

    starsContainer.appendChild(star);
}


/* =========================================================
   SHOW PAGE
========================================================= */

function showPage(index, direction = 1) {

    if (index < 0 || index >= totalPages) {
        return;
    }

    const oldPage = pages[currentPage];
    const newPage = pages[index];

    if (oldPage === newPage) {
        return;
    }

    oldPage.classList.remove("active");

    if (direction < 0) {
        oldPage.classList.add("exit-left");
    }

    newPage.classList.remove("exit-left");

    currentPage = index;

    setTimeout(() => {

        newPage.classList.add("active");

    }, 30);


    updateNavigation();


    /* Fireworks */
    if (index === 1) {
        startFireworks();
    }


    /* Stop fireworks on other pages */
    if (index !== 1) {
        stopFireworks();
    }

}


/* =========================================================
   NAVIGATION UPDATE
========================================================= */

function updateNavigation() {

    const pageNumber =
        String(currentPage + 1).padStart(2, "0");

    chapterCurrent.textContent =
        pageNumber;


    /* Back */
    backButton.disabled =
        currentPage === 0;


    /* Next */

    if (currentPage === totalPages - 1) {

        nextButton.style.opacity = "0";

        nextButton.style.pointerEvents =
            "none";

    } else {

        nextButton.style.opacity = "1";

        nextButton.style.pointerEvents =
            "auto";
    }


    /* Dots */

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentPage
        );

    });

}


/* =========================================================
   NEXT
========================================================= */

function nextPage() {

    if (currentPage < totalPages - 1) {

        showPage(
            currentPage + 1,
            1
        );

    }

}


/* =========================================================
   BACK
========================================================= */

function previousPage() {

    if (currentPage > 0) {

        showPage(
            currentPage - 1,
            -1
        );

    }

}


/* =========================================================
   NAV BUTTONS
========================================================= */

nextButton.addEventListener(
    "click",
    nextPage
);

backButton.addEventListener(
    "click",
    previousPage
);


/* =========================================================
   EVERY PAGE NEXT BUTTON
========================================================= */

document
    .querySelectorAll("[data-next]")
    .forEach(button => {

        button.addEventListener(
            "click",
            nextPage
        );

    });


/* =========================================================
   DOT NAVIGATION
========================================================= */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        if (index === currentPage) {
            return;
        }

        const direction =
            index > currentPage ? 1 : -1;

        showPage(
            index,
            direction
        );

    });

});


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "ArrowRight") {
            nextPage();
        }

        if (event.key === "ArrowLeft") {
            previousPage();
        }

    }
);


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


document.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchEndX - touchStartX;

        if (Math.abs(difference) < 60) {
            return;
        }

        if (difference < 0) {
            nextPage();
        } else {
            previousPage();
        }

    },
    { passive: true }
);


/* =========================================================
   MESSAGE CARDS
========================================================= */

const thingCards =
    document.querySelectorAll(".thing-card");

const messageModal =
    document.getElementById("messageModal");

const modalText =
    document.getElementById("modalText");

const modalClose =
    document.getElementById("modalClose");


thingCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const message =
                card.dataset.message;

            modalText.textContent =
                message;

            messageModal.classList.add("show");

        }
    );

});


function closeModal() {

    messageModal.classList.remove(
        "show"
    );

}


modalClose.addEventListener(
    "click",
    closeModal
);


messageModal.addEventListener(
    "click",
    event => {

        if (
            event.target === messageModal
        ) {
            closeModal();
        }

    }
);


/* =========================================================
   FIREWORKS
========================================================= */

const canvas =
    document.getElementById("fireworksCanvas");

const ctx =
    canvas.getContext("2d");

let fireworks = [];
let particles = [];

let fireworksActive = false;

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* Rocket */

class Rocket {

    constructor() {

        this.x =
            Math.random() *
            canvas.width;

        this.y =
            canvas.height + 20;

        this.targetY =
            Math.random() *
            canvas.height *
            0.55 +
            80;

        this.speed =
            7 +
            Math.random() * 4;

        this.dead = false;

    }

    update() {

        this.y -= this.speed;

        if (
            this.y <= this.targetY
        ) {

            explode(
                this.x,
                this.y
            );

            this.dead = true;

        }

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,220,180,0.9)";

        ctx.fill();

    }

}


/* Particle */

class Particle {

    constructor(
        x,
        y
    ) {

        this.x = x;
        this.y = y;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            Math.random() *
            5 +
            1;

        this.vx =
            Math.cos(angle) *
            speed;

        this.vy =
            Math.sin(angle) *
            speed;

        this.life =
            70 +
            Math.random() *
            40;

        this.maxLife =
            this.life;

        this.size =
            Math.random() *
            2 +
            1;

    }

    update() {

        this.x += this.vx;

        this.y += this.vy;

        this.vy += 0.035;

        this.vx *= 0.99;

        this.life--;

    }

    draw() {

        const opacity =
            this.life /
            this.maxLife;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(240,190,210,${opacity})`;

        ctx.fill();

    }

}


function explode(x, y) {

    for (
        let i = 0;
        i < 75;
        i++
    ) {

        particles.push(
            new Particle(x, y)
        );

    }

}


function animateFireworks() {

    if (!fireworksActive) {
        return;
    }

    ctx.fillStyle =
        "rgba(8,7,11,0.18)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Launch rockets */

    if (
        Math.random() <
        0.025
    ) {

        fireworks.push(
            new Rocket()
        );

    }


    fireworks.forEach(
        rocket => {

            rocket.update();
            rocket.draw();

        }
    );


    fireworks =
        fireworks.filter(
            rocket => !rocket.dead
        );


    /* Particles */

    particles.forEach(
        particle => {

            particle.update();
            particle.draw();

        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );


    requestAnimationFrame(
        animateFireworks
    );

}


function startFireworks() {

    if (fireworksActive) {
        return;
    }

    fireworksActive = true;

    fireworks = [];
    particles = [];

    animateFireworks();

}


function stopFireworks() {

    fireworksActive = false;

}


/* =========================================================
   GIFT
========================================================= */

const gift =
    document.getElementById("gift");

const finalReveal =
    document.getElementById("finalReveal");

const finalContent =
    document.querySelector(".final-content");


gift.addEventListener(
    "click",
    () => {

        gift.style.transform =
            "scale(0.8)";

        setTimeout(() => {

            finalContent.classList.add(
                "hide"
            );

            finalReveal.classList.add(
                "show"
            );

            createFinalParticles();

        }, 350);

    }
);


/* =========================================================
   FINAL PARTICLES
========================================================= */

function createFinalParticles() {

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.textContent =
            Math.random() > 0.5
                ? "✦"
                : "♡";

        particle.style.position =
            "fixed";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            Math.random() * 100 + "%";

        particle.style.color =
            Math.random() > 0.5
                ? "#d8b878"
                : "#e8a6bd";

        particle.style.fontSize =
            8 +
            Math.random() * 14 +
            "px";

        particle.style.pointerEvents =
            "none";

        particle.style.zIndex =
            "20";

        particle.style.opacity =
            "0";

        particle.style.transition =
            "all 2s ease";

        document.body.appendChild(
            particle
        );

        setTimeout(() => {

            particle.style.opacity =
                "0.8";

            particle.style.transform =
                `translateY(-${
                    40 +
                    Math.random() * 100
                }px)`;

        }, 50);

        setTimeout(() => {

            particle.remove();

        }, 2200);

    }

}


/* =========================================================
   RESTART
========================================================= */

const restartButton =
    document.getElementById(
        "restartButton"
    );

restartButton.addEventListener(
    "click",
    () => {

        finalReveal.classList.remove(
            "show"
        );

        finalContent.classList.remove(
            "hide"
        );

        gift.style.transform =
            "";

        showPage(
            0,
            -1
        );

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateNavigation();