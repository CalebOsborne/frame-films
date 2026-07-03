export function buildTicketSearchQuery(title: string, year?: string): string {
  const sanitized = title.trim().slice(0, 120);
  return year ? `${sanitized} ${year}` : sanitized;
}

/** Fandango movie search — primary outbound ticket link */
export function getPrimaryTicketUrl(title: string, releaseDate?: string): string {
  const year = releaseDate?.slice(0, 4);
  const query = buildTicketSearchQuery(title, year);
  return `https://www.fandango.com/search?q=${encodeURIComponent(query)}&mode=movies`;
}
