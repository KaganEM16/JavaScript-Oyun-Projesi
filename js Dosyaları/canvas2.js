// Canvas2 - Seviye 2 (4 yıldız bağlama)
const canvas2 = document.getElementById("canvas2");
const vh2 = window.innerHeight / 100;
canvas2.width = vh2 * 130;
canvas2.height = vh2 * 80;
const ctx2 = canvas2.getContext("2d");

// Yıldız resmi ve ses efekti
const starImg2 = new Image();
starImg2.src = "./images/star.png";
starImg2.onload = function() {
  drawCanvas2();
};
const clickSound2 = new Audio("./audio/click.wav");

// Yıldızların konumları
const circles2 = [
  { x: 200, y: 100, radius: 30 },  // 1. yıldız
  { x: 450, y: 150, radius: 30 },  // 2. yıldız
  { x: 600, y: 350, radius: 30 },  // 3. yıldız
  { x: 850, y: 500, radius: 30 }   // 4. yıldız
];

let currentIndex2 = 0;      // Mevcut yıldız indeksi
let isDrawing2 = false;     // Çizim yapılıp yapılmadığı
let lastMouse2 = { x: 0, y: 0 }; // Son fare pozisyonu
const lines2 = [];          // Çizilen çizgiler
const maxDistance2 = 250;   // Maksimum bağlantı mesafesi

// Yıldız çizme fonksiyonu
function drawCircle2(circle) {
  ctx2.beginPath();
  ctx2.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx2.fillStyle = "white";
  ctx2.fill();
  ctx2.strokeStyle = "black";
  ctx2.stroke();
  if (starImg2.complete) {
    ctx2.drawImage(starImg2, circle.x - 15, circle.y - 15, 30, 30);
  }
}

// Fare pozisyonunun yıldız içinde olup olmadığını kontrol eder
function isInsideCircle2(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Canvas'ı çizme fonksiyonu
function drawCanvas2() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  // Kayıtlı çizgileri çiz
  ctx2.strokeStyle = "red";
  ctx2.lineWidth = 2;
  lines2.forEach(line => {
    ctx2.beginPath();
    ctx2.moveTo(line.start.x, line.start.y);
    ctx2.lineTo(line.end.x, line.end.y);
    ctx2.stroke();
  });

  // Aktif çizgiyi çiz
  if (isDrawing2 && currentIndex2 < circles2.length - 1) {
    const start = circles2[currentIndex2];
    const dx = lastMouse2.x - start.x;
    const dy = lastMouse2.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let endX = lastMouse2.x;
    let endY = lastMouse2.y;

    // Maksimum mesafe kontrolü
    if (distance > maxDistance2) {
      const angle = Math.atan2(dy, dx);
      endX = start.x + Math.cos(angle) * maxDistance2;
      endY = start.y + Math.sin(angle) * maxDistance2;
    }

    // Çizgi çizme
    ctx2.beginPath();
    ctx2.moveTo(start.x, start.y);
    ctx2.lineTo(endX, endY);
    ctx2.stroke();
  }

  // Tüm yıldızları çiz
  circles2.forEach(circle => {
    drawCircle2(circle);
  });
}

// Canvas'ı sıfırlama fonksiyonu
function resetCanvas2() {
  currentIndex2 = 0;
  isDrawing2 = false;
  lines2.length = 0;
  lastMouse2 = { x: 0, y: 0 };
  drawCanvas2();
}

// Fare tıklama olayı
canvas2.addEventListener("mousedown", (e) => {
  const rect = canvas2.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideCircle2(x, y, circles2[currentIndex2])) {
    clickSound2.play();
    isDrawing2 = true;
  }
});

// Fare hareket olayı
canvas2.addEventListener("mousemove", (e) => {
  const rect = canvas2.getBoundingClientRect();
  lastMouse2.x = e.clientX - rect.left;
  lastMouse2.y = e.clientY - rect.top;

  if (isDrawing2 && currentIndex2 < circles2.length - 1) {
    // Sonraki yıldıza ulaşıldığında
    if (isInsideCircle2(lastMouse2.x, lastMouse2.y, circles2[currentIndex2 + 1])) {
      lines2.push({
        start: { x: circles2[currentIndex2].x, y: circles2[currentIndex2].y },
        end: { x: circles2[currentIndex2 + 1].x, y: circles2[currentIndex2 + 1].y }
      });

      currentIndex2++;
      clickSound2.play();

      // Tüm yıldızlar bağlandığında
      if (currentIndex2 === circles2.length - 1) {
        isDrawing2 = false;
        setTimeout(() => {
          gecisYap(canvas2, canvas3);
        }, 400);
      }
    }
  }

  drawCanvas2();
});

// İlk çizimi yap
drawCanvas2();