export interface AzureOrganizationResponse {
  "@odata.context": string;
  value: AzureOrganization[];
}

export interface AzureOrganization {
  // Tenant ID
  id: string;

  // Tenant display name
  displayName: string;

  //Address
  street: string;
  city: string;
  state: string;
  postalCode: string;
  countryLetterCode: string;

  // Tenant type (e.g. "AAD")
  tenantType: string;

  // Tenant veridied domains
  verifiedDomains: VerifiedDomain[];
}

export interface VerifiedDomain {
  capabilities: string;
  // Indicates if this is the default domain for organization
  isDefault: boolean;
  // Indicates if this is the initial domain for organization
  isInitial: boolean;
  // Doman address
  name: string;
  // Domain type (e.g. "Managed")
  type: string;
}
