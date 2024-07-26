import React, { ReactElement } from 'react';
import ReplyInput from './ReplyInput';
import * as dsnpLink from '../dsnpLink';
import { DSNPContentURI } from '../helpers/dsnp';
import Post from './Post';
import styles from './ReplyBlock.module.css';
import { Flex } from 'antd';

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  showReplyInput: boolean;
}

const ReplyBlock = ({ parentURI, replies, showReplyInput }: ReplyBlockProps): ReactElement => {
  return (
    <>
      {replies.length > 0 && (
        <Flex gap={'small'} vertical className={styles.root}>
          {replies.map((reply, index) => (
            <Post feedItem={reply} key={index} showReplyInput={false} isReply={true} />
          ))}
        </Flex>
      )}

      {showReplyInput && <ReplyInput parentURI={parentURI} />}
    </>
  );
};

export default ReplyBlock;
