import {AlertController} from "@ionic/angular";

export class Alerts {
  constructor(public alertController:AlertController) {
  }

  async SERVER_ERROR(): Promise<HTMLIonAlertElement> {
    return await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: "Server isn't responding",
      message: 'Please try again later.',
      buttons: ['Dismiss']
    });
  }

  async INCORRECT_DETAILS(): Promise<HTMLIonAlertElement> {
    return await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Incorrect login',
      message: 'Either your password or email is incorrect.',
      buttons: ['OK']
    });
  }

  async CREATE_ERROR_WORKOUT(): Promise<HTMLIonAlertElement> {
    return await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Could not create workout',
      message: 'Please fill all of the fields.',
      buttons: ['Dismiss']
    });
  }

  async WORKOUT_CREATED(): Promise<HTMLIonAlertElement> {
    return await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Workout Submitted',
      buttons: ['Go Back']
    });
  }
}
