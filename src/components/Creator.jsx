import { brands, creators } from "../data";
import { goTo } from "../utils";
import Reveal from "./Reveal";

const initials = (n) =>
  n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function Creator() {
  return (
    <section className="creator-page" id="creator">
      <Reveal anim="up" className="creator-header">
        <p className="creator-eyebrow"><span>●</span> BRANDS I'VE WORKED WITH</p>
        <h2 className="creator-title">Brands that trusted me with their videos<span>.</span></h2>
        <p className="creator-intro">
          Every logo below is a real project, from reels and ads to long-form videos.
        </p>
      </Reveal>

      <Reveal anim="fade" delay={0.1}>
        <div className="marquee">
          <div className="marquee-track">
            {[...brands, ...brands].map(([name, file], i) => (
              <figure
                className="brand-item"
                key={`${name}-${i}`}
                aria-hidden={i >= brands.length}
              >
                <div className="brand-tile">
                  <img src={`/thumbnails/${file}`} alt={`${name} logo`} />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal anim="up" className="creator-header creators-block">
        <p className="creator-eyebrow"><span>●</span> CREATORS I'VE WORKED WITH</p>
        <h2 className="creator-title">Creators I edit for<span>.</span></h2>
      </Reveal>

      <div className="creators-grid">
        {creators.map(([name, platform, handle, photo], i) => (
          <Reveal
            key={name}
            anim={i % 2 === 0 ? "left" : "right"}
            delay={Math.floor(i / 2) * 0.12}
          >
            <div className="creator-card">
              <div className="creator-avatar">
                <span>{initials(name)}</span>
                <img
                  src={`/creatorimages/${encodeURIComponent(photo)}`}
                  alt={name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <div className="creator-info">
                <h3>{name}</h3>
                <p>{platform} · {handle}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal anim="zoom" className="creator-cta">
        <h3>Want your brand here<span>?</span></h3>
        <p>Send me your footage and I'll take care of the rest.</p>
        <a href="#contact" className="creator-btn" onClick={(e) => goTo(e, "contact")}>
          Send your footage
        </a>
      </Reveal>
    </section>
  );
}