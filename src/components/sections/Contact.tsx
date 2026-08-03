'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@futurelabs.et',
    href: 'mailto:info@futurelabs.et',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+251 11 234 5678',
    href: 'tel:+251112345678',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Addis Ababa, Ethiopia',
    href: undefined,
  },
];

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/futurelabs',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/company/futurelabs',
    label: 'LinkedIn',
  },
  {
    icon: Mail,
    href: 'mailto:info@futurelabs.et',
    label: 'Email',
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      delay: i * 0.1,
    },
  }),
};

const formVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: 0.3 },
  },
};

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
        title: 'Message sent!',
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later or email us directly at info@futurelabs.et.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 lg:py-32 grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <motion.p
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="text-primary uppercase tracking-widest text-sm font-medium"
            >
              Contact Us
            </motion.p>

            <motion.h2
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mt-3"
            >
              Let&apos;s Build Something{' '}
              <span className="gradient-text">Extraordinary</span>
            </motion.h2>

            <motion.p
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="text-muted-foreground mt-4 text-lg leading-relaxed"
            >
              Ready to bring your vision to life? Whether you have a project idea,
              a question about our services, or just want to say hello — we&apos;d
              love to hear from you.
            </motion.p>

            {/* Contact info cards */}
            <div className="mt-8 space-y-4">
              {contactInfo.map((item, index) => {
                const IconComp = item.icon;
                const content = (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComp className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                );

                if (item.href) {
                  return (
                    <a key={item.label} href={item.href} className="block">
                      {content}
                    </a>
                  );
                }

                return <div key={item.label}>{content}</div>;
              })}
            </div>

            {/* Social media links */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              className="mt-8 flex items-center gap-3"
            >
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="glass rounded-full p-2.5 hover:border-primary/20 transition-all duration-300"
                  >
                    <SocialIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Right column — Contact form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 lg:p-8"
            >
              <div className="space-y-5">
                {/* Name field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Subject field */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project or idea..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
