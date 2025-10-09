export const ShapingScore = ({ score }: { score: number }) => {
  return (
    <div
      className={
        'flex size-48 shrink-0 flex-col items-center justify-center rounded-full border-3 border-green-700 bg-green-100 text-center text-2xl'
      }
    >
      <p>{score} / 100</p>
      <p>points</p>
    </div>
  );
};
