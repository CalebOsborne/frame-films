import Image from "next/image";
import { ExternalLink, Tv } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import type { WatchProviders } from "@/types/movie";

type StreamingProvidersProps = {
  providers: WatchProviders | null;
  compact?: boolean;
};

type ProviderGroupProps = {
  label: string;
  providers: WatchProviders["flatrate"];
};

function ProviderGroup({ label, providers }: ProviderGroupProps) {
  if (providers.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">{label}</p>
      <ul className="flex flex-wrap gap-3">
        {providers.map((provider) => (
          <li key={provider.provider_id}>
            <div
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5"
              title={provider.provider_name}
            >
              {provider.logo_path ? (
                <Image
                  src={getImageUrl(provider.logo_path, "poster", "sm")}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-md"
                />
              ) : (
                <Tv className="h-5 w-5 text-zinc-400" aria-hidden="true" />
              )}
              <span className="text-sm font-medium text-zinc-200">{provider.provider_name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StreamingProviders({ providers, compact = false }: StreamingProvidersProps) {
  if (!providers) {
    return (
      <div className={compact ? "" : "glass-card glass-padding rounded-2xl"}>
        <h2 className="text-lg font-semibold text-white">Where to Watch</h2>
        <p className="mt-3 text-sm text-zinc-500">
          Streaming availability not available for your region.
        </p>
      </div>
    );
  }

  const hasAny =
    providers.flatrate.length > 0 ||
    providers.rent.length > 0 ||
    providers.buy.length > 0;

  if (!hasAny) {
    return (
      <div className={compact ? "" : "glass-card glass-padding rounded-2xl"}>
        <h2 className="text-lg font-semibold text-white">Where to Watch</h2>
        <p className="mt-3 text-sm text-zinc-500">
          Not currently available on major streaming services in {providers.region}.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-5" : "glass-card glass-padding space-y-6 rounded-2xl"}>
      <div className="flex items-center justify-between gap-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Where to Watch</h2>
          <p className="mt-1 text-xs text-zinc-500">Availability in {providers.region}</p>
        </div>
        {providers.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            View all options
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      <ProviderGroup label="Stream" providers={providers.flatrate} />
      {!compact && <ProviderGroup label="Rent" providers={providers.rent} />}
      {!compact && <ProviderGroup label="Buy" providers={providers.buy} />}
    </div>
  );
}
