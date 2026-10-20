import { WA, EMAIL, INSTAGRAM, YOUTUBE } from "../data";
import { goTo } from "../utils";
import Reveal from "./Reveal";

const links = [
  ["top", "Home"], ["work", "Work"], ["about", "About"],
  ["creator", "Creator"], ["contact", "Contact"],
];

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal anim="up" className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#top" className="footer-logo" onClick={(e) => goTo(e, "top")}>
              RAHUL EDITING<span>.</span>
            </a>
            <p>
              Video editing for creators and brands. Clean cuts, strong storytelling, delivered
              on the date I promise.
            </p>
          </div>

          <div className="footer-col">
            <h4>QUICK LINKS</h4>
            <ul>
              {links.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => goTo(e, id)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>GET IN TOUCH</h4>
            <ul>
              <li><a href={WA} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              {INSTAGRAM && <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
              {YOUTUBE && <li><a href={YOUTUBE} target="_blank" rel="noopener noreferrer">YouTube</a></li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rahul Editing. All rights reserved.</p>
          <p className="footer-credit">
            Designed &amp; developed by{" "}
            <a href="https://zelvixmedia.online" target="_blank" rel="noopener noreferrer">ZELVIX MEDIA</a>
          </p>
          <button type="button" className="footer-top-btn"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top ↑
          </button>
        </div>
      </Reveal>
    </footer>
  );
}