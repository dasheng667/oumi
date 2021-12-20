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

export const response_file = {
  file: {
    name: 'file',
    in: 'formData',
    description: '上传文件',
    required: true,
    type: 'file'
  },
  billShelfId: {
    name: 'billShelfId',
    in: 'query',
    description: 'billShelfId',
    required: false,
    type: 'string'
  }
};

export const responseInSchema = {
  phoneNum: {
    in: 'body',
    name: 'phoneNum',
    description: '手机号',
    required: true,
    schema: {
      type: 'string'
    }
  },
  sendId: {
    in: 'body',
    name: 'sendId',
    description: '业务点id',
    required: true,
    schema: {
      type: 'string'
    }
  },
  code: {
    in: 'body',
    name: 'code',
    description: '编码',
    required: true,
    schema: {
      type: 'string'
    }
  }
};
