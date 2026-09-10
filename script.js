const CATON = {
  name: "caton",
  symbol: "caton",
  ca: "",
  x: "https://x.com/catonmeme",
  pumpSwapBase: "https://swap.pump.fun",
  dexBase: "https://dexscreener.com/solana",
};

function caValue() {
  return (CATON.ca || "").trim();
}

function buyUrl() {
  const ca = caValue();
  if (!ca) return CATON.pumpSwapBase;
  return `${CATON.pumpSwapBase}/?inputMint=So11111111111111111111111111111111111111112&outputMint=${ca}`;
}

function chartUrl() {
  const ca = caValue();
  return ca ? `${CATON.dexBase}/${ca}` : CATON.dexBase;
}

function embedUrl() {
  const ca = caValue();
  const pair = ca ? `${CATON.dexBase}/${ca}` : CATON.dexBase;
  return `${pair}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=light&theme=light&chartStyle=0&chartType=usd&interval=15`;
}

function wireLinks() {
  const buy = buyUrl();
  const chart = chartUrl();
  document.querySelectorAll("[data-link='buy']").forEach((el) => el.setAttribute("href", buy));
  document.querySelectorAll("[data-link='chart']").forEach((el) => el.setAttribute("href", chart));
  document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", CATON.x));

  const frame = document.getElementById("dex-frame");
  if (frame) frame.src = embedUrl();

  const caDisplay = document.getElementById("ca-display");
  if (caDisplay) caDisplay.textContent = caValue() || "Contract posts when the baton hits Solana";
}

function setupCopy() {
  const btn = document.getElementById("copy-ca");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const value = caValue();
    if (!value) {
      btn.textContent = "Soon";
      setTimeout(() => { btn.textContent = "Copy"; }, 1200);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      btn.classList.add("copied");
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy";
      }, 1400);
    } catch {
      btn.textContent = "Failed";
      setTimeout(() => { btn.textContent = "Copy"; }, 1200);
    }
  });
}

function setupNav() {
  const nav = document.getElementById("nav");
  const btn = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

function setupTicker() {
  const track = document.getElementById("ticker-track");
  if (!track) return;
  const bits = [
    "caton",
    "$caton",
    "grab the baton",
    "straight onto Solana",
    "cream coat, green grip",
    "no whistle, just run",
    "name caton",
    "symbol caton",
  ];
  const row = bits.map((bit) => `<span>${bit}</span><span aria-hidden="true">/</span>`).join("");
  track.innerHTML = row + row;
}

function setupSpotlight() {
  const spot = document.getElementById("spotlight");
  if (!spot) return;
  window.addEventListener("pointermove", (event) => {
    spot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  }, { passive: true });
}

function setupPaws() {
  const canvas = document.getElementById("paw-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const paws = [];
  const COUNT = 18;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < COUNT; i += 1) {
    paws.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      s: 0.45 + Math.random() * 0.7,
      a: 0.08 + Math.random() * 0.12,
      r: Math.random() * Math.PI,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.12 - Math.random() * 0.16,
    });
  }

  const drawPaw = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.scale(p.s, p.s);
    ctx.fillStyle = `rgba(47, 190, 74, ${p.a})`;
    const pads = [
      [0, 10, 7, 8],
      [-12, -6, 5, 6],
      [0, -12, 5, 6],
      [12, -6, 5, 6],
    ];
    pads.forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paws.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.0015;
      if (p.y < -40) {
        p.y = canvas.height + 40;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -40) p.x = canvas.width + 40;
      if (p.x > canvas.width + 40) p.x = -40;
      drawPaw(p);
    });
    requestAnimationFrame(tick);
  };
  tick();
}

wireLinks();
setupCopy();
setupNav();
setupTicker();
setupSpotlight();
setupPaws();
