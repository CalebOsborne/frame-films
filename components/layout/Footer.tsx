import Link from "next/link";
import { footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/featuredSeries";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="safe-bottom mt-4 border-t border-white/[0.05] bg-[#06060a]">
      <Container className="section-y">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white">
              {siteConfig.name}
            </Link>
            <p className="mt-3.5 max-w-xs text-[0.9375rem] leading-relaxed text-[#6b6b76]">
              {siteConfig.tagline}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-[#6b6b76]/80">
              Movie data provided by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 underline-offset-2 hover:text-white hover:underline"
              >
                TMDb
              </a>
              . This product uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {footerNavigation.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-[#6b6b76] transition-colors duration-200 hover:text-zinc-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Legal</h2>
            <ul className="mt-4 space-y-2.5">
              {footerNavigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-[#6b6b76] transition-colors duration-200 hover:text-zinc-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/[0.05] pt-8 text-sm text-[#6b6b76]">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
