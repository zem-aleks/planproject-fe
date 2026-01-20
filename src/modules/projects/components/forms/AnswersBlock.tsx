import { Button } from '@/ui/button';
import { IconCheck } from '@tabler/icons-react';

export const AnswersBlock = ({
  answers,
  message,
  onChange,
}: {
  answers: string[];
  message: string;
  onChange: (newMessage: string) => void;
}) => {
  return (
    <div className={'flex flex-wrap gap-2'}>
      {answers.map((answer) => {
        const included = message.includes(answer);
        return (
          <Button
            variant={'outline'}
            className={'active:bg grow cursor-pointer rounded-md p-1 px-3'}
            aria-selected={included}
            onClick={() => {
              if (!included) {
                if (message.length === 0) {
                  return onChange(answer);
                }
                return onChange(`${message}
${answer}`);
              }

              return onChange(message.replace(answer, '').trim());
            }}
          >
            {included && <IconCheck className={'size-6 text-green-600'} />}{' '}
            {answer}
          </Button>
        );
      })}
    </div>
  );
};
