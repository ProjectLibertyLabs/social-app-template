import { Input } from "antd";
import React, { useState } from "react";
import { createNote } from "@dsnp/activity-content/factories";
import { DSNPContentURI } from "../helpers/dsnp";
import styles from "./ReplyInput.module.css";

interface ReplyInputProps {
  parentURI: DSNPContentURI;
}

const ReplyInput = ({ parentURI: parent }: ReplyInputProps): JSX.Element => {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");

  const createReply = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    setSaving(true);
    const newReply = createNote(replyValue, new Date());
    console.log("replyActivityContentCreated", { reply: newReply });
    // await sendReply(userId, newReply, parent);
    // dispatch(replyLoading({ loading: true, parent: parent }));
    setReplyValue("");
    setSaving(false);
  };

  return (
    <div className={styles.root}>
      <Input.TextArea
        placeholder="Reply..."
        value={replyValue}
        onChange={(e) => {
          if (saving) return;
          setReplyValue(e.target.value);
        }}
        autoSize={true}
        onPressEnter={(event) => createReply(event)}
      />
    </div>
  );
};

export default ReplyInput;
