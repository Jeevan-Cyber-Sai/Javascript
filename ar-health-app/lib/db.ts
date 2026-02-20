// In-memory database (replace with real database in production)
export const users: Array<{
  id: string;
  email: string;
  name: string;
  password: string;
}> = [];

// In-memory user data storage (replace with real database in production)
export const userData: Record<
  string,
  {
    emergencyHistory: Array<{ type: string; timestamp: string }>;
    preferences: { language: string };
  }
> = {};
