
import React, { memo,useRef, useState,forwardRef,useImperativeHandle  } from 'react'
import { Button, Input, Space, Table,Popconfirm,message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import { RepairListWrapper } from './style'
import UseMainStore from '../../../../../../store/main'
import { useEffect } from 'react';
import RepairModal from '../repair_modal';
import { localCache } from '../../../../../../utils/cache.ts';
// import EditModal from '../edit_modal';

const RepairList = memo(forwardRef((props,ref) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const searchInput = useRef(null);
  const {repairList,repairTotalCount,postRepairListAction,
    deleteRepairByIdAction,changeStatusRepairAction,changeOffsetAction,changeOffsetActionAsync} = UseMainStore()
  // 将请求的数据填入data
  const data = repairList
  const role = localCache.getCache('copyRole')
  useEffect(() => {
    fetchRepairList()
  },[pagination.current])
   // 获取offset和size
   const size = pagination.pageSize
   let offset = (pagination.current - 1) * size
// 定义网络请求函数
  function fetchRepairList(formData,page){
    let pageInfo = { offset,size }
    if(page)pageInfo = page
    const queryInfo = {...pageInfo,...formData}
    // 发送网络请求
    postRepairListAction(queryInfo)
  }
  // 将定义的函数暴露出去
    useImperativeHandle(ref,() => ({
    fetchRepairList
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
    // 判断是否为本页最后一个数据，如果是则页码减10到上一页并更新上一页的数据
    await changeOffsetActionAsync(repairList)
    deleteRepairByIdAction(id)
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
  // 提交维修点击确定后的操作
  const handleModalClick = () => {
    setPagination({...pagination,current:1})
  }
  // 修改维修状态
  const handleStatusClick = (id) => {
    if(role === '学生'){
      message.error('您没有操作权限')
    }else {
      const repair_status = '已处理'
    const repairInfo = { role,repair_status}
      changeStatusRepairAction(id,repairInfo)
      fetchRepairList()
    }
    }
  
  const columns = [
    {
      title: '宿舍号',
      dataIndex: 'dormitory_number',
      key: 'dormitory_number',
      width: '15%',
      editable: true,
    //   title:'点击以降序'
    },
    {
        title: '联系人',
        dataIndex: 'contact_person',
        key: 'contact_person',
        width: '15%',
        ...getColumnSearchProps('contact_person'),
      },
      { 
        title: '联系电话',
        dataIndex: 'cellphone',
        key:'cellphone',
        width: '15%',
        ...getColumnSearchProps('cellphone'),
      },
      {
        title: '维修说明',
        dataIndex: 'repair_content',
        key: 'repair_content',
        width: '20%',
        ...getColumnSearchProps('repair_content'),
      },
      {
        title: '维修状态',
        dataIndex: 'repair_status',
        key: 'repair_status',
        width: '8%',
        render:(text) => <div style={{width:'3.9063vw',height:'1.8229vw',fontSize:'0.7813vw',
        backgroundColor: text==='已处理' ? 'rgb(106, 205, 102)' : '#f56c6cf3',textAlign:'center',
        lineHeight:'1.8229vw',borderRadius:'0.5208vw',color:'#ffffffec'}}>{text}</div>
      },
      {
        title: '提交时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width: '15%',
      },
      
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record,index) =>{
        return data.length >= 1 ? (<>
        <Popconfirm title='确认处理吗?' cancelText='取消' onConfirm={() => handleStatusClick(record.id)}>
        <EditOutlined style={{color:'#1677ff',marginRight: '0.1953vw'}}/>
        <span style={{color:'rgb(22, 119, 255)', marginRight:'0.651vw',cursor:"pointer"}} 
             onClick={handleStatusClick}>处理</span>
        </Popconfirm>
          
             
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
    <RepairListWrapper>
        <div className='repair_list'>
        <div className="list_header">
            <h2>报修列表</h2>
            <RepairModal onClick={handleModalClick}/>
        </div>
        <div className="table">
        <Table columns={columns} dataSource={data} 
        pagination={{...pagination,total:repairTotalCount}} onChange={handleTableChange}
        // 可以通过这种方式修改，也能直接导入中文包变成中文
        locale={{ triggerDesc: '点击降序',
        triggerAsc: '点击升序',
        cancelSort: '取消排序',}}
        />
        </div>
    </div>
    </RepairListWrapper>
  )
}))


export default RepairList