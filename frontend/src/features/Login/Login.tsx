import React, { ReactElement } from 'react';
import { Spin } from 'antd';
import { UserAccount } from '../../types';
import LoginForm from './LoginForm';

interface LoginScreenProps {
  onLogin: (account: UserAccount) => void;
}

const Login = ({ onLogin }: LoginScreenProps): ReactElement => {
  return <LoginForm onLogin={(account) => onLogin(account)} />;
};

export default Login;
