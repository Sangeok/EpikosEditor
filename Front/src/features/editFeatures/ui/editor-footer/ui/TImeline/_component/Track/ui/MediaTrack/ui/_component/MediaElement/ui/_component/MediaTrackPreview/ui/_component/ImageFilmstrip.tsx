interface ImageFilmstripProps {
  url: string;
  isResizeDragging?: boolean;
}

export default function ImageFilmstrip({ url, isResizeDragging }: ImageFilmstripProps) {
  // degrade during resize: no repeat for lower repaint cost
  if (isResizeDragging) {
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${url})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          imageRendering: "auto",
        }}
      />
    );
  }
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%", // fit height, keep aspect
        backgroundPosition: "left center",
        imageRendering: "auto",
      }}
    />
  );
}
