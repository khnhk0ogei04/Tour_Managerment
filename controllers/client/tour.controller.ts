import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /tours/:slugCategory
export const index = async(req: Request, res: Response) => {
    const slugCategory = req.params.slugCategory;

    const tours: any = await sequelize.query(`
        SELECT tours.*, ROUND(price * (1 - discount/100), 0) as price_special FROM tours 
        JOIN tours_categories ON tours.id = tours_categories.tour_id
        JOIN categories ON tours_categories.category_id = categories.id
        WHERE    
            tours.slug = "${slugCategory}"
            and categories.deleted = false
            and categories.status = 'active'
            and tours.deleted = false
            and tours.status = 'active';
        `, {
            type: QueryTypes.SELECT
        });
        tours.forEach((tour: any) => {
            if(tour["images"]){
                const images = JSON.parse(tour["images"]);
                tour["image"] = images[0];
            }
            tour["price_special"] = +tour["price_special"];
        });
        console.log(tours);
        res.render("client/pages/tours/index", {
            pageTitle: "Tours List",
            tours: tours
        });
}

// [GET] /tours/detail/:slugTour
export const detail = async(req: Request, res: Response) => {
    const slugTour = req.params.slugTour;
    const tourDetail: any = await Tour.findOne({
        where: {
            slug: slugTour,
            deleted: false,
            status: "active"
        },
        raw: true
    });
    if (tourDetail["images"]){
        tourDetail["images"] = JSON.parse(tourDetail["images"]);
    }
    tourDetail["price_special"] = +(tourDetail["price"] * (1 - tourDetail["discount"] / 100));
    console.log(tourDetail);
    res.render("client/pages/tours/detail", {
        pageTitle: "Chi Tiết Tour Du Lịch",
        tourDetail: tourDetail
    })
}