const { signUpClient } = require('../../../api/controllers/workoutController');

describe('Matching a given title to workouts - success', () => {
    beforeEach(async () => {
        await request(app).post('/workout/createWorkout')
            .send(
                {
                    workoutTitle: 'Cardio',
                    workoutDescription: 'Increasing heart fitness',
                    difficulty: 'EASY',
                }
            )
    });
    test('Should recieve valid information about workout with corresponding title', async () => {
        getWorkout()
    });
});

describe('Matching a given title to workouts - failure', () => {
    test('Should not recieve valid information about workout with corresponding title as workout does not exist', async () => {
        await request(app).get('/workout/getworkoutbytitle/ ')
            .expect(404)
    });
});