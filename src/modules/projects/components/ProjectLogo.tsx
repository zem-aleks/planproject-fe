export const ProjectLogo = ({
  url,
  size,
}: {
  url: string | undefined | null;
  size: 'small' | 'medium' | 'large';
}) => {
  const sizeClasses = {
    small: 'size-10',
    medium: 'size-14',
    large: 'size-20',
  };
  return (
    <div
      className={`${sizeClasses[size]} overflow-hidden rounded-md border border-gray-200`}
      style={{
        backgroundColor: `rgba(255, 255, 255, 0)`,
      }}
    >
      <img
        src={url || 'https://placehold.co/200x200'}
        alt="Project Logo"
        className="h-full w-full rounded-md object-contain object-center"
      />
    </div>
  );
};
