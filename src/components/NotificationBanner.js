import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #FFC107;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const BannerText = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const Description = styled.div`
  font-size: 13px;
  color: #757575;
  line-height: 1.4;
`;

const IconWrapper = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #FFF9C4;
  color: #FFA000;
`;

const ArrowIcon = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  color: #9e9e9e;
  transition: transform 0.2s ease;
  
  ${Banner}:hover & {
    transform: translateX(3px);
    color: #757575;
  }
`;

const NotificationBanner = () => {
  const [permissionState, setPermissionState] = useState('default');
  
  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionState('not-supported');
      return;
    }
    
    setPermissionState(Notification.permission);
  }, []);

  const requestPermission = () => {
    if (permissionState === 'granted' || permissionState === 'not-supported') return;
    
    Notification.requestPermission().then(result => {
      setPermissionState(result);
    });
  };
  
  if (permissionState === 'granted' || permissionState === 'not-supported') {
    return null;
  }
  
  const NotificationIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor"/>
    </svg>
  );
  
  const ChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z" fill="currentColor"/>
    </svg>
  );
  
  return (
    <Banner onClick={requestPermission}>
      <ContentWrapper>
        <IconWrapper>
          <NotificationIcon />
        </IconWrapper>
        <BannerText>
          <Title>Enable Notifications</Title>
          <Description>
            Get instant alerts when riders are nearby or when you receive a ride request.
          </Description>
        </BannerText>
      </ContentWrapper>
      <ArrowIcon>
        <ChevronRight />
      </ArrowIcon>
    </Banner>
  );
};

export default NotificationBanner;
