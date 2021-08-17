import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";

import { ClientListPage } from "./client-list.page";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ClientService} from "../Services/ClientService/client.service";
import {Client} from "../Models/client";
import {FormsModule} from "@angular/forms";

describe("ClientListPage", () => {
    let component: ClientListPage;
    let fixture: ComponentFixture<ClientListPage>;
    let routeMock: Router;
    let alertController: AlertController;
    let clientService: ClientService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ClientListPage ],
            imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule, HttpClientTestingModule]
        }).compileComponents();
        routeMock = TestBed.inject(Router);
        alertController = TestBed.inject(AlertController);
        clientService = TestBed.inject(ClientService);
        fixture = TestBed.createComponent(ClientListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    //Get Clients
    it("should retrieve a list of clients from the server, that is not empty, and populate the contacts arrays", async () => {
        spyOn(clientService, "getClientList").and.resolveTo({data: [
            {name: "Luca", surname: "Azmanov", contactEmail: "luca@me.com", contactId: "1"},
            {name: "Zelu", surname: "Tesema", contactEmail: "zelu@yahoo.co.za", contactId: "2"},
            {name: "Jackie", surname: "Wang", contactEmail: "jackie@gmail.com", contactId: "3"}]});
        await component.getClients();
        const client1 = new Client("Luca", "Azmanov", "luca@me.com", "1");
        const client2 = new Client("Zelu", "Tesema", "zelu@yahoo.co.za", "2");
        const client3 = new Client("Jackie", "Wang", "jackie@gmail.com", "3");
        expect(component.contacts).toEqual([client1, client2, client3]);
        expect(component.contactsOriginal).toEqual([client1, client2, client3]);
    });
    it("should retrieve a list of clients from the server, that is empty, and populate the contacts arrays", async () => {
        spyOn(clientService, "getClientList").and.resolveTo({data: []});
        await component.getClients();
        expect(component.contacts).toEqual([]);
        expect(component.contactsOriginal).toEqual([]);
    });

    //Update Contacts
    it("should, given a valid object, update the contact", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("1");
        spyOn(clientService, "updateClient").and.resolveTo(200);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.update().then(data=>{
            expect(data).toEqual(200);
        });
    });
    it("should, given a invalid object, not update the contact and throw an error", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("");
        spyOn(clientService, "updateClient").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.update().catch(error=>{
            expect(error).toEqual(new Error("Data is invalid."));
        });
    });
    it("should not update the contact because server is not working", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("");
        spyOn(clientService, "updateClient").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.update().catch(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });

    //Submit Contacts
    it("should, given a valid object, create the contact", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("1");
        spyOn(clientService, "addClient").and.resolveTo(200);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.submitContact().then(data=>{
            expect(data).toEqual(200);
        });
    });
    it("should, given a invalid object, not create the contact and throw an error", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("");
        spyOn(clientService, "addClient").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.submitContact().catch(error=>{
            expect(error).toEqual(new Error("Data is invalid."));
        });
    });
    it("should not create the contact because server is not working", async () => {
        spyOnProperty(component, "name").and.returnValue("Luca");
        spyOnProperty(component, "surname").and.returnValue("Azmanov");
        spyOnProperty(component, "email").and.returnValue("luca@me.com");
        spyOnProperty(component, "contactID").and.returnValue("");
        spyOn(clientService, "addClient").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.submitContact().catch(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });

    //Remove Contacts
    it("should, given a valid object, remove the contact", async () => {
        spyOn(clientService, "removeClient").and.resolveTo(200);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.remove().catch(data=>{
            expect(data).toEqual(200);
        });
    });
    it("should, given a invalid object, not remove the contact and throw an error", async () => {
        spyOn(clientService, "removeClient").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.remove().catch(error=>{
            expect(error).toEqual(new Error("Data is invalid."));
        });
    });
    it("should not remove the contact because server is not working", async () => {
        spyOn(clientService, "removeClient").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.remove().catch(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });
});
