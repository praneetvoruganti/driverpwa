import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom markers for pickup and destination
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMEM3LjU4MiAwIDQgMy41ODIgNCAxMEM0IDE0LjI5MiAxMS4xOTIgMjUuNjU4IDExLjE5MiAyNS42NThDMTEuMjk3MyAyNS44MjY4IDExLjQ1NjEgMjUuOTY0MiAxMS42NDgyIDI2LjA1NTdDMTEuODQwMyAyNi4xNDczIDEyLjA1NTggMjYuMTg4NCAxMi4yNjg4IDI2LjE3MzlDMTIuNDgxOCAyNi4xNTkzIDEyLjY4NzQgMjYuMDg5NiAxMi44NjI5IDI1Ljk3MzRDMTMuMDM4MyAyNS44NTcyIDEzLjE3NiAyNS42OTgzIDEzLjI2IDI1LjUxQzEzLjc1NCAxNC41IDIwIDEwIDIwIDEwQzIwIDMuNTgyIDE2LjQxOCAwIDEyIDBaIiBmaWxsPSIjNENBRjUwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32]
});

const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMEM3LjU4MiAwIDQgMy41ODIgNCAxMEM0IDE0LjI5MiAxMS4xOTIgMjUuNjU4IDExLjE5MiAyNS42NThDMTEuMjk3MyAyNS44MjY4IDExLjQ1NjEgMjUuOTY0MiAxMS42NDgyIDI2LjA1NTdDMTEuODQwMyAyNi4xNDczIDEyLjA1NTggMjYuMTg4NCAxMi4yNjg4IDI2LjE3MzlDMTIuNDgxOCAyNi4xNTkzIDEyLjY4NzQgMjYuMDg5NiAxMi44NjI5IDI1Ljk3MzRDMTMuMDM4MyAyNS44NTcyIDEzLjE3NiAyNS42OTgzIDEzLjI2IDI1LjUxQzEzLjc1NCAxNC41IDIwIDEwIDIwIDEwQzIwIDMuNTgyIDE2LjQxOCAwIDEyIDBaIiBmaWxsPSIjRjQ0MzM2Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32]
});

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RequestBannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  max-width: 500px;
  margin: 0 auto;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out forwards;
  pointer-events: ${props => props.isExiting ? 'none' : 'auto'};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  height: 100%;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const HeaderBar = styled.div`
  width: 40px;
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin: 12px auto 8px;
`;

const RequestHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fff;
  position: relative;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  letter-spacing: -0.01em;
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountdownCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CircleProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 ${props => props.progress * 360}deg, 
    transparent ${props => props.progress * 360}deg 360deg
  );
  opacity: 0.15;
`;

const TimerLabel = styled.div`
  font-size: 14px;
  color: #757575;
  font-weight: 500;
`;

const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9;
  min-height: 250px;
  
  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 1;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }
  
  .leaflet-control-attribution {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.7);
    padding: 2px 5px;
  }
`;

const RideDetailCard = styled.div`
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  animation: ${fadeIn} 0.3s ease forwards;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1;
`;

const RouteInfo = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const IconColumn = styled.div`
  margin-right: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LocationIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.type === 'pickup' ? '#4CAF50' : '#F44336'};
  margin-bottom: ${props => props.type === 'pickup' ? '0' : 'auto'};
  position: relative;
  z-index: 1;
`;

const ConnectingLine = styled.div`
  width: 2px;
  height: 30px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

const LocationInfo = styled.div`
  flex-grow: 1;
`;

const LocationLabel = styled.div`
  font-size: 13px;
  color: #9e9e9e;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const LocationName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;

const RideDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
`;

const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || 'flex-start'};
`;

const DetailLabel = styled.div`
  font-size: 13px;
  color: #9e9e9e;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const DetailValue = styled.div`
  font-size: ${props => props.large ? '22px' : '15px'};
  font-weight: ${props => props.large ? '600' : '500'};
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RupeeSymbol = styled.span`
  font-family: system-ui;
`;

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 20px 20px;
  background-color: white;
`;

const ActionButton = styled.button`
  height: 54px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  
  &:active {
    transform: scale(0.98);
  }
