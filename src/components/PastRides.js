import React, { useState } from 'react';
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
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  /* border-bottom: 1px solid #f0f0f0; // Removed as filter tabs will be below */
`;

const FilterTabsContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
`;

const FilterTab = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.active ? '#2e7d32' : '#555'};
  background-color: ${props => props.active ? '#e8f5e9' : 'transparent'};
  border: 1px solid ${props => props.active ? '#a5d6a7' : '#e0e0e0'};
  border-radius: 16px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.active ? '#a5d6a7' : '#bdbdbd'};
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const RidesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background-color: #f9f9f9;
`;

const RideItem = styled.div`
  background-color: white;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  /* border: ${props => props.cancelled ? '1px solid #ffcdd2' : 'none'}; // Handled by status chip */
`;

const RideDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #f5f5f5;
  
  .date-time {
    font-size: 13px;
    color: #555;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  
  .icon {
    margin-right: 6px;
    color: #757575;
    display: flex;
    align-items: center;
  }
`;

const RideDetails = styled.div`
  padding: 12px;
`;

const LocationContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  padding-top: 10px;
`;

const LocationMarkers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
`;

const LocationMarkerDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color || '#ccc'};
`;

const LocationLine = styled.div`
  width: 1px;
  height: 18px; /* Adjust based on text line height */
  background-color: #e0e0e0;
  margin: 3px 0;
`;

const LocationInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px; /* Spacing between pickup and destination text */
`;

const LocationText = styled.div`
  font-size: 13px;
  color: #333;
  line-height: 1.3;
`;

const RideStatus = styled.div`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.cancelled ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.cancelled ? '#c62828' : '#2e7d32'};
`;

const PassengerSection = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  margin-top: 8px;
`;

const PassengerIconContainer = styled.div`
  margin-right: 8px;
  color: #757575;
  display: flex;
  align-items: center;
`;

const PassengerName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #333;
`;

const RideFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0 4px 0;
  font-size: 12px;
  color: #555;
  gap: 12px; /* For spacing between items */
`;

const FooterInfoItem = styled.div`
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: 4px;
    color: #757575; /* Icon color */
    display: flex;
    align-items: center;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  height: 100%;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: #e0e0e0;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  color: #757575;
