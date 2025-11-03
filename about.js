
document.addEventListener("DOMContentLoaded", () => {
  // Анімація появи при скролі
  const sections = document.querySelectorAll("section, h1");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
});

