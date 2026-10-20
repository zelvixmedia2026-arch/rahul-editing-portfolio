import { useEffect, useRef, useState } from "react";
import { videos } from "../data";
import Reveal from "./Reveal";

function Reel({ src }) {
  const box = useRef(null);
  const vid = useRef(null);
  const [near, setNear] = useState(false);
  const [ratio, setRatio] = useState(9 / 16); // placeholder until the video loads

  // start downloading only when close to the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px" }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // play only while visible
  useEffect(() => {
    const el = vid.current;
    if (!near || !el) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <div
      className={`vm-reel ${ratio >= 1 ? "is-wide" : "is-tall"}`}
      ref={box}
      style={{ aspectRatio: ratio }}
    >
      <video
        ref={vid}
        src={near ? src : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const { videoWidth: w, videoHeight: h } = e.currentTarget;
          if (w && h) setRatio(w / h);
        }}
        onClick={() => (vid.current.muted = !vid.current.muted)}
      />
    </div>
  );
}

export default function Work() {
  return (
    <section className="work-showcase" id="work">
      <div className="showcase-heading">
        <Reveal anim="left">
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2>Latest edits<span>.</span></h2>
        </Reveal>
        <Reveal anim="right" delay={0.15}>
          <p className="showcase-description">
            A look at some of the videos I have edited recently. Hover to pause, tap a video for sound.
          </p>
        </Reveal>
      </div>

      <div className="reel-marquee">
        <div className="reel-track">
          {[...videos, ...videos].map((v, i) => (
            <div className="reel-item" key={i} aria-hidden={i >= videos.length}>
              <Reel src={v.src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}