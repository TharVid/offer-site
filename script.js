// Elements
const previewBtn = document.getElementById("previewBtn");
const nameInput = document.getElementById("nameInput");
const shareSection = document.getElementById("shareSection");
const orderSection = document.getElementById("orderSection");
const whatsappShare = document.getElementById("whatsappShare");
const shareCounter = document.getElementById("shareCounter");
const orderNowBtn = document.getElementById("orderNowBtn");

let shareClicks = parseInt(localStorage.getItem("shareClicks")) || 0;
let userName = localStorage.getItem("userName") || "";

const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
const tshirtImg = new Image();
tshirtImg.src = "assets/tshirt.png";

// Draw T-shirt + name
tshirtImg.onload = () => {
  ctx.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
  if (userName) drawName(userName);
};

function drawName(name) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
  ctx.font = "bold 28px Poppins";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(name, canvas.width / 2, 160);
}

// Step 1: Preview name
previewBtn.addEventListener("click", () => {
  userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name!");
    return;
  }
  localStorage.setItem("userName", userName);
  drawName(userName);
  shareSection.classList.remove("hidden");

  // ✅ Analytics event: preview generated
  gtag('event', 'preview_generated', {
    event_category: 'Engagement',
    event_label: 'Offer Page'
  });
});

// Step 2: WhatsApp share
whatsappShare.addEventListener("click", () => {
  shareClicks++;
  localStorage.setItem("shareClicks", shareClicks);
  const remaining = 5 - shareClicks;

  const message = `🎁 I'm trying to win a free GeekSwags T-Shirt! You can get ₹50 OFF too — try it now → https://offer.geekswags.in`;
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  // ✅ Analytics event: share click
  gtag('event', 'whatsapp_share', {
    event_category: 'Social',
    event_label: 'Offer Page',
    remaining_shares: remaining
  });

  if (remaining > 0) {
    shareCounter.textContent = `Shares Left: ${remaining}`;
  } else {
    shareSection.classList.add("hidden");
    orderSection.classList.remove("hidden");

    // ✅ Analytics event: coupon unlocked
    gtag('event', 'coupon_unlocked', {
      event_category: 'Conversion',
      event_label: 'Offer Page'
    });
  }
});

// Step 3: Redirect to main site
orderNowBtn.addEventListener("click", () => {
  // ✅ Analytics event: redirect clicked
  gtag('event', 'order_redirect', {
    event_category: 'Navigation',
    event_label: 'Offer Page'
  });

  const redirectURL = `https://geekswags.in/product/custom-name-t-shirt?name=${encodeURIComponent(userName.trim())}`;
  window.location.href = redirectURL;
});
