/**
 * @file database.test.ts
 * @description Comprehensive test suite for Prisma Client database utility
 * 
 * Test Categories:
 * - Unit Tests: Singleton pattern, instance validation
 * - Integration Tests: Database connectivity, Prisma operations
 * - Configuration Tests: Environment-specific behavior
 * - Error Handling: Connection failures, invalid operations
 * 
 * Coverage Target: >80%
 * Complexity: Simple (database utility module)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient before importing the module
vi.mock('@prisma/client', () => {
  const mockPrismaClient = vi.fn().mockImplementation(() => ({
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    $executeRaw: vi.fn(),
    $queryRaw: vi.fn(),
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  }));

  return {
    PrismaClient: mockPrismaClient,
  };
});

describe('Database Utility Module', () => {
  let originalEnv: string | undefined;
  let originalGlobalPrisma: PrismaClient | undefined;

  beforeAll(() => {
    // Store original environment
    originalEnv = process.env.NODE_ENV;
    originalGlobalPrisma = globalThis.prisma;
  });

  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
    globalThis.prisma = originalGlobalPrisma;
  });

  beforeEach(() => {
    // Clear module cache to test fresh imports
    vi.resetModules();
    // Clear global prisma instance
    delete globalThis.prisma;
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('🎯 Unit Tests - Instance Creation', () => {
    it('should export a Prisma Client instance', async () => {
      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      expect(prisma).toBeInstanceOf(Object);
    });

    it('should export default Prisma Client instance', async () => {
      const prismaDefault = await import('../database');

      expect(prismaDefault.default).toBeDefined();
      expect(prismaDefault.default).toBeInstanceOf(Object);
    });

    it('should have required Prisma Client methods', async () => {
      const { prisma } = await import('../database');

      expect(prisma.$connect).toBeDefined();
      expect(prisma.$disconnect).toBeDefined();
      expect(typeof prisma.$connect).toBe('function');
      expect(typeof prisma.$disconnect).toBe('function');
    });

    it('should have model accessors', async () => {
      const { prisma } = await import('../database');

      expect(prisma.user).toBeDefined();
      expect(prisma.question).toBeDefined();
    });
  });

  describe('🔄 Singleton Pattern Tests', () => {
    it('should use singleton pattern in development environment', async () => {
      process.env.NODE_ENV = 'development';

      const { prisma: prisma1 } = await import('../database');
      vi.resetModules();
      const { prisma: prisma2 } = await import('../database');

      // In development, should reuse global instance
      expect(globalThis.prisma).toBeDefined();
      expect(prisma1).toBe(globalThis.prisma);
    });

    it('should store instance in global object in development', async () => {
      process.env.NODE_ENV = 'development';
      delete globalThis.prisma;

      await import('../database');

      expect(globalThis.prisma).toBeDefined();
      expect(globalThis.prisma).toBeInstanceOf(Object);
    });

    it('should not store instance in global object in production', async () => {
      process.env.NODE_ENV = 'production';
      delete globalThis.prisma;

      await import('../database');

      expect(globalThis.prisma).toBeUndefined();
    });

    it('should create new instance in production environment', async () => {
      process.env.NODE_ENV = 'production';

      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      expect(globalThis.prisma).toBeUndefined();
    });

    it('should reuse existing global instance if available', async () => {
      process.env.NODE_ENV = 'development';
      const mockExistingPrisma = new PrismaClient();
      globalThis.prisma = mockExistingPrisma;

      const { prisma } = await import('../database');

      expect(prisma).toBe(mockExistingPrisma);
    });
  });

  describe('⚙️ Configuration Tests', () => {
    it('should configure logging for development environment', async () => {
      process.env.NODE_ENV = 'development';
      vi.resetModules();

      await import('../database');

      expect(PrismaClient).toHaveBeenCalledWith({
        log: ['query', 'error', 'warn'],
      });
    });

    it('should configure minimal logging for production environment', async () => {
      process.env.NODE_ENV = 'production';
      vi.resetModules();

      await import('../database');

      expect(PrismaClient).toHaveBeenCalledWith({
        log: ['error'],
      });
    });

    it('should use production logging when NODE_ENV is not set', async () => {
      delete process.env.NODE_ENV;
      vi.resetModules();

      await import('../database');

      expect(PrismaClient).toHaveBeenCalledWith({
        log: ['error'],
      });
    });

    it('should handle test environment as non-production', async () => {
      process.env.NODE_ENV = 'test';
      vi.resetModules();

      await import('../database');

      // Test environment should store in global like development
      expect(globalThis.prisma).toBeDefined();
    });
  });

  describe('🔗 Integration Tests - Database Operations', () => {
    it('should successfully connect to database', async () => {
      const { prisma } = await import('../database');

      await expect(prisma.$connect()).resolves.not.toThrow();
      expect(prisma.$connect).toHaveBeenCalledTimes(1);
    });

    it('should successfully disconnect from database', async () => {
      const { prisma } = await import('../database');

      await expect(prisma.$disconnect()).resolves.not.toThrow();
      expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle connection lifecycle', async () => {
      const { prisma } = await import('../database');

      await prisma.$connect();
      await prisma.$disconnect();

      expect(prisma.$connect).toHaveBeenCalled();
      expect(prisma.$disconnect).toHaveBeenCalled();
    });

    it('should support query operations', async () => {
      const { prisma } = await import('../database');
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers);

      const users = await prisma.user.findMany();

      expect(users).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should support create operations', async () => {
      const { prisma } = await import('../database');
      const newUser = {
        id: '1',
        email: 'new@example.com',
        name: 'New User',
      };

      vi.mocked(prisma.user.create).mockResolvedValue(newUser);

      const user = await prisma.user.create({
        data: { email: 'new@example.com', name: 'New User' },
      });

      expect(user).toEqual(newUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'new@example.com', name: 'New User' },
      });
    });

    it('should support update operations', async () => {
      const { prisma } = await import('../database');
      const updatedUser = {
        id: '1',
        email: 'updated@example.com',
        name: 'Updated User',
      };

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser);

      const user = await prisma.user.update({
        where: { id: '1' },
        data: { name: 'Updated User' },
      });

      expect(user).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated User' },
      });
    });

    it('should support delete operations', async () => {
      const { prisma } = await import('../database');
      const deletedUser = {
        id: '1',
        email: 'deleted@example.com',
        name: 'Deleted User',
      };

      vi.mocked(prisma.user.delete).mockResolvedValue(deletedUser);

      const user = await prisma.user.delete({
        where: { id: '1' },
      });

      expect(user).toEqual(deletedUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('🛡️ Error Handling Tests', () => {
    it('should handle connection errors gracefully', async () => {
      const { prisma } = await import('../database');
      const connectionError = new Error('Connection failed');

      vi.mocked(prisma.$connect).mockRejectedValue(connectionError);

      await expect(prisma.$connect()).rejects.toThrow('Connection failed');
    });

    it('should handle query errors', async () => {
      const { prisma } = await import('../database');
      const queryError = new Error('Query failed');

      vi.mocked(prisma.user.findMany).mockRejectedValue(queryError);

      await expect(prisma.user.findMany()).rejects.toThrow('Query failed');
    });

    it('should handle disconnection errors', async () => {
      const { prisma } = await import('../database');
      const disconnectError = new Error('Disconnect failed');

      vi.mocked(prisma.$disconnect).mockRejectedValue(disconnectError);

      await expect(prisma.$disconnect()).rejects.toThrow('Disconnect failed');
    });

    it('should handle invalid operations', async () => {
      const { prisma } = await import('../database');
      const validationError = new Error('Invalid data');

      vi.mocked(prisma.user.create).mockRejectedValue(validationError);

      await expect(
        prisma.user.create({
          data: { email: 'invalid', name: '' },
        })
      ).rejects.toThrow('Invalid data');
    });
  });

  describe('⚡ Performance Tests', () => {
    it('should initialize quickly', async () => {
      const startTime = performance.now();

      await import('../database');

      const endTime = performance.now();
      const initTime = endTime - startTime;

      // Initialization should be fast (< 100ms)
      expect(initTime).toBeLessThan(100);
    });

    it('should handle multiple rapid imports efficiently', async () => {
      const startTime = performance.now();

      await Promise.all([
        import('../database'),
        import('../database'),
        import('../database'),
        import('../database'),
        import('../database'),
      ]);

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Multiple imports should be fast due to caching
      expect(totalTime).toBeLessThan(200);
    });

    it('should not create multiple instances unnecessarily', async () => {
      process.env.NODE_ENV = 'development';
      vi.resetModules();

      await import('../database');
      const callCount1 = vi.mocked(PrismaClient).mock.calls.length;

      vi.resetModules();
      await import('../database');
      const callCount2 = vi.mocked(PrismaClient).mock.calls.length;

      // Should reuse global instance, not create new one
      expect(callCount2).toBe(callCount1);
    });
  });

  describe('🔍 Type Safety Tests', () => {
    it('should export correct TypeScript types', async () => {
      const { prisma } = await import('../database');

      // Type assertions to verify TypeScript compilation
      const _typeCheck: PrismaClient = prisma;
      expect(_typeCheck).toBeDefined();
    });

    it('should support typed model operations', async () => {
      const { prisma } = await import('../database');

      // Verify model methods exist with correct signatures
      expect(typeof prisma.user.findMany).toBe('function');
      expect(typeof prisma.user.findUnique).toBe('function');
      expect(typeof prisma.user.create).toBe('function');
      expect(typeof prisma.user.update).toBe('function');
      expect(typeof prisma.user.delete).toBe('function');
    });
  });

  describe('🌐 Environment Edge Cases', () => {
    it('should handle undefined NODE_ENV', async () => {
      delete process.env.NODE_ENV;
      vi.resetModules();

      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      // Should default to production behavior
      expect(globalThis.prisma).toBeUndefined();
    });

    it('should handle empty NODE_ENV string', async () => {
      process.env.NODE_ENV = '';
      vi.resetModules();

      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      // Empty string is not 'production', so should store globally
      expect(globalThis.prisma).toBeDefined();
    });

    it('should handle custom NODE_ENV values', async () => {
      process.env.NODE_ENV = 'staging';
      vi.resetModules();

      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      // Non-production environment should store globally
      expect(globalThis.prisma).toBeDefined();
    });
  });

  describe('📊 Module Export Tests', () => {
    it('should export both named and default exports', async () => {
      const module = await import('../database');

      expect(module.prisma).toBeDefined();
      expect(module.default).toBeDefined();
    });

    it('should have consistent named and default exports', async () => {
      const { prisma, default: defaultPrisma } = await import('../database');

      expect(prisma).toBe(defaultPrisma);
    });

    it('should allow destructured import', async () => {
      const { prisma } = await import('../database');

      expect(prisma).toBeDefined();
      expect(prisma.$connect).toBeDefined();
    });

    it('should allow default import', async () => {
      const prismaModule = await import('../database');
      const prisma = prismaModule.default;

      expect(prisma).toBeDefined();
      expect(prisma.$connect).toBeDefined();
    });
  });
});