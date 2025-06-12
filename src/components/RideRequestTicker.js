import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import L from 'leaflet';

// Animation keyframes
const slideInFromBottom = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutToTop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-50px);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Custom markers for pickup and destination - same as in RideRequestBanner
const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMEM3LjU4MiAwIDQgMy41ODIgNCAxMEM0IDE0LjI5MiAxMS4xOTIgMjUuNjU4IDExLjE5MiAyNS42NThDMTEuMjk3MyAyNS44MjY4IDExLjQ1NjEgMjUuOTY0MiAxMS42NDgyIDI2LjA1NTdDMTEuODQwMyAyNi4xNDczIDEyLjA1NTggMjYuMTg4NCAxMi4yNjg4IDI2LjE3MzlDMTIuNDgxOCAyNi4xNTkzIDEyLjY4NzQgMjYuMDg5NiAxMi44NjI5IDI1Ljk3MzRDMTMuMDM4MyAyNS44NTcyIDEzLjE3NiAyNS42OTgzIDEzLjI2IDI1LjUxQzEzLjc1NCAxNC41IDIwIDEwIDIwIDEwQzIwIDMuNTgyIDE2LjQxOCAwIDEyIDBaIiBmaWxsPSIjRjQ0MzM2Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32]
});

// Styled Components
const TickerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0;
  z-index: 100;
  pointer-events: auto;
  border-radius: 0;
  max-height: 60vh;
  overflow-y: auto;
`;

const RideCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 0 0 8px 0;
  overflow: hidden;
  animation: ${props => props.isExiting ? slideOutToTop : slideInFromBottom} 0.5s ease-in-out forwards;
  min-height: 120px;
  width: 100%;
  transition: all 0.3s ease;
  border-top: 5px solid #4CAF50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const DestinationSection = styled.div`
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
`;

const DestinationHeading = styled.div`
  font-size: 10px;
  color: #757575;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const DestinationText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 4px 0;
  max-width: 100%;
`;

const DetailsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-top: 1px solid #f0f0f0;
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 10px;
  color: #9e9e9e;
  text-transform: uppercase;
`;

const DetailValue = styled.div`
  font-size: ${props => (props.large ? '16px' : '14px')};
  font-weight: ${props => (props.large ? '600' : '500')};
  color: #4CAF50;
`;

const ActionButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  height: 48px;
  padding: 0 28px;
  border-radius: 6px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #3b9c3f;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }

  &:active {
    background-color: #2e7d32;
    transform: translateY(0);
  }
`;

const CountIndicator = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease forwards;
  margin: 0 8px;
`;

const PickupRadius = styled.div`
  display: inline-block;
  background-color: #E3F2FD;
  color: #1976D2;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 4px;
`;

const RefreshButton = styled.button`
  background-color: transparent;
  color: #4CAF50;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

/**
 * RideRequestTicker Component
 * 
 * @param {Object} props
 * @param {boolean} props.isVisible - Controls visibility of the ticker
 * @param {Array} props.rideRequests - Array of ride request objects
 * @param {Function} props.onAccept - Handler for when a ride is accepted
 */
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 12h7V5l-2.35 1.35z" />
  </svg>
);

function getRandomDistance() {
  // Return a random pickup radius rounded up to the nearest hundred
  const rawDistance = Math.random() * 300 + 200;
  return Math.ceil(rawDistance / 100) * 100;
}

// Timer Progress Animation
const timerProgress = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

const TimerBar = styled.div`
  height: 3px;
  background-color: #4CAF50;
  position: absolute;
  left: 0;
  bottom: 0;
  animation: ${props => props.isActive ? css`${timerProgress} 5s linear forwards` : 'none'};
  width: ${props => props.isActive ? '100%' : '0%'};
  opacity: 0.7;
