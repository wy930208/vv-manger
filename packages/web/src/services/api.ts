import { request } from '@umijs/max';
import { type Menu, type Role, type User, type Store, type Staff, type Customer, type CustomerRecord } from '@/db';

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 菜单 API
export const menuApi = {
  async getList(): Promise<Menu[]> {
    const response: ApiResponse<Menu[]> = await request('/menus');
    return response.data;
  },

  async add(menu: Omit<Menu, 'id'>): Promise<Menu> {
    const response: ApiResponse<Menu> = await request('/menus', {
      method: 'POST',
      data: menu,
    });
    return response.data;
  },

  async update(id: string, menu: Partial<Menu>): Promise<Menu> {
    const response: ApiResponse<Menu> = await request(`/menus/${id}`, {
      method: 'PUT',
      data: menu,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/menus/${id}`, {
      method: 'DELETE',
    });
  },

  async getTree(): Promise<Menu[]> {
    const response: ApiResponse<Menu[]> = await request('/menus/tree');
    return response.data;
  },
};

// 角色 API
export const roleApi = {
  async getList(): Promise<Role[]> {
    const response: ApiResponse<Role[]> = await request('/roles');
    return response.data;
  },

  async add(role: Omit<Role, 'id'>): Promise<Role> {
    const response: ApiResponse<Role> = await request('/roles', {
      method: 'POST',
      data: role,
    });
    return response.data;
  },

  async update(id: string, role: Partial<Role>): Promise<Role> {
    const response: ApiResponse<Role> = await request(`/roles/${id}`, {
      method: 'PUT',
      data: role,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/roles/${id}`, {
      method: 'DELETE',
    });
  },

  async getRoleMenus(id: string): Promise<string[]> {
    const response: ApiResponse<string[]> = await request(`/roles/${id}/menus`);
    return response.data;
  },

  async setRoleMenus(id: string, menuIds: string[]): Promise<void> {
    await request(`/roles/${id}/menus`, {
      method: 'POST',
      data: { menuIds },
    });
  },
};

// 用户 API
export const userApi = {
  async getList(): Promise<any> {
    const response: ApiResponse<User[]> = await request('/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response: ApiResponse<User> = await request(`/users/${id}`);
    return response.data;
  },

  async add(user: Omit<User, 'id'>): Promise<User> {
    const response: ApiResponse<User> = await request('/users', {
      method: 'POST',
      data: user,
    });
    return response.data;
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const response: ApiResponse<User> = await request(`/users/${id}`, {
      method: 'PUT',
      data: user,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  async resetPassword(id: string): Promise<void> {
    await request(`/users/${id}/reset-password`, {
      method: 'POST',
    });
  },
};

// 门店 API
export const storeApi = {
  async getList(): Promise<Store[]> {
    const response: ApiResponse<Store[]> = await request('/stores');
    return response.data;
  },

  async add(store: Omit<Store, 'id'>): Promise<Store> {
    const response: ApiResponse<Store> = await request('/stores', {
      method: 'POST',
      data: store,
    });
    return response.data;
  },

  async update(id: string, store: Partial<Store>): Promise<Store> {
    const response: ApiResponse<Store> = await request(`/stores/${id}`, {
      method: 'PUT',
      data: store,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/stores/${id}`, {
      method: 'DELETE',
    });
  },

  async getOne(id: string): Promise<Store> {
    const response: ApiResponse<Store> = await request(`/stores/${id}`);
    return response.data;
  },
};

// 员工相关 API
export const staffApi = {
  async getList(): Promise<Staff[]> {
    const response: ApiResponse<Staff[]> = await request('/staff');
    return response.data;
  },

  async add(staff: Omit<Staff, 'id'>): Promise<Staff> {
    const response: ApiResponse<Staff> = await request('/staff', {
      method: 'POST',
      data: staff,
    });
    return response.data;
  },

  async update(id: string, staff: Partial<Staff>): Promise<Staff> {
    const response: ApiResponse<Staff> = await request(`/staff/${id}`, {
      method: 'PUT',
      data: staff,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/staff/${id}`, {
      method: 'DELETE',
    });
  },
};

// 客户 API
export const customerApi = {
  async getList(): Promise<Customer[]> {
    const response: ApiResponse<Customer[]> = await request('/customers');
    return response.data;
  },

  async add(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response: ApiResponse<Customer> = await request('/customers', {
      method: 'POST',
      data: customer,
    });
    return response.data;
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response: ApiResponse<Customer> = await request(`/customers/${id}`, {
      method: 'PUT',
      data: customer,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await request(`/customers/${id}`, {
      method: 'DELETE',
    });
  },

  // 获取客户记录
  async getRecords(customerId: string): Promise<CustomerRecord[]> {
    const response: ApiResponse<CustomerRecord[]> = await request(`/customers/${customerId}/records`);
    return response.data;
  },

  // 添加客户记录
  async addRecord(record: Omit<CustomerRecord, 'id' | 'createdAt'>): Promise<CustomerRecord> {
    const response: ApiResponse<CustomerRecord> = await request(`/customers/${record.customerId}/records`, {
      method: 'POST',
      data: record,
    });
    return response.data;
  },
};