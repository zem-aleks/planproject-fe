export const GradientBackground = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#0A0A0A]"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 300px, 0 100%)' }}
    >
      <div
        className="absolute inset-0 animate-[gradient-shift_20s_ease_infinite]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(168,85,247,0.4) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 30%, rgba(59,130,246,0.4) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 70%, rgba(236,72,153,0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
