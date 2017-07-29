import { defaultValueValidatorConfig } from './default-value-validator-config';
import { resolveErrorMessage } from '../create-value-validator';
import { ErrorMessage, ValidationTarget } from '../model/error-mapping.model';
import { Validators } from './validators';

describe('defaultValueValidatorConfig', () => {
  const errorMapping = defaultValueValidatorConfig.errorMapping;

  it('should have valid inRange error messages', async () => {
    const inRange = errorMapping.inRange;
    expect(await getMessage(inRange.underMin, {params: {min: 10}}))
      .toBe('Enter a number which has a minimum value of 10');
    expect(await getMessage(inRange.overMax, {params: {max: 10}}))
      .toBe('Enter a number which has a maximum value of 10');
  });

  it('should have valid required error messages', async () => {
    const required = errorMapping.required;
    expect(await getMessage(required.notDefined, {target: {name: 'name'}}))
      .toBe('Name is required');
  });

  it('should have valid isEmail error messages', async () => {
    const isEmail = errorMapping.isEmail;
    expect(await getMessage(isEmail.notValid)).toBe('Enter a valid email');
  });

  it('should have valid isNumber error messages', async () => {
    const isNumber = errorMapping.isNumber;
    expect(await getMessage(isNumber.notValid)).toBe('Enter a valid number');
  });

  it('should have valid hasLength error messages', async () => {
    const hasLength = errorMapping.hasLength;
    expect(await getMessage(hasLength.shorter, {params: {min: 1, max: 3}}))
      .toBe('Use at least 1 character');
    expect(await getMessage(hasLength.longer, {params: {min: 1, max: 3}}))
      .toBe('Use a maximum of 3 characters');
  });

  it('should have valid matchRegExp error messages', async () => {
    const matchRegExp = errorMapping.matchRegExp;
    expect(await getMessage(matchRegExp.notValid, {target: {name: 'name'}}))
      .toBe('Enter a valid name');
  });

  it('should have valid isUrl error messages', async () => {
    const isUrl = errorMapping.isUrl;
    expect(await getMessage(isUrl.notValid, {}))
      .toBe('Enter a valid URL');
  });

  it('should have valid isInList error messages', async () => {
    const isInList = errorMapping.isInList;
    expect(await getMessage(isInList.notInList, {target: {name: 'name'}}))
      .toBe('Enter a valid name');
  });
});

// Helper method for testing the messages
async function getMessage<K extends keyof Validators>
(
  message: ErrorMessage<K, {}>,
  {params = {}, target = {}}: {
    params?: Partial<Validators[K]['params']>,
    target?: Partial<ValidationTarget<K>>,
  } = {}
): Promise<string> {
  return await resolveErrorMessage({
    errorMessage: message,
    params: params as any,
    target: target as any,
    context: {}
  });
}
