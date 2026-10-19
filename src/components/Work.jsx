import { videos } from "../data";

function embedSrc({ type, id }) {
  if (type === "instagram") return `https://www.instagram.com/reel/${id}/embed`;
  return `https://www.youtube.com/embed/${id}?rel=0`;
}

function VideoItem(video) {
  return (
    <div className={`vm-embed vm-${video.type}`}>
      <iframe
        src={embedSrc(video)}
        title={`${video.type} video ${video.id}`}
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

export default function Work() {
  return (
    <section className="work-showcase" id="work">
      <div className="showcase-heading">
        <div>
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2>Latest edits<span>.</span></h2>
        </div>
        <p className="showcase-description">
          A look at some of the videos I have edited recently. Scroll sideways to see more.
        </p>
      </div>
      <div className="vm-wrap">
        <div className="vm-track">
          <div className="vm-group">
            {videos.map((v) => <VideoItem key={v.id} {...v} />)}
          </div>
        </div>
      </div>
    </section>
  );
}