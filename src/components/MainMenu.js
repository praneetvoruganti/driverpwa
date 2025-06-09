import React from 'react';
import styled from 'styled-components';

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  width: auto;
  min-width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: ${props => props.isOpen ? 'fadeIn 0.2s ease-out' : 'none'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: top left;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.logout-item {
    border-top: 1px solid #f5f5f5;
  }
`;

const MenuLink = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 20px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:active {
    background-color: #f5f5f5;
  }
  
  &.logout {
    color: #F44336;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 16px;
  color: #4CAF50;
  
  &.logout {
    color: #F44336;
  }
`;

const CloseArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
`;

const MainMenu = ({ isOpen, onClose, onNavigate }) => {
  const handleMenuItemClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Handle logout functionality
    console.log('Logging out...');
    if (onClose) {
      onClose();
    }
  };

  // Icons
  const HistoryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
    </svg>
  );

  const PaymentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
    </svg>
  );
  
  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
    </svg>
  );

  if (!isOpen) return null;
  
  return (
    <>
      <CloseArea onClick={onClose} />
      <MenuContainer isOpen={isOpen}>
        <MenuList>
          <MenuItem>
            <MenuLink onClick={() => handleMenuItemClick('past-rides')}>
              <IconWrapper>
                <HistoryIcon />
              </IconWrapper>
              Past Rides
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuItemClick('promise-to-pay')}>
              <IconWrapper>
                <PaymentIcon />
              </IconWrapper>
              Promise2Pay
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink onClick={() => handleMenuItemClick('settings')}>
              <IconWrapper>
                <SettingsIcon />
              </IconWrapper>
              Settings
            </MenuLink>
          </MenuItem>
          <MenuItem className="logout-item">
            <MenuLink className="logout" onClick={handleLogout}>
              <IconWrapper className="logout">
                <LogoutIcon />
              </IconWrapper>
              Logout
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuContainer>
    </>
  );
};

export default MainMenu;
