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
}