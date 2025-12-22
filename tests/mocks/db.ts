import {PrismaClient} from '@prisma/client';
import {mockDeep, mockReset, DeepMockProxy} from 'vitest-mock-extended';

export const mockDb: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

export function resetMockDb() {
  mockReset(mockDb);
}
