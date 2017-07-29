export interface Validators {
  required: {
    inputType: any,
    params: {},
    cases: 'notDefined'
  };
  isNumber: {
    inputType: number
    params: {},
    cases: 'notValid'
  };
  isEmail: {
    inputType: string
    params: {},
    cases: 'notValid'
  };
  inRange: {
    inputType: number
    params: {
      min: number,
      max: number,
    },
    cases: 'underMin' | 'overMax'
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