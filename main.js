(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Intro ---------- */
  const intro = $("#intro");
  document.body.classList.add("locked");
  const finishIntro = () => {
    intro.classList.add("done");
    document.body.classList.remove("locked");
    requestAnimationFrame(() => document.body.classList.add("ready"));
  };
  window.addEventListener("load", () => setTimeout(finishIntro, reduceMotion ? 0 : 1500));
  // Yükleme takılırsa yine de siteyi aç
  setTimeout(() => { if (!intro.classList.contains("done")) finishIntro(); }, 4000);

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  const sectionLinks = $$("#navLinks a").map((a) => ({ a, el: $(a.getAttribute("href")) })).filter((x) => x.el);

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const counter = $("[data-count]", e.target);
      if (counter) countUp(counter);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const fmt = (v) => v.toFixed(decimals).replace(".", ",");
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const dur = 1800;
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Scrub text: kelimelere böl ---------- */
  const scrub = $("#scrubText");
  const highlight = new Set(["saniyeyi", "anında", "sizi", "size", "kusursuz"]);
  scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map((w) => {
    const key = w.toLocaleLowerCase("tr").replace(/[.,]/g, "");
    return `<span class="w${highlight.has(key) ? " hl" : ""}">${w}</span>`;
  }).join(" ");
  const words = $$(".w", scrub);

  /* ---------- Elements ---------- */
  const heroBg = $("#heroBg");
  const heroContent = $("#heroContent");
  const scrollHint = $("#scrollHint");
  const pin = $("#overview");
  const orbit = $("#orbit");
  const pinWords = $$(".pin-word");
  const pinBar = $("#pinBar");
  const hSection = $("#design");
  const hTrack = $("#hTrack");

  const sectionProgress = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  };

  /* ---------- Main scroll loop ---------- */
  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    nav.classList.toggle("scrolled", y > 10);

    // Hero parallax + fade
    if (y < vh * 1.2) {
      const p = clamp(y / vh);
      heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 + p * 0.12})`;
      heroContent.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 - p * 0.08})`;
      heroContent.style.opacity = String(1 - p * 1.3);
      scrollHint.style.opacity = String(1 - p * 4);
    }

    // Pinned words
    const pp = sectionProgress(pin);
    orbit.style.setProperty("--p", pp.toFixed(4));
    pinBar.style.transform = `scaleX(${pp})`;
    pinWords.forEach((w) => {
      const [a, b] = w.dataset.range.split(",").map(Number);
      const local = clamp((pp - a) / (b - a));
      // 0→0.3 giriş, 0.3→0.7 sabit, 0.7→1 çıkış
      let o, s, bl;
      if (local < 0.3) { const t = local / 0.3; o = t; s = 0.85 + 0.15 * t; bl = 20 * (1 - t); }
      else if (local < 0.7) { o = 1; s = 1; bl = 0; }
      else { const t = (local - 0.7) / 0.3; o = 1 - t; s = 1 + 0.25 * t; bl = 16 * t; }
      if (pp <= a || pp >= b) { o = 0; }
      if (b > 1 && pp >= 1) { o = 1; s = 1; bl = 0; }
      w.style.opacity = o.toFixed(3);
      w.style.transform = `scale(${s.toFixed(3)})`;
      w.style.filter = `blur(${bl.toFixed(1)}px)`;
    });

    // Scrub text
    const sr = scrub.getBoundingClientRect();
    const sp = clamp((vh * 0.85 - sr.top) / (sr.height + vh * 0.35));
    const lit = Math.round(sp * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));

    // Horizontal gallery
    const hp = sectionProgress(hSection);
    const maxShift = Math.max(0, hTrack.scrollWidth - window.innerWidth);
    hTrack.style.transform = `translate3d(${-hp * maxShift}px, 0, 0)`;

    // Active nav link
    let current = null;
    sectionLinks.forEach(({ a, el }) => {
      const r = el.getBoundingClientRect();
      if (r.top <= vh * 0.4 && r.bottom > vh * 0.4) current = a;
    });
    sectionLinks.forEach(({ a }) => a.classList.toggle("active", a === current));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ---------- Card tilt + glow ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Starfield ---------- */
  const canvas = $("#stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let heroVisible = true;
  function resizeStars() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.015 + 0.004,
      v: Math.random() * 0.15 + 0.03,
    }));
  }
  function drawStars() {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    for (const st of stars) {
      st.a += st.s;
      st.y -= st.v;
      if (st.y < 0) { st.y = height; st.x = Math.random() * width; }
      const alpha = 0.25 + Math.abs(Math.sin(st.a)) * 0.75;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 210, 255, ${alpha})`;
      ctx.fill();
    }
    if (heroVisible && !reduceMotion) requestAnimationFrame(drawStars);
  }
  resizeStars();
  drawStars();
  window.addEventListener("resize", resizeStars);
  new IntersectionObserver(([e]) => {
    const was = heroVisible;
    heroVisible = e.isIntersecting;
    if (heroVisible && !was) drawStars();
  }).observe($("#hero"));

  /* ---------- Live clock (Tasarım paneli) ---------- */
  const clockEl = $("#liveClock");
  const dateEl = $("#liveDate");
  const timeFmt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const dateFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  const tick = () => {
    const now = new Date();
    clockEl.textContent = timeFmt.format(now);
    dateEl.textContent = dateFmt.format(now);
  };
  tick();
  setInterval(tick, 1000);

  /* ---------- Download toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  $("#downloadBtn").addEventListener("click", (e) => {
    e.preventDefault();
    toast.textContent = "SaatOS çok yakında! İlk sürüm için takipte kalın.";
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  });

  $("#year").textContent = new Date().getFullYear();
})();
