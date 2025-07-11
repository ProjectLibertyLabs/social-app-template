import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { WalletService } from '../services/WalletService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePolkadotLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Initialize SIWF
      const siwfResponse = await AuthService.initiateSIWF();
      console.log('siwfResponse', siwfResponse);
      // Connect Polkadot wallet
      const account = await WalletService.connectPolkadot();
      console.log('account', account);

      // TODO: POST /v2/accounts/siwf
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Polkadot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetamaskLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Initialize SIWF
      const siwfResponse = await AuthService.initiateSIWF();
      console.log('siwfResponse', siwfResponse);
      // Connect Metamask
      const account = await WalletService.connectMetamask();
      console.log('account', account);

      // TODO: POST /v2/accounts/siwf
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Metamask');
    } finally {
      setIsLoading(false);
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Metamask');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Welcome to SIWF v2</Title>
        <Button onClick={handlePolkadotLogin} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect with Polkadot.js Extension'}
        </Button>
        <Button onClick={handleMetamaskLogin} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect with Metamask'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
}; 