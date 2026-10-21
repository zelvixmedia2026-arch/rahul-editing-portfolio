import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { videos } from "../data";
import { goTo } from "../utils";

const SHOWREEL = "/showreel.mp4";

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

/* pop-up player with sound */
function ShowreelModal({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true; // browser refused sound: play muted instead of staying paused
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
  const screen = useRef(null);
  const vid = useRef(null);
  const [open, setOpen] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  // play muted only while the hero is on screen and the pop-up is closed
  useEffect(() => {
    const el = vid.current;
    if (!el || !hasVideo) return;
    if (open) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.3 }
    );
    io.observe(screen.current);
    return () => io.disconnect();
  }, [open, hasVideo]);

  return (
    <section className="work-hero" id="top">
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

      {/* ===== Cinematic film frame with video ===== */}
      <div className="hero-visual hero-in" style={{ "--d": "0.5s" }}>
        <span className="note note-a">Stories<br />Edit<br />Create<br />Repeat</span>
        <span className="note note-b">Good edits,<br />better stories.</span>

        <div className="film">
          <span className="film-edge">EDIT 400 &nbsp;•&nbsp; RAHUL</span>

          <div className="film-screen" ref={screen}>
            {/* shown until the video or hero.jpg is available */}
            <div className="film-fallback">
              <div className="ff-sun"></div>
              <div className="ff-hill ff-hill-1"></div>
              <div className="ff-hill ff-hill-2"></div>
            </div>
            <div className="film-photo"></div>

            {hasVideo && (
              <video
                ref={vid}
                className="film-video"
                src={SHOWREEL}
                poster="/hero.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setHasVideo(false)}
              />
            )}

            <div className="film-shade"></div>

            <div className="film-top"><span>SHOWREEL</span><span>HD</span></div>

            {/* <button
              type="button"
              className="film-center"
              onClick={() => setOpen(true)}
              aria-label="Watch showreel with sound"
            >
              <span className="film-play">▶</span>
              <span className="film-watch">WATCH SHOWREEL</span>
            </button> */}

            <div className="film-bottom"><span>RAHUL EDITING</span><span>VIDEO EDITOR</span></div>
          </div>
        </div>

        {/* <div className="film-tag">AVAILABLE FOR WORK</div> */}
      </div>

      {open && <ShowreelModal onClose={() => setOpen(false)} />}
    </section>
  );
}