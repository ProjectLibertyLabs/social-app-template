import React, { ReactElement } from 'react';
import ReplyInput from './ReplyInput';
import * as dsnpLink from '../dsnpLink';
import { DSNPContentURI } from '../helpers/dsnp';
import Post from './Post';
import styles from './ReplyBlock.module.css';

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  showReplyInput: boolean;
}

const ReplyBlock = ({ parentURI, replies, showReplyInput }: ReplyBlockProps): ReactElement => {
  return (
    <>
      <div className={styles.root}>
        {replies.length > 0 && (
          <>
            {replies.map((reply, index) => (
              <Post feedItem={reply} key={index} showReplyInput={false} />
            ))}
          </>
        )}
      </div>
      {showReplyInput && <ReplyInput parentURI={parentURI} />}
    </>
  );
};

export default ReplyBlock;
