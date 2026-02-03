const cursorGlow = document.querySelector(".cursor-glow");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const splitElements = document.querySelectorAll("[data-split]");
const revealElements = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxTitle = document.querySelector(".lightbox-caption h3");
const lightboxDesc = document.querySelector(".lightbox-caption p");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const sliderInput = document.querySelector(".slider-input");
const afterImage = document.querySelector(".after-image");
const sliderHandle = document.querySelector(".slider-handle");
const magneticButtons = document.querySelectorAll(".magnetic");
const timelineSteps = document.querySelectorAll(".timeline-step");
const countUps = document.querySelectorAll(".count-up");
let currentGalleryIndex = 0;

const handleCursor = (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
};

document.addEventListener("mousemove", handleCursor);

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  parallaxItems.forEach((item, index) => {
    const movement = (clientX + clientY) / 250 + index * 2;
    item.style.transform = `translate3d(${movement}px, ${-movement}px, 0)`;
  });
});

const splitText = (element) => {
  const words = element.textContent.split(" ");
  element.textContent = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "split-word";
    span.textContent = `${word}${index < words.length - 1 ? " " : ""}`;
    element.appendChild(span);
  });
};

splitElements.forEach(splitText);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const splitObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll(".split-word");
        words.forEach((word, index) => {
          setTimeout(() => {
            word.classList.add("visible");
          }, index * 80);
        });
      }
    });
  },
  { threshold: 0.4 }
);

splitElements.forEach((element) => splitObserver.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      const matches = filter === "all" || item.dataset.category === filter;
      item.style.display = matches ? "block" : "none";
      item.classList.toggle("visible", matches);
    });
  });
});

const openLightbox = (index) => {
  const item = galleryItems[index];
  if (!item) return;
  currentGalleryIndex = index;
  lightboxImage.src = item.dataset.full;
  lightboxTitle.textContent = item.dataset.title;
  lightboxDesc.textContent = item.dataset.description;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
};

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", () => {
  const newIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(newIndex);
});

lightboxNext.addEventListener("click", () => {
  const newIndex = (currentGalleryIndex + 1) % galleryItems.length;
  openLightbox(newIndex);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

const updateSlider = (value) => {
  const percentage = `${value}%`;
  afterImage.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  sliderHandle.style.left = percentage;
};

if (sliderInput) {
  sliderInput.addEventListener("input", (event) => {
    updateSlider(event.target.value);
  });
}

const magneticStrength = 30;

magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x / magneticStrength}px, ${y / magneticStrength}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("active", entry.isIntersecting);
    });
  },
  { threshold: 0.5 }
);

timelineSteps.forEach((step) => timelineObserver.observe(step));

const countUpObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.target);
      let current = 0;
      const increment = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = current;
      }, 40);
      countUpObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

countUps.forEach((item) => countUpObserver.observe(item));

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.body.style.backgroundPosition = `0px ${scrollY * 0.2}px`;
});

const form = document.querySelector(".quote-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    alert("Thanks! We’ll reach out with a premium quote shortly.");
  });
}
