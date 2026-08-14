import { useEffect } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SECTIONS = [
  {
    title: "1. About Us",
    content: (
      <>
        <p>
          Crescent Relief (London) is a registered charity operating in England
          and Wales.
        </p>
        <div className="mt-4 p-4 sm:p-5 bg-neutral-50 rounded-xl border border-border-light text-sm space-y-1">
          <p>
            <strong>Registered Office:</strong> 317 Legrams Lane, Bradford, BD7
            2HX
          </p>
          <p>
            <strong>Email:</strong> mail@crescentrelief.co.uk
          </p>
          <p>
            <strong>Phone:</strong> 08000 499 389
          </p>
        </div>
      </>
    ),
  },
  {
    title: "2. Use of the Website",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>The website is provided on an "as available" basis.</li>
        <li>We do not guarantee uninterrupted or error-free access.</li>
        <li>You use the website at your own risk.</li>
        <li>
          We take reasonable steps to keep the site secure but cannot guarantee
          it is free from viruses or technical issues.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Website Content",
    content: (
      <>
        <p>
          All content on this website, including text, images, video, and
          graphics, is owned by Crescent Relief (London) or used with
          permission. Content may be viewed for personal, non-commercial use
          only.
        </p>
        <p className="mt-3">
          You must not copy, reproduce, modify, distribute, or reuse any content
          without prior written permission.
        </p>
      </>
    ),
  },
  {
    title: "4. Donations",
    content: (
      <>
        <p>
          Donations made through this website or via text message are voluntary
          and non-refundable except in exceptional circumstances at our
          discretion.
        </p>
        <p className="mt-3">
          Where donations are linked to specific appeals, items, or themes,
          funds may be allocated to similar charitable purposes if targets are
          exceeded or circumstances change.
        </p>
        <p className="mt-3">
          Payments are processed securely by third-party providers. Crescent
          Relief (London) does not store card or bank payment details.
        </p>
      </>
    ),
  },
  {
    title: "5. Age and Consent",
    content: (
      <>
        <p>
          Donations may be made by individuals of any age. Where personal data
          is provided, we rely on appropriate consent in line with UK data
          protection law.
        </p>
        <p className="mt-3">
          By submitting personal information, you confirm that you are aged 18
          or over, or that appropriate parental or guardian consent has been
          obtained.
        </p>
      </>
    ),
  },
  {
    title: "6. Marketing and Communications",
    content: (
      <p>
        We do not actively target marketing communications to individuals under
        18. You may opt out of communications at any time.
      </p>
    ),
  },
  {
    title: "7. Liability",
    content: (
      <p>
        Crescent Relief (London) shall not be liable for any loss or damage,
        including indirect or consequential loss, arising from the use or
        inability to use this website.
      </p>
    ),
  },
  {
    title: "8. External Links",
    content: (
      <p>
        This website may contain links to third-party websites. We are not
        responsible for the content, security, or privacy practices of those
        sites. Accessing external sites is done at your own risk.
      </p>
    ),
  },
  {
    title: "9. User Contributions",
    content: (
      <>
        <p>
          If you submit content to us (including text, images, or media), you
          grant Crescent Relief (London) a non-exclusive, royalty-free licence
          to use that content for charitable and promotional purposes.
        </p>
        <p className="mt-3">
          Contributions must be lawful, respectful, and must not infringe the
          rights of others.
        </p>
      </>
    ),
  },
  {
    title: "10. Changes to These Terms",
    content: (
      <p>
        We may update these Terms and Conditions at any time. Continued use of
        the website means you accept the updated terms.
      </p>
    ),
  },
  {
    title: "11. Governing Law",
    content: (
      <p>
        These Terms and Conditions are governed by the laws of England and
        Wales. Any disputes shall be subject to the exclusive jurisdiction of
        the English courts.
      </p>
    ),
  },
  {
    title: "12. Contact Us",
    content: (
      <div className="p-4 sm:p-5 bg-neutral-50 rounded-xl border border-border-light text-sm space-y-1">
        <p>
          <strong>Email:</strong> mail@crescentrelief.co.uk
        </p>
        <p>
          <strong>Phone:</strong> 08000 499 389
        </p>
      </div>
    ),
  },
];

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <div className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="container-max py-24 sm:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              Legal
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-4 tracking-tight leading-[1.1]">
              Terms & <span className="text-gradient-primary">Conditions</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl">
              Crescent Relief (London) — Registered Charity Number 1087724
              (England & Wales)
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="container-max py-16 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-card border border-border-light relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

            {/* Intro */}
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed mb-10 text-justify">
              These Terms and Conditions govern your use of this website (
              <a
                href="https://crescentrelief.co.uk"
                className="text-primary font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://crescentrelief.co.uk
              </a>
              ) and any related pages operated by Crescent Relief (London). By
              accessing or using the website, you agree to be bound by these
              terms. If you do not agree, you should stop using the website
              immediately.
            </p>

            {/* Sections */}
            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="pb-8 border-b border-border-light last:border-b-0 last:pb-0"
                >
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-neutral-900 mb-3">
                    {section.title}
                  </h3>
                  <div className="text-neutral-600 text-sm sm:text-base leading-relaxed text-justify">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default TermsPage;
