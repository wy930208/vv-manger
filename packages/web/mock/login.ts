

export default {
  'POST /api/login': (req: any, res: any) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'ant.design') {
      res.send({
        success: true,
        data: {
          name: 'Admin',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          email: 'admin@example.com',
          signature: '海纳百川，有容乃大',
          title: '管理员',
          group: '管理员组',
          tags: [
            { key: '0', label: '很有想法的' },
            { key: '1', label: '专注设计' },
            { key: '2', label: '辣~' },
            { key: '3', label: '大长腿' },
            { key: '4', label: '川妹子' },
            { key: '5', label: '海纳百川' },
          ],
          notifyCount: 12,
          unreadCount: 11,
          country: 'China',
          geographic: {
            province: { label: '浙江省', key: '330000' },
            city: { label: '杭州市', key: '330100' },
          },
          address: '西湖区工专路 77 号',
          phone: '0752-268888888',
        },
      });
    } else {
      res.send({
        success: false,
        message: '用户名或密码错误',
      });
    }
  },
}; 