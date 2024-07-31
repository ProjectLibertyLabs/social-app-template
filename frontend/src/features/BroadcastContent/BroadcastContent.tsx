import styles from './BroadcastContent.module.css';
import { Anchorme } from 'react-anchorme';
import React from 'react';
import { ActivityContentNote } from '@dsnp/activity-content/types';

interface BroadcastContentProps {
  content: ActivityContentNote['content'];
}

const BroadcastContent = ({ content }: BroadcastContentProps) => {
  return (
    <div className={styles.root}>
      <Anchorme target="_blank" rel="noreferrer noopener">
        {content}
      </Anchorme>
    </div>
  );
};

export default BroadcastContent;
