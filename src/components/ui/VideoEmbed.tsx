"use client";

interface VideoEmbedProps {
  src: string;
  title?: string;
}

export default function VideoEmbed({ src, title = "Video" }: VideoEmbedProps) {
  return (
    <div
      className="brutalist-card"
      style={{
        overflow: "hidden",
        position: "relative",
        aspectRatio: "16/9",
        width: "100%",
      }}
    >
      <iframe
        src={src}
        title={title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
