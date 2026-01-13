import { PageTemplate } from '@/modules/home/components/PageTemplate';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';

export const StaticPage = ({ content }: { content: string }) => {
  return (
    <PageTemplate>
      {() => (
        <section className="relative z-40 flex items-center justify-center pt-32 pb-40">
          <div className="container mx-auto px-4">
            <Card className={'min-h-[100vh] gap-0 px-8'}>
              <MarkdownFormat>{content}</MarkdownFormat>
            </Card>
          </div>
        </section>
      )}
    </PageTemplate>
  );
};
