import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn("max-w-xl", isCenter && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
      <h2
        id={id}
        className="text-[1.625rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.875rem] sm:leading-tight"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-[#9494a0] sm:mt-3.5">
          {description}
        </p>
      )}
    </div>
  );
}
