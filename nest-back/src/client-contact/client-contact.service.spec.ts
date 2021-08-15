import { Test, TestingModule } from '@nestjs/testing';
import { ClientContactService } from './client-contact.service';

describe('ClientContactService', () => {
  let service: ClientContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientContactService],
    }).compile();

    service = module.get<ClientContactService>(ClientContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
