import SectionHeader from "./SectionHeader";

const groups = [
  { title: "Generative & agentic", items: ["LangChain", "LangGraph", "LangSmith", "RAG", "LLMs", "Prompt Eng."] },
  { title: "Machine learning", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "HuggingFace", "Statsmodels"] },
  { title: "MLOps & serving", items: ["Docker", "Kubernetes", "MLflow", "DVC", "GitHub Actions", "FastAPI", "Flask"] },
  { title: "Cloud", items: ["GCP Vertex AI", "Cloud Run", "BigQuery", "AWS Bedrock", "SageMaker", "DynamoDB"] },
  { title: "Languages & data", items: ["Python", "C++", "TypeScript", "SQL", "NoSQL", "NumPy", "Pandas"] },
  { title: "Vector stores", items: ["Chroma", "Milvus", "FAISS", "Pinecone"] },
];

export default function ToolkitSection() {
  return (
    <section id="skills" className="bg-surface">
      <div className="shell section-y">
        <SectionHeader index="03" title="Toolkit" />
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 font-serif text-display-s">{group.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
