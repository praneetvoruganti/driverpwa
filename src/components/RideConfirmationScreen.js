import React, { useState } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom markers for pickup and destination (using the same ones as in RideRequestBanner)
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

const driverIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzIxOTZGMyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Map coordinates for demo locations - now centered in Hyderabad
const centerPoint = [17.418618673261474, 78.46502565334217]; // Hyderabad center

const locationCoordinates = {
  'Banjara Hills, Hyderabad': [17.4156, 78.4347],
  'Hitech City, Hyderabad': [17.4435, 78.3772],
  'Secunderabad, Hyderabad': [17.4399, 78.4983],
  'Gachibowli, Hyderabad': [17.4401, 78.3489],
  'LB Nagar, Hyderabad': [17.3457, 78.5479],
  'Shamshabad, Hyderabad': [17.2403, 78.4294],
  'Hussain Sagar, Hyderabad': centerPoint,
  // Add more locations as needed
  'Koramangala, Bengaluru': [12.9352, 77.6245],
  'Electronic City, Bengaluru': [12.8399, 77.6770],
  'Indiranagar, Bengaluru': [12.9784, 77.6408],
  'Whitefield, Bengaluru': [12.9698, 77.7500],
  'MG Road, Bengaluru': [12.9766, 77.6097],
  'Hebbal, Bengaluru': [13.0407, 77.5960]
};

const getRoutePoints = (pickup, destination) => {
  const pickupCoords = locationCoordinates[pickup] || [17.4156, 78.4347]; // Default to Banjara Hills
  const destCoords = locationCoordinates[destination] || [17.4435, 78.3772]; // Default to Hitech City
  
  // Generate points that create a route passing through the specified coordinates
  const midPoint1 = [
    (pickupCoords[0] + centerPoint[0]) / 2 + (Math.random() * 0.005 - 0.0025),
    (pickupCoords[1] + centerPoint[1]) / 2 + (Math.random() * 0.005 - 0.0025)
  ];
  
  const midPoint2 = [
    (centerPoint[0] + destCoords[0]) / 2 + (Math.random() * 0.005 - 0.0025),
    (centerPoint[1] + destCoords[1]) / 2 + (Math.random() * 0.005 - 0.0025)
  ];
  
  // Return a more complex route
  return [pickupCoords, midPoint1, centerPoint, midPoint2, destCoords];
};

// Styled components
const ConfirmationContainer = styled.div`
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
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RideStatusBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`;

const MapWrapper = styled.div`
  height: 250px;
  position: relative;
  
  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;

const RideDetailsSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const LocationInfoContainer = styled.div`
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
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
`;

const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
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

const PassengerSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const PassengerHeader = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const PassengerCard = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #e0e0e0;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  font-weight: 600;
  font-size: 18px;
`;

const PassengerInfo = styled.div`
  flex: 1;
`;

const PassengerPhone = styled.div`
  color: #757575;
  font-size: 14px;
`;

const PassengerName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
`;

const PassengerRating = styled.div`
  display: flex;
  align-items: center;
  color: #757575;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Star = styled.span`
  color: #FFC107;
  margin-right: 4px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 20px;
  margin-top: auto;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ConfirmDialog = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 85%;
  max-width: 300px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ConfirmButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(ConfirmButton)`
  background-color: #f5f5f5;
  color: #757575;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ConfirmActionButton = styled(ConfirmButton)`
  background-color: #4CAF50;
  color: white;
  
  &:hover {
    background-color: #43A047;
  }
  
  &:active {
    background-color: #388E3C;
    transform: scale(0.98);
  }
`;

const ActionButton = styled.button`
  flex: 1;
  height: 54px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  gap: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  background-color: #4CAF50;
  color: white;
  
  &:active {
    transform: scale(0.98);
  }
  
  &:hover {
    background-color: #43A047;
  }
`;

const CallButton = styled(ActionButton)`
  background-color: #4CAF50;
  color: white;
  box-shadow: 0px 2px 8px rgba(76, 175, 80, 0.2);
  
  svg {
    fill: white;
  }
`;

const NavigateButton = styled(ActionButton)`
  background-color: #4CAF50;
  color: white;
  box-shadow: 0px 2px 8px rgba(76, 175, 80, 0.3);
  
  &:hover {
    background-color: #43A047;
  }
`;

const EndRideButton = styled(ActionButton)`
  background-color: #F44336;
  color: white;
  box-shadow: 0px 2px 8px rgba(244, 67, 54, 0.2);
  
  &:hover {
    background-color: #E53935;
  }
  
  svg {
    fill: white;
  }
