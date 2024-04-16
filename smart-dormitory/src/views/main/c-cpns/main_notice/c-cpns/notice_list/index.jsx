
import React, { memo,useRef, useState,forwardRef,useImperativeHandle  } from 'react'
import { Button, Input, Space, Table,Popconfirm,message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import { NoticeListWrapper } from './style'
import UseMainStore from '../../../../../../store/main'
import { useEffect } from 'react';
import NoticeModal from '../notice_modal';
import EditModal from '../edit_modal';
import { localCache } from '../../../../../../utils/cache.ts';

const NoticeList = memo(forwardRef((props,ref) => {
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  // const searchInput = useRef(null);
  const {noticeList,noticeTotalCount,postNoticeListAction,deleteNoticeByIdAction,changeOffsetAction,changeOffsetActionAsync} = UseMainStore()
  // 将请求的数据填入data
  const data = noticeList
  const role = localCache.getCache('copyRole')
  useEffect(() => {
    fetchNoticeList()
  },[pagination.current])
  // 获取offset和size
  const size = pagination.pageSize
  let offset = (pagination.current - 1) * size
// 定义网络请求函数
  function fetchNoticeList(formData,page){
    let pageInfo = { offset,size }
    if(page) pageInfo = page
    const queryInfo = {...pageInfo,...formData}
    // 发送网络请求
    postNoticeListAction(queryInfo)
  }
  // 将定义的函数暴露出去
    useImperativeHandle(ref,() => ({
    fetchNoticeList
  }))
//   点击页码事件
  const handleTableChange = (pagination) =>{
    setPagination(pagination)
    // 点击页码，更新每一页的offset
    offset = (pagination.current - 1) * pagination.pageSize
     changeOffsetAction(offset)
}
// 点击删除
const handleDelete = async (id) => {
  if(role==='学生'){
    message.error('您没有操作权限')
  }else {
    // 判断是否为本页最后一个数据，如果是则页码减10到上一页并更新上一页的数据
    await changeOffsetActionAsync(noticeList)
    deleteNoticeByIdAction(id,{role})
  }
    
  };
//   查询
  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };
//   重置
  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText('');
  // };
//   查询框
  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={(e) => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         placeholder={`请输入`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: 'block',
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           查询
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           重置
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({
  //               closeDropdown: false,
  //             });
  //             setSearchText(selectedKeys[0]);
  //             setSearchedColumn(dataIndex);
  //           }}
  //         >
  //           过滤
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close();
  //           }}
  //         >
  //           关闭
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? '#1677ff' : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: '#ffc069',
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // });
  // 注册用户点击确定后的操作
  const handleModalClick = () => {
    setPagination({...pagination,current:1})
  }
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
      editable: true,
    },
    {
      title: '公告内容',
      dataIndex: 'notice_content',
      key: 'notice_content',
    },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width: '15%',
      },
      {
        title: '更新时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
        width: '15%',
      },
      
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '13%',
      render: (text, record,index) =>{
        return data.length >= 1 ? (<>
          <EditOutlined style={{color:'#1677ff',marginRight: '0.1953vw'}}/>
             <EditModal data={record} onFetchNoticeList={fetchNoticeList}/>
          <Popconfirm title="确认删除吗?"  cancelText='取消' onConfirm={() => handleDelete(record.id)} > 
          <DeleteOutlined style={{color:'#f56c6c',marginRight:'0.0651vw'}} />
              <a style={{color:'#f56c6c'}}>删除</a>
            </Popconfirm>
          </>
          ) : null
      } 
    }
  ];
  return (
    <NoticeListWrapper>
        <div className='notice_list'>
        <div className="list_header">
            <h2>通知列表</h2>
            <NoticeModal onClick={handleModalClick}/>
        </div>
        <div className="table">
        <Table columns={columns} dataSource={data} 
        pagination={{...pagination,total:noticeTotalCount}} onChange={handleTableChange}
        // 可以通过这种方式修改，也能直接导入中文包变成中文
        locale={{ triggerDesc: '点击降序',
        triggerAsc: '点击升序',
        cancelSort: '取消排序',}}
        />
        </div>
    </div>
    </NoticeListWrapper>
  )
}))


export default NoticeList