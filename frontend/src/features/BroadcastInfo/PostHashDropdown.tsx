import React, { ReactElement, useState } from 'react';
import { Dropdown } from 'antd';
import { CheckCircleTwoTone, EllipsisOutlined } from '@ant-design/icons';
import { HexString } from '../../types';
import { buildDSNPContentURI } from '../../helpers/dsnp';
import styles from './PostHashDropdown.module.css';

import type { MenuProps } from 'antd';

interface PostHashDropdownProps {
  hash: HexString;
  fromId: string;
}

const PostHashDropdown = ({ hash, fromId }: PostHashDropdownProps): ReactElement => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const announcementURI = buildDSNPContentURI(fromId, hash);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          className={styles.menu}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(announcementURI);
            setIsCopied(true);
            setTimeout(function () {
              setIsCopied(false);
            }, 2000);
          }}
        >
          <div className={styles.title}>DSNP Announcement URI:</div>
          {announcementURI}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      className={styles.root}
      menu={{
        items,
      }}
      open={isVisible}
      onOpenChange={(e) => setIsVisible(e)}
      placement="bottomRight"
    >
      {isCopied ? (
        <CheckCircleTwoTone twoToneColor="#1dcf76" style={{ fontSize: '20px' }} />
      ) : (
        <EllipsisOutlined style={{ fontSize: '20px' }} />
      )}
    </Dropdown>
  );
};

export default PostHashDropdown;
