import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const WelcomeCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
`;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const msaId = localStorage.getItem('msaId');
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await AuthService.logout(accessToken);
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('msaId');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <WelcomeCard>
        <Title>Welcome to Your Dashboard</Title>
        <Text>
          You have successfully authenticated with SIWF v2.
          Your MSA ID is: {msaId}
        </Text>
        <Text>
          This is a mock dashboard page. In a real application, you would see your
          content, profile information, and other features here.
        </Text>
      </WelcomeCard>
    </Container>
  );
}; 