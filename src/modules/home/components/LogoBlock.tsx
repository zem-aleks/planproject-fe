export const LogoBlock = () => {
  return (
    <div className={'flex items-center'}>
      <img
        src={
          'https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/planproject_logo_transparent.png'
        }
        alt={'logo'}
        className="size-10"
      />
      <span className="">PlanProject.ai</span>
    </div>
  );
};
