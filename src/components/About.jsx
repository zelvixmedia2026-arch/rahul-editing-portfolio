import { useEffect, useRef, useState } from "react";
import { goTo } from "../utils";

const FPS = 25, TIMELINE_SECONDS = 60;
const pad = (n) => String(n).padStart(2, "0");
function timecode(totalFrames) {
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS);
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, f].map(pad).join(":");
}

const reveal = (i) => ({ "--delay": `${i * 0.12}s` });

export default function About() {
  const sectionRef = useRef(null);
  const hovering = useRef(false);
  const [inView, setInView] = useState(false);
  const [tc, setTc] = useState("00:00:00:00");
  const [playhead, setPlayhead] = useState(0);

  // running timecode
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      if (hovering.current) return;
      setTc(timecode(Math.floor(((performance.now() - start) / 1000) * FPS)));
    }, 200);
    return () => clearInterval(id);
  }, []);

  // slide-in on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    setPlayhead(ratio * 100);
    setTc(timecode(Math.round(ratio * TIMELINE_SECONDS * FPS)));
  };

  return (
    <section
      ref={sectionRef}
      className={`about-page${inView ? " in-view" : ""}`}
      id="about"
    >
      <div className="about-frame">
        <div className="about-top reveal" style={reveal(0)}>
          <span className="about-rec"><i></i> REC</span>
          <span className="about-timecode">{tc}</span>
        </div>

        <div className="about-grid">
          <div className="about-text reveal" style={reveal(1)}>
            <h1>Great videos aren’t shot. They’re edited.</h1>
            <p className="about-lead">
              I’m a video editor. I make people stop scrolling and watch till the end.
            </p>
            <div className="about-stats">
              <div><strong>[400+]</strong><span>videos edited</span></div>
              <div><strong>On time</strong><span>delivered on the date I promise</span></div>
            </div>
            <blockquote className="about-quote">
              Hi, I’m Rahul. I notice a late cut the way some people notice a wrong note in a
              song. That attention to detail is what keeps your video smooth, sharp and easy to
              watch. Send me your footage and I’ll take care of the rest.
            </blockquote>
            <div>
              <a href="#contact" className="about-btn" onClick={(e) => goTo(e, "contact")}>
                Send your footage
              </a>
            </div>
          </div>
          <div className="about-photo reveal" style={reveal(2)}>
            <img src="/rahul.jpg" alt="Rahul, video editor" loading="lazy" />
          </div>
        </div>

        <div
          className="about-timeline reveal"
          style={reveal(3)}
          onPointerEnter={() => (hovering.current = true)}
          onPointerLeave={() => (hovering.current = false)}
          onPointerMove={onMove}
        >
          <div className="about-clip" style={{ flex: "28 1 0" }}>FOOTAGE</div>
          <div className="about-clip" style={{ flex: "19 1 0" }}>CUT</div>
          <div className="about-clip" style={{ flex: "24 1 0" }}>COLOR</div>
          <div className="about-clip" style={{ flex: "27 1 0" }}>EXPORT</div>
          <div className="about-playhead" style={{ left: `${playhead}%` }}></div>
        </div>
        <p className="about-hint reveal" style={reveal(4)}>
          Move your mouse over the timeline
        </p>
      </div>
    </section>
  );
}