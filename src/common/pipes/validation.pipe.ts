import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

 @Injectable()
 export class SimpleValidationPipe implements PipeTransform {
    transform(value: any) {
        console.log(value)
        if (!value.title || !value.content) {
            throw new BadRequestException('Missing Values')
        }
        return value
    }
 }

 @Injectable()
 export class TrimStringPipe implements PipeTransform {
    transform(value: string) {
        return value?.trim();
    }
  }


 @Injectable()
 export class ValidationPipe implements PipeTransform<any> { 
    async transform(value: any, { metatype }: ArgumentMetadata) {
        // console.log(value)
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
        throw new BadRequestException('Validation failed');
        }
        return value;
    }
    private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
 }