import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const VALUES = [
  {
    icon: "shield",
    title: "Trust",
    description:
      "We are a registered charity (No. 1087724) operating with full transparency, accountability, and governance in accordance with UK charity law.",
  },
  {
    icon: "visibility",
    title: "Transparency",
    description:
      "Every pound you donate is tracked and reported. We publish annual reports and impact summaries so you can see exactly where your money goes.",
  },
  {
    icon: "favorite",
    title: "Compassion",
    description:
      "Our work is driven by compassion for those who are suffering. We believe every human being deserves access to food, clean water, shelter, and medical care.",
  },
  {
    icon: "diversity_3",
    title: "Dignity",
    description:
      "We aim to restore dignity and opportunity to those who need it most, empowering communities to build a brighter, self-sufficient future.",
  },
];

const MILESTONES = [
  { number: "20+", label: "Years of Service" },
  { number: "35+", label: "Countries Reached" },
  { number: "1M+", label: "Lives Impacted" },
  { number: "500+", label: "Projects Completed" },
];

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="container-max py-24 sm:py-32 md:py-40 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <span className="material-symbols-outlined text-[16px]">info</span>
              About Our Mission
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-6 tracking-tight leading-[1.1]">
              Restoring Dignity,{" "}
              <span className="text-gradient-primary">One Life</span> at a Time
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              Crescent Relief (London) works to alleviate poverty and suffering
              around the world. Through humanitarian aid, education, water
              projects, food support, shelter and emergency relief, we aim to
              restore dignity and opportunity to those who need it most.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Milestones */}
      <div className="container-max -mt-12 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.label}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-card dark:shadow-none border border-border-light dark:border-neutral-800 text-center transition-colors"
            >
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-primary dark:text-primary-400 mb-1">
                {m.number}
              </p>
              <p className="text-sm sm:text-base font-semibold text-neutral-500 dark:text-neutral-400">
                {m.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Our Story */}
      <section className="container-max py-16 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 md:p-14 shadow-card dark:shadow-none border border-border-light dark:border-neutral-800 relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-5 text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed text-justify">
              <p>
                Crescent Relief (London) is a registered charity operating in
                England and Wales. Since our founding, we have been dedicated to
                providing humanitarian assistance to those affected by poverty,
                conflict, and natural disasters across the globe.
              </p>
              <p>
                Our work spans across multiple areas including emergency
                response, clean water initiatives, educational programmes, food
                distribution, medical aid, and shelter construction. We operate
                in over 35 countries, partnering with local communities to
                deliver sustainable solutions that create lasting change.
              </p>
              <p>
                We believe that every individual, regardless of their
                background, race, or religion, deserves access to the basic
                necessities of life. Our dedicated team of volunteers and field
                workers ensure that aid reaches those who need it most, with
                full accountability and transparency at every step.
              </p>
            </div>

            {/* Official Details */}
            <div className="mt-8 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-border-light dark:border-neutral-700 transition-colors">
              <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                Official Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[20px] mt-0.5">location_on</span>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">Registered Office</p>
                    <p className="text-neutral-500 dark:text-neutral-400">317 Legrams Lane, Bradford, BD7 2HX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[20px] mt-0.5">badge</span>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">Charity Number</p>
                    <p className="text-neutral-500 dark:text-neutral-400">1087724 (England & Wales)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[20px] mt-0.5">business</span>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">Company Number</p>
                    <p className="text-neutral-500 dark:text-neutral-400">04084325</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary dark:text-primary-400 text-[20px] mt-0.5">mail</span>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">Email</p>
                    <p className="text-neutral-500 dark:text-neutral-400">mail@crescentrelief.co.uk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="bg-white dark:bg-neutral-900 py-16 sm:py-24 transition-colors duration-300">
        <div className="container-max">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary dark:text-primary-400 text-sm font-semibold mb-4">
              <span className="material-symbols-outlined text-[16px]">star</span>
              What We Stand For
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 dark:text-white">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 border border-border-light dark:border-neutral-700 hover:shadow-card dark:hover:shadow-none hover:border-primary/20 dark:hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary dark:text-primary-400 mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[24px]">
                    {value.icon}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-neutral-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed text-justify">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-max py-16 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Together, we can make a difference. Whether through donations,
              volunteering, or spreading awareness, your support matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="btn-accent px-8 py-3.5 rounded-full font-heading font-bold text-base shadow-button hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Donate Now
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-full font-heading font-bold text-base bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
