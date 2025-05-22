// Canvas3 - Seviye 3 (6 yıldız bağlama)
const canvas3 = document.getElementById("canvas3");
const vh3 = window.innerHeight / 100;
canvas3.width = vh3 * 130;
canvas3.height = vh3 * 80;
const ctx3 = canvas3.getContext("2d");

// Yıldız resmi ve ses efekti
const starImg3 = new Image();
starImg3.src = "./images/star.png";
const clickSound3 = new Audio("./audio/click.wav");

// Yıldızların konumları
const circles3 = [
  { x: 100, y: 100, radius: 30 },  // 1. yıldız
  { x: 250, y: 200, radius: 30 },  // 2. yıldız
  { x: 400, y: 100, radius: 30 },  // 3. yıldız
  { x: 550, y: 250, radius: 30 },  // 4. yıldız
  { x: 700, y: 150, radius: 30 },  // 5. yıldız
  { x: 900, y: 300, radius: 30 }   // 6. yıldız
];

let currentIndex3 = 0;      // Mevcut yıldız indeksi
let isDrawing3 = false;     // Çizim yapılıp yapılmadığı
let lines3 = [];            // Çizilen çizgiler
let lastMouse3 = { x: 0, y: 0 }; // Son fare pozisyonu
const maxDistance3 = 250;   // Maksimum bağlantı mesafesi

// Yıldız çizme fonksiyonu
function drawCircle3(circle) {
  ctx3.beginPath();
  ctx3.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx3.fillStyle = "white";
  ctx3.fill();
  ctx3.stroke();
  ctx3.drawImage(starImg3, circle.x - 15, circle.y - 15, 30, 30);
}

// Fare pozisyonunun yıldız içinde olup olmadığını kontrol eder
function isInsideCircle3(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Canvas'ı çizme fonksiyonu
function drawCanvas3() {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // Kayıtlı çizgileri çiz
  ctx3.strokeStyle = "red";
  ctx3.lineWidth = 2;
  lines3.forEach(line => {
    ctx3.beginPath();
    ctx3.moveTo(line.start.x, line.start.y);
    ctx3.lineTo(line.end.x, line.end.y);
    ctx3.stroke();
  });

  // Aktif çizgiyi çiz
  if (isDrawing3 && currentIndex3 < circles3.length - 1) {
    const start = circles3[currentIndex3];
    const dx = lastMouse3.x - start.x;
    const dy = lastMouse3.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let endX = lastMouse3.x;
    let endY = lastMouse3.y;

    // Maksimum mesafe kontrolü
    if (distance > maxDistance3) {
      const angle = Math.atan2(dy, dx);
      endX = start.x + Math.cos(angle) * maxDistance3;
      endY = start.y + Math.sin(angle) * maxDistance3;
    }

    // Çizgi çizme
    ctx3.beginPath();
    ctx3.moveTo(start.x, start.y);
    ctx3.lineTo(endX, endY);
    ctx3.stroke();
  }

  // Tüm yıldızları çiz
  circles3.forEach(circle => {
    drawCircle3(circle);
  });
}

// Canvas'ı sıfırlama fonksiyonu
function resetCanvas3() {
  currentIndex3 = 0;
  isDrawing3 = false;
  lines3.length = 0;
  lastMouse3 = { x: 0, y: 0 };
  drawCanvas3();
}

// Fare tıklama olayı
canvas3.addEventListener("mousedown", (e) => {
  const rect = canvas3.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideCircle3(x, y, circles3[currentIndex3])) {
    clickSound3.play();
    isDrawing3 = true;
  }
});

// Fare hareket olayı
canvas3.addEventListener("mousemove", (e) => {
  const rect = canvas3.getBoundingClientRect();
  lastMouse3.x = e.clientX - rect.left;
  lastMouse3.y = e.clientY - rect.top;

  // Sonraki yıldıza ulaşıldığında
  if (
    isDrawing3 &&
    currentIndex3 < circles3.length - 1 &&
    isInsideCircle3(lastMouse3.x, lastMouse3.y, circles3[currentIndex3 + 1])
  ) {
    lines3.push({
      start: { x: circles3[currentIndex3].x, y: circles3[currentIndex3].y },
      end: { x: circles3[currentIndex3 + 1].x, y: circles3[currentIndex3 + 1].y }
    });

    currentIndex3++;
    clickSound3.play();

    // Tüm yıldızlar bağlandığında
    if (currentIndex3 === circles3.length - 1) {
      isDrawing3 = false;
      setTimeout(() => {
        gecisYap(canvas3, canvas4);
      }, 400);
    } else {
      isDrawing3 = true;
    }
  }

  drawCanvas3();
});

// İlk çizimi yap
drawCanvas3();