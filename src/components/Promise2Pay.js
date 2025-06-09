import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f9f9f9;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.div`
  background-color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
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

const Content = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 4px 0 12px 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 14px;
  margin-bottom: 14px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
`;

const ProgressContainer = styled.div`
  text-align: center;
  margin: 10px 0;
`;

const ProgressCounter = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4CAF50;
  width: ${props => props.percentage}%;
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: #666;
`;

const CollectionOption = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: ${props => props.active ? '#f0f9f0' : '#f5f5f5'};
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  opacity: ${props => props.deprecated ? '0.7' : '1'};
  
  &:hover {
    background-color: ${props => props.active ? '#e8f5e9' : '#eeeeee'};
  }
`;

const OptionIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${props => props.active ? '#e8f5e9' : '#f0f0f0'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: ${props => props.active ? '#4CAF50' : '#9e9e9e'};
`;

const OptionInfo = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-decoration: ${props => props.deprecated ? 'line-through' : 'none'};
`;

const OptionDescription = styled.div`
  font-size: 12px;
  color: #757575;
  margin-top: 2px;
  text-decoration: ${props => props.deprecated ? 'line-through' : 'none'};
`;

const ToggleSwitch = styled.div`
  width: 40px;
  height: 20px;
  background-color: ${props => props.active ? '#4CAF50' : '#bdbdbd'};
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: white;
    transition: left 0.3s;
  }
`;

const HistoryItem = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const HistoryDate = styled.div`
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
`;

const HistoryAmount = styled.div`
  font-size: 12px;
  color: #757575;
`;

const HistoryNote = styled.div`
  font-size: 12px;
  color: #4CAF50;
  margin-top: 4px;
`;

const PayButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  margin: 16px 0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #43A047;
  }
  
  &:active {
    background-color: #388E3C;
    transform: scale(0.98);
  }
`;

const ConfirmDialog = styled.div`
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

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 320px;
`;

const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

const DialogText = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DialogButton = styled.button`
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  margin-left: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#4CAF50' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#4CAF50'};
`;

const Promise2Pay = ({ isVisible, onBack }) => {
  const [collectionType, setCollectionType] = useState('standard'); // 'standard' or 'monthly'
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  
  if (!isVisible) return null;

  // Current date for dynamic content
  const currentDate = new Date();
  
  // Handle collection option change
  const toggleCollectionOption = (option) => {
    setCollectionType(option);
  };
  
  // Handle pay now button
  const handlePayNow = () => {
    setShowPaymentConfirmation(true);
  };
  
  // Handle dialog actions
  const handleConfirmPayment = () => {
    // In a real app, this would handle the payment processing
    setShowPaymentConfirmation(false);
    // Show success message or redirect
  };
  
  const handleCancelPayment = () => {
    setShowPaymentConfirmation(false);
  };
  
  // Icons
  const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
    </svg>
  );

  const StandardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM11 17H13V13H17V11H13V7H11V11H7V13H11V17Z" fill="currentColor"/>
    </svg>
  );

  const MonthlyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V9H19V19ZM19 7H5V5H19V7ZM7 11H12V16H7V11Z" fill="currentColor"/>
    </svg>
  );

  // Format date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Previous collection date range
  const prevEndDate = new Date(currentDate);
  prevEndDate.setDate(prevEndDate.getDate() - 26); // ~1 month ago
  
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevStartDate.getDate() - 20); // 20 days before end date
  
  // Current collection start date
  const currentStartDate = new Date(prevEndDate);
  currentStartDate.setDate(currentStartDate.getDate() + 2); // 2 days after previous collection

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
        <Title>Promise2Pay</Title>
      </Header>
      
      <Content>
        <Description>Pay once after completing multiple rides</Description>
        
        <Card>
          <CardTitle>Current Collection Status</CardTitle>
          <ProgressContainer>
            <ProgressCounter>16 / 20 rides</ProgressCounter>
            <ProgressBar>
              <ProgressFill percentage={80} />
            </ProgressBar>
            <ProgressText>4 rides left • ₹0.50 per ride</ProgressText>
          </ProgressContainer>
        </Card>
        
        <Card>
          <CardTitle>Collection Options</CardTitle>
          <CollectionOption 
            active={collectionType === 'standard'} 
            onClick={() => toggleCollectionOption('standard')}
          >
            <OptionIcon active={collectionType === 'standard'}>
              <StandardIcon />
            </OptionIcon>
            <OptionInfo>
              <OptionTitle>
                {collectionType === 'standard' ? 'Standard Collection (Active)' : 'Standard Collection'}
              </OptionTitle>
              <OptionDescription>Collect after every 20 rides (₹0.50 per ride)</OptionDescription>
            </OptionInfo>
            <ToggleSwitch 
              active={collectionType === 'standard'} 
              onClick={(e) => {
                e.stopPropagation();
                toggleCollectionOption('standard');
              }} 
            />
          </CollectionOption>
          
          <CollectionOption 
            active={collectionType === 'monthly'}
            deprecated={true}
            onClick={() => toggleCollectionOption('monthly')}
          >
            <OptionIcon active={collectionType === 'monthly'}>
              <MonthlyIcon />
            </OptionIcon>
            <OptionInfo>
              <OptionTitle deprecated={true}>
                {collectionType === 'monthly' ? 'Monthly Collection (Active)' : 'Monthly Collection'}
              </OptionTitle>
              <OptionDescription deprecated={true}>Collect once a month regardless of ride count</OptionDescription>
            </OptionInfo>
            <ToggleSwitch 
              active={collectionType === 'monthly'}
              onClick={(e) => {
                e.stopPropagation();
                toggleCollectionOption('monthly');
              }} />
          </CollectionOption>
        </Card>
        
        <Card>
          <CardTitle>Collection History</CardTitle>
          <HistoryItem>
            <div style={{ marginRight: '10px', marginTop: '2px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#E0E0E0" />
              </svg>
            </div>
            <div>
              <HistoryTitle>Previous Collection</HistoryTitle>
              <HistoryDate>2025-04-12 - 2025-05-03 • 20 rides</HistoryDate>
              <HistoryAmount>₹0.50 per ride</HistoryAmount>
            </div>
          </HistoryItem>

          <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '10px 0' }} />
          
          <HistoryItem>
            <div style={{ marginRight: '10px', marginTop: '2px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#4CAF50" />
              </svg>
            </div>
            <div>
              <HistoryTitle>Current Progress</HistoryTitle>
              <HistoryDate>2025-05-05 - Present • 16 rides</HistoryDate>
              <HistoryAmount>₹0.50 per ride</HistoryAmount>
              <HistoryNote>Due in 4 more rides</HistoryNote>
            </div>
          </HistoryItem>
        </Card>
        
        <PayButton onClick={handlePayNow}>Pay Now</PayButton>
      </Content>
      
      {showPaymentConfirmation && (
        <ConfirmDialog>
          <DialogContent>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogText>
              Are you sure you want to pay ₹10.00 now? This will clear your current Promise2Pay balance.
            </DialogText>
            <DialogButtons>
              <DialogButton onClick={handleCancelPayment}>Cancel</DialogButton>
              <DialogButton primary onClick={handleConfirmPayment}>Confirm</DialogButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </PageContainer>
  );
};

export default Promise2Pay;
