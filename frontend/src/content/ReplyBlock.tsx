import React, { ReactElement } from 'react';
import ReplyInput from './ReplyInput';
import * as dsnpLink from '../dsnpLink';
import { DSNPContentURI } from '../helpers/dsnp';
import Post from './Post';
import styles from './ReplyBlock.module.css';
import { Card, Flex } from 'antd';
import { PostLoadingType } from '../types';
import Reply from './Reply';

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  showReplyInput: boolean;
  isReplying: boolean;
  handleIsPosting: (postLoadingType: PostLoadingType) => void;
}

const ReplyBlock = ({
  parentURI,
  replies,
  showReplyInput,
  isReplying,
  handleIsPosting,
}: ReplyBlockProps): ReactElement => {
  return (
    <>
      {replies.length > 0 && (
        <Flex gap={'small'} vertical className={styles.root}>
          {replies.map((reply, index) => (
            <Reply feedItem={reply} key={index} handleIsPosting={handleIsPosting} isReplying={isReplying} />
          ))}
          {isReplying && <Card loading={isReplying} />}
        </Flex>
      )}

      {showReplyInput && <ReplyInput parentURI={parentURI} handleIsPosting={handleIsPosting} />}
    </>
  );
};

export default ReplyBlock;
