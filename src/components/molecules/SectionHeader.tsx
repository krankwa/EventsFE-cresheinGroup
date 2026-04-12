import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";

// --- Types ---
export interface SectionHeaderProps {
  children?: ReactNode;
  className?: string;
}

export interface SectionHeaderTitleProps {
  children?: ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface SectionHeaderDescriptionProps {
  children?: ReactNode;
  className?: string;
}

export interface SectionHeaderActionProps {
  children?: ReactNode;
  className?: string;
}

//styled components
const StyledSectionHeader = styled.div.attrs<SectionHeaderProps>(
  ({ className }) => ({
    className:
      `flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className || ""}`.trim(),
  }),
)``;

const StyledContent = styled.div``;

const StyledTitle = styled.h2.attrs<SectionHeaderTitleProps>(
  ({ className }) => ({
    className: `text-3xl font-bold tracking-tight ${className || ""}`.trim(),
  }),
)``;

const StyledDescription = styled.p.attrs<SectionHeaderDescriptionProps>(
  ({ className }) => ({
    className: `text-muted-foreground mt-1 ${className || ""}`.trim(),
  }),
)``;

const StyledAction = styled.div.attrs<SectionHeaderActionProps>(
  ({ className }) => ({
    className: `${className || ""}`.trim(),
  }),
)``;

//for useCOntecxt
const SectionHeaderContext = createContext<{ withinHeader: boolean } | null>(
  null,
);

function useSectionHeaderContext(componentName: string) {
  const context = useContext(SectionHeaderContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a <SectionHeader>`);
  }
  return context;
}

//compound component used here
export const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return (
    <SectionHeaderContext.Provider value={{ withinHeader: true }}>
      <StyledSectionHeader className={className || ""}>
        {children}
      </StyledSectionHeader>
    </SectionHeaderContext.Provider>
  );
};
SectionHeader.displayName = "SectionHeader";

SectionHeader.Content = function SectionHeaderContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  useSectionHeaderContext("SectionHeader.Content");
  return <StyledContent className={className || ""}>{children}</StyledContent>;
};


SectionHeader.Title = function SectionHeaderTitle({
  children,
  className,
  as,
}: SectionHeaderTitleProps) {
  useSectionHeaderContext("SectionHeader.Title");
  return (
    <StyledTitle className={className || ""} as={as || "h2"}>
      {children}
    </StyledTitle>
  );
};


SectionHeader.Description = function SectionHeaderDescription({
  children,
  className,
}: SectionHeaderDescriptionProps) {
  useSectionHeaderContext("SectionHeader.Description");
  return (
    <StyledDescription className={className || ""}>{children}</StyledDescription>
  );
};


SectionHeader.Action = function SectionHeaderAction({
  children,
  className,
}: SectionHeaderActionProps) {
  useSectionHeaderContext("SectionHeader.Action");
  return <StyledAction className={className || ""}>{children}</StyledAction>;
};