`;

const RideConfirmationScreen = ({ 
  isVisible, 
  onClose, 
  rideDetails = {
    pickup: 'Banjara Hills, Hyderabad',
    destination: 'Hitech City, Hyderabad',
    passengerName: 'Rahul Kumar',
    passengerRating: 4.8,
    passengerPhone: '+91 98765 43210',
    fare: 'Meter fare',
    distance: '14.2 km',
    duration: '32 mins'
  }
}) => {
  const [routePoints, setRoutePoints] = useState([]);
  const [mapCenter, setMapCenter] = useState(centerPoint);
  const [driverPosition, setDriverPosition] = useState(null);
  const [showEndRideConfirm, setShowEndRideConfirm] = useState(false);
  
  // Initialize map and route when component mounts
  React.useEffect(() => {
    if (isVisible) {
      const points = getRoutePoints(rideDetails.pickup, rideDetails.destination);
      setRoutePoints(points);
      setMapCenter(centerPoint);
      
      // Set initial driver position at pickup
      setDriverPosition(points[0]);
      
      // Simulate driver movement along the route
      let currentPositionIndex = 0;
      const moveInterval = setInterval(() => {
        if (currentPositionIndex < points.length - 1) {
          currentPositionIndex++;
          setDriverPosition(points[currentPositionIndex]);
        } else {
          clearInterval(moveInterval);
        }
      }, 3000);
      
      return () => clearInterval(moveInterval);
    }
  }, [isVisible, rideDetails]);
  
  if (!isVisible) return null;
  
  const handleCall = () => {
    // In a real app, this would use the device's native calling capabilities
    // For now, we'll just log it
    console.log(`Calling passenger: ${rideDetails.passengerName} at ${rideDetails.passengerPhone}`);
    
    // On a real device, we could use something like:
    // window.location.href = `tel:${rideDetails.passengerPhone.replace(/\s+/g, '')}`;
  };
  
  // Navigation functionality removed as requested
  
  const handleEndRideClick = () => {
    setShowEndRideConfirm(true);
  };
  
  const handleEndRideConfirm = () => {
    setShowEndRideConfirm(false);
    if (onClose) onClose();
  };
  
  const handleEndRideCancel = () => {
    setShowEndRideConfirm(false);
  };
  
  // Icon components
  const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
    </svg>
  );
  
  const NavigateIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
    </svg>
  );
  
  const EndRideIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="currentColor"/>
    </svg>
  );
  
  const CarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="white"/>
    </svg>
  );
  
  return (
    <ConfirmationContainer>
      <Header>
        <HeaderTitle>
          <CarIcon /> Active Ride <RideStatusBadge>In Progress</RideStatusBadge>
        </HeaderTitle>
      </Header>
      
      <MapWrapper>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          zoomControl={true}
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
                pathOptions={{ color: '#4CAF50', weight: 4, opacity: 0.7 }}
              />
              {driverPosition && (
                <Marker position={driverPosition} icon={driverIcon} />
              )}
            </>
          )}
        </MapContainer>
      </MapWrapper>
      
      <RideDetailsSection>
        <LocationInfoContainer>
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
        </LocationInfoContainer>
        
        <RideDetails>
          <DetailBlock>
            <DetailLabel>FARE</DetailLabel>
            <DetailValue large>
              {rideDetails.fare}
            </DetailValue>
          </DetailBlock>
          
          <DetailBlock>
            <DetailLabel>DISTANCE</DetailLabel>
            <DetailValue>{rideDetails.distance}</DetailValue>
          </DetailBlock>
          
          <DetailBlock>
            <DetailLabel>DURATION</DetailLabel>
            <DetailValue>{rideDetails.duration}</DetailValue>
          </DetailBlock>
        </RideDetails>
      </RideDetailsSection>
      
      <PassengerSection>
        <PassengerHeader>Passenger Information</PassengerHeader>
        <PassengerCard>
          <Avatar>{rideDetails.passengerName.charAt(0)}</Avatar>
          <PassengerInfo>
            <PassengerName>{rideDetails.passengerName}</PassengerName>
            {/* <PassengerRating>
              <Star>★</Star> {rideDetails.passengerRating}
            </PassengerRating> */}
            {/* <PassengerPhone>{rideDetails.passengerPhone}</PassengerPhone> */}
          </PassengerInfo>
        </PassengerCard>
      </PassengerSection>
      
      <ActionButtonsContainer>
        <CallButton onClick={handleCall}>
          <PhoneIcon /> Call Passenger
        </CallButton>
        <EndRideButton onClick={handleEndRideClick}>
          <EndRideIcon /> End Ride
        </EndRideButton>
      </ActionButtonsContainer>
      
      {showEndRideConfirm && (
        <ConfirmOverlay>
          <ConfirmDialog>
            <ConfirmTitle>End Ride?</ConfirmTitle>
            <p>Are you sure you want to end this ride?</p>
            <ConfirmButtonsContainer>
              <CancelButton onClick={handleEndRideCancel}>Cancel</CancelButton>
              <ConfirmActionButton onClick={handleEndRideConfirm}>End Ride</ConfirmActionButton>
            </ConfirmButtonsContainer>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </ConfirmationContainer>
  );
};

export default RideConfirmationScreen;