`;

const RideRequestTicker = ({ 
  isVisible = true,
  rideRequests = [],
  onAccept,
  onRefresh,
  comprehensiveView = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedRequests, setDisplayedRequests] = useState(rideRequests);
  const [timerActive, setTimerActive] = useState(true);
  const timerRef = useRef(null);
  
  // Reset timer whenever the component receives new ride requests
  useEffect(() => {
    setDisplayedRequests(rideRequests);
    if (rideRequests.length === 0) {
      clearTimeout(timerRef.current);
      setTimerActive(false);
      return;
    }
    setCurrentIndex(0);
    setTimerActive(true);
  }, [rideRequests]);

  // Handle the round robin ticker functionality
  useEffect(() => {
    if (!isVisible || displayedRequests.length <= 1 || comprehensiveView) return;
    
    // Start the timer animation
    setTimerActive(true);
    
    const rotateRequests = () => {
      setTimerActive(false); // Stop the timer animation
      setIsExiting(true);
      
      setTimeout(() => {
        setIsExiting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayedRequests.length);
        setTimerActive(true); // Start the timer for the next card
      }, 500); // Wait for exit animation to complete
    };
    
    timerRef.current = setTimeout(rotateRequests, 5000);
    return () => {
      clearTimeout(timerRef.current);
      setTimerActive(false);
    };
  }, [isVisible, displayedRequests, currentIndex, comprehensiveView]);

  const handleAcceptRide = useCallback((requestToAccept, index) => {
    if (displayedRequests.length === 0) return;
    
    // If in comprehensive view, use the provided request and index
    // Otherwise use the current index
    let acceptedRequest, acceptedIndex;
    if (comprehensiveView) {
      acceptedRequest = requestToAccept;
      acceptedIndex = index;
    } else {
      acceptedRequest = displayedRequests[currentIndex];
      acceptedIndex = currentIndex;
    }
    
    // Create a new array without the accepted ride
    const updatedRequests = displayedRequests.filter((_, idx) => idx !== acceptedIndex);
    setDisplayedRequests(updatedRequests);
    
    // Reset index if needed
    if (currentIndex >= updatedRequests.length) {
      setCurrentIndex(0);
    }
    
    // Call parent handler with the accepted ride details
    if (onAccept) onAccept(acceptedRequest);
  }, [displayedRequests, currentIndex, onAccept, comprehensiveView]);

  // If there are no ride requests or ticker is not visible, don't render anything
  if (!isVisible || displayedRequests.length === 0) return null;

  const currentRequest = displayedRequests[currentIndex];
  
  // Function to render a single ride card for standard view
  const renderRideCard = (request, index, isActive = false) => (
    <RideCard 
      key={`ride-${index}`} 
      isExiting={isActive && isExiting}
    >
      {isActive && <TimerBar isActive={timerActive} />}
      <DestinationSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DestinationHeading>DESTINATION</DestinationHeading>
          {displayedRequests.length > 1 && (
            <CountIndicator>
              {currentIndex + 1}/{displayedRequests.length}
            </CountIndicator>
          )}
        </div>
        <DestinationText>{request.destination}</DestinationText>
        <PickupRadius>
          {getRandomDistance()}m away
        </PickupRadius>
      </DestinationSection>
      
      <DetailsSection>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DetailColumn>
            <DetailLabel>FARE</DetailLabel>
            <DetailValue large>Meter Fare Only</DetailValue>
          </DetailColumn>
        </div>
        
        <ActionButton onClick={() => handleAcceptRide(request, index)}>
          Accept
        </ActionButton>
      </DetailsSection>
    </RideCard>
  );
  
  // Function to render compact list item for comprehensive view
  const renderCompactListItem = (request, index) => (
    <div
      key={`compact-${index}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #eaeaea',
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
        borderLeft: '4px solid #4CAF50'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{request.destination}</div>
        <div style={{ fontSize: '12px', color: '#757575' }}>
          <span>{getRandomDistance()}m away</span>
        </div>
      </div>
      <button
        onClick={() => handleAcceptRide(request, index)}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 16px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minWidth: '90px',
          textAlign: 'center'
        }}
      >
        Accept
      </button>
    </div>
  );
  
  return (
    <TickerContainer style={{
      maxHeight: comprehensiveView ? '60vh' : 'auto',
      overflowY: comprehensiveView ? 'auto' : 'visible',
      padding: comprehensiveView ? '0' : '16px',
      backgroundColor: comprehensiveView ? '#fff' : 'transparent',
      borderRadius: comprehensiveView ? '8px' : '0',
      boxShadow: comprehensiveView ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
    }}>
      {comprehensiveView ? (
        // Comprehensive compact view - list all rides
        <div style={{ width: '100%' }}>
          {displayedRequests.map((request, index) => renderCompactListItem(request, index))}
        </div>
      ) : (
        // Standard view - show one ride at a time
        renderRideCard(currentRequest, currentIndex, true)
      )}
    </TickerContainer>
  );
};

export default RideRequestTicker;
