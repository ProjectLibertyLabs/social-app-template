import React, { ReactElement } from 'react';
import { Avatar } from 'antd';
import { minidenticon } from 'minidenticons';
import { UserOutlined } from '@ant-design/icons';
import type { User } from '../types';
import styles from './UserAvatar.module.css';

const avatarSizeOptions = new Map([
  ['small', 28],
  ['medium', 50],
  ['large', 100],
  ['xl', 150],
]);

interface UserAvatarProps {
  user: User | undefined;
  avatarSize: 'small' | 'medium' | 'large' | 'xl';
}

const UserAvatar = ({ user, avatarSize }: UserAvatarProps): ReactElement => {
  const iconURL = user
    ? user.profile?.icon ||
      React.useMemo(
        () => `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(user.msaId.toString()))}`,
        [user.msaId]
      )
    : '';

  return (
    <Avatar
      className={styles.root}
      icon={<UserOutlined />}
      src={iconURL}
      size={avatarSizeOptions.get(avatarSize)}
      style={{ minWidth: avatarSizeOptions.get(avatarSize) }}
    />
  );
};

export default UserAvatar;
