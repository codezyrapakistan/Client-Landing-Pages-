// ===== MENU TOGGLE =====
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const menuCloseIcon = document.getElementById("menu-close");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpening = !navLinks.classList.contains("show");
    navLinks.classList.toggle("show");
    navLinks.classList.toggle("animate-slide-in");
    if (menuCloseIcon) menuCloseIcon.classList.toggle("hidden", !isOpening);
    menuToggle.classList.toggle("hidden", isOpening);
  });

  if (menuCloseIcon) {
    menuCloseIcon.addEventListener("click", () => {
      navLinks.classList.remove("show", "animate-slide-in");
      menuCloseIcon.classList.add("hidden");
      menuToggle.classList.remove("hidden");
    });
  }

  document.querySelectorAll("#nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show", "animate-slide-in");
      if (menuCloseIcon) menuCloseIcon.classList.add("hidden");
      menuToggle.classList.remove("hidden");
    });
  });
}

// ===== PHONE INPUT (intlTelInput) =====
const inputs = document.querySelectorAll("#phone");
inputs.forEach((input) => {
  window.intlTelInput(input, {
    initialCountry: "in",
    preferredCountries: ["in", "us", "gb"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  });
});

// ===== POPUP CONTROL =====
const popup = document.getElementById("popup");
const openBtns = document.querySelectorAll(".open-popup");
const closeBtn = document.querySelector(".close");

setTimeout(() => {
  popup.style.display = "flex";
}, 5000);

openBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    popup.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

// ===== LEAD FORM SUBMISSION =====
document.querySelectorAll("form.lead-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector("input[name='name']")?.value.trim() || "";
    const phoneInput = form.querySelector("input[type='tel']");
    const iti = window.intlTelInputGlobals?.getInstance(phoneInput);
    const fullPhone = iti ? iti.getNumber() : (phoneInput?.value || "").trim();
    const email = form.querySelector("input[type='email']")?.value.trim() || "";
    const comments =
      form.querySelector("textarea[name='Comments']")?.value.trim() ||
      form.querySelector("input[name='Comments']")?.value.trim() ||
      "";

    if (!name || !fullPhone) {
      alert("⚠️ Please fill all required fields (Name & Phone).");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector("button[type='submit'], button");
    const originalText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;
    }

    // Prepare data
    const recaptchaResponse =
      form.querySelector(".g-recaptcha-response")?.value || "";

    const data = {
      name,
      email,
      phone: fullPhone,
      comments,
      projectName: "TVS Emerald Auralis",
      "g-recaptcha-response": recaptchaResponse,
    };

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyO5mH71iXk-L_QYUdCdvyiKEPiFVES8rqk9NOFIirNPRRA_9pN-X5ymNAe76YAIsyn/exec";

    console.log("Sending data to Google Apps Script:", data);

    // Send data
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    })
      .then(() => {
        console.log("✅ Data sent successfully.");

        // WhatsApp Backup
        const whatsappNumber = "9632870766";
        const message = `📋 *New Lead Captured!*\n\n👤 Name: ${name}\n📞 Phone: ${fullPhone}\n📧 Email: ${email}\n💬 Comments: ${comments}\n\n🏢 Landing Page: TVS Emerald Auralis`;

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;
        window.open(url, "_blank");

        // Google Conversion Tracking
        if (typeof gtag === "function") {
          gtag("event", "conversion", {
            send_to: "AW-17534941505/UNmeCP7ur6gbEMHyp6lB",
          });
        }

        form.reset();
        alert(
          "✅ Thank you! Your information has been saved. Our team will contact you shortly."
        );
      })
      .catch((error) => {
        console.error("❌ Error sending data:", error);

        // Fallback: Send to WhatsApp if Apps Script fails
        const whatsappNumber = "9632870766";
        const message = `📋 *New Lead Captured! (Backup)*\n\n👤 Name: ${name}\n📞 Phone: ${fullPhone}\n📧 Email: ${email}\n💬 Comments: ${comments}\n\n🏢 Landing Page: TVS Emerald Auralis`;

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;
        window.open(url, "_blank");

        if (typeof gtag === "function") {
          gtag("event", "conversion", {
            send_to: "AW-17534941505/UNmeCP7ur6gbEMHyp6lB",
          });
        }

        form.reset();
        alert(
          "⚠️ Thank you! Our team will contact you shortly. (Data backup sent via WhatsApp)"
        );
      })
      .finally(() => {
        // Reset button
        if (submitBtn && originalText !== null) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
  });
});

// ===== AUTO-SAVE FORM DATA (LocalStorage) =====
document.querySelectorAll("form.lead-form input").forEach((input) => {
  const savedValue = localStorage.getItem(input.name);
  if (savedValue) input.value = savedValue;

  input.addEventListener("input", () => {
    localStorage.setItem(input.name, input.value);
  });
});
