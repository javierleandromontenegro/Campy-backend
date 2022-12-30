import { Router, Request, Response } from 'express';
// import { registerUser } from '../services/Register.service';
import datosMerca from '../types/datosMerca';
import mercadopago from 'mercadopago';

const CheckoutRouter: Router = Router();
let accessToken : any = process.env.ACCESS_TOKEN; 
mercadopago.configure({
   access_token: accessToken
  });

CheckoutRouter.post('/', async (req: Request<datosMerca>, res: Response) => {
  try {
    const { titleM , priceM} = req.body 
    console.log(titleM , priceM)
    let preference : any = {
        items : [
            {
              id : "idrutabackgaby",
                title : req.body.title,
                picture_url : "https://mapio.net/images-p/8402429.jpg",
            description : "NADAAAAAAAAAAA",
                unit_price : parseInt(req.body.price),
                quantity : 1,
            }
        ],
        "back_urls": {
          success: "http://localhost:3000/booking/camping/1",
          failure: "http://localhost:3000/booking/camping/1",
          pending: "http://localhost:3000/booking/camping/1"
      },
      auto_return: "approved",
      notification_url : "https://2a2b-181-23-131-222.sa.ngrok.io/api/checkout/payment"
    }; 

    mercadopago.preferences.create(preference)
    .then(function(response){
console.log(response)
 
res.redirect(response.body.init_point)
    })

    let algo : any = req 

    algo = undefined 
    console.log(algo)
 
    
   
  } catch(e) {
    console.log("error", e)
    res.status(400).json(e)
  }
});



CheckoutRouter.post('/payment', async (req: Request<datosMerca>, res: Response) => {
  const { query  } = req
  var merchantOrder 
  var payment
 
  const topic = query.topic || query.type 

  switch (topic) {
    case "payment" :
    const  paymentId : any  = query.id || query['data.id'];
   payment  = await  mercadopago.payment.findById(paymentId)
    merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
   break
   
   case "merchant_order" : 
   const orderId : any = query.id;
   merchantOrder = await mercadopago.merchant_orders.findById(orderId);
   break
  }

if(false){
  console.log(payment)
}

console.log(merchantOrder?.body?.items)
console.log(merchantOrder)
//  console.log(merchantOrder)

  res.send()
})  


//Ruta provisoria hasta que realicen la ruta real de post
// CheckoutRouter.post('/provisoria', async (req: Request<datosMerca>, res: Response) => {
// try {
//   let body = req.body 
//   let ingreso1 = body.validate.alldate.slice(0, 10).replace("-", '/').replace("-", '/')
//   let ingreso2 = body.validate.alldate2.slice(0, 10).replace("-", '/').replace("-", '/')
//   let trailer = body.validate.stay > 0 ?  1 : 0 

//   let data = {
//     "fecha_desde_reserva" : ingreso1,
//     "fecha_hasta_reserva" : ingreso2,
//     "cant_noches" : body.validate.total,
//     "total" : body.price,
//     "UsuarioId" : body.user.id, 
//     "CampingId" : body.campId,
//     "cantMayores" : body.validate.travellers,
//     "cantMenores" : body.validate.kids,
//     "extraRodante" : trailer,
//     "precioMayores" : body.mayores[0].precio,
//     "precioMenores" : body.menores[0].precio, 
//     "precioextraRodante" : body.validate.stay,
//   }

// console.log(data)
//   res.send("sisi")
// }catch(e) {
//   console.log("error", e)
//   res.status(400).json(e)
// }

// })



export default CheckoutRouter;
