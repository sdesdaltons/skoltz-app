import Image, { type StaticImageData } from "next/image";

import { SbBadge, SbCard } from "@/components/ui";
import { cn } from "@/lib/utils";

type SbPromoCardProps = {
  image: StaticImageData;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  className?: string;
};

export function SbPromoCard({
  image,
  alt,
  title,
  subtitle,
  ctaText,
  className,
}: SbPromoCardProps) {
  return (
    <SbCard
      className={cn(
        "group overflow-hidden p-0 transition duration-200 hover:border-primary/50 hover:shadow-[var(--sb-glow-blue)]",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 82vw"
          className="object-cover transition duration-200 group-hover:scale-[1.02]"
          placeholder="blur"
        />
      </div>

      {(title || subtitle || ctaText) && (
        <div className="space-y-3 p-4">
          {(title || subtitle) && (
            <div className="space-y-1">
              {title ? (
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  {title}
                </h3>
              ) : null}
              {subtitle ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
          )}
          {ctaText ? <SbBadge tone="blue">{ctaText}</SbBadge> : null}
        </div>
      )}
    </SbCard>
  );
}
