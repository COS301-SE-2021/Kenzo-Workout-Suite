import { Exercise } from './exercise';

describe('Exercise', () => {
  it('should create an instance', () => {
    expect(new Exercise("","","",0,"",0,"",0)).toBeTruthy();
  });
});
