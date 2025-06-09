import React, { useState } from 'react';
import styled from 'styled-components';
import ToggleSwitch from './ToggleSwitch';
import VehicleDetails from './VehicleDetails';
import LiveMap from './LiveMap';
import NotificationBanner from './NotificationBanner';
import RideRequestBanner from './RideRequestBanner';
import RideConfirmationScreen from './RideConfirmationScreen';
import MainMenu from './MainMenu';
import PlaceholderPage from './PlaceholderPage';
import PastRides from './PastRides';
import Promise2Pay from './Promise2Pay';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  min-height: 100vh;
  animation: fadeIn 0.4s ease-in-out;
  padding: 0;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  position: relative;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #333;
  margin: 0;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  font-family: 'Arial', sans-serif;
  align-items: right;
  
  span.highlight {
    color: #4CAF50;
    font-size: 48px;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.online ? '#2E7D32' : '#757575'};
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.online ? '#2E7D32' : '#9E9E9E'};
    margin-right: 6px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem;
`;

const Note = styled.div`
  background-color: ${props => props.online ? '#e8f5e9' : '#f5f5f5'};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 14px;
  color: ${props => props.online ? '#2E7D32' : '#616161'};
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease-in-out;
  opacity: ${props => props.visible ? '1' : '0'};
  transform: translateY(${props => props.visible ? '0' : '10px'});
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NoteIcon = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const TestRequestButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 99;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const sampleRideRequests = [
  {
    pickup: 'Koramangala, Bengaluru',
    destination: 'Electronic City, Bengaluru',
    fare: 'Meter fare',
    distance: '12.4 km',
    duration: '25 mins',
    timeout: 15
  },
  {
    pickup: 'Indiranagar, Bengaluru',
    destination: 'Whitefield, Bengaluru',
    fare: 'Meter fare',
    distance: '16.8 km',
    duration: '32 mins',
    timeout: 15
  },
  {
    pickup: 'MG Road, Bengaluru',
    destination: 'Hebbal, Bengaluru',
    fare: 'Meter fare',
    distance: '14.2 km',
    duration: '28 mins',
    timeout: 15
  }
];

const HomeScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [showRideConfirmation, setShowRideConfirmation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentRideRequest, setCurrentRideRequest] = useState(sampleRideRequests[0]);
  const [currentPage, setCurrentPage] = useState(null);

  const handleToggleChange = (status) => {
    setIsOnline(status);
    // In a real app, this would update the driver's status on the server
  };
  
  const handleShowRideRequest = () => {
    if (!isOnline) {
      // Only show ride requests when online
      return;
    }
    
    // Pick a random ride request from our samples
    const randomIndex = Math.floor(Math.random() * sampleRideRequests.length);
    setCurrentRideRequest(sampleRideRequests[randomIndex]);
    setShowRideRequest(true);
  };
  
  const handleCloseRideRequest = () => {
    setShowRideRequest(false);
  };
  
  const handleAcceptRide = () => {
    setShowRideRequest(false);
    // Show the ride confirmation screen
    setShowRideConfirmation(true);
  };
  
  const handleEndRide = () => {
    setShowRideConfirmation(false);
    // Reset the online status after ride completion
    setIsOnline(true);
    // In a real app, this would handle ride completion, payment, etc.
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const handleMenuNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    // Set the current page based on the route
    setCurrentPage(route);
    // Close the menu when navigating
    setShowMenu(false);
  };
  
  const handleBackFromPage = () => {
    setCurrentPage(null);
  };

  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
    </svg>
  );
  
  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
    </svg>
  );
  
  const HistoryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
    </svg>
  );

  const PaymentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
    </svg>
  );
  
  const RequestIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="white"/>
    </svg>
  );

  return (
    <PageContainer>
      <RideRequestBanner 
        isVisible={showRideRequest} 
        onClose={handleCloseRideRequest} 
        onAccept={handleAcceptRide} 
        rideDetails={currentRideRequest}
      />
      
      <RideConfirmationScreen
        isVisible={showRideConfirmation}
        onClose={handleEndRide}
        rideDetails={{
          ...currentRideRequest,
          passengerName: 'Rahul Kumar',
          passengerRating: 4.8,
          passengerPhone: '+91 98765 43210' // Adding phone number for the call functionality
        }}
      />
      

      
      {/* Past Rides Page */}
      <PastRides 
        isVisible={currentPage === 'past-rides'}
        onBack={handleBackFromPage}
      />
      
      <Promise2Pay
        isVisible={currentPage === 'promise-to-pay'}
        onBack={handleBackFromPage}
      />
      
      <PlaceholderPage
        title="Settings"
        icon={<SettingsIcon />}
        message="App Settings"
        subMessage="Customize your app experience"
        isVisible={currentPage === 'settings'}
        onBack={handleBackFromPage}
      />
      
      <Header>
        <TopBar>
          <MenuButton onClick={toggleMenu}>
            <MenuIcon />
            {showMenu && (
              <MainMenu 
                isOpen={showMenu} 
                onClose={toggleMenu} 
                onNavigate={handleMenuNavigation} 
              />
            )}
          </MenuButton>
          <PageTitle>Y A B N A <span className="highlight">.</span></PageTitle>
          <div style={{ width: '48px' }}></div> {/* Empty div for balanced spacing */}
        </TopBar>
        <StatusContainer>
          <StatusIndicator online={isOnline}>
            {isOnline ? 'Online' : 'Offline'}
          </StatusIndicator>
        </StatusContainer>
        <ToggleSwitch onChange={handleToggleChange} />
      </Header>
      
      <ContentContainer>
        <VehicleDetails />
        
        <LiveMap />
        
        <NotificationBanner />
        
        <Note online={isOnline} visible={isOnline}>
          <NoteIcon>
            <InfoIcon />
          </NoteIcon>
          You're visible to riders in your area. Keep your phone and data connection active.
        </Note>
      </ContentContainer>
      
      {isOnline && (
        <TestRequestButton onClick={handleShowRideRequest} title="Simulate Ride Request">
          <RequestIcon />
        </TestRequestButton>
      )}
    </PageContainer>
  );
};

export default HomeScreen;
