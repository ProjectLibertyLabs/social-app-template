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
  handleIsReplying: () => void;
  isReplying: boolean;
  showLoginModal?: () => void;
}

const ReplyList = ({
  parentURI,
  replies,
  isLoggedOut,
  showLoginModal,
  isReplying,
  handleIsReplying,
}: ReplyBlockProps): ReactElement => {
  return (
    <>
      {(replies.length > 0 || isReplying) && (
        <Flex gap={'small'} vertical>
          {isReplying && <BroadcastCard broadcastCardType={BroadcastCardType.REPLY_LOADING} isLoading={true} />}
          {replies?.map((reply, index) => <Reply feedItem={reply} showLoginModal={showLoginModal} key={index} />)}
        </Flex>
      )}

      {isLoggedOut && <ReplyInput parentURI={parentURI} handleIsReplying={handleIsReplying} />}
    </>
  );
};

export default ReplyList;
