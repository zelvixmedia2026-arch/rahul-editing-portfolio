import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { videos } from "../data";
import Reveal from "./Reveal";

/* ---------- a single card: shows a still frame, never plays ---------- */
function Card({ src, onOpen }) {
  const box = useRef(null);
  const [near, setNear] = useState(false);
  const [ratio, setRatio] = useState(9 / 16);

  // load the first frame only when close to the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="rc"
      style={{ aspectRatio: ratio }}
      role="button"
      tabIndex={0}
      aria-label="Play video"
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
    >
      <video
        src={near ? `${src}#t=0.1` : undefined}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const { videoWidth: w, videoHeight: h } = e.currentTarget;
          if (w && h) setRatio(w / h);
        }}
      />
      <span className="rc-play">▶</span>
    </div>
  );
}

/* ---------- pop-up player ---------- */
function Lightbox({ index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = old;
    };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      <button
        className="lb-nav lb-prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous video"
      >‹</button>

      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        <video
          key={index}
          src={videos[index].src}
          autoPlay
          controls
          loop
          playsInline
        />
        <p className="lb-count">
          {String(index + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
        </p>
      </div>

      <button
        className="lb-nav lb-next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next video"
      >›</button>
    </div>,
    document.body
  );
}

/* ---------- section ---------- */
export default function Work() {
  const scroller = useRef(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const [open, setOpen] = useState(null); // index of the video in the pop-up

  const slide = (dir) => {
    const el = scroller.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // mouse drag-to-scroll (touch uses normal swiping)
  const onDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, moved: false, x: e.clientX, left: scroller.current.scrollLeft };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) d.moved = true;
    scroller.current.scrollLeft = d.left - dx;
  };
  const onUp = () => (drag.current.down = false);

  // a drag must not count as a click
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  const close = () => setOpen(null);
  const prev = () => setOpen((i) => (i === null ? i : (i - 1 + videos.length) % videos.length));
  const next = () => setOpen((i) => (i === null ? i : (i + 1) % videos.length));

  return (
    <section className="work-showcase" id="work">
      <div className="showcase-heading">
        <Reveal anim="left">
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2>Latest edits<span>.</span></h2>
        </Reveal>
        <Reveal anim="right" delay={0.15}>
          <p className="showcase-description">
            A look at some of the videos I have edited recently. Slide to browse and tap a video to watch it.
          </p>
        </Reveal>
      </div>

      <div className="reel-slider">
        <button className="rs-arrow rs-left" onClick={() => slide(-1)} aria-label="Slide left">‹</button>
        <button className="rs-arrow rs-right" onClick={() => slide(1)} aria-label="Slide right">›</button>

        <div
          className="reel-scroller"
          ref={scroller}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onClickCapture={onClickCapture}
        >
          {videos.map((v, i) => (
            <Card key={v.src} src={v.src} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      {open !== null && <Lightbox index={open} onClose={close} onPrev={prev} onNext={next} />}
    </section>
  );
}