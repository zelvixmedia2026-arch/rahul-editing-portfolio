import { brands, creators } from "../data";
import { goTo } from "../utils";

const initials = (n) =>
  n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function Creator() {
  return (
    <section className="creator-page" id="creator">
      <div className="creator-header">
        <p className="creator-eyebrow"><span>●</span> BRANDS I'VE WORKED WITH</p>
        <h2 className="creator-title">Brands that trusted me with their videos<span>.</span></h2>
        <p className="creator-intro">
          Every logo below is a real project, from reels and ads to long-form videos.
        </p>
      </div>

      <div className="brand-grid">
        {brands.map(([name, file]) => (
          <figure className="brand-item" key={name}>
            <div className="brand-tile">
              <img src={`/thumbnails/${file}`} alt={`${name} logo`} loading="lazy" />
            </div>
            <figcaption>{name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="creator-header creators-block">
        <p className="creator-eyebrow"><span>●</span> CREATORS I'VE WORKED WITH</p>
        <h2 className="creator-title">Creators I edit for<span>.</span></h2>
      </div>

      <div className="creators-grid">
        {creators.map(([name, platform, handle, url, photo]) => (
          <a
            className="creator-card"
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
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
            <span className="creator-arrow">↗</span>
          </a>
        ))}
      </div>

      <div className="creator-cta">
        <h3>Want your brand here<span>?</span></h3>
        <p>Send me your footage and I'll take care of the rest.</p>
        <a href="#contact" className="creator-btn" onClick={(e) => goTo(e, "contact")}>
          Send your footage
        </a>
      </div>
    </section>
  );
}