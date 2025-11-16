import { motion } from 'framer-motion';

export const GradientBackground = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#0A0A0A]"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 300px, 0 100%)' }}
    >
      {/* Blob 1 */}
      <motion.div
        initial={{ x: -200, y: -200, scale: 1 }}
        animate={{ x: 400, y: 400, scale: 1.6 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute h-[90%] w-[90%] rounded-full bg-purple-500 opacity-40 blur-[120px]"
      />

      {/* Blob 2 */}
      <motion.div
        initial={{ x: 300, y: 100, scale: 1 }}
        animate={{ x: -150, y: -150, scale: 1.4 }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute h-[70%] w-[70%] rounded-full bg-blue-500 opacity-40 blur-[140px]"
      />

      {/* Blob 3 */}
      <motion.div
        initial={{ x: 400, y: 900, scale: 1 }}
        animate={{ x: -200, y: 80, scale: 1.8 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute h-[90%] w-[90%] rounded-full bg-pink-500 opacity-40 blur-[160px]"
      />
    </div>
  );
};
