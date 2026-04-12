import styled from "styled-components";
import { Button } from "./button";

const StyledErrorContainer = styled.div.attrs({
  className: "rounded-lg border-red-200 bg-red-50 p-6 text-center text-red-800"
})``;

const StyledErrorMessage = styled.p.attrs({
  className: "mb-4"
})``;

const StyledRetryButton = styled(Button).attrs({
  variant: "outline",
  className: "border-red-200 text-red-800 hover:bg-red-100"
})``;

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StyledErrorContainer>
      <StyledErrorMessage>{message}</StyledErrorMessage>
      {onRetry && (
        <StyledRetryButton onClick={onRetry}>
          Try Again
        </StyledRetryButton>
      )}
    </StyledErrorContainer>
  );
}
