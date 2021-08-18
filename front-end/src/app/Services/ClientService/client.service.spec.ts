import { TestBed } from "@angular/core/testing";

import { ClientService } from "./client.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Client} from "../../Models/client";

describe("ClientService", () => {
    let service: ClientService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]});
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/createClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/createClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/createClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/deleteClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/deleteClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/deleteClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/updateClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/updateClientContact");
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
        const req = httpMock.expectOne("http://localhost:3000/client-contact/updateClientContact");
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
});
