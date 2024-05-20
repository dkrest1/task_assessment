import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isActualString' })
export class IsActualString implements ValidatorConstraintInterface {
  validate(value: any) {
    console.log('worked');
    return typeof value === 'string';
  }

  defaultMessage() {
    return '($property) must be a valid string';
  }
}
