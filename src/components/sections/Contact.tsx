'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TiltCard3D } from '@/components/TiltCard3D';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@futurelabs.et',
    href: 'mailto:info@futurelabs.et',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+251 922 871 082',
    href: 'tel:+251922871082',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'Addis Ababa, Ethiopia',
    href: undefined,
  },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/futurelabs', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/futurelabs', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:info@futurelabs.et', label: 'Email' },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: 'Message sent successfully!',
        description: 'Thank you for reaching out. We will respond shortly.',
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast({
        title: 'Submission error',
        description: 'Failed to send message. Please email info@futurelabs.et directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="text-primary font-medium text-sm tracking-widest uppercase block mb-3">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Let&apos;s Build Something <span className="accent-gradient">Great</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              Have a project inquiry, partnership proposal, or want to join our lab? Reach out and our team will get back to you within 24 hours.
            </p>

            {/* Contact Info Bento Cards */}
            <div className="mt-8 space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <TiltCard3D key={item.label} className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">{item.label}</span>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                        )}
                      </div>
                    </div>
                  </TiltCard3D>
                );
              })}
            </div>

            {/* Social Links */}
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
                    className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column — Contact Form Bento Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <TiltCard3D className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-secondary/40 border-border focus:border-primary rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-secondary/40 border-border focus:border-primary rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-semibold uppercase text-muted-foreground">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Project Inquiry / Partnership"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-secondary/40 border-border focus:border-primary rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-semibold uppercase text-muted-foreground">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project requirements..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-secondary/40 border-border focus:border-primary rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </TiltCard3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
