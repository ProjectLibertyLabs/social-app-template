import React, { ReactElement, useState } from 'react';
import ReplyInput from './ReplyInput';
import * as dsnpLink from '../../dsnpLink';
import { DSNPContentURI } from '../../helpers/dsnp';
import { Card, Flex } from 'antd';
import styles from './Post.module.css';
import Reply from '../Reply/Reply';

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  showReplyInput: boolean;
}

const ReplyBlock = ({ parentURI, replies, showReplyInput }: ReplyBlockProps): ReactElement => {
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const handleIsReplying = () => {
    setIsReplying(true);
    setTimeout(() => {
      setIsReplying(false);
    }, 14_000);
  };

  return (
    <>
      {replies.length > 0 && (
        <Flex gap={'small'} vertical>
          {replies.map((reply, index) => (
            <Reply feedItem={reply} key={index} />
          ))}
          {isReplying && <Card loading={isReplying} style={{ height: 70 }} className={styles.card} bordered={true} />}
        </Flex>
      )}

      {showReplyInput && <ReplyInput parentURI={parentURI} handleIsReplying={handleIsReplying} />}
    </>
  );
};

export default ReplyBlock;
