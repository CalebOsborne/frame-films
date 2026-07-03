"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useState, useTransition } from "react";
import { genreFilters, sortOptions } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const ALL_VALUE = "all";

function toSelectValue(value: string): string {
  return value || ALL_VALUE;
}

function fromSelectValue(value: string): string {
  return value === ALL_VALUE ? "" : value;
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState(toSelectValue(searchParams.get("genre") ?? ""));
  const [year, setYear] = useState(searchParams.get("year") ?? "");
  const [rating, setRating] = useState(toSelectValue(searchParams.get("rating") ?? ""));
  const [sort, setSort] = useState(searchParams.get("sort") ?? "popularity");

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`/search?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({
      q: query.trim(),
      genre: fromSelectValue(genre),
      year: year.trim(),
      rating: fromSelectValue(rating),
      sort,
    });
  }

  function handleReset() {
    setQuery("");
    setGenre(ALL_VALUE);
    setYear("");
    setRating(ALL_VALUE);
    setSort("popularity");
    startTransition(() => router.push("/search"));
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card glass-padding rounded-2xl">
      <div className="grid grid-gap sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Search" htmlFor="search-q" className="lg:col-span-2">
          <TextInput
            id="search-q"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, franchise, actor..."
          />
        </Field>

        <Field label="Genre" htmlFor="search-genre">
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="search-genre" aria-label="Genre">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All Genres</SelectItem>
              {genreFilters.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Year" htmlFor="search-year">
          <TextInput
            id="search-year"
            name="year"
            type="number"
            min={1900}
            max={2030}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </Field>

        <Field label="Min Rating" htmlFor="search-rating">
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger id="search-rating" aria-label="Minimum rating">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Any Rating</SelectItem>
              <SelectItem value="9">9+</SelectItem>
              <SelectItem value="8">8+</SelectItem>
              <SelectItem value="7">7+</SelectItem>
              <SelectItem value="6">6+</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Sort By" htmlFor="search-sort" className="sm:col-span-2 lg:col-span-1">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="search-sort" aria-label="Sort by">
              <SelectValue placeholder="Popularity" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Apply Filters"}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
