import {AlertController} from "@ionic/angular";

export class Alerts {
  constructor(public alertController:AlertController) {
  }

  public SERVER_ERROR = this.alertController.create({
    cssClass: 'kenzo-alert',
    header: "Server isn't responding",
    message: 'Please try again later.',
    buttons: ['Dismiss']
  });

  public INCORRECT_DETAILS = this.alertController.create({
    cssClass: 'kenzo-alert',
    header: 'Incorrect login',
    message: 'Either your password or email is incorrect.',
    buttons: ['OK']
  });

  public CREATE_ERROR_WORKOUT = this.alertController.create({
    cssClass: 'kenzo-alert',
    header: 'Could not create workout',
    message: 'Please fill all of the fields.',
    buttons: ['Dismiss']
  });

  public WORKOUT_CREATED = this.alertController.create({
    cssClass: 'kenzo-alert',
    header: 'Workout Submitted',
    buttons: ['Go Back']
  });
}
