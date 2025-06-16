// 门店列表
const storeList = [
  {
    id: 1,
    name: '上海门店',
    code: 'SH001',
    address: '上海市浦东新区张江高科技园区',
    manager: '张三',
    phone: '021-12345678',
    status: 'active',
    area: '华东区',
    businessHours: '09:00-22:00',
  },
  {
    id: 2,
    name: '北京门店',
    code: 'BJ001',
    address: '北京市朝阳区建国路88号',
    manager: '李四',
    phone: '010-87654321',
    status: 'active',
    area: '华北区',
    businessHours: '09:00-22:00',
  },
];

// 员工列表
const staffList = [
  {
    id: 1,
    name: '张三',
    employeeId: 'EMP001',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    position: '店长',
    store: '上海门店',
    status: 'active',
    joinDate: '2023-01-01',
  },
  {
    id: 2,
    name: '李四',
    employeeId: 'EMP002',
    phone: '13800138002',
    email: 'lisi@example.com',
    position: '销售顾问',
    store: '上海门店',
    status: 'active',
    joinDate: '2023-02-01',
  },
  {
    id: 3,
    name: '王五',
    employeeId: 'EMP003',
    phone: '13800138003',
    email: 'wangwu@example.com',
    position: '销售顾问',
    store: '北京门店',
    status: 'inactive',
    joinDate: '2023-03-01',
  },
];

export default {
  // 门店管理接口
  'GET /api/store/info': (req: any, res: any) => {
    res.json({
      success: true,
      data: storeList,
    });
  },

  'POST /api/store/info': (req: any, res: any) => {
    const newStore = {
      id: storeList.length + 1,
      ...req.body,
    };
    storeList.push(newStore);
    res.json({
      success: true,
      data: newStore,
    });
  },

  'PUT /api/store/info/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = storeList.findIndex(store => store.id === Number(id));
    if (index > -1) {
      storeList[index] = { ...storeList[index], ...req.body };
      res.json({
        success: true,
        data: storeList[index],
      });
    } else {
      res.status(404).json({
        success: false,
        message: '门店不存在',
      });
    }
  },

  'DELETE /api/store/info/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = storeList.findIndex(store => store.id === Number(id));
    if (index > -1) {
      storeList.splice(index, 1);
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '门店不存在',
      });
    }
  },

  // 员工管理接口
  'GET /api/store/staff': (req: any, res: any) => {
    const { store } = req.query;
    let filteredStaff = staffList;
    if (store && store !== 'all') {
      filteredStaff = staffList.filter(staff => staff.store === store);
    }
    res.json({
      success: true,
      data: filteredStaff,
    });
  },

  'POST /api/store/staff': (req: any, res: any) => {
    const newStaff = {
      id: staffList.length + 1,
      ...req.body,
    };
    staffList.push(newStaff);
    res.json({
      success: true,
      data: newStaff,
    });
  },

  'PUT /api/store/staff/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = staffList.findIndex(staff => staff.id === Number(id));
    if (index > -1) {
      staffList[index] = { ...staffList[index], ...req.body };
      res.json({
        success: true,
        data: staffList[index],
      });
    } else {
      res.status(404).json({
        success: false,
        message: '员工不存在',
      });
    }
  },

  'DELETE /api/store/staff/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = staffList.findIndex(staff => staff.id === Number(id));
    if (index > -1) {
      staffList.splice(index, 1);
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '员工不存在',
      });
    }
  },
}; 