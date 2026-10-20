import { useEffect, useRef, useState } from "react";
import { videos } from "../data";
import Reveal from "./Reveal";

function Reel({ src }) {
  const box = useRef(null);
  const vid = useRef(null);
  const [near, setNear] = useState(false);

  // 1) start loading only when close to the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // 2) play only while visible, pause when scrolled away
  useEffect(() => {
    const el = vid.current;
    if (!near || !el) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const toggleSound = () => {
    vid.current.muted = !vid.current.muted;
  };

  return (
    <div className="vm-reel" ref={box}>
      <video
        ref={vid}
        src={near ? src : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggleSound}
      />
    </div>
  );
}

export default function Work() {
  return (
    <section className="work-showcase" id="work">
      <div className="showcase-heading">
        <Reveal anim="left">
          <p className="section-eyebrow"></p>
          <h2>Featured Projects<span>.</span></h2>
        </Reveal>
        <Reveal anim="right" delay={0.15}>
          <p className="showcase-description">
            A look at some of the videos I have edited recently. Scroll sideways to see more.
          </p>
        </Reveal>
      </div>

      <div className="vm-wrap">
        <div className="vm-track">
          <div className="vm-group">
            {videos.map((v, i) => (
              <Reveal key={i} anim="zoom" delay={Math.min(i, 5) * 0.1} className="vm-slot">
                <Reel src={v.src} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}