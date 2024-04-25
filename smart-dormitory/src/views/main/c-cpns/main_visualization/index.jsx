import React, { memo,useEffect } from 'react'
import { Layout, theme } from 'antd';
import PowerScheduleChart from '@/components/electricity_timing_chart'
import UserTypePieChart from '@/components/user_type_pie_chart'
import BuildingOccupancyBarChart from '@/components/building_occupancy_bar_chart';
import RepairSummaryStackedBarChart from '@/components/RepairSummaryStackedBarChart';
import AnnouncementsCard from '@/components/Announcement'
import UseMainStore from '@/store/main';
import { localCache } from '@/utils/cache.ts';

const MainVisualization = memo(() => {
  const {Content, Footer } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // 拿到通知列表
const noticeList = UseMainStore(state => state.noticeList)
const postNoticeListAction = UseMainStore(state => state.postNoticeListAction)
const postRepairListAction = UseMainStore(state => state.postRepairListAction)
const postUserListAction = UseMainStore(state => state.postUserListAction)
const announcements = noticeList.slice(0,3)
const scheduleArr = localCache.getCache('scheduleArr')
// 拿到报修列表
const repairList = UseMainStore(state => state.repairList)
// 处理报修数据
const repairData = repairList.reduce((acc, repair) => {
  if (repair.repair_status === "未处理") {
    acc.unfixed++;
  } else if (repair.repair_status === "已处理") {
    acc.fixed++;
  }
  return acc;
}, { unfixed: 0, fixed: 0 });
// 拿到用户列表
const userList = UseMainStore(state => state.userList)
// 处理角色数据
// 使用reduce方法统计每种角色的数量
const roleCount = userList.reduce((acc, user) => {
  if (user.role === '管理员') {
    acc.admin = (acc.admin || 0) + 1; // 如果角色是管理员，则递增管理员的计数
  } else if (user.role === '学生') {
    acc.student = (acc.student || 0) + 1; // 如果角色是学生，则递增学生的计数
  }
  return acc;
}, {});
// 格式化最终结果
const userData = [
  { value: roleCount.admin || 0, name: '管理员' },
  { value: roleCount.student || 0, name: '学生' }
];
// 处理各栋的人数数据
// 使用reduce方法统计每栋楼的人数
const occupancy = userList.reduce((acc, user) => {
  // 提取栋数，例如从"A栋143"中提取"A栋"
  const building = user.dormitory_number[0] + '栋';
  // 计数，如果该栋已存在于累加器中，则增加计数，否则设为1
  acc[building] = (acc[building] || 0) + 1;
  return acc;
}, {});
// 格式化最终结果
const occupancyData = [
  { name: 'A栋', value: occupancy['A栋'] || 0 },
  { name: 'B栋', value: occupancy['B栋'] || 0 },
  { name: 'C栋', value: occupancy['C栋'] || 0 },
  { name: 'D栋', value: occupancy['D栋'] || 0 },
  { name: 'E栋', value: occupancy['E栋'] || 0 },
  { name: 'F栋', value: occupancy['F栋'] || 0 }
];
const powerSessions = [
  { startTime: '2023-04-18T03:00:00', endTime: '2023-04-18T05:00:00' },
  // { startTime: '2024-04-18T05:00:00', endTime: '2024-04-18T15:00:00' }
];
// 处理供电时间
// 验证时间值是否有效
const isValidDate = (dateStr) => {
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) // 如果 date 是有效的，getTime() 不会是 NaN
};
scheduleArr?.forEach((schedule)=> {
  if (isValidDate(schedule?.startTime) && isValidDate(schedule?.endTime)) {
    const startTimeUTC = new Date(schedule?.startTime);
    const endTimeUTC = new Date(schedule?.endTime);
    // 转为中国标准时间
    const startTimeCST = new Date(startTimeUTC.getTime() + 8 * 3600 * 1000);
    const endTimeCST = new Date(endTimeUTC.getTime() + 8 * 3600 * 1000);
  
    const handledSchedule = {
      startTime: startTimeCST.toISOString().replace('.000Z', ''),
      endTime: endTimeCST.toISOString().replace('.000Z', '')
    };
    powerSessions.push(handledSchedule)
  
  } else {
    console.error('Invalid date provided in schedule');
  }
})


  useEffect(() => {
   postNoticeListAction()
   postRepairListAction()
   postUserListAction()
  },[])
  return (
    <div>
      <Content
          style={{
            margin: '0 1.0417vw',
          }}
        >
          <div
            style={{
              height:'22.7865vw',
              padding: '1.5625vw 1.5625vw 0vw 1.5625vw',
              minHeight: '7.8125vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div style={{display:'flex',justifyContent:'space-between'}}>
             <div style={{flex: 1}}> <AnnouncementsCard announcements={announcements}/></div>
            <div style={{flex:1}}><PowerScheduleChart powerSessions={powerSessions} /></div>
            </div>
          </div>
        </Content>
        <Footer
          style={{
            padding: '1.1068vw'
          }}
        >
          <div style={{
              height:'270px',
              padding: '1.5625vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
             <div style={{flex: 0.75}}> <UserTypePieChart userData={userData}/></div>
            <div style={{flex: 1,marginRight:'1.3021vw'}}><BuildingOccupancyBarChart occupancyData={occupancyData} /></div>
            <div style={{flex: 1}}><RepairSummaryStackedBarChart repairData={repairData} /></div>
            </div>
              </div>
            </div>
        </Footer>
    </div>
  )
})

export default MainVisualization