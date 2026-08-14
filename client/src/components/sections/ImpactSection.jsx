import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IMPACT_STORIES } from "../../constants/data";

const ImpactSection = () => {
  const featured = IMPACT_STORIES.find((s) => s.featured);
  const secondary = IMPACT_STORIES.filter((s) => !s.featured);

  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[100px]"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')] opacity-60" />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-bold mb-5 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">public</span>
            Global Reach
          </span>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white mb-6 tracking-tight">
            Real People. <span className="text-gradient-primary">Real Change.</span>
          </h2>
          <p className="text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Behind every number is a name, a family, and a future. See how your donations are actively transforming lives and rebuilding communities across the globe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Featured Story */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[450px] lg:min-h-[550px] group cursor-pointer border border-white/10 shadow-2xl"
            >
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-block text-xs font-bold text-white bg-primary px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                    {featured.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight drop-shadow-sm">
                    {featured.headline}
                  </h3>
                  <p className="text-neutral-300 text-lg leading-relaxed mb-6 line-clamp-2 max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    {featured.story}
                  </p>
                  <Link to={`/impact/${featured.id}`} className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-primary-300 transition-colors">
                    Read Full Story
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secondary Stories */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondary.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 group flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch"
              >
                <div className="w-full sm:w-48 lg:w-full xl:w-44 flex-shrink-0 overflow-hidden min-h-[200px] sm:min-h-full lg:min-h-[220px] xl:min-h-full relative">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex flex-col justify-center p-6 lg:p-8 flex-1">
                  <span className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-2 block">
                    {story.category}
                  </span>
                  <h4 className="font-heading font-bold text-white text-lg sm:text-xl mb-3 leading-snug group-hover:text-primary-300 transition-colors">
                    {story.headline}
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                    {story.story}
                  </p>
                  <Link to={`/impact/${story.id}`} className="inline-flex items-center gap-1.5 text-white font-bold text-xs hover:text-primary-300 transition-colors mt-auto">
                    Read More
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-2"
            >
              <Link to="/impact" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/20 text-white font-bold hover:bg-white hover:text-neutral-900 transition-all duration-300 group">
                View All Impact Reports
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">insights</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
