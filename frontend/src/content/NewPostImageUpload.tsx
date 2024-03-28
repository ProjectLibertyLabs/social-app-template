import { Form, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import React from "react";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface NewPostImageUploadProps {
  onChange: (fileList: UploadFile[]) => void;
}

const NewPostImageUpload = ({
  onChange,
}: NewPostImageUploadProps): JSX.Element => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange(newFileList);
  };

  const handleUpload: UploadProps["customRequest"] = (options) => {
    const { file, onSuccess, onError } = options;
    const reader = new FileReader();
    reader.onload = () => {
      onSuccess?.("ok");
    };
    reader.onerror = () => {
      // Handle file read error
      onError?.(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file as any);
  };

  return (
    <>
      <Form.Item
        validateStatus={errorMsg ? "error" : ""}
        name="images"
        valuePropName="fileList"
        help={errorMsg}
        noStyle
      >
        <Upload
          name="media-upload"
          multiple
          beforeUpload={() => false}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          customRequest={handleUpload}
          onChange={handleChange}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
export default NewPostImageUpload;
