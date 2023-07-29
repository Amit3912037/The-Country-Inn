import styled from 'styled-components';

const StyledLogo = styled.div`
  text-align: center;
  margin-bottom: 1.2rem;
`;

const Img = styled.img`
  height: 8.4rem;
  width: auto;
`;

const Title = styled.p`
  font-weight: 400;
  line-height: 0;
`;
function Logo() {
  return (
    <StyledLogo>
      <Img src="/logo.png" alt="Logo" />
      <Title>The country Inn</Title>
    </StyledLogo>
  );
}

export default Logo;
