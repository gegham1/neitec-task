import * as _ from 'lodash';
import { TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { BadRequestErrorCode } from 'src/common/enum/error-code';

/**
 * Util method that converts single or missing param into array.
 * Workaround for nestjs inability to convert single param into array
 */
export const singleItemToArray = () => {
  return ({
    key,
    value,
  }: TransformFnParams): string[] | unknown[] | undefined => {
    if (value === undefined || value === null) {
      return [];
    }

    if (typeof value === 'string') {
      return value.length === 0 && [];
    }

    if (Array.isArray(value)) {
      return value as unknown[];
    }

    throw new BadRequestException(
      BadRequestErrorCode.API_VALIDATION,
      `${key} is not a valid string`,
    );
  };
};
