import { TestBed } from "@angular/core/testing";

import { ClientService } from "./client.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Client} from "../../Models/client";
import {environment} from "../../../environments/environment";

describe("ClientService", () => {
    let service: ClientService;
    let httpMock: HttpTestingController;
    const apiURL = environment.apiURL;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]
        });
        service = TestBed.inject(ClientService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(()=>{
        httpMock.verify();
    });


    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    //Add Client
    it("should, given correct/valid client details, create a contact", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "");
        const respStatus = service.addClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/createClientContact");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contactEmail: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should, given invalid client details, not create a contact", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "");
        const respStatus = service.addClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/createClientContact");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contactEmail: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should not create a contact because server is down", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "");
        const respStatus = service.addClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/createClientContact");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contactEmail: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });

    //Remove Client
    it("should, given correct/valid client, remove a contact", async () => {
        const respStatus = service.removeClient("VALID_ID");
        const req = httpMock.expectOne(apiURL+"/client-contact/deleteClientContact");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            contactID: "VALID_ID",
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should, given invalid client, not remove a contact", async () => {
        const respStatus = service.removeClient("INVALID_ID");
        const req = httpMock.expectOne(apiURL+"/client-contact/deleteClientContact");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            contactID: "INVALID_ID",
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should not remove a contact because server is down", async () => {
        const respStatus = service.removeClient("INVALID_ID");
        const req = httpMock.expectOne(apiURL+"/client-contact/deleteClientContact");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            contactID: "INVALID_ID",
        });

        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });

    //Update Client
    it("should, given correct/valid client details, update a contact", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "100");
        const respStatus = service.updateClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/updateClientContact");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            contactID: client.contactID,
            email: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should, given invalid client details, not update a contact", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "100");
        const respStatus = service.updateClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/updateClientContact");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            contactID: client.contactID,
            email: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should not update a contact because server is down", async () => {
        const client = new Client("Luca", "Azmanov", "luca@me.com", "100");
        const respStatus = service.updateClient(client);
        const req = httpMock.expectOne(apiURL+"/client-contact/updateClientContact");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            contactID: client.contactID,
            email: client.email,
            name: client.firstName,
            surname: client.lastName
        });

        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the PDF of the chosen workout to all contacts
     */
    it("should email the PDF for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsPDF(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the PDF for the chosen workout to all the clients of the planner because the workout with given id does not exist and return a 400 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsPDF(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the PDF for the chosen workout to all the clients of the planner because no clients exist and return a 404 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsPDF(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the PDF for the chosen workout to all the clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsPDF(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the video of the chosen workout to all contacts
     */
    it("should email the video for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsVideo(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the video for the chosen workout to all the clients of the planner because the workout with given id does not exist and return a 400 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsVideo(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the video for the chosen workout to all the clients of the planner because no clients exist and return a 404 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsVideo(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the video for the chosen workout to all the clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsVideo(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the PDF and video of the chosen workout to all contacts
     */
    it("should email the PDF and video for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsMedia(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the PDF and video for the chosen workout to all the clients of the planner because the workout with given id does not exist and return a 400 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsMedia(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToAllContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the PDF and video for the chosen workout to all the clients of the planner because no clients exist and return a 404 status", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailAllClientsMedia(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the PDF and video for the chosen workout to all the clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsMedia(workoutID);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToAllContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the PDF of the chosen workout to select contacts
     */
    it("should email the PDF for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailClientsPDF(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts: [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the PDF for the chosen workout to the select clients because the workout with given id does not exist and return a 400 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsPDF(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the PDF for the chosen workout to all the clients of the planner because no clients exist and return a 404 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsPDF(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the PDF for the chosen workout to all the clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsPDF(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsPDFToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the video of the chosen workout to select contacts
     */
    it("should email the video for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailClientsVideo(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts: [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the video for the chosen workout to the select clients because the workout with given id does not exist and return a 400 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsVideo(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToContacts");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the video for the chosen workout to all the clients of the planner because no clients exist and return a 404 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsVideo(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToContacts");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the video for the chosen workout to all the clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsVideo(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsVideoToContacts");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Emailing the PDF and video of the chosen workout to select contacts
     */
    it("should email the PDF and video for the chosen workout to select clients of the planner and return a 200 status", async () => {
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailClientsMedia(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToContacts");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts: [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });

    it("should fail to email the PDF and video for the chosen workout to the select clients because the workout with given id does not exist and return a 400 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsMedia(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(400);
    });

    it("should fail to email the PDF and video for the chosen workout to select clients of the planner because no clients exist and return a 404 status", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsMedia(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 404
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });

    it("should fail to email the PDF and video for the chosen workout to select clients of the planner because server did not respond and returns a status of 500", async ()=>{
        const contacts= [{
            contactId: "1234",
            contactEmail: "jackiewang1999@outlook.com",
            name: "Jackie",
            surname: "Wang",
            plannerID: "Jack123abc"
        }];
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f94";
        const respStatus = service.attemptEmailClientsMedia(workoutID, contacts);
        const req = httpMock.expectOne(apiURL+"/client-contact/sendEmailsMultimediaToContacts"); expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            contacts : [{
                contactId: "1234",
                contactEmail: "jackiewang1999@outlook.com",
                name: "Jackie",
                surname: "Wang",
                plannerID: "Jack123abc"
            }],
            workoutID : workoutID
        });
        const resp = new HttpErrorResponse({
            status: 500
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

});
