import React from 'react';
import styled from 'styled-components';

const WalletContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Title = styled.h2`
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const RatingButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  color: #757575;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #333;
  }
`;

const Balance = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
`;

const PayoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.disabled ? '#f1f1f1' : '#f1f1f1'};
  color: ${props => props.disabled ? '#9e9e9e' : '#333'};
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.disabled ? '#f1f1f1' : '#e0e0e0'};
  }
`;

const MinThresholdNote = styled.div`
  font-size: 12px;
  color: #9e9e9e;
  text-align: center;
  margin-top: 0.5rem;
`;

const WalletStatus = ({ balance = 0, minThreshold = 50 }) => {
  const isPayoutDisabled = balance < minThreshold;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
    </svg>
  );

  return (
    <WalletContainer>
      <WalletHeader>
        <Title>Wallet</Title>
        <RatingButton>
          <StarIcon />
        </RatingButton>
      </WalletHeader>
      
      <Balance>{formatCurrency(balance)}</Balance>
      
      <PayoutButton disabled={isPayoutDisabled}>
        Request Payout
      </PayoutButton>
      
      {isPayoutDisabled && (
        <MinThresholdNote>
          Minimum payout threshold: {formatCurrency(minThreshold)}
        </MinThresholdNote>
      )}
    </WalletContainer>
  );
};

export default WalletStatus;
