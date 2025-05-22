// Canvas1 - Seviye 1 (2 yıldız bağlama)
const canvas1 = document.getElementById("canvas1");
const vh = window.innerHeight / 100;
canvas1.width = vh * 130;  // Canvas genişliği ayarı
canvas1.height = vh * 80;  // Canvas yüksekliği ayarı
const ctx1 = canvas1.getContext("2d");

// Yıldız resmi ve ses efekti
const starImg1 = new Image();
starImg1.src = "./images/star.png";
starImg1.onload = function() {
  drawCanvas1();
};
const clickSound1 = new Audio("./audio/click.wav");

// Yıldızların konumları ve özellikleri
const circle1A = { x: 400, y: canvas1.height / 2, radius: 30 }; // 1. yıldız
const circle1B = { x: 700, y: canvas1.height / 2, radius: 30 }; // 2. yıldız
let drawLine1 = false;      // Çizim yapılıp yapılmadığı
let lineLocked1 = false;    // Çizimin kilitlenip kilitlenmediği
let lastMouse1 = { x: 0, y: 0 }; // Son fare pozisyonu
const maxDistance1 = 300;   // Maksimum bağlantı mesafesi

// Yıldız çizme fonksiyonu
function drawCircle1(circle) {
  ctx1.beginPath();
  ctx1.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx1.fillStyle = "white";
  ctx1.fill();
  ctx1.strokeStyle = "black";
  ctx1.stroke();
  if (starImg1.complete) {
    ctx1.drawImage(starImg1, circle.x - 15, circle.y - 15, 30, 30);
  }
}

// Fare pozisyonunun yıldız içinde olup olmadığını kontrol eder
function isInsideCircle1(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Canvas'ı çizme fonksiyonu
function drawCanvas1() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  drawCircle1(circle1A);
  drawCircle1(circle1B);

  // Çizgi çizme veya kilitli çizgi gösterme
  if (drawLine1 || lineLocked1) {
    const startX = circle1A.x;
    const startY = circle1A.y;
    let endX = lineLocked1 ? circle1B.x : lastMouse1.x;
    let endY = lineLocked1 ? circle1B.y : lastMouse1.y;

    // Maksimum mesafe kontrolü
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (!lineLocked1 && distance > maxDistance1) {
      const angle = Math.atan2(dy, dx);
      endX = startX + Math.cos(angle) * maxDistance1;
      endY = startY + Math.sin(angle) * maxDistance1;
    }

    // Çizgi çizme
    ctx1.beginPath();
    ctx1.moveTo(startX, startY);
    ctx1.lineTo(endX, endY);
    ctx1.strokeStyle = "red";
    ctx1.lineWidth = 2;
    ctx1.stroke();
  }
}

// Canvas'ı sıfırlama fonksiyonu
function resetCanvas1() {
  drawLine1 = false;
  lineLocked1 = false;
  lastMouse1 = { x: 0, y: 0 };
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  drawCanvas1();
}

// Fare tıklama olayı
canvas1.addEventListener("mousedown", (e) => {
  const rect = canvas1.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideCircle1(x, y, circle1A)) {
    clickSound1.play();
    drawLine1 = true;
    lineLocked1 = false;
  }
});

// Fare hareket olayı
canvas1.addEventListener("mousemove", (e) => {
  const rect = canvas1.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  lastMouse1 = { x, y };

  // İkinci yıldıza ulaşıldığında
  if (drawLine1 && isInsideCircle1(x, y, circle1B) && !lineLocked1) {
    const dx = x - circle1A.x;
    const dy = y - circle1A.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= maxDistance1) {
      lineLocked1 = true;
      drawLine1 = false;
      clickSound1.play();
      setTimeout(() => {
        gecisYap(canvas1, canvas2);
      }, 400);
    }
  }

  drawCanvas1();
});

// İlk çizimi yap
drawCanvas1();