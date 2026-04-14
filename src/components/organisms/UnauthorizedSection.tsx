import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import styled from "styled-components";
import { Button } from "../../components/ui/button";

const StyledContainer = styled.div.attrs({
  className:
    "min-h-screen flex flex-col items-center justify-center bg-muted/10 p-4",
})``;

const IconWrapper = styled.div.attrs({
  className:
    "w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6",
})``;

const Title = styled.h1.attrs({
  className: "text-3xl font-bold mb-2",
})``;

const Description = styled.p.attrs({
  className: "text-muted-foreground mb-8 text-center max-w-md",
})``;

export function UnauthorizedSection() {
  return (
    <StyledContainer>
      <IconWrapper>
        <ShieldAlert className="w-8 h-8 text-destructive" />
      </IconWrapper>
      <Title>Access Denied</Title>
      <Description>
        You do not have the necessary permissions to access this page. Please
        contact your system administrator if you believe this is an error.
      </Description>
      <Button asChild>
        <Link to="/">Back to Safety</Link>
      </Button>
    </StyledContainer>
  );
}
