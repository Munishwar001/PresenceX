import { apiClient } from "./apiClient";

export type MemberRole = "admin" | "teacher" | "student";

export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roles: { role: { name: string } }[];
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  role: MemberRole;
  password?: string;
}

export interface CreateMemberResponse {
  user: Member;
  temporaryPassword?: string;
}

class UsersClient {
  createMember(payload: CreateMemberRequest) {
    return apiClient.post<CreateMemberResponse>("/users", payload);
  }
}

export const usersClient = new UsersClient();
