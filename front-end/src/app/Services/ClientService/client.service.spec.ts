import { TestBed } from "@angular/core/testing";

import { ClientService } from "./client.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

describe("ClientService", () => {
    let service: ClientService;
    let httpMock: HttpTestingController;

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

    /**
     * Emailing the PDF of the chosen workout to all contacts
     */
    it("should email the PDF for the chosen workout to all the clients of the planner and return a 200 status", async () => {
        const workoutID = "5f55cd19-29c8-4a58-850e-ce850cb9f949";
        const respStatus = service.attemptEmailAllClientsPDF(workoutID);
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsPDFToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsPDFToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsPDFToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsPDFToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsVideoToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsVideoToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsVideoToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsVideoToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsMultimediaToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsMultimediaToAllContacts"); expect(req.request.method).toEqual("POST");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsMultimediaToAllContacts");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/sendEmailsMultimediaToAllContacts");
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

});
