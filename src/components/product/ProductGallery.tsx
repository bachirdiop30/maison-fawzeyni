// Les photos d'un modèle.
// - Téléphone : une rangée qu'on fait glisser du doigt, avec un compteur « 1 / 3 ».
// - Ordinateur : les photos en grand, les unes sous les autres.
// - Un clic sur une photo l'ouvre en plein écran (on peut y glisser d'une photo à l'autre).
"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Photo = { url: string; alt: string };

export function ProductGallery({ name, images }: { name: string; images: Photo[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewerRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0); // photo visible sur téléphone
  const [viewerIndex, setViewerIndex] = useState(0); // photo visible en plein écran

  if (images.length === 0) {
    return <div className="aspect-[4/5] bg-ivoire" />;
  }

  // Ouvre le plein écran directement sur la photo cliquée.
  function openViewer(index: number) {
    dialogRef.current?.showModal();
    setViewerIndex(index);
    const viewer = viewerRef.current;
    if (viewer) viewer.scrollTo({ left: index * viewer.clientWidth, behavior: "instant" });
  }

  // Fait défiler le plein écran d'une photo (direction : -1 ou +1).
  function step(direction: number) {
    const viewer = viewerRef.current;
    if (viewer) viewer.scrollBy({ left: direction * viewer.clientWidth, behavior: "smooth" });
  }

  // Quelle photo est à l'écran ? On le déduit de la position de défilement.
  function indexFromScroll(element: HTMLElement) {
    return Math.round(element.scrollLeft / element.clientWidth);
  }

  return (
    <div className="relative">
      <ul
        aria-label={`Photos de ${name}`}
        onScroll={(event) => setCurrent(indexFromScroll(event.currentTarget))}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:grid lg:gap-3 lg:overflow-visible"
      >
        {images.map((image, index) => (
          <li key={image.url} className="w-full shrink-0 snap-center">
            <button
              type="button"
              onClick={() => openViewer(index)}
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-ivoire focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bleu"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover"
              />
              <span className="sr-only">Agrandir la photo</span>
            </button>
          </li>
        ))}
      </ul>

      {images.length > 1 && (
        <p
          aria-hidden
          className="absolute right-4 bottom-4 bg-white/85 px-2.5 py-1 text-xs tracking-widest text-encre tabular-nums lg:hidden"
        >
          {current + 1} / {images.length}
        </p>
      )}

      {/* Le plein écran. <dialog> gère seul la touche Échap et garde le clavier à l'intérieur. */}
      <dialog
        ref={dialogRef}
        aria-label={`Photos de ${name} en plein écran`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-nuit text-white open:animate-fondu"
      >
        <ul
          ref={viewerRef}
          onScroll={(event) => setViewerIndex(indexFromScroll(event.currentTarget))}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {images.map((image) => (
            <li key={image.url} className="relative h-full w-full shrink-0 snap-center">
              <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-contain" />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute top-4 right-4 inline-flex min-h-11 items-center px-4 text-sm tracking-widest text-white/90 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-or"
        >
          FERMER
        </button>

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6 text-sm">
            <button type="button" onClick={() => step(-1)} aria-label="Photo précédente" className={arrowClass}>
              ←
            </button>
            <span className="tracking-widest tabular-nums text-white/80">
              {viewerIndex + 1} / {images.length}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Photo suivante" className={arrowClass}>
              →
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}

const arrowClass =
  "inline-flex size-11 items-center justify-center text-lg text-white/90 transition-colors hover:text-or focus-visible:outline-2 focus-visible:outline-or";
