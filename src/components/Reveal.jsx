import { useEffect, useRef, useState } from "react";

export default function Reveal({
  as: Tag = "div",
  anim = "up",       // up | left | right | zoom | fade
  delay = 0,         // seconds
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rv rv-${anim}${shown ? " rv-in" : ""} ${className}`.trim()}
      style={{ "--rv-delay": `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}