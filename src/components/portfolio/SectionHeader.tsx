export default function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 flex items-baseline gap-6 border-b border-hairline pb-5 lg:mb-16">
      <span className="label text-accent">{index}</span>
      <h2 className="font-serif text-display-l">{title}</h2>
    </div>
  );
}
