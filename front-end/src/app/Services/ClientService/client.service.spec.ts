import { TestBed } from "@angular/core/testing";

import { ClientService } from "./client.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("ClientService", () => {
    let service: ClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]});
        service = TestBed.inject(ClientService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
