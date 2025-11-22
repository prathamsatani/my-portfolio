"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { UserData, getUserData } from "@/lib/data";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/portfolio/user");

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = (await response.json()) as UserData;
      setUserData(data);
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData(getUserData());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Interested in collaborating or discussing opportunities? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                I&apos;m always open to discussing new opportunities, exciting projects, 
                or just having a conversation about AI and machine learning. 
                Feel free to reach out!
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {userData?.email && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <a 
                      href={`mailto:${userData.email}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {userData.email}
                    </a>
                  </div>
                </div>
              )}

              {userData?.location && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Location</p>
                    <p className="text-slate-600">{userData.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="text-slate-600">Available for ML Engineer roles</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-slate-200">
              <h4 className="font-semibold mb-4 text-slate-900">Connect with me</h4>
              <div className="flex gap-4">
                {userData?.github_url && (
                  <a 
                    href={userData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Github className="w-5 h-5 text-slate-700 hover:text-slate-900" />
                  </a>
                )}
                {userData?.linkedin_url && (
                  <a 
                    href={userData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-slate-700 hover:text-slate-900" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-50 rounded-2xl p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Message Sent!</h3>
                <p className="text-slate-600 mb-6">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                  }}
                  className="border-2 border-slate-300 text-slate-900 hover:bg-slate-200 px-6 py-2 rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-slate-900">Send me a message</h3>
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}
                </div>

                {/* Honeypot field - hidden from users, catches bots */}
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell me about your project or opportunity..."
                    className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 text-lg font-medium rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}