import { goTo } from "../utils";

export default function Hero() {
  return (
    <section className="work-hero" id="top">
      <div className="hero-content">
        <p className="hero-eyebrow">VIDEO EDITOR<span>● CONTENT CREATOR</span></p>
        <h1>I TURN IDEAS <span>INTO STORIES.</span></h1>
        <p className="hero-description">
          Crafting engaging edits, cinematic visuals and content that makes people stop scrolling
        </p>
        <div className="hero-actions">
          <a href="#work" className="hero-btn primary-btn" onClick={(e) => goTo(e, "work")}>
            EXPLORE MY WORK<span>→</span>
          </a>
          <a href="#contact" className="hero-btn secondary-btn" onClick={(e) => goTo(e, "contact")}>
            LET'S CONNECT<span>→</span>
          </a>
        </div>
        <div className="hero-stats">
          <div><h2>5</h2><p>PROJECTS TO SHOWCASE</p></div>
          <div><h2>CREATIVE</h2><p>EDITING APPROACH</p></div>
          <div><h2>3+</h2><p>YEARS EXPERIENCE</p></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="visual-frame">
          <div className="visual-top"><span>SHOWREEL</span><span>HD</span></div>
          <div className="visual-center">
            <div className="play-symbol">▶</div>
            <p>WATCH SHOWREEL</p>
          </div>
          <div className="visual-bottom"><span>RAHUL EDITING</span><span>VIDEO EDITOR</span></div>
        </div>
        <div className="visual-tag">AVAILABLE FOR WORK</div>
      </div>
    </section>
  );
}