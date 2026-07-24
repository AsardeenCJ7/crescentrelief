import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="container-max text-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-8xl mb-6">🌙</div>
        <h1 className="font-heading font-extrabold text-5xl text-neutral-900 mb-4">404</h1>
        <p className="text-xl font-heading font-semibold text-neutral-700 mb-3">Page Not Found</p>
        <p className="text-base text-neutral-500 mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist. But the need for humanitarian aid does — let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/campaigns" className="btn-secondary">Browse Campaigns</Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default NotFoundPage;
