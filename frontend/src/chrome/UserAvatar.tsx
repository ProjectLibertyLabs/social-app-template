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
  let iconURL = '';
  if (user) {
    if (user.profile?.icon) {
      iconURL = user.profile.icon;
    } else {
      // Used to trace conditions when msaId is undefined
      // console.log(`REMOVE: DEBUG: UserAvatar:msaId(${user.msaId})`);
      let msaIdString: string;
      if (typeof user.msaId !== 'string') {
        msaIdString = '';
      } else {
        msaIdString = user.msaId;
      }
      iconURL = React.useMemo(
        () => `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(msaIdString))}`,
        [user.msaId]
      );
    }
  }

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
