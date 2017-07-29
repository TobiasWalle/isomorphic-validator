export interface Validators {
  inRange: {
    inputType: number
    params: {
      min: number,
      max: number,
    },
    cases: 'underMin' | 'overMax'
  };
  required: {
    inputType: any,
    params: {},
    cases: 'notDefined'
  };
  isEmail: {
    inputType: string
    params: {},
    cases: 'notValid'
  };
  isNumber: {
    inputType: number
    params: {},
    cases: 'notValid'
  };
  hasLength: {
    inputType: string
    params: {
      min: number,
      max: number,
    },
    cases: 'shorter' | 'longer'
  };
}