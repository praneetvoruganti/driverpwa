import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const TogglePill = styled.div`
  display: flex;
  width: 100%;
  height: 3.5rem;
  background-color: #f8f8f8;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0, 0, 0, 0.02);
`;

const ToggleOption = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#fff' : '#333'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 15px;
  z-index: 2;
  transition: all 0.3s ease;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 6px;
  text-shadow: ${props => props.active ? '0px 1px 1px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const Slider = styled.div`
  position: absolute;
  height: 100%;
  width: 50%;
  border-radius: 20px;
  background-color: ${props => props.online ? '#4CAF50' : '#757575'};
  background-image: ${props => props.online ? 'linear-gradient(to bottom, #4CAF50, #43A047)' : 'linear-gradient(to bottom, #757575, #616161)'};
  box-shadow: 0px 2px 8px ${props => props.online ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 0, 0, 0.15)'};
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  left: ${props => props.online ? '50%' : '0'};
`;

const StatusIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleSwitch = ({ onChange }) => {
  const [isOnline, setIsOnline] = useState(false);

  const toggleStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (onChange) onChange(newStatus);
  };

  const OnlineIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
    </svg>
  );

  const OfflineIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" fill="currentColor"/>
    </svg>
  );

  return (
    <ToggleContainer>
      <TogglePill onClick={toggleStatus}>
        <ToggleOption active={!isOnline}>
          <StatusIcon><OfflineIcon /></StatusIcon>
          Go Offline
        </ToggleOption>
        <ToggleOption active={isOnline}>
          <StatusIcon><OnlineIcon /></StatusIcon>
          Go Online
        </ToggleOption>
        <Slider online={isOnline} />
      </TogglePill>
    </ToggleContainer>
  );
};

export default ToggleSwitch;
