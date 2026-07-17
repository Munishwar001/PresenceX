import { apiClient } from "./apiClient";

export interface Organisation {
  id: string;
  name: string;
  type: string;
  address: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdBy: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganisationRequest {
  name: string;
  type: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CreateOrganisationResponse {
  organisation: Organisation;
}

export interface ListOrganisationsResponse {
  organisations: Organisation[];
}

class OrganisationsClient {
  create(payload: CreateOrganisationRequest) {
    return apiClient.post<CreateOrganisationResponse>("/organisations", payload);
  }

  list() {
    return apiClient.get<ListOrganisationsResponse>("/organisations");
  }
}

export const organisationsClient = new OrganisationsClient();