`;

const DeclineButton = styled(ActionButton)`
  background-color: #f5f5f5;
  color: #757575;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const AcceptButton = styled(ActionButton)`
  background-color: #4CAF50;
  color: white;
  background-image: linear-gradient(to bottom, #4CAF50, #43A047);
  box-shadow: 0px 2px 8px rgba(76, 175, 80, 0.3);
  
  &:hover {
    background-color: #43A047;
  }
`;

const RideDetailsContainer = styled.div`
  background-color: white;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
`;

const IconWithCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f9f9f9;
  margin-right: 12px;
  color: #4CAF50;
`;

// Map coordinates for demo locations - now centered in Hyderabad
const centerPoint = [17.418618673261474, 78.46502565334217]; // Hyderabad center

const locationCoordinates = {
  'Banjara Hills, Hyderabad': [17.4156, 78.4347],
  'Hitech City, Hyderabad': [17.4435, 78.3772],
  'Secunderabad, Hyderabad': [17.4399, 78.4983],
  'Gachibowli, Hyderabad': [17.4401, 78.3489],
  'LB Nagar, Hyderabad': [17.3457, 78.5479],
  'Shamshabad, Hyderabad': [17.2403, 78.4294],
  // Keeping exact center point as a location
  'Hussain Sagar, Hyderabad': centerPoint
};

const getRoutePoints = (pickup, destination) => {
  const pickupCoords = locationCoordinates[pickup] || [17.4156, 78.4347]; // Default to Banjara Hills
  const destCoords = locationCoordinates[destination] || [17.4435, 78.3772]; // Default to Hitech City
  
  // Always make sure route passes through or near the center point
  // Generate points that create a route passing through the specified coordinates
  const midPoint1 = [
    (pickupCoords[0] + centerPoint[0]) / 2 + (Math.random() * 0.005 - 0.0025),
    (pickupCoords[1] + centerPoint[1]) / 2 + (Math.random() * 0.005 - 0.0025)
  ];
  
  const midPoint2 = [
    (centerPoint[0] + destCoords[0]) / 2 + (Math.random() * 0.005 - 0.0025),
    (centerPoint[1] + destCoords[1]) / 2 + (Math.random() * 0.005 - 0.0025)
  ];
  
  // Return a more complex route passing through multiple points
  return [pickupCoords, midPoint1, centerPoint, midPoint2, destCoords];
};

const RideRequestBanner = ({ 
  isVisible, 
  onClose, 
  onAccept, 
  rideDetails = {
    pickup: 'Banjara Hills, Hyderabad',
    destination: 'Hitech City, Hyderabad',
    fare: 'Meter fare',
    distance: '14.2 km',
    duration: '32 mins',
    timeout: 15 // seconds
  } 
}) => {
  const [timeLeft, setTimeLeft] = useState(rideDetails.timeout);
  const [isExiting, setIsExiting] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(12);
  
  const handleDecline = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);
  
  const handleAccept = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (onAccept) onAccept();
    }, 300);
  }, [onAccept]);
  
  // Initialize route and map center when banner becomes visible
  useEffect(() => {
    if (isVisible) {
      // Reset timer
      setTimeLeft(rideDetails.timeout);
      setIsExiting(false);
      
      // Set up map route
      const points = getRoutePoints(rideDetails.pickup, rideDetails.destination);
      setRoutePoints(points);
      
      // Use fixed center point for Hyderabad coordinates
      setMapCenter([17.418618673261474, 78.46502565334217]);
      
      // Set fixed zoom level for better view of the area
      setMapZoom(13);
    }
    
    return () => { /* cleanup if needed */ };
  }, [isVisible, rideDetails]);
  
  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (isVisible && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleDecline();
    }
    
    return () => clearInterval(interval);
  }, [isVisible, timeLeft, handleDecline]);
  
  if (!isVisible) return null;
  
  const RequestIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="currentColor"/>
    </svg>
  );
  
  return (
    <RequestBannerContainer isExiting={isExiting}>
      <HeaderBar />
      <RequestHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconWithCircle>
            <RequestIcon />
          </IconWithCircle>
          <Title>New Ride Request</Title>
        </div>
        <CountdownContainer>
          <TimerLabel>Expires in</TimerLabel>
          <CountdownCircle>
            <CircleProgress progress={timeLeft / rideDetails.timeout} />
            {timeLeft}
          </CountdownCircle>
        </CountdownContainer>
      </RequestHeader>
      
      <MapWrapper>
        {isVisible && (
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            scrollWheelZoom={false} 
            zoomControl={false}
            attributionControl={true}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routePoints.length > 0 && (
              <>
                <Marker position={routePoints[0]} icon={pickupIcon} />
                <Marker position={routePoints[routePoints.length-1]} icon={destinationIcon} />
                <Polyline 
                  positions={routePoints}
                  pathOptions={{ color: '#4CAF50', weight: 4, opacity: 0.7, dashArray: '5, 10' }}
                />
              </>
            )}
          </MapContainer>
        )}
        
        <RideDetailCard>
          <RouteInfo>
            <IconColumn>
              <LocationIcon type="pickup" />
              <ConnectingLine />
              <LocationIcon type="destination" />
            </IconColumn>
            <LocationInfo>
              <LocationLabel>PICKUP</LocationLabel>
              <LocationName>{rideDetails.pickup}</LocationName>
              <div style={{ height: '10px' }} />
              <LocationLabel>DESTINATION</LocationLabel>
              <LocationName>{rideDetails.destination}</LocationName>
            </LocationInfo>
          </RouteInfo>
        </RideDetailCard>
      </MapWrapper>
      
      <RideDetailsContainer>
        <RideDetails>
          <DetailBlock>
            <DetailLabel>ESTIMATED FARE</DetailLabel>
            <DetailValue large>
              {rideDetails.fare}
            </DetailValue>
          </DetailBlock>
          
          <DetailBlock>
            <DetailLabel>DISTANCE</DetailLabel>
            <DetailValue>{rideDetails.distance}</DetailValue>
          </DetailBlock>
          
          <DetailBlock align="flex-end">
            <DetailLabel>DURATION</DetailLabel>
            <DetailValue>{rideDetails.duration}</DetailValue>
          </DetailBlock>
        </RideDetails>
      </RideDetailsContainer>
      
      <ButtonsContainer>
        <DeclineButton onClick={handleDecline}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
          Decline
        </DeclineButton>
        <AcceptButton onClick={handleAccept}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
          </svg>
          Accept
        </AcceptButton>
      </ButtonsContainer>
    </RequestBannerContainer>
  );
};

export default RideRequestBanner;
