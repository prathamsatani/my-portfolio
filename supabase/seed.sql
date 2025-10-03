-- seed.sql
-- Populates the portfolio schema with starter content matching the local JSON fallbacks.

-- Blogs ---------------------------------------------------------------------
insert into public.blogs (id, title, slug, content, excerpt, cover_image_url, tags, status, featured, created_date, likes)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Understanding Transformer Architecture: A Deep Dive',
    'understanding-transformer-architecture',
    '<p>Transformers have revolutionized natural language processing and are now being applied to various domains including computer vision...</p>',
    'A comprehensive guide to understanding how transformer models work, from attention mechanisms to positional encodings.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    array['AI','Deep Learning','NLP','Transformers'],
    'published',
    true,
    '2024-09-15T10:00:00Z',
    128
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Building Production-Ready ML Pipelines',
    'building-production-ml-pipelines',
    '<p>Learn best practices for deploying machine learning models in production environments...</p>',
    'Practical tips and strategies for creating robust, scalable ML pipelines that work in real-world applications.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    array['MLOps','Machine Learning','Python','Production'],
    'published',
    true,
    '2024-09-01T14:30:00Z',
    96
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Computer Vision: From CNNs to Vision Transformers',
    'computer-vision-cnns-to-vit',
    '<p>Explore the evolution of computer vision architectures and how Vision Transformers are changing the landscape...</p>',
    'An exploration of how computer vision has evolved from traditional CNNs to modern Vision Transformer architectures.',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop',
    array['Computer Vision','Deep Learning','CNN','Vision Transformers'],
    'published',
    false,
    '2024-08-20T09:15:00Z',
    74
  )
on conflict (slug) do update
set
  title = excluded.title,
  content = excluded.content,
  excerpt = excluded.excerpt,
  cover_image_url = excluded.cover_image_url,
  tags = excluded.tags,
  status = excluded.status,
  featured = excluded.featured,
  created_date = excluded.created_date,
  likes = excluded.likes;

-- Blog comments --------------------------------------------------------------
insert into public.blog_comments (id, blog_id, author, message, created_at)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Aisha Patel', 'Loved the breakdown of multi-head attention—super clear!', '2024-09-18T09:30:00Z'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', 'Liam Chen', 'Would be great to see an example implementation in PyTorch too.', '2024-09-19T15:45:00Z'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222222', 'Sophia Martinez', 'The monitoring checklist is exactly what I needed—thank you!', '2024-09-03T11:20:00Z'),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', 'Noah Johnson', 'Curious how you manage model rollback strategies in production?', '2024-09-05T18:05:00Z'),
  ('ccccccc1-cccc-cccc-cccc-ccccccccccc1', '33333333-3333-3333-3333-333333333333', 'Maya Singh', 'Appreciate the comparison table between CNNs and ViTs!', '2024-08-22T13:10:00Z'),
  ('ccccccc2-cccc-cccc-cccc-ccccccccccc2', '33333333-3333-3333-3333-333333333333', 'Ethan Wright', 'Would you recommend ViTs for small-scale datasets as well?', '2024-08-23T07:55:00Z')
on conflict (id) do nothing;

-- Portfolio profile ---------------------------------------------------------
insert into public.portfolio_profile (id, full_name, email, bio, title, location, profile_image_url, github_url, linkedin_url, resume_url)
values
  (
    '44444444-4444-4444-4444-444444444444',
    'Pratham Satani',
    'pratham.satani@outlook.com',
    'AI & Machine Learning Graduate Student',
    'Graduate Student',
    'Boston, MA',
    '/pratham.jpg',
    'https://github.com/prathamsatani',
    'https://linkedin.com/in/prathamsatani',
    '/Pratham Satani.pdf'
  )
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  bio = excluded.bio,
  title = excluded.title,
  location = excluded.location,
  profile_image_url = excluded.profile_image_url,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url,
  resume_url = excluded.resume_url;

