export type SupplierType = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SupplierCreationType = Omit<
  SupplierType,
  "id" | "createdAt" | "updatedAt"
>;
