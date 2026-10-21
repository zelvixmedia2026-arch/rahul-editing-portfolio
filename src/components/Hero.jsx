import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { videos } from "../data";
import { goTo } from "../utils";

const SHOWREEL = "/showreel.mp4";
const SHOWREEL_MOBILE = "/showreel-mobile.mp4";

function CountUp({ end, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1600, 1);
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end]);
  return <>{n}{suffix}</>;
}

/* decides which background video to use (if any) */
function useBackgroundMode() {
  const [mode, setMode] = useState("none"); // none | mobile | desktop

  useEffect(() => {
    const conn = navigator.connection || {};
    const slow = conn.saveData || /2g$/.test(conn.effectiveType || "");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slow || reduce) return; // stays "none": still image only

    const phone = window.matchMedia("(max-width: 700px)").matches;
    const start = () => setMode(phone ? "mobile" : "desktop");

    // wait until the page has loaded, so the text appears first
    if (document.readyState === "complete") {
      const t = setTimeout(start, 300);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return mode;
}

/* pop-up player with sound (full quality, loads only on click) */
function ShowreelModal({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = old;
    };
  }, [onClose]);

  return createPortal(
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="lb-stage pop" onClick={(e) => e.stopPropagation()}>
        <video ref={ref} src={SHOWREEL} controls loop playsInline />
      </div>
    </div>,
    document.body
  );
}

export default function Hero() {
  const section = useRef(null);
  const vid = useRef(null);
  const mode = useBackgroundMode();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const showVideo = mode !== "none" && !failed;
  const bgSrc = mode === "mobile" ? SHOWREEL_MOBILE : SHOWREEL;

  // play muted only while the hero is on screen and the pop-up is closed
  useEffect(() => {
    const el = vid.current;
    if (!el || !showVideo) return;
    if (open) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.2 }
    );
    io.observe(section.current);
    return () => io.disconnect();
  }, [open, showVideo]);

  return (
    <section className="work-hero" id="top" ref={section}>
      {/* still image first, video fades in over it */}
      <div className="hero-bg-poster"></div>

      {showVideo && (
        <video
          ref={vid}
          className={`hero-bg-video${ready ? " ready" : ""}`}
          src={bgSrc}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
      <div className="hero-bg-shade"></div>

      <div className="hero-content">
        <p className="hero-eyebrow hero-in" style={{ "--d": "0.1s" }}>
          <i className="live-dot"></i>
          VIDEO EDITOR 
        </p>

        <h1>
          <span className="line"><span className="line-in" style={{ "--d": "0.25s" }}>I TURN IDEAS</span></span>
          <span className="line"><span className="line-in accent" style={{ "--d": "0.45s" }}>INTO STORIES.</span></span>
        </h1>

        <p className="hero-description hero-in" style={{ "--d": "0.7s" }}>
          Crafting engaging edits, cinematic visuals and content that makes people stop scrolling.
        </p>

        <div className="hero-actions hero-in" style={{ "--d": "0.85s" }}>
          <a href="#work" className="hero-btn primary-btn" onClick={(e) => goTo(e, "work")}>
            EXPLORE MY WORK<span>→</span>
          </a>
          <a href="#contact" className="hero-btn secondary-btn" onClick={(e) => goTo(e, "contact")}>
            LET'S CONNECT<span>→</span>
          </a>
        </div>

        {/* <div className="hero-stats hero-in" style={{ "--d": "1s" }}>
          <div><h2><CountUp end={videos.length} /></h2><p>REELS SHOWCASED</p></div>
          <div><h2><CountUp end={400} suffix="+" /></h2><p>VIDEOS EDITED</p></div>
          <div><h2><CountUp end={3} suffix="+" /></h2><p>YEARS EXPERIENCE</p></div>
        </div> */}
      </div>

      <div className="hero-visual hero-in hero-play-wrap" style={{ "--d": "0.5s" }}>
        {/* <button
          type="button"
          className="film-center hero-play"
          onClick={() => setOpen(true)}
          aria-label="Watch showreel with sound"
        >
          <span className="film-play">▶</span>
          <span className="film-watch">WATCH SHOWREEL</span>
        </button> */}

        {/* <div className="film-tag">AVAILABLE FOR WORK</div> */}
      </div>

      {open && <ShowreelModal onClose={() => setOpen(false)} />}
    </section>
  );
}