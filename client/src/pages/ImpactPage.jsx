import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMPACT_STORIES } from "../constants/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ImpactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featured = IMPACT_STORIES.find((s) => s.featured) || IMPACT_STORIES[0];
  const secondary = IMPACT_STORIES.filter((s) => s.id !== featured.id);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-neutral-950 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-neutral-950 to-secondary-900/30" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')] opacity-60" />

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-bold mb-5 shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px]">public</span>
              Global Reach
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-6 tracking-tight">
              Our <span className="text-gradient-primary">Impact</span>
            </h1>
            <p className="text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Striving to relieve human suffering. See how your generous donations have been actively transforming lives, restoring hope, and rebuilding communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="container-max -mt-10 relative z-20 mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] group shadow-2xl border border-white/10 bg-neutral-900"
        >
          <img
            src={featured.image}
            alt={featured.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 md:p-16">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out max-w-3xl">
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 shadow-md">
                {featured.category}
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight drop-shadow-md">
                {featured.headline}
              </h2>
              <p className="text-neutral-200 text-lg sm:text-xl leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                {featured.story}
              </p>
              <Link to={`/impact/${featured.id}`} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3">
                Read Featured Story
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Other Stories Grid */}
      <section className="container-max">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-white">
            More Impact Initiatives
          </h3>
          <div className="h-px bg-border-light dark:bg-neutral-800 flex-1 ml-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondary.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-card dark:shadow-none hover:shadow-card-hover dark:hover:border-neutral-700 transition-all duration-300 group border border-border-light dark:border-neutral-800 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h4 className="font-heading font-bold text-xl text-neutral-900 dark:text-white mb-3 leading-snug group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
                  {story.headline}
                </h4>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                  {story.story}
                </p>
                <Link
                  to={`/impact/${story.id}`}
                  className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:gap-2 transition-all"
                >
                  Read Report
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
