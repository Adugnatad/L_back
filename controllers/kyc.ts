import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import multer from "multer";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  decoded?: { phone_number: string };
}

// Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

export const submitKYCForm = async (req: CustomRequest, res: Response) => {
  try {
    const {
      fullName,
      gender,
      dateOfBirth,
      maritalStatus,
      email,
      residentialAddress,
      mailingAddress,
      idType,
      idNumber,
      issuingAuthority,
      expiryDate,
      occupation,
      employerName,
      employerAddress,
      income,
      incomeFrequency,
      sourceOfIncome,
      tin,
      sameAsResidential,
    } = req.body;

    console.log(req.files);

    const files = req.files as {
      [fieldname: string]: (Express.Multer.File & { uri: string })[];
    };
    const passportPhotos = files?.passportPhotos?.[0];
    const idScan = files?.idScan?.[0];

    const kyc = await prisma.kYC.findUnique({
      where: { phoneNumber: req.decoded.phone_number },
    });

    if (!kyc) {
      const kycForm = await prisma.kYC.create({
        data: {
          fullName,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          maritalStatus,
          phoneNumber: req.decoded.phone_number,
          email,
          residentialStreet: residentialAddress.street,
          residentialCity: residentialAddress.city,
          residentialSubCity: residentialAddress.subCity,
          residentialWoreda: residentialAddress.woreda,
          mailingStreet: mailingAddress?.street,
          mailingCity: mailingAddress?.city,
          mailingSubCity: mailingAddress?.subCity,
          mailingWoreda: mailingAddress?.woreda,
          idType,
          idNumber,
          issuingAuthority,
          expiryDate: new Date(expiryDate),
          occupation,
          employerName,
          employerAddress,
          income: parseFloat(income),
          incomeFrequency,
          sourceOfIncome,
          tin,
          sameAsResidential: sameAsResidential === "true",
          passportPhotoType: passportPhotos?.mimetype,
          passportPhotoName: passportPhotos?.filename,
          passportPhotoSize: passportPhotos?.size,
          idScanType: idScan?.mimetype,
          idScanName: idScan?.filename,
          idScanSize: idScan?.size,
        },
      });

      res.status(201).json(kycForm);
    } else {
      await prisma.kYC.update({
        where: { phoneNumber: req.decoded.phone_number },
        data: {
          fullName,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          maritalStatus,
          phoneNumber: req.decoded.phone_number,
          email,
          residentialStreet: residentialAddress.street,
          residentialCity: residentialAddress.city,
          residentialSubCity: residentialAddress.subCity,
          residentialWoreda: residentialAddress.woreda,
          mailingStreet: mailingAddress?.street,
          mailingCity: mailingAddress?.city,
          mailingSubCity: mailingAddress?.subCity,
          mailingWoreda: mailingAddress?.woreda,
          idType,
          idNumber,
          issuingAuthority,
          expiryDate: new Date(expiryDate),
          occupation,
          employerName,
          employerAddress,
          income: parseFloat(income),
          incomeFrequency,
          sourceOfIncome,
          tin,
          sameAsResidential: sameAsResidential === "true",
          passportPhotoType: passportPhotos?.mimetype,
          passportPhotoName: passportPhotos?.filename,
          passportPhotoSize: passportPhotos?.size,
          idScanType: idScan?.mimetype,
          idScanName: idScan?.filename,
          idScanSize: idScan?.size,
        },
      });
      res.status(201).json({ message: "KYC form updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "KYC form submission failed" });
  }
};

export const getKYCDetails = async (req: CustomRequest, res: Response) => {
  try {
    const kycForms = await prisma.kYC.findMany({
      where: { phoneNumber: req.decoded.phone_number },
    });
    res.status(200).json(kycForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch KYC details" });
  }
};
