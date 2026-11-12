const stats = [
  { value: "1.6M", caption: "products embedded for multimodal retrieval" },
  { value: "95%", caption: "retrieval accuracy on a production RAG agent" },
  { value: "80%", caption: "less repetitive support work, via agentic RAG" },
];

export default function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="bg-surface">
      <div className="shell section-y">
        <h2 id="about-title" className="label mb-8 text-muted">
          About
        </h2>
        <p className="max-w-5xl font-serif text-display-m">
          I like owning the whole loop — data, model, API and the interface around it — then measuring whether it
          actually helped. Lately that means agentic RAG, multimodal embeddings at scale, and evaluation that catches
          drift before users do.
        </p>
        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <li key={stat.value} className="border-t border-hairline pt-5">
              <p className="font-serif text-display-l text-accent">{stat.value}</p>
              <p className="mt-2 text-body-s text-muted">{stat.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
