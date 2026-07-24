import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const FOOTER_LINKS = {
  "Our Work": [
    { label: "Emergency Appeals", to: "/campaigns?cat=emergency" },
    { label: "Water & Sanitation", to: "/campaigns?cat=water" },
    { label: "Education", to: "/campaigns?cat=education" },
    { label: "Food Security", to: "/campaigns?cat=food" },
    { label: "Healthcare", to: "/campaigns?cat=medical" },
  ],
  "Get Involved": [
    { label: "Donate Now", to: "/donate" },
    { label: "Start Fundraising", to: "/fundraising" },
    { label: "Volunteer", to: "/volunteer" },
    { label: "Monthly Giving", to: "/monthly" },
    { label: "Corporate Partners", to: "/partners" },
  ],
  "Organisation": [
    { label: "About Us", to: "/about" },
    { label: "Annual Reports", to: "/reports" },
    { label: "News & Blog", to: "/news" },
    { label: "Contact Us", to: "/contact" },
    { label: "Careers", to: "/careers" },
  ],
  "Legal": [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Safeguarding", to: "/safeguarding" },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/crelief" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/crescent_relief/" },
  { icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@crescentrelieflondon" },
  { icon: FaTiktok, label: "TikTok", href: "https://www.tiktok.com/@crescentrelief" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/447593334449" },
];

const Footer = () => {
  return (
    <footer className="bg-neutral-900 dark:bg-black text-neutral-300 transition-colors duration-300">
      {/* Main Footer */}
      <div className="container-max py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">cruelty_free</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">Crescent Relief</span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-xs">
              Crescent Relief (London) works to alleviate poverty and suffering around the world through humanitarian aid, education, water projects, food support, shelter and emergency relief.
            </p>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-neutral-300">
                <span className="material-symbols-outlined text-[14px] text-green-400">verified</span>
                Registered Charity
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-neutral-300">
                <span className="material-symbols-outlined text-[14px] text-blue-400">lock</span>
                SSL Secured
              </span>
            </div>
            {/* Social Links */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <Icon size={16} strokeWidth={2} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-heading font-bold text-white text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-max py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            © 2026 Crescent Relief (London). All rights reserved. Registered Charity No. 1087724 (England & Wales). Company No. 04084325.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="material-symbols-outlined text-[14px] text-green-500">favorite</span>
            Relenra Solution (PVT) Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
