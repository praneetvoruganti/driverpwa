import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const VehicleCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.isCollapsed ? '0' : '1.25rem'};
  padding-bottom: 0.75rem;
  border-bottom: ${props => props.isCollapsed ? 'none' : '1px solid #f5f5f5'};
  cursor: pointer;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f9f9f9;
    color: #333;
  }
`;

const VehicleInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  overflow: hidden;
  max-height: ${props => props.isCollapsed ? '0' : '1000px'};
  opacity: ${props => props.isCollapsed ? '0' : '1'};
  transition: all 0.3s ease-in-out;
  margin-top: ${props => props.isCollapsed ? '0' : '1rem'};
`;

const VehicleInfoSection = styled.div`
  padding-bottom: ${props => props.hasBorder ? '1rem' : '0'};
  border-bottom: ${props => props.hasBorder ? '1px solid #f5f5f5' : 'none'};
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  color: #555;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const VehicleInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const VehicleInfoItem = styled.div`
  font-size: 14px;
`;

const Label = styled.div`
  color: #9e9e9e;
  margin-bottom: 0.25rem;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Value = styled.div`
  color: #333;
  font-weight: 500;
  font-size: 15px;
`;



const EditForm = styled.form`
  display: grid;
  gap: 1rem;
  padding-top: 0.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23757575' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  
  &:focus {
    border-color: #9e9e9e;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.03);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #9e9e9e;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.03);
  }

  &::placeholder {
    color: #bdbdbd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SaveButton = styled(Button)`
  background-color: #333;
  color: white;
  
  &:hover {
    background-color: #1e1e1e;
  }
`;

const VehicleDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [vehicle, setVehicle] = useState({
    vehicleNumber: '',
    vehicleClass: '',
    model: ''
  });
  
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleClass: '',
    model: ''
  });

  useEffect(() => {
    // Load vehicle data from localStorage if available
    const savedVehicle = localStorage.getItem('vehicleDetails');
    if (savedVehicle) {
      const parsedVehicle = JSON.parse(savedVehicle);
      setVehicle(parsedVehicle);
      setFormData(parsedVehicle);
    }
  }, []);

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent collapse toggle when clicking edit
    setIsEditing(true);
  };
  
  const toggleCollapse = () => {
    if (isEditing) return; // Don't collapse while editing
    setIsCollapsed(!isCollapsed);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(vehicle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVehicle(formData);
    localStorage.setItem('vehicleDetails', JSON.stringify(formData));
    setIsEditing(false);
  };

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
    </svg>
  );
  
  const ChevronIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}
    >
      <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor"/>
    </svg>
  );

  const vehicleClassOptions = [
    { value: '', label: 'Select vehicle class' },
    { value: 'auto', label: 'Auto Rickshaw' },
    { value: 'mini', label: 'Mini' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' }
  ];

  return (
    <VehicleCard>
      <CardHeader isCollapsed={isCollapsed} onClick={toggleCollapse}>
        <CardTitle>
          <ChevronIcon /> Vehicle Information
        </CardTitle>
        {!isEditing && (
          <EditButton onClick={handleEdit}>
            <EditIcon />
          </EditButton>
        )}
      </CardHeader>
      
      {!isEditing ? (
        <VehicleInfoWrapper isCollapsed={isCollapsed}>
          <VehicleInfoSection hasBorder>
            <SectionTitle>Vehicle Details</SectionTitle>
            <VehicleInfoGrid>
              <VehicleInfoItem>
                <Label>Vehicle Number</Label>
                <Value>{vehicle.vehicleNumber || 'Not specified'}</Value>
              </VehicleInfoItem>
              <VehicleInfoItem>
                <Label>Vehicle Class</Label>
                <Value>
                  {vehicle.vehicleClass ? 
                    vehicleClassOptions.find(option => option.value === vehicle.vehicleClass)?.label || vehicle.vehicleClass 
                    : 'Not specified'}
                </Value>
              </VehicleInfoItem>
              <VehicleInfoItem>
                <Label>Model</Label>
                <Value>{vehicle.model || 'Not specified'}</Value>
              </VehicleInfoItem>
            </VehicleInfoGrid>
          </VehicleInfoSection>


        </VehicleInfoWrapper>
      ) : (
        <EditForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Vehicle Details</SectionTitle>
            <InputGroup>
              <Label>Vehicle Number</Label>
              <Input 
                type="text" 
                name="vehicleNumber" 
                value={formData.vehicleNumber} 
                onChange={handleChange} 
                placeholder="Enter vehicle number"
              />
            </InputGroup>
            <InputGroup>
              <Label>Vehicle Class</Label>
              <Select 
                name="vehicleClass" 
                value={formData.vehicleClass} 
                onChange={handleChange}
              >
                {vehicleClassOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Model</Label>
              <Input 
                type="text" 
                name="model" 
                value={formData.model} 
                onChange={handleChange} 
                placeholder="Enter vehicle model"
              />
            </InputGroup>
          </FormSection>


          
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
            <SaveButton type="submit">Save Changes</SaveButton>
          </ButtonGroup>
        </EditForm>
      )}
    </VehicleCard>
  );
};

export default VehicleDetails;
