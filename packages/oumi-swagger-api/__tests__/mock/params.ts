export const requestParams1 = [
  {
    name: 'FFS-Head',
    in: 'header',
    description: '用户登登ttoo',
    required: false,
    type: 'string'
  },
  {
    name: 'FFS-UserId',
    in: 'header',
    description: '用户登登UserId',
    required: false,
    type: 'string'
  },
  {
    name: 'sourceBillId',
    in: 'query',
    description: '来源单据号',
    required: false,
    type: 'integer',
    format: 'int64'
  },
  {
    name: 'productCode2',
    in: 'query',
    description: '商品编码',
    required: false,
    type: 'string'
  },
  {
    name: 'responsibleId',
    in: 'query',
    description: '责任方id',
    required: false,
    type: 'string'
  },
  {
    name: 'addTimeStart',
    in: 'query',
    description: '创建开始日期',
    required: false,
    type: 'string',
    format: 'date-time'
  }
];

export const requestParams2 = [
  {
    name: 'FFS-Head',
    in: 'header',
    description: '用户登登ttoo',
    required: false,
    type: 'string'
  },
  {
    name: 'FFS-UserId',
    in: 'header',
    description: '用户登登UserId',
    required: false,
    type: 'string'
  },
  {
    in: 'body',
    name: 'queryVO',
    description: 'queryVO',
    required: true,
    schema: { $ref: '#/definitions/AbnormalSignRecordVO' }
  }
];

export const requestParams3 = [
  {
    name: 'groupId',
    in: 'query',
    description: 'groupId',
    required: true,
    type: 'integer',
    format: 'int64'
  }
];
