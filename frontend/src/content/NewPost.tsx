import React from "react";
import { Button, Modal, Input, Form } from "antd";
import UserAvatar from "../chrome/UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import type { User } from "../types";
import type { UploadFile } from "antd/es/upload/interface";
import * as dsnpLink from "../dsnpLink";
import { getContext } from "../service/AuthService";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
  account: User;
}

type NewPostValues = {
  message: string;
  test: string;
  images: UploadFile[];
};

const NewPost = ({
  onSuccess,
  onCancel,
  account,
}: NewPostProps): JSX.Element => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async (formValues: NewPostValues) => {
    try {
      const body = new FormData();
      body.append("content", formValues.message);
      (formValues.images || []).forEach((upload) => {
        if (upload.originFileObj) body.append("images", upload.originFileObj);
      });
      const resp = await dsnpLink.createBroadcast(getContext(), {}, body);
      console.log("postActivityContentCreated", { resp });
      success();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <Modal
      title="New Post"
      open={true}
      onCancel={onCancel}
      footer={null}
      centered={true}
    >
      <Form form={form} onFinish={createPost}>
        <Form.Item>
          <UserAvatar user={account} avatarSize={"medium"} />
          Posting as @{account.handle}
        </Form.Item>
        <Form.Item name="message" required={true}>
          <Input.TextArea rows={4} placeholder="Enter your message" />
        </Form.Item>
        <NewPostImageUpload
          onChange={(fileList) => {
            form.setFieldsValue({ images: fileList });
            form.validateFields(["images"]);
          }}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewPost;
