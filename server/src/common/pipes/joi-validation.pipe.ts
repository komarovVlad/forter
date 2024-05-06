import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Schema, ValidationOptions } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  public static defaultOption: ValidationOptions = {
    allowUnknown: true,
    abortEarly: false,
    stripUnknown: true,
  };

  constructor(
    private schema: Schema,
    private validationOptions?: ValidationOptions,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.validate(value, {
      ...JoiValidationPipe.defaultOption,
      ...this.validationOptions,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.value;
  }
}
