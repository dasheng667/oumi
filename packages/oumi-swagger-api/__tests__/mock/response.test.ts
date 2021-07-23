export const response1 = {
  addTime: {
    type: 'string',
    format: 'date-time',
    description: '添加时间'
  },
  companyId: {
    type: 'array',
    items: {
      type: 'string'
    }
  }
};

export const response2 = {
  addTime: {
    type: 'string',
    format: 'date-time',
    description: '添加时间'
  },
  myList: {
    isArray: true,
    time1: {
      type: 'string',
      description: '添加时间'
    },
    companyId: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
};

export const response3 = {
  addTime: {
    type: 'string',
    format: 'date-time',
    description: '添加时间'
  },
  myList: {
    isArray: true,
    time1: {
      type: 'string',
      description: '添加时间'
    }
  }
};
