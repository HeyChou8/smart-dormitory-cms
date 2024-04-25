import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Text, Title } = Typography;
// 单个公告的显示组件，标题在左侧，日期在右侧，并在条目间添加虚线（除最后一个外）
const Announcement = ({ title, date, isLast }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7813vw 0' }}>
        <Title level={5} style={{ margin: '0' }}>{title}</Title>
        <Text type="secondary" style={{ margin: '0' }}>{date}</Text>
      </div>
      {!isLast && <hr style={{ width: '100%', borderTop: '0.0651vw dashed #ccc', marginTop: '0.7813vw' }} />}
    </div>
  );
};

// 主卡片组件，包含多个公告，每个公告之间使用虚线分割
  
  const AnnouncementsCard = ({announcements}) => {
  const navigate = useNavigate()
  const handleDetailClick = () => {
    navigate('/main/notice')
  }
  return (
    <Card style={{ width: '22.7865vw'}} bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3021vw' }}>
        <Title level={4} style={{ margin: '0' }}>最新公告</Title>
        <Text onClick={handleDetailClick} style={{ cursor: 'pointer', color: '#555' }}>
          详情 <RightOutlined />
        </Text>
      </div>
      {announcements.map((announcement, index) => (
        <Announcement
          key={index}
          title={announcement.title}
          date={announcement.updateAt}
          isLast={index === announcements.length - 1}
        />
      ))}
    </Card>
  );
};

export default AnnouncementsCard;
