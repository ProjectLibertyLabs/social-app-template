import { Button } from 'antd';
import React, { useState } from 'react';
import styles from './NewPost.module.css';
import NewPostModal from './content/NewPostModal';
import { PostLoadingType, UserAccount } from './types';

interface NewPostProps {
  handleIsPosting: (postLoadingType: PostLoadingType) => void;
  loggedInAccount: UserAccount;
}

const NewPost = ({ handleIsPosting, loggedInAccount }: NewPostProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className={styles.header}>
      <Button size={'large'} type={'primary'} className={styles.newPostButton} onClick={() => setIsModalOpen(true)}>
        New Post
      </Button>
      {isModalOpen && (
        <NewPostModal
          onSuccess={() => {
            setIsModalOpen(false);
            handleIsPosting('post');
          }}
          onCancel={() => setIsModalOpen(false)}
          loggedInAccount={loggedInAccount}
        />
      )}
    </div>
  );
};

export default NewPost;
