import styled from "styled-components";
import type { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

const StyledLoadingGridContainer = styled.div.attrs({
  className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
})``;

const StyledLoadingCardWrapper = styled.div.attrs({
  className: "space-y-4"
})``;

export function LoadingGridContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <StyledLoadingGridContainer className={className}>{children}</StyledLoadingGridContainer>;
}

interface LoadingProps {
  count?: number;
}

export function Loading({ count = 6 }: LoadingProps) {
  return (
    <LoadingGridContainer>
      {Array.from({ length: count }).map((_, i) => (
        <StyledLoadingCardWrapper key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </StyledLoadingCardWrapper>
      ))}
    </LoadingGridContainer>
  );
}
