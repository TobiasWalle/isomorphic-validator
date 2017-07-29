export interface Validators {
  required: {
    inputType: any,
    params: {},
    cases: 'notDefined'
  };
  matchRegExp: {
    inputType: string,
    params: {
      pattern: string
    },
    cases: 'notValid'
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
  //isUrl: {
  //  inputType: string,
  //  params: {},
  //  cases: 'notValid'
  //};
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
  //isInList: {
  //  inputType: any,
  //  params: {
  //    list: any[],
  //    listName: string
  //  },
  //  cases: 'notInList'
  //};
}