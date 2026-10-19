// Smooth scroll to a section id (use "top" for page top)
export function goTo(e, id) {
  e.preventDefault();
  if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}