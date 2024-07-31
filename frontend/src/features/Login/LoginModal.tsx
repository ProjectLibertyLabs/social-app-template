import { Modal } from 'antd';
import React, { useState } from 'react';
import { UserAccount } from '../../types';
import * as dsnpLink from '../../dsnpLink';
import Login from './Login';
import styles from './LoginModal.module.css';

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
    <Modal
      open={open}
      title={<span className={styles.title}>To proceed, please login.</span>}
      footer={null}
      onCancel={onCancel}
    >
      <Login onLogin={onLogin} loadingState={loadingState} />
    </Modal>
  );
};

export default LoginModal;
