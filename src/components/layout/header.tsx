import { Logo } from "..";

export const Header = () => {
  return (
    <header className="flex w-full items-center justify-center bg-background">
      <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px]">
        <Logo size={100} />
      </div>
    </header>
  );
};
