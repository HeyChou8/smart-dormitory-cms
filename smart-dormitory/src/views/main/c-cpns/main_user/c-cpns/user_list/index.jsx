
import React, { memo,useRef, useState,forwardRef,useImperativeHandle  } from 'react'
import { Button, Input, Space, Table,Popconfirm,Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import { UserListWrapper } from './style'
import UseMainStore from '../../../../../../store/main'
import { useEffect } from 'react';
import UserModal from '../user_modal';
import EditModal from '../edit_modal';

const UserList = memo(forwardRef((props,ref) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const searchInput = useRef(null);
  const {userList,userTotalCount,postUserListAction,
    deleteUserByIdAction,changeOffsetAction,changeOffsetActionAsync} = UseMainStore()
  // 将请求的数据填入data
  const data = userList
  useEffect(() => {
     fetchUserList()
  },[pagination.current])
  // 获取offset和size
  const size = pagination.pageSize
  let offset = (pagination.current - 1) * size
// 定义网络请求函数
  function fetchUserList(formData,page){
    let pageInfo = { offset,size }
    if(page)pageInfo = page
    const queryInfo = {...pageInfo,...formData}
    // 发送网络请求
    postUserListAction(queryInfo)
  }
  // 删除失败后出现的模态框
  const deleteFailedModal = (message) => {
    if(message){
      Modal.error({
        content: message,
        onOk: () => {
            // 用户点击确定按钮后的操作，例如执行退出系统的操作
        },
    });
    }
  }
  // 将定义的函数暴露出去
    useImperativeHandle(ref,() => ({
    fetchUserList,pagination,setPagination
  }))
//   点击页码事件
  const handleTableChange = (pagination) =>{
    setPagination(pagination)
    // 将offset存到状态管理器
    // 点击页码，更新每一页的offset
    offset = (pagination.current - 1) * pagination.pageSize
    changeOffsetAction(offset)
}
// 点击删除
const handleDelete = async (id) => {
  // 判断是否为本页最后一个数据，如果是则页码减10到上一页并更新上一页的数据
    await changeOffsetActionAsync(userList)
    const message = await deleteUserByIdAction(id)
    deleteFailedModal(message)
  };
//   查询
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
//   重置
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
//   查询框
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: '0.5208vw',
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`请输入`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: '0.5208vw',
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: '5.8594vw',
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: '5.8594vw',
            }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            过滤
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  // 注册用户点击确定后的操作
  const handleModalClick = () => {
    setPagination({...pagination,current:1})
  }
  const columns = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: '25%',
      editable: true,
      ...getColumnSearchProps('account'),
      sorter: (a, b) => a.account - b.account,
      sortDirections: ['descend', 'ascend'],
    //   title:'点击以降序'
    },
    {
      title: '宿舍号',
      dataIndex: 'dormitory_number',
      key: 'dormitory_number',
      width: '12%',
      ...getColumnSearchProps('dormitory_number'),
    },
    {
        title: '床位号',
        dataIndex: 'bed_number',
        key: 'bed_number',
        width: '10%',
        ...getColumnSearchProps('bed_number'),
      },
      { 
        title: '角色',
        dataIndex: 'role',
        key:'role',
        width: '10%',
        ...getColumnSearchProps('role'),
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
      render: (text, record,index) =>{
        return data.length >= 1 ? (<>
          <EditOutlined style={{color:'#1677ff',marginRight: '0.0651vw'}}/>
             <EditModal data={record} onFetchUserList={fetchUserList}/>
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
    <UserListWrapper>
        <div className='user_list'>
        <div className="list_header">
            <h2>用户列表</h2>
            <UserModal onClick={handleModalClick}/>
        </div>
        <div className="table">
        <Table columns={columns} dataSource={data} 
        pagination={{...pagination,total:userTotalCount}} onChange={handleTableChange}
        // 可以通过这种方式修改，也能直接导入中文包变成中文
        locale={{ triggerDesc: '点击降序',
        triggerAsc: '点击升序',
        cancelSort: '取消排序',}}
        />
        </div>
    </div>
    </UserListWrapper>
  )
}))


export default UserList