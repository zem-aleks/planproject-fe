import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { ProjectLogo } from '@/modules/projects/components/ProjectLogo';
import {
  CREATE_PROJECT_SCHEMA,
  ProjectCreateData,
} from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Input } from '@/ui/input.tsx';
import { Label } from '@/ui/label.tsx';
import { Textarea } from '@/ui/textarea.tsx';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  defaultValues: ProjectCreateData;
  onSubmit: (data: ProjectCreateData) => void;
};

export const ProjectForm = ({ defaultValues, onSubmit }: Props): ReactNode => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCreateData>({
    resolver: zodResolver(CREATE_PROJECT_SCHEMA),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-8 py-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          {...register('title')}
          id="title"
          placeholder="Enter project title"
          error={Boolean(errors.title)}
        />
        {errors.title && (
          <p className="text-xs text-red-700">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <p className={'text-muted-foreground text-xs'}>
          This description is used as a part of prompt for the project. Add
          information about the project, company, its purpose, and any other
          relevant details that can help the project understand its role better.
        </p>
        <Textarea
          {...register('description')}
          id="description"
          placeholder="Enter description"
          error={Boolean(errors.description)}
        />
        {errors.description && (
          <p className="text-xs text-red-700">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-row justify-between gap-4">
        <div className="flex grow flex-col gap-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <p className={'text-muted-foreground text-xs'}>
            Absolute URL to the logo image of the project. Big images can cause
            slow page loading.
          </p>
          <Input
            {...register('logoUrl')}
            id="logoUrl"
            placeholder="Enter logo URL"
            error={Boolean(errors.logoUrl)}
          />
          {errors.logoUrl && (
            <p className="text-xs text-red-700">{errors.logoUrl.message}</p>
          )}
        </div>

        <ProjectLogo url={watch('logoUrl')} size={'large'} />
      </div>

      <Button className="mt-4" type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  );
};
