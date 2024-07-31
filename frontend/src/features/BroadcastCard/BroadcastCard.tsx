import { BroadcastCardType } from '../../types';
import { Card, Flex } from 'antd';
import React, { ReactNode } from 'react';
import styles from './BroadcastCard.module.css';

interface BroadcastCardProps {
  broadcastCardType: BroadcastCardType;
  isLoading: boolean;
  children?: ReactNode;
}

const BroadcastCard = ({ broadcastCardType, isLoading, children }: BroadcastCardProps) => {
  const renderCard = (content?: ReactNode, style: React.CSSProperties = {}) => (
    <Card className={styles.root} bordered={true} loading={isLoading} style={style}>
      {content}
    </Card>
  );
  switch (broadcastCardType) {
    case BroadcastCardType.POST: {
      return renderCard(
        <Flex gap={18} vertical>
          {children}
        </Flex>
      );
    }
    case BroadcastCardType.REPLY: {
      return renderCard(
        <Flex gap={12} vertical>
          {children}
        </Flex>
      );
    }
    case BroadcastCardType.POST_LOADING: {
      return renderCard();
    }
    case BroadcastCardType.REPLY_LOADING: {
      return renderCard(null, { height: 70 });
    }
  }
};

export default BroadcastCard;
