import { Button, Flex, Form, Input } from 'antd';
import React, { ReactElement } from 'react';
import { DSNPContentURI } from '../../helpers/dsnp';
import styles from './ReplyInput.module.css';
import * as dsnpLink from '../../dsnpLink';
import { getContext } from '../../service/AuthService';

interface ReplyInputProps {
  parentURI: DSNPContentURI;
  handleIsReplying: () => void;
}

type NewReplyValues = {
  message: string;
};

const ReplyInput = ({ parentURI, handleIsReplying }: ReplyInputProps): ReactElement => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);

  const success = () => {
    setSaving(false);
  };

  const createReply = async (formValues: NewReplyValues) => {
    if (!formValues.message || formValues?.message?.length < 1) return;
    try {
      const response = await dsnpLink.postBroadcastHandler(
        getContext(),
        {},
        {
          content: formValues.message,
          inReplyTo: parentURI,
        }
      );
      success();
      handleIsReplying();
      form.resetFields();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <Form form={form} onFinish={createReply}>
      <Flex className={styles.root} gap={'small'}>
        <Form.Item name="message" required={true} className={styles.formItemInput}>
          <Input.TextArea placeholder="Reply..." autoSize={true} />
        </Form.Item>
        <Form.Item className={styles.formItem}>
          <Button htmlType="submit" loading={saving} type={'primary'}>
            Post
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};

export default ReplyInput;
