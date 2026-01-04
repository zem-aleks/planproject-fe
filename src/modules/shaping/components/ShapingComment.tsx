import { Card } from '@/ui/card';

export const ShapingComment = ({
  comment,
  loading,
}: {
  comment: string;
  loading?: boolean;
}) => {
  return (
    <div className={'flex w-full items-start gap-2 text-xl'}>
      <img
        src={
          'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/fox.png'
        }
        alt={'Funny fox'}
        className={'animate-in fade-in-0 h-24'}
      />
      <Card className={'shrink px-4 py-2 text-sm whitespace-normal sm:text-lg'}>
        {loading ? (
          <>
            <b className={'animate-bounce'}>.</b>
            <b className={'animate-bounce delay-100'}>.</b>
            <b className={'animate-bounce delay-300'}>.</b>
          </>
        ) : (
          <>{comment}</>
        )}
      </Card>
    </div>
  );
};
