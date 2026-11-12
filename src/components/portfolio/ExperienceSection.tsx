"use client";

import { useEffect, useState } from "react";
import { Experience, getExperiences } from "@/lib/data";
import SectionHeader from "./SectionHeader";

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();

const formatPeriod = (entry: Experience) =>
  [entry.start_date && formatMonth(entry.start_date), entry.current ? "NOW" : entry.end_date && formatMonth(entry.end_date)]
    .filter(Boolean)
    .join(" — ");

const newestFirst = (a: Experience, b: Experience) => (b.start_date ?? "").localeCompare(a.start_date ?? "");

function Column({ title, entries }: { title: string; entries: Experience[] }) {
  return (
    <div>
      <h3 className="label border-b border-hairline pb-3 text-muted">{title}</h3>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} className="border-b border-hairline py-7">
            <p className="label text-muted">{formatPeriod(entry)}</p>
            <h4 className="mt-3 font-serif text-display-s">{entry.title}</h4>
            <p className="mt-1 text-body-m text-muted">{entry.organization}</p>
            {entry.description && <p className="mt-3 text-body-s text-muted">{entry.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ExperienceSection() {
  const [entries, setEntries] = useState<Experience[]>(getExperiences);

  useEffect(() => {
    fetch("/api/portfolio/experiences")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch experiences: ${response.status}`);
        return response.json() as Promise<Experience[]>;
      })
      .then(setEntries)
      .catch((error) => console.error("Error loading experiences:", error));
  }, []);

  const sorted = [...entries].sort(newestFirst);

  return (
    <section id="experience" className="shell section-y">
      <SectionHeader index="02" title="Experience & Education" />
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <Column title="Experience" entries={sorted.filter((e) => e.type !== "education")} />
        <Column title="Education" entries={sorted.filter((e) => e.type === "education")} />
      </div>
    </section>
  );
}
