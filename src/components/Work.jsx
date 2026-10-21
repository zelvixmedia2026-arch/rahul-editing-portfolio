import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { videos } from "../data";
import Reveal from "./Reveal";

/* ---------- card: plays muted, only while visible in the slider ---------- */
function Card({ src, index, scrollerRef, ratios, paused, onOpen }) {
  const box = useRef(null);
  const vid = useRef(null);
  const [near, setNear] = useState(false);
  const [ratio, setRatio] = useState(9 / 16);
  const [loading, setLoading] = useState(true);

  // start downloading only when close to the screen
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

  // play muted only while inside the slider's visible area
  useEffect(() => {
    const el = vid.current;
    if (!near || !el) return;
    if (paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { root: scrollerRef.current, threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, paused, scrollerRef]);

  const open = () => onOpen(box.current.getBoundingClientRect());

  return (
    <div
      ref={box}
      className={`rc${loading ? " is-loading" : ""}`}
      style={{ aspectRatio: ratio }}
      role="button"
      tabIndex={0}
      aria-label="Play video with sound"
      aria-busy={loading}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
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
          if (w && h) {
            setRatio(w / h);
            ratios.current[index] = w / h;
          }
        }}
        onLoadedData={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onError={() => setLoading(false)}
      />

      {/* loading animation */}
      <div className="rc-loader" aria-hidden="true">
        <span className="rc-spinner"></span>
      </div>

      <span className="rc-play">▶</span>
    </div>
  );
}

/* ---------- pop-up: grows out of the clicked card, then plays with sound ---------- */
function Lightbox({ index, origin, ratios, onClose, onPrev, onNext }) {
  const stage = useRef(null);
  const vref = useRef(null);
  const first = useRef(true);
  const [ratio, setRatio] = useState(ratios.current[index] || 9 / 16);

  const play = () => {
    const v = vref.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true; // browser refused sound: play muted rather than stay paused
      v.play().catch(() => {});
    });
  };

  // zoom from the card's position into the centre, then start with sound
  useLayoutEffect(() => {
    const el = stage.current;
    const r = el.getBoundingClientRect();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduce) {
      play();
      return;
    }
    const dx = origin.left + origin.width / 2 - (r.left + r.width / 2);
    const dy = origin.top + origin.height / 2 - (r.top + r.height / 2);
    const s = Math.max(origin.width / r.width, 0.15);
    const anim = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.5 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ],
      { duration: 550, easing: "cubic-bezier(0.2, 0.9, 0.2, 1)" }
    );
    anim.onfinish = play;
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // moving to another video with the arrows: play right away
  useEffect(() => {
    setRatio(ratios.current[index] || 9 / 16);
    if (first.current) {
      first.current = false;
      return;
    }
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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

      <div className="lb-stage" ref={stage} onClick={(e) => e.stopPropagation()}>
        <video
          ref={vref}
          key={index}
          src={videos[index].src}
          style={{ aspectRatio: ratio, height: `min(80vh, calc(92vw / ${ratio}))` }}
          controls
          loop
          playsInline
          onLoadedMetadata={(e) => {
            const { videoWidth: w, videoHeight: h } = e.currentTarget;
            if (w && h) {
              ratios.current[index] = w / h;
              setRatio(w / h);
            }
          }}
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
  const ratios = useRef({});
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const [open, setOpen] = useState(null); // { i, rect }

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
  const prev = () => setOpen((o) => o && { ...o, i: (o.i - 1 + videos.length) % videos.length });
  const next = () => setOpen((o) => o && { ...o, i: (o.i + 1) % videos.length });

  return (
    <section className="work-showcase" id="work">
      <div className="showcase-heading">
        <Reveal anim="left">
          {/* <p className="section-eyebrow">SELECTED WORK</p> */}
          <h2>Featured Project <span>.</span></h2>
        </Reveal>
        <Reveal anim="right" delay={0.15}>
          <p className="showcase-description">
            A look at some of the videos I have edited recently. Slide to browse and click a video to watch it with sound.
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
            <Card
              key={v.src}
              src={v.src}
              index={i}
              scrollerRef={scroller}
              ratios={ratios}
              paused={open !== null}
              onOpen={(rect) => setOpen({ i, rect })}
            />
          ))}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          index={open.i}
          origin={open.rect}
          ratios={ratios}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}