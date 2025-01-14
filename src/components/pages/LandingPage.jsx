import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Hero = styled.section`
  background: linear-gradient(270deg, #0a2463, #3e92cc, #1e1b18);
  background-size: 600% 600%;
  animation: gradientShift 30s ease infinite;

  @keyframes gradientShift {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 20px;
`;

const HeroContent = styled.div`
  max-width: 800px;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
`;

const Section = styled.section`
  padding: 80px 20px;
  background-color: ${props => props.dark ? '#f5f5f5' : '#fff'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const CTASection = styled(Section)`
  text-align: center;
  background-color: #007bff;
  color: white;
`;

const Button = styled.a`
  display: inline-block;
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
`;

const MessageBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 15px;
  display: inline-block;
  margin-left: 20px;
`;

const AnimatedText = styled.span`
  background: linear-gradient(
    to right,
    #ffffff 45%,
    #1a3a73 48%,
    #5aa2e0 50%,
    #1a3a73 52%,
    #ffffff 55%
  );
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shine 16s ease-in-out infinite;

  @keyframes shine {
    0%, 100% {
      background-position: 200% center;
    }
    50% {
      background-position: -100% center;
    }
  }
`;

const LandingPage = ({ handleGetStarted }) => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <HeaderContainer>
      <Hero>
        <HeroContent>
          <h1><AnimatedText>Corporate Development Tool V1.0</AnimatedText></h1>
          <p>Automating NBO Analysis</p>
          <Button onClick={handleGetStarted} style={{ cursor: 'pointer' }}>Get Started</Button>
        </HeroContent>
      </Hero>

      <Section>
        <Container>
          <SectionTitle>About Us</SectionTitle>
          <p>
            This is the ultimate redesign in a long list of prior versions. Its purpose is to eliminate Excel failures and automate data analysis based on input straight from the source.
            With an AI import system, you can upload your Excel sheets and within seconds have all the output you need to evaluate companies at an introductory level. Without data rounding
            at every corner, this method also guarantees the most accurate calculations possible. This is the first version of this redesign, so expect more changes down the road with even more flexibility.
          </p>
        </Container>
      </Section>

      <Section dark='true'>
        <Container>
          <SectionTitle>Our Features</SectionTitle>
          <Features>
            <FeatureCard>
              <h3 style={{ marginBottom: '10px' }}>AI Data Import</h3>
              <p>Upload your Excel & instantly have your data populated here.</p>
            </FeatureCard>
            <FeatureCard>
              <h3 style={{ marginBottom: '10px' }}>In-Depth Analysis & Sensitivities</h3>
              <p>Watch as your data accurately turns into a visually digestible resource.</p>
            </FeatureCard>
            <FeatureCard>
              <h3 style={{ marginBottom: '10px' }}>Cloud-Based Capabilities</h3>
              <p>Save your data for you and your team members to access across all networks (In Progress).</p>
            </FeatureCard>
          </Features>
        </Container>
      </Section>

      <CTASection>
        <Container>
          <SectionTitle>Ready to Get Started?</SectionTitle>
          <p>Join us today and experience the difference</p>
          <Button onClick={() => setShowMessage(true)}>Sign Up Now</Button>
          {showMessage && (
            <MessageBox>
              This feature is still under development
            </MessageBox>
          )}
        </Container>
      </CTASection>

      <Footer>
        <p>&copy; {new Date().getFullYear()} Mondelez International. All rights reserved.</p>
      </Footer>
    </HeaderContainer>
  );
};

export default LandingPage;