import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { CONSTANT } from './constants/message';

interface Data {
  message: string;
  data: any;
}

interface List {
  message?: string;
  total: number;
  limit: number;
  offset: number;
  data: any[];
}

const successCreate = (data: Data, res: Response) => {
  res.status(HttpStatus.CREATED).json({
    status: 1,
    message: data.message ? data.message : CONSTANT.DEFAULT,
    data: data.data,
  });
};

const successResponse = (data: Data, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: 1,
    message: data.message ? data.message : CONSTANT.DEFAULT,
    data: data.data,
  });
};

const successResponseWithPagination = (data: List, res: Response) => {
  const message = data.data.length
    ? CONSTANT.RECORD_FOUND('Record')
    : CONSTANT.RECORD_NOT_FOUND('Record');
  res.status(HttpStatus.OK).json({
    status: 1,
    message: data.message ? data.message : message,
    total: data.total,
    limit: data.limit,
    offset: data.offset,
    data: data.data,
  });
};

const recordNotFound = (data: Data, res: Response) =>
  res.status(HttpStatus.OK).json({
    status: 0,
    message: data.message ? data.message : CONSTANT.RECORD_NOT_FOUND('Record'),
    data: data.data,
  });

const response = {
  successCreate,
  successResponse,
  successResponseWithPagination,
  recordNotFound,
};

export default response;
