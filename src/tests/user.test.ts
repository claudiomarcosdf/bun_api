import { describe, it, expect, mock } from "bun:test";
import { RegisterUserUseCase } from "../application/use-cases/register-user.use-case";
import { UserRole } from "../domain/entities/user.entity";

describe("RegisterUserUseCase", () => {
  it("should register a new user successfully", async () => {
    const mockUserRepository: any = {
      findByEmail: mock(() => Promise.resolve(null)),
      create: mock((data: any) => Promise.resolve({ id: "1", ...data })),
    };

    const mockEmailService: any = {
      sendVerificationEmail: mock(() => Promise.resolve()),
    };

    const useCase = new RegisterUserUseCase(mockUserRepository, mockEmailService);
    
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      document: "12345678900",
    };

    const result = await useCase.execute(userData);

    expect(result.email).toBe(userData.email);
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
  });
});
