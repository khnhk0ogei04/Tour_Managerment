import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate.helper";

// [POST] /order/
export const order = async (req: Request, res: Response) => {
  const data = req.body;
  const dataOrder = {
    code: "",
    fullName: data.info.fullName,
    phone: data.info.phone,
    note: data.info.note,
    status: "initial",
  };

  const order = await Order.create(dataOrder);
  const orderId = order.dataValues.id;

  const code = generateOrderCode(orderId);

  await Order.update({
    code: code
  }, {
    where: {
      id: orderId
    }
  });

  res.json({
    code: 200,
    message: "Đặt hàng thành công!"
  });
};