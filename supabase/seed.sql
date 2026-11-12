-- seed.sql
-- Replaces the portfolio content with the real profile, experiences and projects.
-- Matches the JSON fallbacks in src/data/ (checked by `npm run check:seed`).
-- Idempotent: safe to re-run. Never touches auth users, admin_audit_logs or storage objects.

begin;

-- Blogs ---------------------------------------------------------------------
-- No real posts yet. Remove only the old sample posts (by id or slug); their
-- comments go with them via `on delete cascade`. Posts written in the admin
-- portal are left alone.
delete from public.blogs
where id in (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
  )
  or slug in (
    'understanding-transformer-architecture',
    'building-production-ml-pipelines',
    'computer-vision-cnns-to-vit'
  );

-- Portfolio profile ---------------------------------------------------------
-- Single-row table (unique index on (true)), so replace whatever row exists.
delete from public.portfolio_profile;

insert into public.portfolio_profile (id, full_name, email, bio, title, location, profile_image_url, github_url, linkedin_url, resume_url)
values
  (
    '44444444-4444-4444-4444-444444444444',
    'Pratham Satani',
    'pratham.satani@outlook.com',
    'I build production ML — RAG and agentic systems, multimodal retrieval, and the pipelines that keep them honest. Currently a Data Scientist Co-op while pursuing an M.S. in AI at Northeastern.',
    'ML Engineer',
    'Boston, MA',
    '/pratham.jpg',
    'https://github.com/prathamsatani',
    'https://linkedin.com/in/prathamsatani',
    '/Pratham_Satani_MLE.pdf'
  );

-- Portfolio experiences -----------------------------------------------------
-- Replace every row: this file is the source of truth for experiences.
delete from public.portfolio_experiences;

insert into public.portfolio_experiences (id, title, organization, start_date, end_date, description, type, current)
values
  ('55555555-5555-5555-5555-555555555561', 'Data Scientist Co-op', 'Northeastern University (Portland, ME)', '2026-06-01', null, 'Building an AI-native digital-risk-protection pipeline that detects malicious content across text, image and video; multimodal embeddings matched against relational stores and vector indexes; models fine-tuned to a precision/recall bar with automated evaluation and drift monitoring.', 'work', true),
  ('55555555-5555-5555-5555-555555555562', 'M.S. in Artificial Intelligence', 'Northeastern University', '2025-09-01', '2027-12-31', 'Graduate studies in artificial intelligence and machine learning.', 'education', true),
  ('55555555-5555-5555-5555-555555555563', 'AI Engineer Intern', 'Softmax AI', '2025-01-01', '2025-06-30', 'Designed a production RAG-based agent over a 5,200-document knowledge base and a reusable agentic RAG framework (FastAPI, LangChain, ChromaDB) on GCP Cloud Run; 95% retrieval accuracy, sub-1s latency, and an 80% cut in repetitive support work.', 'work', false),
  ('55555555-5555-5555-5555-555555555564', 'Machine Learning Engineer', 'CasePoint', '2024-01-01', '2024-12-31', 'Built a multimodal apparel recommendation system with fashionSigLIP and Vertex AI Vector Search, plus ingestion and embedding pipelines over 1.6M products served by FastAPI on GCP.', 'work', false),
  ('55555555-5555-5555-5555-555555555565', 'B.Tech in Information Technology', 'Gujarat Technological University (Birla Vishvakarma Mahavidyalaya)', '2021-10-01', '2025-06-30', 'Chairperson, Machine Learning Club · Secretary, IEEE Computer Society BVM SB.', 'education', false);

-- Portfolio projects --------------------------------------------------------
-- Replace every row: this file is the source of truth for projects.
delete from public.portfolio_projects;

insert into public.portfolio_projects (id, title, description, technologies, github_url, demo_url, image_url, category, featured, created_date)
values
  ('66666666-6666-6666-6666-666666666671', 'WebGPT', 'Web-scale RAG system: crawls sites, chunks and embeds content into ChromaDB, and serves grounded Gemini answers via FastAPI with PostgreSQL metadata and Phoenix tracing.', array['FastAPI','ChromaDB','PostgreSQL','Gemini','Docker'], 'https://github.com/prathamsatani/webgpt', null, null, 'other', true, '2026-04-01'),
  ('66666666-6666-6666-6666-666666666672', 'Product Discovery Agent', 'Multi-agent e-commerce assistant: a LangGraph supervisor routes queries to data-lookup, ordering and policy agents, streamed to a Next.js UI.', array['LangGraph','Gemini','Next.js','Python'], 'https://github.com/prathamsatani/ai-agent-for-product-discovery', null, null, 'other', true, '2026-03-01'),
  ('66666666-6666-6666-6666-666666666673', 'GPT from Scratch', 'A working GPT assembled from first principles — self-attention, multi-head attention and transformer blocks written by hand.', array['Python','PyTorch'], 'https://github.com/prathamsatani/neetcode-gpt', null, null, 'deep_learning', true, '2026-02-01'),
  ('66666666-6666-6666-6666-666666666674', 'ANLI NLI Pipeline', 'Config-driven multiclass natural-language-inference pipeline on Facebook ANLI-R2: entailment, neutral, contradiction.', array['HuggingFace','PyTorch','Python'], 'https://github.com/prathamsatani/anli-nli-pipeline', null, null, 'deep_learning', true, '2026-01-01'),
  ('66666666-6666-6666-6666-666666666675', 'KrishiMitra', 'ML-driven crop recommendation; Random Forest and XGBoost models reaching 92% cross-validated accuracy.', array['Scikit-learn','XGBoost','Python'], 'https://github.com/prathamsatani/KrishiMitra-Server', null, null, 'machine_learning', true, '2025-02-01'),
  ('66666666-6666-6666-6666-666666666676', 'BI Dashboard', 'Self-service analytics: upload CSV/Excel, auto-clean, and explore interactive visualizations.', array['Python','Pandas','Gradio'], 'https://github.com/prathamsatani/business-intelligence-dashboard', 'https://huggingface.co/spaces/titanite09/business-intelligence-dashboard', null, 'data_science', true, '2025-01-01');

commit;
