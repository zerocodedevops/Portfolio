import { useEffect, useRef, useState } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}

export const ParallaxImage = ({
  src,
  alt,
  className = "",
  strength = 0.1,
}: ParallaxImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setMotionAllowed(media.matches);
    const update = () => setMotionAllowed(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || !motionAllowed) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = image.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * strength;
        image.style.setProperty("--parallax-y", `${-offset}px`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      image.style.removeProperty("--parallax-y");
    };
  }, [motionAllowed, strength]);

  return <img ref={imageRef} src={src} alt={alt} className={className} />;
};
