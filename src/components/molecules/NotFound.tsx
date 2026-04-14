import styled from "styled-components";
import type { ReactNode } from "react";

const StyledNotFound = styled.div.attrs({
  className: "col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl"
})``;

interface NotFoundProps {
  children: ReactNode;
  className?: string;
}

export function NotFound({ children, className }: NotFoundProps) {
  return (
    <StyledNotFound className={className}>
      {children}
    </StyledNotFound>
  );
}
