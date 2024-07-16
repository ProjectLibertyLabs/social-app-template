import { Modal } from 'antd';
import Login from '../login/Login';
import React, { useState } from 'react';
import { UserAccount } from '../types';
import * as dsnpLink from '../dsnpLink';
import LoginScreen from '../login/LoginScreen';

interface LoginModalProps {
  open: boolean;
  onLogin: (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => void;
  handleCancel: () => void;
}

const LoginModal = ({ open, onLogin, handleCancel }: LoginModalProps) => {
  const [loadingState, setLoadingState] = useState<boolean>();

  const onCancel = () => {
    handleCancel();
    setLoadingState(false);
  };

  return (
    <Modal open={open} title={'To proceed, please login.'} footer={null} onCancel={onCancel}>
      <LoginScreen onLogin={onLogin} loadingState={loadingState} />
    </Modal>
  );
};

export default LoginModal;
