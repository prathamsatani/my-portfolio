#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const seedPath = path.join(projectRoot, 'supabase', 'seed.sql');

const seedContent = fs.readFileSync(seedPath, 'utf8');

const sources = {
  blogs: path.join(projectRoot, 'src', 'data', 'blogs.json'),
  projects: path.join(projectRoot, 'src', 'data', 'projects.json'),
  experiences: path.join(projectRoot, 'src', 'data', 'experiences.json'),
  profile: path.join(projectRoot, 'src', 'data', 'user.json')
};

const missing = [];

const ensureIncludes = (value, context) => {
  if (!value) {
    return;
  }

  const normalised = `${value}`.trim();

  if (!normalised) {
    return;
  }

  if (!seedContent.includes(normalised)) {
    missing.push(`${context}: "${normalised}"`);
  }
};

const blogs = JSON.parse(fs.readFileSync(sources.blogs, 'utf8'));
blogs.forEach((blog, index) => {
  const prefix = `blog[${index}]`;
  ensureIncludes(blog.title, `${prefix} title`);
  ensureIncludes(blog.slug, `${prefix} slug`);
  ensureIncludes(blog.excerpt, `${prefix} excerpt`);
  ensureIncludes(blog.cover_image_url, `${prefix} cover_image_url`);
  ensureIncludes(blog.created_date, `${prefix} created_date`);
  ensureIncludes(`${blog.likes}`, `${prefix} likes`);

  blog.tags?.forEach((tag, tagIndex) => {
    ensureIncludes(tag, `${prefix} tag[${tagIndex}]`);
  });

  blog.comments?.forEach((comment, commentIndex) => {
    const commentPrefix = `${prefix} comment[${commentIndex}]`;
    ensureIncludes(comment.author, `${commentPrefix} author`);
    ensureIncludes(comment.message, `${commentPrefix} message`);
    ensureIncludes(comment.date, `${commentPrefix} date`);
  });
});

const projects = JSON.parse(fs.readFileSync(sources.projects, 'utf8'));
projects.forEach((project, index) => {
  const prefix = `project[${index}]`;
  ensureIncludes(project.title, `${prefix} title`);
  ensureIncludes(project.description, `${prefix} description`);
  ensureIncludes(project.image_url, `${prefix} image_url`);
  ensureIncludes(project.category, `${prefix} category`);
  ensureIncludes(project.created_date, `${prefix} created_date`);

  project.technologies?.forEach((tech, techIndex) => {
    ensureIncludes(tech, `${prefix} technology[${techIndex}]`);
  });

  if (project.github_url) {
    ensureIncludes(project.github_url, `${prefix} github_url`);
  }

  if (project.demo_url) {
    ensureIncludes(project.demo_url, `${prefix} demo_url`);
  }
});

const experiences = JSON.parse(fs.readFileSync(sources.experiences, 'utf8'));
const normaliseExperienceType = (value) => {
  const raw = (value || '').toLowerCase();

  if (['education', 'work', 'research'].includes(raw)) {
    return raw;
  }

  if (raw === 'internship') {
    return 'work';
  }

  return raw;
};

experiences.forEach((experience, index) => {
  const prefix = `experience[${index}]`;
  ensureIncludes(experience.title, `${prefix} title`);
  ensureIncludes(experience.organization, `${prefix} organization`);
  ensureIncludes(experience.description, `${prefix} description`);
  ensureIncludes(normaliseExperienceType(experience.type), `${prefix} type`);

  if (experience.start_date) {
    ensureIncludes(experience.start_date, `${prefix} start_date`);
  }

  if (experience.end_date) {
    ensureIncludes(experience.end_date, `${prefix} end_date`);
  }
});

const profile = JSON.parse(fs.readFileSync(sources.profile, 'utf8'));
ensureIncludes(profile.full_name, 'profile.full_name');
ensureIncludes(profile.email, 'profile.email');
ensureIncludes(profile.bio, 'profile.bio');
ensureIncludes(profile.title, 'profile.title');
ensureIncludes(profile.location, 'profile.location');
ensureIncludes(profile.profile_image_url, 'profile.profile_image_url');
ensureIncludes(profile.github_url, 'profile.github_url');
ensureIncludes(profile.linkedin_url, 'profile.linkedin_url');
ensureIncludes(profile.resume_url, 'profile.resume_url');

if (missing.length > 0) {
  console.error('❌ Seed consistency check failed. Update supabase/seed.sql to include the following data points:');
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exitCode = 1;
} else {
  console.log('✅ Seed consistency check passed: supabase/seed.sql matches src/data fallbacks.');
}
