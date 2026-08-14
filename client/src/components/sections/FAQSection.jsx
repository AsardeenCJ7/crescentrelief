import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FAQ_ITEMS } from "../../constants/data";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-border-light">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      aria-expanded={isOpen}
    >
      <span className={`font-heading font-semibold text-sm md:text-base transition-colors ${isOpen ? "text-primary" : "text-neutral-800"}`}>
        {item.question}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className={`material-symbols-outlined flex-shrink-0 text-[20px] transition-colors ${isOpen ? "text-primary" : "text-neutral-400"}`}
      >
        expand_more
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-neutral-500 leading-relaxed pb-5 pr-8">{item.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openId, setOpenId] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSubscribed(true);
  };

  return (
    <>
      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Got Questions?</span>
              <h2 className="section-title mb-4">Frequently Asked Questions</h2>
              <p className="text-base text-neutral-500 leading-relaxed">
                Everything you need to know about donating, volunteering, and our work. Can't find your answer? Contact our team.
              </p>
              <a href="/contact" className="btn-outline-primary mt-6 inline-flex">
                Contact Us
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {FAQ_ITEMS.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-50 border-y border-primary/10">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="material-symbols-outlined text-primary text-[36px] mb-4 block">mail</span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-3">Stay Close to the Cause</h2>
              <p className="text-neutral-500 mb-8">Get impact updates, campaign news, and humanitarian insights delivered to your inbox. No spam, ever.</p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 bg-white rounded-2xl p-5 border border-green-100"
                >
                  <span className="material-symbols-outlined text-success text-[28px]">check_circle</span>
                  <div className="text-left">
                    <p className="font-heading font-bold text-neutral-900 text-sm">You're subscribed!</p>
                    <p className="text-xs text-neutral-500">Welcome to the Crescent Relief community.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-5 py-3.5 rounded-full border border-border-light bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    {errors.email && <p className="text-xs text-emergency mt-1.5 text-left px-5">{errors.email.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap rounded-full">
                    {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                    Subscribe
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
