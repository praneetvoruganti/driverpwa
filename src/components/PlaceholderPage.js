import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in-out;
  max-width: 500px;
  margin: 0 auto;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 8px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Illustration = styled.div`
  margin-bottom: 20px;
  color: #9e9e9e;
  font-size: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #f5f5f5;
`;

const Message = styled.p`
  color: #333;
  font-size: 18px;
  margin-bottom: 8px;
`;

const SubMessage = styled.p`
  color: #757575;
  font-size: 14px;
  margin-top: 0;
`;

const PlaceholderPage = ({ title, icon, message, subMessage, isVisible, onBack }) => {
  if (!isVisible) return null;
  
  const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
    </svg>
  );
  
  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
        <Title>{title}</Title>
      </Header>
      <Content>
        <Illustration>
          {icon}
        </Illustration>
        <Message>{message}</Message>
        {subMessage && <SubMessage>{subMessage}</SubMessage>}
      </Content>
    </PageContainer>
  );
};

export default PlaceholderPage;
