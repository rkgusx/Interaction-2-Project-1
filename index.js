const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 4;

document.body.style.margin = "0";
document.body.style.overflow = "auto"; 


document.body.style.height = `${canvas.height}px`; 

const emotionColors = [
    ["#FF5733", "#C70039"],
    ["#900C3F", "#581845"],
    ["#1D4ED8", "#4B91F3"],
    ["#38A1DB", "#63B7D0"],
    ["#6EE7B7", "#10B981"],
    ["#D4AF37", "#DAA520"]
];

class FloatingGradient {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.radiusX = Math.random() * 300 + 400;
        this.radiusY = this.radiusX * (Math.random() * 0.8 + 0.8);
        
        this.baseSpeed = (Math.random() * 0.1) + 0.05;
        this.speedX = (Math.random() - 0.5) * this.baseSpeed;
        this.speedY = (Math.random() - 0.5) * this.baseSpeed;
        this.opacity = 0.8;

        this.setNewColors();
        this.transitionProgress = Math.random();
        this.colorChangeSpeed = 0.0002;

        this.randomDirectionFactorX = (Math.random() - 0.5) * 0.05;
        this.randomDirectionFactorY = (Math.random() - 0.5) * 0.05;

        this.followSpeed = 0.0005;
        this.maxDistance = 300;
        this.lastMouseMoveTime = 0;
        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;

        this.movingSpeedMultiplier = 0.1;
    }

    setNewColors() {
        let newIndex = Math.floor(Math.random() * emotionColors.length);
        this.colorA = this.hexToRgb(emotionColors[newIndex][0]);
        this.colorB = this.hexToRgb(emotionColors[newIndex][1]);
    }

    update() {
        let currentTime = Date.now();
        let mouseMovementEffect = 0;

        if (currentTime - this.lastMouseMoveTime < 200) {
            let dx = this.mouseX - this.x;
            let dy = this.mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.maxDistance) {
                mouseMovementEffect = 1 - (distance / this.maxDistance);
                this.speedX += dx * this.followSpeed * mouseMovementEffect * this.movingSpeedMultiplier;
                this.speedY += dy * this.followSpeed * mouseMovementEffect * this.movingSpeedMultiplier;
            }
        } else {
            this.speedX += (Math.random() - 0.5) * 0.01;
            this.speedY += (Math.random() - 0.5) * 0.01;
        }

        this.x += this.speedX + this.randomDirectionFactorX;
        this.y += this.speedY + this.randomDirectionFactorY;

        if (this.x - this.radiusX > canvas.width) this.x = canvas.width - this.radiusX;
        if (this.x + this.radiusX < 0) this.x = this.radiusX;
        if (this.y - this.radiusY > canvas.height) this.y = canvas.height - this.radiusY;
        if (this.y + this.radiusY < 0) this.y = this.radiusY;

        this.transitionProgress += this.colorChangeSpeed;

        if (this.transitionProgress >= 1) {
            this.transitionProgress = 0;
            this.setNewColors();
        }
    }

    draw() {
        let gradient = ctx.createRadialGradient(
            this.x, this.y, 50, 
            this.x, this.y, this.radiusX
        );

        let blendedColor = this.interpolateColor(this.colorA, this.colorB, this.transitionProgress);
        let blendedColor2 = this.interpolateColor(this.colorB, this.colorA, this.transitionProgress);

        gradient.addColorStop(0, `rgba(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b}, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(${blendedColor2.r}, ${blendedColor2.g}, ${blendedColor2.b}, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    interpolateColor(color1, color2, factor) {
        factor = Math.pow(factor, 3);
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * factor),
            g: Math.round(color1.g + (color2.g - color1.g) * factor),
            b: Math.round(color1.b + (color2.b - color1.b) * factor)
        };
    }

    hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    updateMousePosition(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.lastMouseMoveTime = Date.now();
    }
}

let floatingGradients = [];
for (let i = 0; i < 5; i++) { 
    floatingGradients.push(new FloatingGradient());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    floatingGradients.forEach(gradient => {
        gradient.update();
        gradient.draw();
    });

    requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("mousemove", function(event) {
    floatingGradients.forEach(gradient => {
        gradient.updateMousePosition(event);
    });
});

function handleScroll() {
    let scrollTop = window.scrollY;
    let windowHeight = window.innerHeight;

    floatingGradients.forEach(gradient => {
        if (gradient.y >= scrollTop && gradient.y <= scrollTop + windowHeight) {
            gradient.draw();
        }
    });
}

// 글자 위로 늘어나는 거

window.addEventListener("scroll", handleScroll);


document.querySelectorAll(".interactive-text span").forEach(letter => {
    letter.addEventListener("mouseenter", () => {
        let randomScale = 1 + Math.random() * 1.5;
        letter.style.transform = `scaleY(${randomScale})`;
    });

    letter.addEventListener("mouseleave", () => {
        setTimeout(() => {
            letter.style.transform = "scaleY(1)";
        }, 300);
    });
});

// 슬라이드 (아직 해결 못 함)

let isTextVisible = false;

document.getElementById("nextTextBtn").addEventListener("click", () => {
    let emotionText = document.querySelector(".interactive-text");
    let nextText = document.getElementById("nextText");
    let prevTextBtn = document.getElementById("prevTextBtn");
    let nextTextBtn = document.getElementById("nextTextBtn");

    if (!isTextVisible) {

        nextTextBtn.style.transition = "opacity 0.6s ease";
        nextTextBtn.style.opacity = 0;

        emotionText.style.transition = "transform 0.6s ease, opacity 0.6s ease";
        emotionText.style.transform = "translateX(-100%)";
        emotionText.style.opacity = 0;

        setTimeout(() => {
            nextText.style.transition = "transform 0.6s ease, opacity 0.6s ease"; 
            nextText.style.transform = "translateX(0)";
            nextText.style.opacity = 1; 

            prevTextBtn.style.transition = "opacity 0.6s ease";
            prevTextBtn.style.opacity = 1;

            nextTextBtn.style.display = "none"; 

        }, 600);

        isTextVisible = true; 
    }
});

document.getElementById("prevTextBtn").addEventListener("click", () => {
    let emotionText = document.querySelector(".interactive-text");
    let nextText = document.getElementById("nextText");
    let prevTextBtn = document.getElementById("prevTextBtn");
    let nextTextBtn = document.getElementById("nextTextBtn");

    if (isTextVisible) { 
        prevTextBtn.style.transition = "opacity 0.6s ease";
        prevTextBtn.style.opacity = 0;

        nextText.style.transition = "transform 0.6s ease, opacity 0.6s ease";
        nextText.style.transform = "translateX(100%)";
        nextText.style.opacity = 0;

        setTimeout(() => {
            emotionText.style.transition = "transform 0.6s ease, opacity 1s ease";
            emotionText.style.transform = "translateX(0)";
            emotionText.style.opacity = 1;

            nextTextBtn.style.display = "inline-block"; 
            nextTextBtn.style.transition = "opacity 0.6s ease";
            nextTextBtn.style.opacity = 1;
        }, 600); 

        isTextVisible = false; 
    }
});
