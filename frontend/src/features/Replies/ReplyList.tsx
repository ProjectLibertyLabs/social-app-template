import React, { ReactElement, useState } from 'react';
import ReplyInput from './ReplyInput';
import * as dsnpLink from '../../dsnpLink';
import { DSNPContentURI } from '../../helpers/dsnp';
import { Flex } from 'antd';
import Reply from './Reply';
import BroadcastCard from '../BroadcastCard/BroadcastCard';
import { BroadcastCardType } from '../../types';

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  isLoggedOut: boolean;
  showLoginModal?: () => void;
}

const ReplyList = ({ parentURI, replies, isLoggedOut, showLoginModal }: ReplyBlockProps): ReactElement => {
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
            <Reply feedItem={reply} showLoginModal={showLoginModal} key={index} />
          ))}
          {isReplying && <BroadcastCard broadcastCardType={BroadcastCardType.REPLY_LOADING} isLoading={true} />}
        </Flex>
      )}

      {isLoggedOut && <ReplyInput parentURI={parentURI} handleIsReplying={handleIsReplying} />}
    </>
  );
};

export default ReplyList;
