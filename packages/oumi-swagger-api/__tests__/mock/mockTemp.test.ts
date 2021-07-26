export const mockDataList = {
  isArray: true,
  id: {
    type: 'integer',
    format: 'int32',
    example: 1,
    description: '序号'
  },
  orderDate: {
    type: 'string',
    example: '2018-10-01',
    description: '下单时间 yyyy-MM-dd'
  },
  orderId: {
    type: 'string',
    example: '02109210',
    description: '订单编号'
  }
};

export const mockRootBoolean = {
  type: 'boolean'
};

export const mockObject = {
  code: {
    type: 'string'
  },
  currentTimeMillis: {
    type: 'integer',
    format: 'int64'
  },
  data: {
    orderVO: {
      id: {
        type: 'integer',
        format: 'int32',
        example: 1,
        description: '序号'
      },
      orderDate: {
        type: 'string',
        example: '2018-10-01',
        description: '下单时间 yyyy-MM-dd'
      },
      thirdOrderId: {
        type: 'string',
        example: '18062615131234',
        description: '订单id'
      }
    },
    restaurantVO: {
      isArray: true,
      restaurantGoodsVOS: {
        isArray: true,
        foodProductName: {
          type: 'string',
          example: '福建古田茶树菇干货 250g',
          description: '餐品名称'
        },
        quantity: {
          type: 'integer',
          format: 'int32',
          example: 1,
          description: '数量'
        }
      }
    },
    timingDistributeVO: {
      linkInfo: {
        type: 'string',
        example: '张三  18566749654',
        description: '联系人'
      }
    }
  },
  msg: {
    type: 'string'
  },
  success: {
    type: 'boolean'
  }
};
