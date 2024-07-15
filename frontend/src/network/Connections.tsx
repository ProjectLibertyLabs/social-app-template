import { Button, Flex, Modal } from 'antd';
import React, { useState } from 'react';

const Connections = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex>
        <div>
          <span>31</span>
          <span>Followers</span>
        </div>
        <div>
          <span>31</span>
          <span>Following</span>
        </div>
      </Flex>

      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}></Modal>
    </>
  );
};

export default Connections;
