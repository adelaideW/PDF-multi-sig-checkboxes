
import React from 'react';

export interface DraggableField {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
}

export interface PlacedField {
  id: string;
  type: string;
  label: string;
  variableName?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  recipientId: string;
  required: boolean;
  groupId?: string;
}

export interface Signer {
  id: string;
  name: string;
  color: string;
  initials: string;
}
