import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const VolunteerCTA = () => (
  <section className="section-padding bg-neutral-50">
    <div className="container-max">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Join Our Team</span>
          <h2 className="section-title mb-4">Give Your Time, Change a Life</h2>
          <p className="text-base text-neutral-500 leading-relaxed mb-6 max-w-lg">
            Join thousands of volunteers worldwide. Whether you have an hour or a month, your skills and time can transform communities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: "translate", label: "Translation & Content" },
              { icon: "code", label: "Tech & Development" },
              { icon: "groups", label: "Community Events" },
              { icon: "local_shipping", label: "Field Operations" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-border-light">
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                </div>
                <span className="text-sm font-semibold text-neutral-700">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/volunteer" className="btn-primary">
              Become a Volunteer
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link to="/volunteer/events" className="btn-secondary">View Opportunities</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2 rounded-3xl overflow-hidden aspect-[4/3] shadow-card-hover"
        >
          <img
            src="/images/hero_volunteer.png"
            alt="Volunteers helping communities"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default VolunteerCTA;
