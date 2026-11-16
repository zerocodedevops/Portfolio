/**
 * Zero Plague — Motor de Experiencia Inmersiva 3D + GSAP (Fase 5.3B+)
 */

function initHero3D(prefersReduced) {
  const canvas = document.getElementById("hero-particles");
  if (!canvas || prefersReduced || navigator.connection?.saveData) return;

  if (typeof THREE !== "undefined") {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      // Campo volumétrico de partículas bio-tecnológicas
      const count = window.innerWidth < 768 ? 450 : 1100;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 14;
        positions[i + 1] = (Math.random() - 0.5) * 9;
        positions[i + 2] = (Math.random() - 0.5) * 8;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.045,
        transparent: true,
        opacity: 0.78
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let mouseX = 0;
      let mouseY = 0;
      window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
      }, { passive: true });

      window.addEventListener("resize", () => {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      }, { passive: true });

      const animate = () => {
        points.rotation.y += 0.0009;
        points.rotation.x += 0.0004;
        camera.position.x += (mouseX - camera.position.x) * 0.04;
        camera.position.y += (-mouseY - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      };
      window.requestAnimationFrame(animate);
      return;
    } catch {
      // Fallback silencioso a Canvas 2D si WebGL falla
    }
  }
}

function initCursorEffects(isFinePointer, prefersReduced) {
  if (!isFinePointer || prefersReduced) return;

  const heroSection = document.getElementById("hero-section");
  const spotlight = document.getElementById("hero-spotlight");
  const parallaxLayers = document.querySelectorAll("[data-parallax-depth]");

  if (heroSection && (spotlight || parallaxLayers.length)) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (spotlight) {
        spotlight.style.background = `radial-gradient(680px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(16, 185, 129, 0.22), transparent 65%)`;
      }

      parallaxLayers.forEach((layer) => {
        const depth = Number.parseFloat(layer.dataset.parallaxDepth || "0.02");
        layer.style.transform = `translate3d(${nx * depth * 140}px, ${ny * depth * 140}px, 0)`;
      });
    });
  }

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate3d(0, 0, 0)";
    });
  });

  document.querySelectorAll("[data-tilt-img]").forEach((wrap) => {
    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
      wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    wrap.addEventListener("mouseleave", () => {
      wrap.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

function initServiceShowcase() {
  const serviceTriggers = document.querySelectorAll("[data-service-img]");
  const servicePreview = document.getElementById("service-showcase-img");
  const serviceCaption = document.getElementById("service-showcase-caption");
  if (!serviceTriggers.length || !servicePreview) return;

  serviceTriggers.forEach((item) => {
    const activate = () => {
      const src = item.dataset.serviceImg;
      const cap = item.dataset.serviceCaption || "";
      if (src && servicePreview.getAttribute("src") !== src) {
        servicePreview.setAttribute("src", src);
        if (serviceCaption) serviceCaption.textContent = cap;
      }
      serviceTriggers.forEach((el) => el.classList.remove("border-bio-emerald", "bg-forest/80"));
      item.classList.add("border-bio-emerald", "bg-forest/80");
    };
    item.addEventListener("mouseenter", activate);
    item.addEventListener("focusin", activate);
  });
}

function initScrollAnimations(prefersReduced) {
  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const progressBar = document.createElement("div");
  progressBar.id = "gsap-progress-bar";
  progressBar.style.cssText =
    "position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#10B981,#34D399);width:0%;z-index:9999;pointer-events:none;";
  document.body.appendChild(progressBar);

  gsap.to(progressBar, {
    width: "100%",
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.25 }
  });

  gsap.from("[data-hero-stagger]", {
    y: 34,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    clearProps: "transform"
  });

  gsap.utils.toArray("[data-mask-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(14% 0% 14% 0%)", opacity: 0.4 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      }
    );
  });

  gsap.utils.toArray("[data-cinematic-zoom]").forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.16 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.5 }
      }
    );
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  const methodLine = document.getElementById("methodology-progress-line");
  const methodSection = document.getElementById("pilares");
  if (methodLine && methodSection) {
    gsap.fromTo(
      methodLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: { trigger: methodSection, start: "top 65%", end: "bottom 75%", scrub: 0.4 }
      }
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.__zpMotionInit) return;
  window.__zpMotionInit = true;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  initHero3D(prefersReduced);
  initCursorEffects(isFinePointer, prefersReduced);
  initServiceShowcase();
  initScrollAnimations(prefersReduced);
});
