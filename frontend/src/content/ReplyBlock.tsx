import React from "react";
import ReplyInput from "./ReplyInput";
import * as dsnpLink from "../dsnpLink";
import { DSNPContentURI } from "../helpers/dsnp";
import Post from "./Post";
import styles from "./ReplyBlock.module.css";

interface isReplyLoadingType {
  loading: boolean;
  parent: DSNPContentURI | undefined;
}

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  goToProfile: (dsnpId?: string) => void;
  showReplyInput: boolean;
}

const ReplyBlock = ({
  parentURI,
  replies,
  goToProfile,
  showReplyInput,
}: ReplyBlockProps): JSX.Element => {
  return (
    <>
      <div className={styles.root}>
        {replies.length > 0 && (
          <>
            {replies.map((reply, index) => (
              <Post
                feedItem={reply}
                goToProfile={goToProfile}
                key={index}
                showReplyInput={false}
              />
            ))}
          </>
        )}
      </div>
      {showReplyInput && <ReplyInput parentURI={parentURI} />}
    </>
  );
};

export default ReplyBlock;
