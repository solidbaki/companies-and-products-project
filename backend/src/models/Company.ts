import mongoose from "mongoose";

export interface ICompany {
  name: string;
  legalNumber: string;
  incorporationCountry: string;
  website?: string;
}

const CompanySchema = new mongoose.Schema<ICompany>(
  {
    name: { type: String, required: true },
    legalNumber: { type: String, required: true, unique: true },
    incorporationCountry: { type: String, required: true },
    website: { type: String },
  },
  { timestamps: true }
);

const Company = mongoose.model<ICompany>("Company", CompanySchema);
export default Company;
