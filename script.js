/* ------------------- Init emailjs (put your public key here) ------------------- */
(function(){
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init("5lQ94D5TvQZn6KHn7"); // <<--- YOUR PUBLIC KEY (replace if needed)
      console.log('EmailJS initialized.');
    } else {
      console.warn('emailjs is not loaded yet. Make sure the emailjs script tag is included before this script.');
    }
  } catch (e) {
    console.error('Error initializing EmailJS:', e);
  }
})();

/* ------------------- Typed.js (unchanged) ------------------- */
if (window.Typed) {
 var typed = new Typed(".multiple-text", {
    strings: ["Web Developer", "Python Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true

  });
}

/* ------------------- DOM ready ------------------- */
document.addEventListener('DOMContentLoaded', function () {

  /* ------------- Menu toggle ------------- */
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.getElementById("navbar");
  menuIcon?.addEventListener("click", () => {
    navbar?.classList.toggle("active");
    if (menuIcon.classList.contains("bx-menu")) {
      menuIcon.classList.replace("bx-menu", "bx-x");
    } else {
      menuIcon.classList.replace("bx-x", "bx-menu");
    }
  });

  /* ------------- Scroll spy & sticky header ------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');

  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    sections.forEach(sec => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (top >= offset && top < offset + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        const selector = `header nav a[href*="${id}"]`;
        const activeLink = document.querySelector(selector);
        if (activeLink) activeLink.classList.add('active');
      }
    });

    // sticky header
    const header = document.querySelector('header');
    if (header) header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle after clicking nav (if using mobile)
    menuIcon?.classList.remove('bx-x');
    navbar?.classList.remove('active');
  });

  /* ------------- ScrollReveal (if loaded) ------------- */
  if (window.ScrollReveal) {
    ScrollReveal({
      reset: true,
      distance: '80px',
      duration: 2000,
      delay: 200
    });
    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
  }

  /* ================= EmailJS form handler with send-lock ================= */
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.querySelector(".send-btn");
  let isSending = false; // lock flag

  // Configure these IDs (replace with your actual IDs)
  const serviceID = "service_0wgoyng";        // your service id
  const templateID = "template_mwb1yai";      // admin notification template id
  const autoReplyTemplateID = null;           // set to "template_xxx" if you want to send auto-reply

  if (!contactForm) {
    console.warn('contactForm element not found on page.');
    return;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Prevent multiple submissions
    if (isSending) {
      console.log('Send blocked: already sending.');
      return;
    }

    // basic validation (HTML required will handle most)
    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert('Please fill Name, Email and Message.');
      return;
    }

    // prepare params
    const params = {
      name,
      email,
      mobile,
      subject,
      message,
      time: new Date().toLocaleString()
    };

    // UI lock
    isSending = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      // save original text to restore later
      submitBtn.dataset.orig = submitBtn.value || submitBtn.innerText || "Send Message";
      // show sending text
      if (submitBtn.tagName.toLowerCase() === "input") {
        submitBtn.value = "Sending…";
      } else {
        submitBtn.innerText = "Sending…";
      }
    }

    // safety fallback: re-enable after 60s to avoid permanent lock if something hangs
    const safetyTimer = setTimeout(() => {
      if (isSending) {
        console.warn('Safety timeout: re-enabling send button after 60s.');
        isSending = false;
        if (submitBtn) {
          if (submitBtn.tagName.toLowerCase() === "input") submitBtn.value = submitBtn.dataset.orig;
          else submitBtn.innerText = submitBtn.dataset.orig;
          submitBtn.disabled = false;
        }
      }
    }, 60000); // 60 seconds

    // ensure emailjs is ready
    if (typeof emailjs === 'undefined' || !emailjs.send) {
      clearTimeout(safetyTimer);
      console.error('emailjs library not loaded or emailjs.send missing.');
      alert('Email service is not ready. Please try again later.');
      isSending = false;
      if (submitBtn) {
        if (submitBtn.tagName.toLowerCase() === "input") submitBtn.value = submitBtn.dataset.orig;
        else submitBtn.innerText = submitBtn.dataset.orig;
        submitBtn.disabled = false;
      }
      return;
    }

    // 1) send admin notification
    emailjs.send(serviceID, templateID, params)
      .then(function (res) {
        console.log('Admin email sent:', res);

        // If you want an auto-reply to the sender, send it now (optional)
        if (autoReplyTemplateID) {
          return emailjs.send(serviceID, autoReplyTemplateID, params)
            .then(function (r2) {
              console.log('Auto-reply sent:', r2);
              return { success: true };
            })
            .catch(function (err2) {
              console.warn('Auto-reply failed (non-blocking):', err2);
              return { success: true }; // treat as non-fatal
            });
        }
        return { success: true };
      })
      .then(function () {
        clearTimeout(safetyTimer);
        isSending = false;

        // success UI
        alert('Message sent successfully!');
        contactForm.reset();

        if (submitBtn) {
          if (submitBtn.tagName.toLowerCase() === "input") submitBtn.value = submitBtn.dataset.orig;
          else submitBtn.innerText = submitBtn.dataset.orig;
          submitBtn.disabled = false;
        }
      })
      .catch(function (err) {
        clearTimeout(safetyTimer);
        console.error('EmailJS error:', err);
        isSending = false;

        alert('Failed to send message. Please try again later.');

        if (submitBtn) {
          if (submitBtn.tagName.toLowerCase() === "input") submitBtn.value = submitBtn.dataset.orig;
          else submitBtn.innerText = submitBtn.dataset.orig;
          submitBtn.disabled = false;
        }
      });

  }); // end submit handler

}); // end DOMContentLoaded