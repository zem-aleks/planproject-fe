export const ShapingScore = ({ score }: { score: number }) => {
  return (
    <div
      className={'flex flex-col text-center text-2xl text-white md:text-left'}
    >
      <div className={'text-4xl'}>Your score:</div>
      <div className={'flex items-end gap-2'}>
        <span
          className={`text-2xl ${score < 50 ? 'text-orange-400' : 'text-green-600'}`}
        >
          {score}
        </span>{' '}
        of
        <span className={'text-3xl text-green-600'}>100</span>
        <p>points</p>
      </div>
    </div>
  );
};
