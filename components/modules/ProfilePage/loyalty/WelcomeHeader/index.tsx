interface WelcomeHeaderProps {
  userName: string;
  membershipTier: string;
  className?: string;
}

export default function WelcomeHeader({
  userName,
  membershipTier,
  className = '',
}: WelcomeHeaderProps) {
  return (
    <div className={`${className}`}>
      <h1 className='text-foreground text-base md:text-2xl md:font-serif'>
        Welcome, {userName}
      </h1>
    </div>
  );
}
