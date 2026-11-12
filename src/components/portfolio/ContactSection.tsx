"use client";

import { useState } from "react";
import { UserData } from "@/lib/data";

type Field = "name" | "email" | "message";
const emptyForm = { name: "", email: "", message: "", website: "" }; // website = honeypot

// Mirrors the checks in /api/contact so users see errors before submitting.
const validate = (form: typeof emptyForm) => {
  const errors: Partial<Record<Field, string>> = {};
  if (!/^[a-zA-Z\s\-']{2,50}$/.test(form.name.trim())) errors.name = "Enter your name (letters, spaces and hyphens).";
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (form.message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  else if (form.message.length > 5000) errors.message = "Keep the message under 5000 characters.";
  return errors;
};

const fieldClass =
  "mt-2 w-full border-0 border-b border-ink bg-transparent py-2 text-body-m text-ink placeholder:text-muted";

export default function ContactSection({ userData }: { userData: UserData }) {
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");
      setSubmitted(true);
      setFormData(emptyForm);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: formData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value })),
    "aria-invalid": Boolean(fieldErrors[field]),
    "aria-describedby": fieldErrors[field] ? `contact-${field}-error` : undefined,
    className: fieldClass,
  });

  const renderError = (field: Field) =>
    fieldErrors[field] && (
      <p id={`contact-${field}-error`} className="mt-2 text-body-s text-accent">
        {fieldErrors[field]}
      </p>
    );

  return (
    <section id="contact" aria-labelledby="contact-title" className="shell section-y">
      <p className="label mb-8 text-accent">04 — Contact</p>
      <div className="grid gap-16 lg:grid-cols-[1fr_500px] lg:gap-20">
        <div>
          <h2 id="contact-title" className="font-serif text-display-l">
            Have a problem worth modelling? Let&apos;s talk.
          </h2>
          {userData.email && (
            <a
              href={`mailto:${userData.email}`}
              className="mt-8 inline-block break-all text-body-l text-accent underline underline-offset-4"
            >
              {userData.email}
            </a>
          )}
          <p className="label mt-6 text-muted">{userData.location || "Boston, MA"}</p>
        </div>

        <div>
          {submitted ? (
            <div role="status" className="border-t border-hairline pt-6">
              <p className="font-serif text-display-s">Message sent.</p>
              <p className="mt-2 text-body-m text-muted">Thanks for reaching out. I&apos;ll get back to you soon.</p>
              <button type="button" onClick={() => setSubmitted(false)} className="btn mt-6">
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {error && (
                <p role="alert" className="border-l-2 border-accent pl-4 text-body-s text-accent">
                  {error}
                </p>
              )}

              {/* Honeypot field - hidden from users, catches bots */}
              <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="contact-name" className="label text-muted">
                  Name
                </label>
                <input type="text" autoComplete="name" required {...fieldProps("name")} />
                {renderError("name")}
              </div>
              <div>
                <label htmlFor="contact-email" className="label text-muted">
                  Email
                </label>
                <input type="email" autoComplete="email" required {...fieldProps("email")} />
                {renderError("email")}
              </div>
              <div>
                <label htmlFor="contact-message" className="label text-muted">
                  Message
                </label>
                <textarea rows={5} required {...fieldProps("message")} className={`${fieldClass} resize-none`} />
                {renderError("message")}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? "Sending…" : "Send message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
