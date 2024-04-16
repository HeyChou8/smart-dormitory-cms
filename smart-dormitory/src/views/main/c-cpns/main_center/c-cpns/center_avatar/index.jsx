

import React, { memo, useState,useEffect } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Upload, message, Button } from 'antd';
import axios from 'axios';
import { localCache } from '../../../../../../utils/cache.ts';
import {CenterAvatarWrapper} from './style'


const CenterAvatar = memo(() => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const user_id = localCache.getCache('user_id');

   // 组件加载时，尝试从本地缓存获取头像URL
   useEffect(() => {
    const cachedAvatarUrl = localCache.getCache(`avatar_url_${user_id}`);
    if (cachedAvatarUrl) {
      setAvatarUrl(cachedAvatarUrl);
    }
  }, []);
  const customRequest = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`http://localhost:8001/profile/uploads/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round((loaded / total) * 100) }, file);
        },
      });

      // 上传成功后，更新组件状态和本地缓存
       const newAvatarUrl = response.data.url; // 假设响应中包含了新头像的URL
       setAvatarUrl(newAvatarUrl); // 更新组件状态
       localCache.setCache(`avatar_url_${user_id}`, newAvatarUrl); // 根据用户ID更新本地缓存

      onSuccess(response.data, file);
      message.success('上传成功！');
      
    } catch (error) {
      console.error('上传失败:', error);
      onError(error);
      message.error('上传失败！');
    }
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/JPEG/PNG 文件!');
      return Upload.LIST_IGNORE; // 阻止文件被上传
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB!');
      return Upload.LIST_IGNORE; // 阻止文件被上传
    }

    return isJpgOrPng && isLt2M; // 只有当文件类型和大小都符合条件时，才允许上传
  };

  return (
    <CenterAvatarWrapper>
      <div className="center_avatar">
        <div className='avatar_info'>
          {avatarUrl ? (
            <Avatar size={100} src={avatarUrl} />
          ) : (
            <Avatar size={100} icon={<UserOutlined />} />
          )}
          <div className='upload_text'>
            <Upload customRequest={customRequest} showUploadList={false} beforeUpload={beforeUpload}>
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
            <p className='text'>支持.jpg .jpeg .png类型文件, 2M以内</p>
          </div>
        </div>
      </div>
    </CenterAvatarWrapper>
  );
});

export default CenterAvatar;


