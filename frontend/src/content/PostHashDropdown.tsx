import React, { useState } from "react";
import { Dropdown } from "antd";
import { CopyOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { HexString } from "../types";
import { buildDSNPContentURI } from "../helpers/dsnp";
import styles from "./PostHashDropdown.module.css";

import type { MenuProps } from "antd";

interface PostHashDropdownProps {
  hash: HexString;
  fromId: string;
  isReply?: boolean;
}

const PostHashDropdown = ({
  hash,
  fromId,
  isReply,
}: PostHashDropdownProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const announcementURI = buildDSNPContentURI(fromId, hash);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.menu}>
          <div className={styles.title}>DSNP Announcement URI:</div>
          {announcementURI}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      className={isReply ? styles.replyRoot : styles.root}
      menu={{
        items,
      }}
      open={isVisible}
      onOpenChange={(e) => setIsVisible(e)}
      placement="bottomRight"
    >
      <button
        className={styles.button}
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(announcementURI);
          setIsCopied(true);
          setTimeout(function () {
            setIsCopied(false);
          }, 2000);
        }}
      >
        {isCopied ? (
          <CheckCircleTwoTone twoToneColor="#1dcf76" />
        ) : (
          <CopyOutlined />
        )}{" "}
        DSNP URI
      </button>
    </Dropdown>
  );
};

export default PostHashDropdown;
