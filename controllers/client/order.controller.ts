import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate.helper";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";

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
  console.log(data.cart);
  for (const item of data.cart){
    const dataOrderItem: any = {
        orderId: orderId,
        tourId: item.tourId,
        quantity: item.quantity
    };
    const tourInfo: any = await Tour.findOne({
        where: {
            id: item.tourId,
            deleted: false,
            status: "active"
        },
        raw: true
      });
      dataOrderItem["price"] = tourInfo["price"];
      dataOrderItem["discount"] = tourInfo["discount"];
      dataOrderItem["timeStart"]= tourInfo["timeStart"];
      console.log(dataOrderItem);
      await OrderItem.create(dataOrderItem);
  }


  res.json({
    code: 200,
    message: "Đặt hàng thành công!",
    orderCode: code
  });
};

// [GET] /order/success
export const success = async(req: Request, res: Response) => {
    const orderCode = req.query.orderCode;
    const order: any = await Order.findOne({
        where: {
            code: orderCode,
            deleted: false
        },
        raw: true
    });
    const ordersItem: any = await OrderItem.findAll({
        where: {
            orderId: order["id"]
        },
        raw: true
    })
    let totalPrice = 0;
    for (const item of ordersItem){
        item["price_special"] = +Math.round(item["price"] * (1 - item["discount"]/100));
        item["total"] = item["price_special"] * item["quantity"];
        totalPrice += item["total"];
        const tourInfo: any = await Tour.findOne({
            where: {
                id: item["tourId"],
                deleted: false,
                status: "active"
            },
            raw: true
        });
        if (tourInfo["images"]){
            tourInfo["images"] = JSON.parse(tourInfo["images"]);
            item["image"] = tourInfo["images"][0];
        }
        item["title"] = tourInfo["title"];
        item["slug"] = tourInfo["slug"];
    }
    res.render("client/pages/order/success", {
        pageTitle: "Đặt hàng thành công",
        order: order,
        ordersItem: ordersItem,
        totalPrice: totalPrice
    });
}