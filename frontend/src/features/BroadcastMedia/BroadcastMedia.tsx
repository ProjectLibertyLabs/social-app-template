import React, { ReactElement } from 'react';
import ReactPlayer from 'react-player';
import { Carousel } from 'antd';
import styles from './BroadcastMedia.module.css';
import type {
  ActivityContentAttachment,
  ActivityContentImage,
  ActivityContentVideo,
  ActivityContentAudio,
} from '@dsnp/activity-content/types';
import { tryUseIpfsGateway } from '../../service/IpfsService';

interface BroadcastMediaProps {
  attachments: ActivityContentAttachment[];
}

function isImage(attachment: ActivityContentAttachment): attachment is ActivityContentImage {
  return attachment.type.toLowerCase() === 'image';
}

function isVideo(attachment: ActivityContentAttachment): attachment is ActivityContentVideo {
  return attachment.type.toLowerCase() === 'video';
}

function isAudio(attachment: ActivityContentAttachment): attachment is ActivityContentAudio {
  return attachment.type.toLowerCase() === 'audio';
}

const BroadcastMedia = ({ attachments }: BroadcastMediaProps): ReactElement => {
  const getPostMediaItems = () => {
    return attachments.map((attachment, index) => {
      return (
        <div key={index} className={styles.cover}>
          {isImage(attachment) && (
            <a href={tryUseIpfsGateway(attachment.url[0].href)} target="_blank" rel="noopener noreferrer">
              <img alt={attachment.name} className={styles.image} src={tryUseIpfsGateway(attachment.url[0].href)} />
            </a>
          )}
          {(isVideo(attachment) || isAudio(attachment)) && (
            <ReactPlayer
              controls
              playsinline
              className={styles.image}
              url={tryUseIpfsGateway(attachment.url[0].href)}
              maxWith={670}
              height={isVideo(attachment) ? 'auto' : 55}
              muted
            />
          )}
        </div>
      );
    });
  };

  return (
    <Carousel className={styles.slider} dots={attachments.length > 1}>
      {getPostMediaItems()}
    </Carousel>
  );
};
export default BroadcastMedia;
