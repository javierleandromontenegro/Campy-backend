import { Router, Request, Response } from 'express';
// import { registerUser } from '../services/Register.service';
import datosMerca from '../types/datosUsuario';
import mercadopago from 'mercadopago';

const CheckoutRouter: Router = Router();
let accessToken : any = process.env.ACCESS_TOKEN; 
mercadopago.configure({
   access_token: accessToken
    ,
  });

CheckoutRouter.post('/', async (req: Request<datosMerca>, res: Response) => {
  try {
    const { titleM , priceM} = req.body 
    console.log(titleM , priceM)
    let preference : any = {
        items : [
            {
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
    }; 

    mercadopago.preferences.create(preference)
    .then(function(response){
console.log(response.body)
 
res.redirect(response.body.init_point)
    })

    console.log(req)
 
    
   
  } catch(e) {
    console.log("error", e)
    res.status(400).json(e)
  }
});

export default CheckoutRouter;
