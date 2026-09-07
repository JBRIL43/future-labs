'use client';

import { useState, type FormEvent } from 'react';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
} from '@/components/icons';

const contactInfo = [
  {
    label: 'Email',
    value: 'info@futurelabs.et',
    href: 'mailto:info@futurelabs.et',
    icon: MailIcon,
  },
  {
    label: 'Phone',
    value: '+251 922 871 082',
    href: 'tel:+251922871082',
    icon: PhoneIcon,
  },
  {
    label: 'Headquarters',
    value: 'Addis Ababa, Ethiopia',
    href: undefined,
    icon: MapPinIcon,
  },
];

const socialLinks = [
  { href: 'https://github.com/futurelabs', label: 'GitHub', icon: GithubIcon },
  { href: 'https://linkedin.com/company/futurelabs', label: 'LinkedIn', icon: LinkedinIcon },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-card py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="label-caps text-primary mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Let&apos;s Build Something Great
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Have a project inquiry, partnership proposal, or want to join our lab?
              Reach out and our team will get back to you within 24 hours.
            </p>

            <ul className="mt-8 border-t border-border">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex items-center gap-4 py-4 border-b border-border">
                    <span className="text-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-xs text-muted-foreground block">{item.label}</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-md border border-border bg-card shadow-sm flex items-center justify-center text-muted-foreground transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:text-primary hover:border-primary hover:shadow-md active:scale-95"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="card-interactive p-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label-caps text-muted-foreground block mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    required
                    minLength={2}
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label-caps text-muted-foreground block mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="label-caps text-muted-foreground block mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  placeholder="Project Inquiry / Partnership"
                  required
                  minLength={3}
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="message" className="label-caps text-muted-foreground block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project requirements..."
                  rows={5}
                  required
                  minLength={10}
                  className="field-input resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full h-12 text-sm"
              >
                {status === 'submitting' ? 'Sending Message...' : 'Send Message'}
              </button>

              <p role="status" aria-live="polite" className="text-sm">
                {status === 'success' && (
                  <span className="text-primary">
                    Message sent. Thank you for reaching out, we will respond shortly.
                  </span>
                )}
                {status === 'error' && (
                  <span className="text-destructive">
                    Failed to send the message. Please email info@futurelabs.et directly.
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
