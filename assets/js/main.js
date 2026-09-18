(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  function cssMs(name, fallback) {
    var raw = getComputedStyle(root).getPropertyValue(name).trim();
    if (!raw) return fallback;
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return /ms$/.test(raw) ? n : n * 1000;
  }

  function restartAnimation(el) {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-reveal-delay");
          if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  function initHeroCopy() {
    var items = document.querySelectorAll("[data-hero-copy] [data-stagger]");
    if (!items.length) return;

    if (reduceMotion.matches) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    items.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", 120 + i * 110 + "ms");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        items.forEach(function (el) {
          el.classList.add("is-in");
        });
      });
    });
  }

  function initHeroSlider() {
    var wrap = document.getElementById("heroSlides");
    if (!wrap) return;

    var slides = Array.prototype.slice.call(wrap.querySelectorAll(".hero__slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero__dot"));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var visible = true;
    var hovered = false;
    var duration = cssMs("--hero-autoplay", 6000);

    function paint(next) {
      index = (next + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        var img = slide.querySelector("img");
        if (img && i === index && !reduceMotion.matches) restartAnimation(img);
      });

      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
        var fill = dot.querySelector(".hero__dot-fill");
        if (fill && active && !reduceMotion.matches) restartAnimation(fill);
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (reduceMotion.matches || !visible || hovered) return;
      timer = setTimeout(function () {
        paint(index + 1);
        schedule();
      }, duration);
    }

    function setPaused(state) {
      dots.forEach(function (dot) {
        dot.classList.toggle("is-paused", state && dot.classList.contains("is-active"));
      });
      if (state) clearTimeout(timer);
      else schedule();
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        paint(parseInt(dot.getAttribute("data-goto"), 10) || 0);
        schedule();
      });
    });
    
    var media = document.querySelector(".hero__media");
    if (media) {
      media.addEventListener("mouseenter", function () {
        hovered = true;
        setPaused(true);
      });
      media.addEventListener("mouseleave", function () {
        hovered = false;
        setPaused(false);
      });
    }

    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      setPaused(!visible);
    });

    if ("IntersectionObserver" in window && media) {
      new IntersectionObserver(
        function (entries) {
          visible = entries[0].isIntersecting && !document.hidden;
          setPaused(!visible);
        },
        { threshold: 0.12 }
      ).observe(media);
    }

    reduceMotion.addEventListener
      ? reduceMotion.addEventListener("change", function () {
          clearTimeout(timer);
          schedule();
        })
      : null;

    paint(0);
    schedule();
  }


  function buildMarquee(track) {
    var original = track.getAttribute("data-marquee-html");
    if (original === null) {
      original = track.innerHTML;
      track.setAttribute("data-marquee-html", original);
    } else {
      track.innerHTML = original;
    }

    var unit = track.firstElementChild;
    if (!unit) return;

    var guard = 0;
    while (track.scrollWidth < window.innerWidth && guard < 12) {
      track.appendChild(cloneDecorative(unit));
      guard++;
    }

    var half = Array.prototype.slice.call(track.children);
    var frag = document.createDocumentFragment();
    half.forEach(function (node) {
      frag.appendChild(cloneDecorative(node));
    });
    track.appendChild(frag);
  }

  function cloneDecorative(node) {
    var clone = node.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(clone.querySelectorAll("a, button"), function (el) {
      el.setAttribute("tabindex", "-1");
    });
    return clone;
  }

  function initMarquees() {
    var tracks = [
      document.getElementById("tickerTrack"),
      document.getElementById("brandTrack")
    ].filter(Boolean);
    if (!tracks.length) return;

    function build() {
      tracks.forEach(buildMarquee);
    }

    build();
    window.addEventListener("resize", debounce(build, 200));
  }

  onReady(function () {
    initReveal();
    initHeroCopy();
    initHeroSlider();
    initMarquees();
  });
})();
