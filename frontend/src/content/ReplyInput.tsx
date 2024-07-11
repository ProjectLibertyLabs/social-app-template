import { Button, Flex, Input } from 'antd';
import React, { ReactElement, useState } from 'react';
import { createNote } from '@dsnp/activity-content/factories';
import { DSNPContentURI } from '../helpers/dsnp';
import styles from './ReplyInput.module.css';

interface ReplyInputProps {
  parentURI: DSNPContentURI;
}

const ReplyInput = ({ parentURI: parent }: ReplyInputProps): ReactElement => {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>('');

  const createReply = async (
    event: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    setSaving(true);
    const newReply = createNote(replyValue, new Date());
    console.log('replyActivityContentCreated', { reply: newReply });
    // await sendReply(userId, newReply, parent);
    // dispatch(replyLoading({ loading: true, parent: parent }));
    setReplyValue('');
    setSaving(false);
  };

  return (
    <Flex className={styles.root} gap={'small'}>
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
      <Button onClick={(event) => createReply(event)} type={'primary'} disabled={saving || replyValue.length < 1}>
        Post
      </Button>
    </Flex>
  );
};

export default ReplyInput;
