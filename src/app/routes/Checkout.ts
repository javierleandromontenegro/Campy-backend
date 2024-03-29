import { Router, Request, Response } from "express";
// import { registerUser } from '../services/Register.service';
import datosMerca from "../types/datosMerca";
import mercadopago from "mercadopago";
import { postReservaPago } from "../services/Reservas.service";

const CheckoutRouter: Router = Router();
let accessToken: any = process.env.ACCESS_TOKEN;
mercadopago.configure({
  access_token: accessToken,
});

CheckoutRouter.post("/", async (req: Request<datosMerca>, res: Response) => {
  try {
    const formatIngreso = new Date(req.body.ingreso).toLocaleDateString(
      "es-US",
      {
        timeZone: "GMT",
      }
    );

    const formatEgreso = new Date(req.body.egreso).toLocaleDateString("es-US", {
      timeZone: "GMT",
    });

    let preference: any = {
      items: [
        {
          id: req.body.idm,
          title: req.body.title,
          picture_url:
            "https://res.cloudinary.com/pfcampy/image/upload/v1670849448/campy/logo_CAMPY-BLANCO_hn507u.png",
          description: `Alquiler temporario desde ${formatIngreso} hasta ${formatEgreso}.`,
          unit_price: parseInt(req.body.price),
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${
          process.env.HOST_FRONTEND || "http://localhost:3000"
        }/dashboard`,
        failure: `${
          process.env.HOST_FRONTEND || "http://localhost:3000"
        }/dashboard`,
        pending: `${
          process.env.HOST_FRONTEND || "http://localhost:3000"
        }/dashboard`,
      },
      auto_return: "approved",
      notification_url: `${
        process.env.HOST || "https://5fd8-181-23-151-204.sa.ngrok.io"
      }/api/checkout/payment`,
      statement_descriptor: "CAMPY",
    };

    mercadopago.preferences.create(preference).then(function (response) {
      res.redirect(response.body.init_point);
    });
  } catch (e) {
    console.log("error", e);
    res.status(400).json(e);
  }
});

CheckoutRouter.post(
  "/payment",
  async (req: Request<datosMerca>, res: Response) => {
    const { query } = req;
    var merchantOrder;
    var payment;

    const topic = query.topic || query.type;

    switch (topic) {
      case "payment":
        const paymentId: any = query.id || query["data.id"];
        payment = await mercadopago.payment.findById(paymentId);

        merchantOrder = await mercadopago.merchant_orders.findById(
          payment.body.order.id
        );
        break;

      case "merchant_order":
        const orderId: any = query.id;
        merchantOrder = await mercadopago.merchant_orders.findById(orderId);
        break;
    }

    if (false) {
      console.log(payment);
      console.log(merchantOrder);
    }
   

    //  console.log(merchantOrder)
    postReservaPago({
      ID_reserva: merchantOrder?.body?.items[0].id,
      ID_transaccion: merchantOrder?.body.id,
      Estado_transaccion: merchantOrder?.body.order_status,
    });

    // = async ({ ID_reserva,ID_transaccion, Estado_transaccion}: (merchantOrder?.body?.items.id // merchantOrder.body.id  //  merchantOrder.body.order_status
    res.status(200);
  }
);

//Ruta provisoria hasta que realicen la ruta real de post
// CheckoutRouter.post(
//   "/provisoria",
//   async (req: Request<datosMerca>, res: Response) => {
//     try {
//       let body = req.body;
//       let ingreso1 = body.validate.alldate
//         .slice(0, 10)
//         .replace("-", "/")
//         .replace("-", "/");
//       let ingreso2 = body.validate.alldate2
//         .slice(0, 10)
//         .replace("-", "/")
//         .replace("-", "/");
//       let trailer = body.validate.stay > 0 ? 1 : 0;

//       let data = {
//         fecha_desde_reserva: ingreso1,
//         fecha_hasta_reserva: ingreso2,
//         cant_noches: body.validate.total,
//         total: body.price,
//         UsuarioId: body.user?.id,
//         CampingId: body.campId,
//         cantMayores: body.validate.travellers,
//         cantMenores: body.validate.kids,
//         extraRodante: trailer,
//         precioMayores: body.mayores[0].precio,
//         precioMenores: body.menores[0].precio,
//         precioextraRodante: body.validate.stay,
//       };

//       console.log(data);
//       //postReservaCreate(data)

//       res.send("sisi");
//     } catch (e) {
//       console.log("error", e);
//       res.status(400).json(e);
//     }
//   }
// );

export default CheckoutRouter;
