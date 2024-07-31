import React, { LegacyRef, ReactElement, useEffect } from 'react';
import { Button, Modal, Input, Form, Flex } from 'antd';
import UserAvatar from '../UserAvatar/UserAvatar';
import NewPostImageUpload from './NewPostImageUpload';
import type { User } from '../../types';
import type { UploadFile } from 'antd/es/upload/interface';
import * as dsnpLink from '../../dsnpLink';
import { getContext } from '../../service/AuthService';
import FormData from 'form-data';
import { makeDisplayHandle } from '../../helpers/DisplayHandle';
import styles from './NewPostModal.module.css';
import { TextAreaRef } from 'antd/es/input/TextArea';

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
  loggedInAccount: User;
}

type NewPostValues = {
  message: string;
  test?: string;
  images: UploadFile[];
};

const NewPostModal = ({ onSuccess, onCancel, loggedInAccount }: NewPostProps): ReactElement => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);

  const messageRef: LegacyRef<TextAreaRef> = React.createRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [messageRef]);

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async (formValues: NewPostValues) => {
    try {
      const body = new FormData();
      body.append('content', formValues.message);
      (formValues.images || []).forEach((upload) => {
        if (upload.originFileObj) body.append('files', upload.originFileObj);
      });

      const { assetIds } = await dsnpLink.postAssetsHandler(getContext(), {}, body);
      const response = await dsnpLink.postBroadcastHandler(
        getContext(),
        {},
        {
          content: formValues.message,
          assets: assetIds,
        }
      );
      success();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <Modal
      title={<div className={styles.title}>New Post</div>}
      open={true}
      onCancel={onCancel}
      footer={null}
      centered={true}
    >
      <Form form={form} onFinish={createPost}>
        <Form.Item>
          <Flex gap={8}>
            <UserAvatar user={loggedInAccount} avatarSize={'small'} />
            <span className={styles.fromTitle}>Posting as @{makeDisplayHandle(loggedInAccount.handle)}</span>
          </Flex>
        </Form.Item>
        <Form.Item name="message" required={true}>
          <Input.TextArea
            rows={4}
            placeholder="Enter your message"
            autoFocus={true}
            ref={messageRef}
            onChange={(e) => setIsDisabled(e.target.value.length === 0)}
          />
        </Form.Item>
        <NewPostImageUpload
          onChange={(fileList) => {
            form.setFieldsValue({ images: fileList });
            form.validateFields(['images']);
          }}
        />
        <Form.Item>
          <Button
            size={'large'}
            type={'primary'}
            className={styles.postButton}
            htmlType="submit"
            loading={saving}
            disabled={isDisabled}
          >
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewPostModal;
