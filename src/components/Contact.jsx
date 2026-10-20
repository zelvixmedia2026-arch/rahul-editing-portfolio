

import { useState } from "react";
import { WA, EMAIL, INSTAGRAM, YOUTUBE } from "../data";
import Reveal from "./Reveal";

export default function Contact() {
  const [form, setForm] = useState({ name: "", type: "YouTube video", message: "" });
  const [sent, setSent] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  };

  const text = `Hi Rahul, I'm ${form.name}.\nI need help with: ${form.type}\n\n${form.message}`;
  const emailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Video editing project: " + form.type
  )}&body=${encodeURIComponent(text)}`;

  const submit = (e) => {
    e.preventDefault();
    window.open(`${WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section className="contact-page" id="contact">
      <div className="contact-grid">
        <Reveal anim="left" className="contact-text">
          <p className="contact-eyebrow"><span>●</span> LET'S WORK TOGETHER</p>
          <h2>Send your footage. I'll take care of the rest<span>.</span></h2>
          <p className="contact-intro">
            Tell me what you're making and I'll get back to you on WhatsApp. No long forms, no
            waiting around.
          </p>
          <ul className="contact-methods">
            <li><span>WHATSAPP</span><a href={WA} target="_blank" rel="noopener noreferrer">Chat with Rahul ↗</a></li>
            <li><span>EMAIL</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            {INSTAGRAM && (
              <li><span>INSTAGRAM</span><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Follow my work ↗</a></li>
            )}
            {YOUTUBE && (
              <li><span>YOUTUBE</span><a href={YOUTUBE} target="_blank" rel="noopener noreferrer">Watch my edits ↗</a></li>
            )}
          </ul>
        </Reveal>

        <Reveal as="form" anim="right" delay={0.15} className="contact-form" onSubmit={submit}>
          <h3>Tell me about your project</h3>

          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" placeholder="e.g. Aarav"
                 value={form.name} onChange={change} required />

          <label htmlFor="type">What do you need?</label>
          <select id="type" name="type" value={form.type} onChange={change}>
            <option>YouTube video</option>
            <option>Reels / Shorts</option>
            <option>Ad or brand video</option>
            <option>Podcast / long-form</option>
            <option>Something else</option>
          </select>

          <label htmlFor="message">Your message</label>
          <textarea id="message" name="message" rows="5"
                    placeholder="Tell me about the video, the deadline, and add a link to your footage (Google Drive, WeTransfer...)"
                    value={form.message} onChange={change} required />

          <button type="submit" className="contact-btn">Send on WhatsApp <span>→</span></button>
          <a className="contact-email" href={emailHref}>or send by email instead</a>
          <p className="contact-sent" role="status" hidden={!sent}>
            WhatsApp should have opened with your message ready. Just press send there.
          </p>
        </Reveal>
      </div>
    </section>
  );
}