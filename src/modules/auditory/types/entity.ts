export type AuditorySegment = {
  title: string;
  description: string;
  motivation: string;
  pain: string;
};

export type AuditoryAgeSegment = { ageInterval: string; percentage: number };

export type AuditoryCharacter = {
  title: string;
  description: string;
  usageScenario: string;
};

export type AuditoryEntity = {
  id: string;
  projectId: string;
  menPercentage: number;
  ageSeparation: Array<AuditoryAgeSegment>;
  mainSegments: Array<AuditorySegment>;
  characters: Array<AuditoryCharacter>;
  tam: string;
  sam: string;
  som: string;
  auditoryDemands: string;
  auditoryPains: string;
  differentiation: string;
  auditoryChannels: string;
};
