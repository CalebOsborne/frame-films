import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import type { CastMember } from "@/types/movie";

type CastListProps = {
  cast: CastMember[];
};

export function CastList({ cast }: CastListProps) {
  return (
    <div>
      <h2 className="section-head text-xl font-semibold text-white">Cast</h2>
      <div className="grid grid-cols-2 grid-gap sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.map((member) => (
          <figure key={member.id} className="text-center">
            <div className="relative mx-auto aspect-square w-full max-w-[120px] overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
              <Image
                src={getImageUrl(member.profile_path, "profile", "md")}
                alt={member.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="text-sm font-medium text-white">{member.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{member.character}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
