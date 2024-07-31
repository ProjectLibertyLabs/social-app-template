import React, { ReactElement } from 'react';
import { User } from '../../types';
import styles from './FromTitle.module.css';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import { makeDisplayHandle } from '../../helpers/DisplayHandle';

interface FromTitleProps {
  user: User;
  level?: 1 | 2 | 3 | 4;
  isReply?: boolean;
  isLoggedOut?: boolean;
  showLoginModal?: () => void;
}

export const FromTitle = ({ user, isReply, level, isLoggedOut, showLoginModal }: FromTitleProps): ReactElement => {
  const navigate = useNavigate();

  const primary = makeDisplayHandle(user.handle);
  const secondary = user?.profile?.name || '';

  return (
    <div
      onClick={() => (isLoggedOut ? navigate(`/profile/${user.msaId}`) : showLoginModal && showLoginModal())}
      className={styles.root}
    >
      {level && (
        <Title style={{ margin: 0 }} level={level}>
          {primary}
        </Title>
      )}
      {!level && primary}
      {!isReply && <div>{secondary}</div>}
    </div>
  );
};