`;

const PastRides = ({ isVisible, onBack }) => {
  const [activeFilter, setActiveFilter] = useState('Matched'); // 'Matched', 'Cancelled', 'All'
  // Sample past rides data - updated for new design
  const [pastRidesData] = useState([
    {
      id: 1,
      date: '20 May 2025',
      time: '02:30 pm',
      pickup: 'Indiranagar, Bengaluru',
      destination: 'Koramangala, Bengaluru',
      passengerName: 'Rajesh Kumar',
      fareType: '(Meter fare)', // Updated from 'fare' and matches image text
      vehicleType: 'Sedan',
      distance: '12 km',
      status: 'completed'
    },
    {
      id: 2,
      date: '18 May 2025',
      time: '09:15 am',
      pickup: 'MG Road, Bengaluru',
      destination: 'Electronic City, Bengaluru',
      passengerName: 'Suresh Patel',
      fareType: '(Meter fare)',
      vehicleType: 'SUV',
      distance: '22 km',
      status: 'completed'
    },
    {
      id: 3,
      date: '15 May 2025',
      time: '07:45 pm',
      pickup: 'Whitefield, Bengaluru',
      destination: 'HSR Layout, Bengaluru',
      passengerName: 'Amit Singh',
      fareType: '(Meter fare)',
      vehicleType: 'Auto Rickshaw',
      distance: '14 km',
      status: 'completed'
    },
    {
      id: 4,
      date: '12 May 2025',
      time: '11:20 am',
      pickup: 'Jayanagar, Bengaluru',
      destination: 'Mahadevapura, Bengaluru',
      passengerName: 'Vijay Sharma',
      fareType: '(Meter fare)',
      vehicleType: 'Sedan',
      distance: '19 km',
      status: 'cancelled'
    },
    {
      id: 5,
      date: '10 May 2025',
      time: '08:40 am',
      pickup: 'JP Nagar, Bengaluru',
      destination: 'Hebbal, Bengaluru',
      passengerName: 'Aman Sharma',
      fareType: '(Meter fare)',
      vehicleType: 'Hatchback',
      distance: '18.5 km',
      status: 'completed'
    }
  ]);

  const filteredRides = pastRidesData.filter(ride => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Matched') return ride.status === 'completed';
    if (activeFilter === 'Cancelled') return ride.status === 'cancelled';
    return true;
  });

  if (!isVisible) return null;

  // Icons
  const PassengerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const FareIcon = () => ( // Rupee icon variant
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 7.009c0-1.105-.896-2-2-2h-11c-1.104 0-2 .895-2 2s.896 2 2 2h3v1.5c0 .829.672 1.5 1.5 1.5h1c.828 0 1.5-.671 1.5-1.5v-1.5h2v1.5c0 .829.672 1.5 1.5 1.5h1c.828 0 1.5-.671 1.5-1.5v-1.5h.5c1.104 0 2-.895 2-2zm-2.5 5.491h-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5h6c.828 0 1.5-.671 1.5-1.5s-.672-1.5-1.5-1.5zm-10-4h13v1h-13v-1z"/>
    </svg>
  );

  const VehicleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  );

  const DistanceIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.285 9.715l-2-2a.999.999 0 00-1.414 0l-8.293 8.293a.997.997 0 000 1.414l2 2a.999.999 0 001.414 0l8.293-8.293a.997.997 0 000-1.414zm-19.57 1.57a.999.999 0 00-.001 1.414l2 2a.999.999 0 001.414 0l2-2a.999.999 0 000-1.414.999.999 0 00-1.414 0L5.414 12l-1.285-1.285a.999.999 0 00-1.414 0zM12 5.414L10.715 4.13a.999.999 0 00-1.414 0l-2 2a.999.999 0 000 1.414.999.999 0 001.414 0L10 6.242l1.285 1.286a.999.999 0 001.414 0l2-2a.999.999 0 000-1.414.999.999 0 00-1.414 0L12 5.414z"/>
    </svg>
  );

  const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM19 7H5V5H19V7ZM7 11H12V16H7V11Z" fill="currentColor"/>
    </svg>
  );



  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
        <Title>Past Rides</Title>
      </Header>
      <FilterTabsContainer>
        <FilterTab active={activeFilter === 'Matched'} onClick={() => setActiveFilter('Matched')}>Matched</FilterTab>
        {/* <FilterTab active={activeFilter === 'Cancelled'} onClick={() => setActiveFilter('Cancelled')}>Cancelled</FilterTab> */}
        {/* <FilterTab active={activeFilter === 'All'} onClick={() => setActiveFilter('All')}>All</FilterTab> */}
      </FilterTabsContainer>
      <RidesList>
        {filteredRides.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🚗</EmptyStateIcon>
            <EmptyStateText>No past rides found</EmptyStateText>
          </EmptyState>
        ) : (
          filteredRides.map(ride => (
            <RideItem key={ride.id}>
              <RideDate>
                <div className="date-time">
                    <span className="icon"><CalendarIcon /></span>
                    {ride.date} • {ride.time}
                </div>
                <RideStatus cancelled={ride.status === 'cancelled'}>
                  {ride.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                </RideStatus>
              </RideDate>
              
              <RideDetails>
                <LocationContainer>
                  <LocationMarkers>
                    <LocationMarkerDot color="#4CAF50" />
                    <LocationLine />
                    <LocationMarkerDot color="#F44336" />
                  </LocationMarkers>
                  <LocationInfo>
                    <LocationText>{ride.pickup}</LocationText>
                    <LocationText>{ride.destination}</LocationText>
                  </LocationInfo>
                </LocationContainer>
                
                <PassengerSection>
                  <PassengerIconContainer><PassengerIcon /></PassengerIconContainer>
                  <PassengerName>{ride.passengerName}</PassengerName>
                </PassengerSection>
                
                <RideFooter>
                  <FooterInfoItem>
                    <span className="icon"><FareIcon /></span>
                    {ride.fareType}
                  </FooterInfoItem>
                  <FooterInfoItem>
                    <span className="icon"><VehicleIcon /></span>
                    {ride.vehicleType}
                  </FooterInfoItem>
                  <FooterInfoItem>
                    <span className="icon"><DistanceIcon /></span>
                    {ride.distance}
                  </FooterInfoItem>
                </RideFooter>
              </RideDetails>
            </RideItem>
          ))
        )}
      </RidesList>
    </PageContainer>
  );
};

export default PastRides;
