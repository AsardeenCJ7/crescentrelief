const CampaignVideo = ({ videoUrl, title }) => {
  if (!videoUrl) return null;

  return (
    <div className="mb-10 overflow-hidden rounded-2xl bg-neutral-900 aspect-video shadow-card border border-border-light relative group">
      <iframe
        src={videoUrl}
        title={`${title} Video`}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default CampaignVideo;
