// components/PageContainer/PageContainer.tsx
import { Flex } from "@radix-ui/themes";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <Flex
      direction="column"
      className={`pt-20 px-4 sm:px-6 lg:px-8 xl:px-12 md:!pl-[100px] min-h-screen ${className} max-xl:pt-32 bg-off-white w-full max-w-full overflow-x-hidden`}
      gap="5"
    >
      <div className="w-full max-w-full mx-auto">
        {children}
      </div>
    </Flex>
  );
};