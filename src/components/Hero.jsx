import { useEffect, useState } from "react";
import { videos } from "../data";
import { goTo } from "../utils";

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

export default function Hero() {
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

      {/* ===== Cinematic film frame ===== */}
      <div className="hero-visual hero-in" style={{ "--d": "0.5s" }}>
        <span className="note note-a">Stories<br />Edit<br />Create<br />Repeat</span>
        <span className="note note-b">Good edits,<br />better stories.</span>

        <div className="film">
          <span className="film-edge">EDIT 400 &nbsp;•&nbsp; RAHUL</span>

          <div className="film-screen">
            {/* shown until /hero.jpg exists */}
            <div className="film-fallback">
              <div className="ff-sun"></div>
              <div className="ff-hill ff-hill-1"></div>
              <div className="ff-hill ff-hill-2"></div>
            </div>
            <div className="film-photo"></div>
            <div className="film-shade"></div>

            <div className="film-top"><span>SHOWREEL</span><span>HD</span></div>

            <a href="#work" className="film-center" onClick={(e) => goTo(e, "work")}>
              <span className="film-play">▶</span>
              <span className="film-watch">WATCH SHOWREEL</span>
            </a>

            <div className="film-bottom"><span>RAHUL EDITING</span><span>VIDEO EDITOR</span></div>
          </div>
        </div>

        <div className="film-tag">AVAILABLE FOR WORK</div>
      </div>
    </section>
  );
}