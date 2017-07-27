export interface Validators {
  inRange: {
    inputType: number | undefined | null,
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
    inputType: string | undefined | null,
    params: {},
    cases: 'notValid'
  };
  isNumber: {
    inputType: number | undefined | null,
    params: {},
    cases: 'notValid'
  };
  hasLength: {
    inputType: string | undefined | null,
    params: {
      min: number,
      max: number,
    },
    cases: 'shorter' | 'longer'
  };
}