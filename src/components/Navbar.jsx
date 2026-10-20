import { useEffect, useState } from "react";
import { goTo } from "../utils";

const links = [
  ["top", "Home"], ["work", "Work"], ["about", "About"],
  ["creator", "Creator"], ["contact", "Contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handle = (e, id) => {
    setOpen(false);
    goTo(e, id);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#top" className="navbar-logo" onClick={(e) => handle(e, "top")}>
          <span className="logo-typing">RAHUL EDITING</span>
          <span className="logo-dot"></span>
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
        <nav className={`nav-links${open ? " open" : ""}`}>
          {links.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link${active === id ? " active" : ""}`}
              style={{ "--link-index": i }}
              onClick={(e) => handle(e, id)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}