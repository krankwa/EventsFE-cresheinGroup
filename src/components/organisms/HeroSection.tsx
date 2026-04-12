import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";

// --- Types ---
export interface HeroProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroContainerProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroBadgeProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroTitleProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroSubtitleProps {
  children?: ReactNode;
  className?: string;
}

export interface HeroActionsProps {
  children?: ReactNode;
  className?: string;
}

// --- Styled Components ---
const StyledHero = styled.section.attrs<HeroProps>(({ className }) => ({
  className:
    `relative overflow-hidden py-20 md:py-32 px-4 ${className || ""}`.trim(),
}))``;

const StyledContainer = styled.div.attrs<HeroContainerProps>(
  ({ className }) => ({
    className:
      `container mx-auto text-center relative z-10 max-w-3xl ${className || ""}`.trim(),
  }),
)``;

const BlobOne = styled.div.attrs<{ className?: string }>(({ className }) => ({
  className:
    `absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-48 pointer-events-none ${className || ""}`.trim(),
}))``;

const BlobTwo = styled.div.attrs<{ className?: string }>(({ className }) => ({
  className:
    `absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-32 pointer-events-none ${className || ""}`.trim(),
}))``;

const StyledBadge = styled.div.attrs<HeroBadgeProps>(({ className }) => ({
  className:
    `inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-pulse ${className || ""}`.trim(),
}))``;

const StyledTitle = styled.h1.attrs<HeroTitleProps>(({ className }) => ({
  className:
    `text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 ${className || ""}`.trim(),
}))``;

const StyledSubtitle = styled.p.attrs<HeroSubtitleProps>(({ className }) => ({
  className:
    `text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto ${className || ""}`.trim(),
}))``;

const StyledActions = styled.div.attrs<HeroActionsProps>(({ className }) => ({
  className:
    `flex flex-col sm:flex-row gap-4 justify-center ${className || ""}`.trim(),
}))``;

// --- Context ---
const HeroContext = createContext<{ withinHero: boolean } | null>(null);

function useHeroContext(componentName: string) {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a <HeroSection>`);
  }
  return context;
}

// --- Compound Components ---
export const HeroSection = ({ children, className }: HeroProps) => {
  return (
    <HeroContext.Provider value={{ withinHero: true }}>
      <StyledHero className={className ?? ""}>{children}</StyledHero>
    </HeroContext.Provider>
  );
};

HeroSection.Background = function HeroSectionBackground({
  children,
  className,
}: HeroBackgroundProps) {
  useHeroContext("HeroSection.Background");
  return (
    <>
      {children || (
        <>
          <BlobOne className={className ?? ""} />
          <BlobTwo className={className ?? ""} />
        </>
      )}
    </>
  );
};

HeroSection.Container = function HeroSectionContainer({
  children,
  className,
}: HeroContainerProps) {
  useHeroContext("HeroSection.Container");
  return <StyledContainer className={className ?? ""}>{children}</StyledContainer>;
};

HeroSection.Badge = function HeroSectionBadge({
  children,
  className,
}: HeroBadgeProps) {
  useHeroContext("HeroSection.Badge");
  return <StyledBadge className={className ?? ""}>{children}</StyledBadge>;
};

HeroSection.Title = function HeroSectionTitle({
  children,
  className,
}: HeroTitleProps) {
  useHeroContext("HeroSection.Title");
  return <StyledTitle className={className ?? ""}>{children}</StyledTitle>;
};

HeroSection.Subtitle = function HeroSectionSubtitle({
  children,
  className,
}: HeroSubtitleProps) {
  useHeroContext("HeroSection.Subtitle");
  return <StyledSubtitle className={className ?? ""}>{children}</StyledSubtitle>;
};

HeroSection.Actions = function HeroSectionActions({
  children,
  className,
}: HeroActionsProps) {
  useHeroContext("HeroSection.Actions");
  return <StyledActions className={className ?? ""}>{children}</StyledActions>;
};
