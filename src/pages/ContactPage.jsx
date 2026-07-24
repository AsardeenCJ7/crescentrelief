import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const CONTACT_INFO = [
  {
    icon: "call",
    title: "Phone",
    lines: ["08000 499 389", "07405 314465"],
    action: "tel:08000499389",
  },
  {
    icon: "mail",
    title: "Email",
    lines: ["mail@crescentrelief.co.uk"],
    action: "mailto:mail@crescentrelief.co.uk",
  },
  {
    icon: "location_on",
    title: "Address",
    lines: ["317 Legrams Lane", "Bradford, BD7 2HX"],
    action: null,
  },
  {
    icon: "schedule",
    title: "Office Hours",
    lines: ["Mon – Fri: 9am – 5pm", "Sat – Sun: Closed"],
    action: null,
  },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "https://www.facebook.com/crelief", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/crescent_relief/", label: "Instagram" },
  { icon: FaYoutube, href: "https://www.youtube.com/@crescentrelieflondon", label: "YouTube" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@crescentrelief", label: "TikTok" },
  { icon: FaWhatsapp, href: "https://wa.me/447593334449", label: "WhatsApp" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production this would call an API endpoint
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <div className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="container-max py-24 sm:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <span className="material-symbols-outlined text-[16px]">contact_support</span>
              Get In Touch
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-4 tracking-tight leading-[1.1]">
              Contact <span className="text-gradient-primary">Us</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed">
              Have a question, want to volunteer, or need more information about
              our projects? We would love to hear from you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Cards + Form */}
      <section className="container-max py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left — Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {CONTACT_INFO.map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-border-light flex items-start gap-4 group hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[22px]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-neutral-900 mb-1">
                      {item.title}
                    </p>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-neutral-500">
                        {item.action ? (
                          <a
                            href={item.action}
                            className="hover:text-primary transition-colors"
                          >
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-border-light"
            >
              <p className="font-heading font-bold text-neutral-900 mb-4">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-primary hover:text-white transition-all"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Bank Details */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-border-light"
            >
              <p className="font-heading font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                Bank Transfer Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-neutral-400 font-medium">Bank</p>
                  <p className="font-semibold text-neutral-900">Barclays Bank</p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium">Sort Code</p>
                  <p className="font-semibold text-neutral-900">20-44-22</p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium">Account No</p>
                  <p className="font-semibold text-neutral-900">80013137</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-card border border-border-light relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-neutral-500 mb-8">
                Fill in the form below and we will get back to you as soon as
                possible.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Your message has been sent successfully! We will be in touch.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-neutral-50 text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-neutral-50 text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-neutral-50 text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-neutral-50 text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:border-primary/50 focus:bg-white transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-accent w-full sm:w-auto px-10 py-3.5 rounded-full font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
