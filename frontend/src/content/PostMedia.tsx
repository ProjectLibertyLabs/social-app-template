import React from "react";
import ReactPlayer from "react-player";
import { Carousel } from "antd";
// import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import styles from "./PostMedia.module.css";
import type {
  ActivityContentAttachment,
  ActivityContentImage,
  ActivityContentVideo,
  ActivityContentAudio,
} from "@dsnp/activity-content/types";
import { tryUseIpfsGateway } from "../service/IpfsService";

interface PostMediaProps {
  attachments: ActivityContentAttachment[];
}

function isImage(
  attachment: ActivityContentAttachment,
): attachment is ActivityContentImage {
  return attachment.type.toLowerCase() === "image";
}

function isVideo(
  attachment: ActivityContentAttachment,
): attachment is ActivityContentVideo {
  return attachment.type.toLowerCase() === "video";
}

function isAudio(
  attachment: ActivityContentAttachment,
): attachment is ActivityContentAudio {
  return attachment.type.toLowerCase() === "audio";
}

const PostMedia = ({ attachments }: PostMediaProps): JSX.Element => {
  const getPostMediaItems = () => {
    return attachments.map((attachment, index) => {
      return (
        <div key={index} className={styles.cover}>
          {isImage(attachment) && (
            <a
              href={tryUseIpfsGateway(attachment.url[0].href)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt={attachment.name}
                className={styles.image}
                src={tryUseIpfsGateway(attachment.url[0].href)}
              />
            </a>
          )}
          {(isVideo(attachment) || isAudio(attachment)) && (
            <ReactPlayer
              controls
              playsinline
              className={styles.image}
              url={tryUseIpfsGateway(attachment.url[0].href)}
              width={670}
              height={isVideo(attachment) ? 400 : 55}
              muted
            />
          )}
        </div>
      );
    });
  };

  return (
    <Carousel
      dotPosition="bottom"
      // nextArrow={<RightOutlined />}
      // prevArrow={<LeftOutlined />}
      className={styles.slider}
      dots={{ className: styles.dots }}
    >
      {getPostMediaItems()}
    </Carousel>
  );
};
export default PostMedia;