-- Portfolio experiences -----------------------------------------------------
insert into public.portfolio_experiences (id, title, organization, start_date, end_date, description, type, current)
values
  (
    '55555555-5555-5555-5555-555555555551',
    'Master of Science in Artificial Intelligence',
    'Northeastern University',
    '2023-09-01',
    null,
    'Advanced studies in artificial intelligence, machine learning, deep learning, and their applications. Focus on developing practical skills for ML engineering and building scalable AI systems. Coursework includes Neural Networks, Computer Vision, Natural Language Processing, and Reinforcement Learning.',
    'education',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    'Machine Learning Engineer Intern',
    'Softmax AI',
    '2025-01-01',
    '2025-06-30',
    'Conducting research on novel deep learning architectures for computer vision tasks. Developed and trained models achieving 15% improvement in accuracy over baseline approaches. Collaborated with a team of 5 researchers on published work.',
    'work',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555553',
    'Software Engineering - Machine Learning Intern',
    'Tech Innovation Corp',
    '2023-06-01',
    '2023-08-31',
    'Developed machine learning pipelines for predictive analytics. Built REST APIs using Python and FastAPI. Implemented data preprocessing workflows that reduced processing time by 40%. Worked with cross-functional teams in an Agile environment.',
    'work',
    false
  ),
  (
    '55555555-5555-5555-5555-555555555554',
    'Bachelor of Technology in Information Technology',
    'Gujarat Technological University',
    '2021-10-01',
    '2025-05-31',
    'Graduated with honors. Specialized in AI and Data Science. Completed capstone project on sentiment analysis using deep learning. GPA: 3.8/4.0. Chairperson of Machine Learning club and Secretary of IEEE Computer society.',
    'education',
    false
  )
on conflict (id) do update
set
  title = excluded.title,
  organization = excluded.organization,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  type = excluded.type,
  current = excluded.current;

-- Portfolio projects --------------------------------------------------------
insert into public.portfolio_projects (id, title, description, technologies, github_url, demo_url, image_url, category, featured, created_date)
values
  (
    '66666666-6666-6666-6666-666666666661',
    'AI-Powered Image Classifier',
    'Built a deep learning model using TensorFlow to classify images across 10 categories with 94% accuracy. Implemented data augmentation techniques and transfer learning using ResNet50. Deployed as a web application with React frontend.',
    array['Python','TensorFlow','Keras','React','Flask','Docker'],
    'https://github.com/yourusername/image-classifier',
    'https://image-classifier-demo.com',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    'deep_learning',
    true,
    '2024-03-15'
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    'Sentiment Analysis NLP Model',
    'Developed a natural language processing model to analyze customer reviews sentiment. Used BERT transformers and achieved 92% F1-score. Processed over 100K reviews and generated actionable insights through interactive dashboards.',
    array['Python','PyTorch','Transformers','BERT','Pandas','Plotly'],
    'https://github.com/yourusername/sentiment-analysis',
    null,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'machine_learning',
    true,
    '2024-02-20'
  ),
  (
    '66666666-6666-6666-6666-666666666663',
    'Real-time Object Detection System',
    'Created a real-time object detection system using YOLO v8. Optimized for edge devices achieving 30 FPS on Raspberry Pi. Implemented for security monitoring with alert notifications and video recording capabilities.',
    array['Python','YOLO','OpenCV','Raspberry Pi','MQTT'],
    'https://github.com/yourusername/object-detection',
    'https://object-detection-demo.com',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop',
    'deep_learning',
    true,
    '2024-01-10'
  ),
  (
    '66666666-6666-6666-6666-666666666664',
    'Customer Churn Prediction',
    'Built a machine learning model to predict customer churn for a telecom company. Utilized ensemble methods (Random Forest, XGBoost) and achieved 88% accuracy. Performed extensive feature engineering and hyperparameter tuning.',
    array['Python','Scikit-learn','XGBoost','Pandas','Jupyter'],
    'https://github.com/yourusername/churn-prediction',
    null,
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'data_science',
    false,
    '2023-12-05'
  ),
  (
    '66666666-6666-6666-6666-666666666665',
    'AI Chatbot with RAG',
    'Developed an intelligent chatbot using Retrieval Augmented Generation (RAG) architecture. Integrated LangChain and OpenAI GPT models with vector database for context-aware responses. Handles 1000+ queries with high accuracy.',
    array['Python','LangChain','OpenAI','Pinecone','FastAPI','Next.js'],
    'https://github.com/yourusername/ai-chatbot',
    'https://ai-chatbot-demo.com',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    'machine_learning',
    false,
    '2023-11-15'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Stock Price Predictor',
    'Created a time series forecasting model using LSTM neural networks to predict stock prices. Implemented technical indicators and sentiment analysis from financial news. Backtested strategies with historical data.',
    array['Python','TensorFlow','LSTM','Pandas','yfinance','Streamlit'],
    'https://github.com/yourusername/stock-predictor',
    'https://stock-predictor-demo.com',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    'deep_learning',
    false,
    '2023-10-20'
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  technologies = excluded.technologies,
  github_url = excluded.github_url,
  demo_url = excluded.demo_url,
  image_url = excluded.image_url,
  category = excluded.category,
  featured = excluded.featured,
  created_date = excluded.created_date;
