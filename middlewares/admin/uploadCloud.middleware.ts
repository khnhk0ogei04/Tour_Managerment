// import { Request, Response, NextFunction } from "express";
// import { uploadToCloudinary } from "../../helpers/uploadToCloudinary.helper";
// import { Multer } from "multer";  // Bạn cần import Multer nếu sử dụng thư viện multer

// export const uploadFields = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const files = req["files"] as { [fieldname: string]: Express.Multer.File[] }; // Ép kiểu
//   for (const key in files) {
//     const links: any[] = [];
//     for (const item of files[key]) {
//       try {
//         const link: any = await uploadToCloudinary(item.buffer);
//         links.push(link);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     req.body[key] = links;
//   }
//   next();
// };
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../../helpers/uploadToCloudinary.helper";

export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if(req["file"]) {
    const link = await uploadToCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = link;
    next();
  } else {
    next();
  }
}

export const uploadFields = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  for (const key in req["files"]) {
    const links: any = [];
    for (const item of req["files"][key]) {
      try {
        const link: any = await uploadToCloudinary(item.buffer);
        links.push(link);
      } catch (error) {
        console.log(error);
      }
    }
    req.body[key] = links;
  }
  next();
}