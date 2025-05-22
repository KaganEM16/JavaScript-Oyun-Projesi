// Canvas4 - Seviye 4 (8 yıldız bağlama - Final seviyesi)
const canvas4 = document.getElementById("canvas4");
const vh4 = window.innerHeight / 100;
canvas4.width = vh4 * 130;
canvas4.height = vh4 * 80;
const ctx4 = canvas4.getContext("2d");

// Yıldız resmi ve ses efekti
const starImg4 = new Image();
starImg4.src = "./images/star.png";
const clickSound4 = new Audio("./audio/click.wav");

// Yıldızların konumları
const circles4 = [
  { x: 150, y: 100, radius: 30 },  // 1. yıldız
  { x: 300, y: 200, radius: 30 },  // 2. yıldız
  { x: 450, y: 100, radius: 30 },  // 3. yıldız
  { x: 600, y: 250, radius: 30 },  // 4. yıldız
  { x: 650, y: 400, radius: 30 },  // 5. yıldız
  { x: 800, y: 370, radius: 30 },  // 6. yıldız
  { x: 900, y: 300, radius: 30 },  // 7. yıldız
  { x: 1000, y: 100, radius: 30 }  // 8. yıldız
];

let currentIndex4 = 0;      // Mevcut yıldız indeksi
let isDrawing4 = false;     // Çizim yapılıp yapılmadığı
let lines4 = [];            // Çizilen çizgiler
let lastMouse4 = { x: 0, y: 0 }; // Son fare pozisyonu
const maxDistance4 = 180;   // Maksimum bağlantı mesafesi (daha zor)

// Yıldız çizme fonksiyonu
function drawCircle4(circle) {
  ctx4.beginPath();
  ctx4.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx4.fillStyle = "white";
  ctx4.fill();
  ctx4.stroke();
  ctx4.drawImage(starImg4, circle.x - 15, circle.y - 15, 30, 30);
}

// Fare pozisyonunun yıldız içinde olup olmadığını kontrol eder
function isInsideCircle4(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Canvas'ı çizme fonksiyonu
function drawCanvas4() {
  ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

  // Kayıtlı çizgileri çiz
  ctx4.strokeStyle = "red";
  ctx4.lineWidth = 2;
  lines4.forEach(line => {
    ctx4.beginPath();
    ctx4.moveTo(line.start.x, line.start.y);
    ctx4.lineTo(line.end.x, line.end.y);
    ctx4.stroke();
  });

  // Aktif çizgiyi çiz
  if (isDrawing4 && currentIndex4 < circles4.length - 1) {
    const start = circles4[currentIndex4];
    const dx = lastMouse4.x - start.x;
    const dy = lastMouse4.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let endX = lastMouse4.x;
    let endY = lastMouse4.y;

    // Maksimum mesafe kontrolü
    if (distance > maxDistance4) {
      const angle = Math.atan2(dy, dx);
      endX = start.x + Math.cos(angle) * maxDistance4;
      endY = start.y + Math.sin(angle) * maxDistance4;
    }

    // Çizgi çizme
    ctx4.beginPath();
    ctx4.moveTo(start.x, start.y);
    ctx4.lineTo(endX, endY);
    ctx4.stroke();
  }

  // Tüm yıldızları çiz
  circles4.forEach(circle => {
    drawCircle4(circle);
  });
}

// Canvas'ı sıfırlama fonksiyonu
function resetCanvas4() {
  currentIndex4 = 0;
  isDrawing4 = false;
  lines4.length = 0;
  lastMouse4 = { x: 0, y: 0 };
  drawCanvas4();
}

// Fare tıklama olayı
canvas4.addEventListener("mousedown", (e) => {
  const rect = canvas4.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideCircle4(x, y, circles4[currentIndex4])) {
    clickSound4.play();
    isDrawing4 = true;
  }
});

// Fare hareket olayı
canvas4.addEventListener("mousemove", (e) => {
  const rect = canvas4.getBoundingClientRect();
  lastMouse4.x = e.clientX - rect.left;
  lastMouse4.y = e.clientY - rect.top;

  // Sonraki yıldıza ulaşıldığında
  if (
    isDrawing4 &&
    currentIndex4 < circles4.length - 1 &&
    isInsideCircle4(lastMouse4.x, lastMouse4.y, circles4[currentIndex4 + 1])
  ) {
    lines4.push({
      start: { x: circles4[currentIndex4].x, y: circles4[currentIndex4].y },
      end: { x: circles4[currentIndex4 + 1].x, y: circles4[currentIndex4 + 1].y }
    });

    currentIndex4++;
    clickSound4.play();

    // Tüm yıldızlar bağlandığında
    if (currentIndex4 === circles4.length - 1) {
      isDrawing4 = false;
      setTimeout(() => {
        gecisYap(canvas4, message2); // Oyunu bitir
      }, 400);
    } else {
      isDrawing4 = true;
    }
  }

  drawCanvas4();
});

// İlk çizimi yap
drawCanvas4();