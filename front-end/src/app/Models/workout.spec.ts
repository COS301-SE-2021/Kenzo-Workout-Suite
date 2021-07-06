import { Workout } from './workout';

describe('Workout', () => {
  it('should create an instance', () => {
    expect(new Workout("","",[])).toBeTruthy();
  });
});
