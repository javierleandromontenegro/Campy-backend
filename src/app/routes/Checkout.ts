import { Router, Request, Response } from 'express';
// import { registerUser } from '../services/Register.service';
import datosUsuario from '../types/datosUsuario';
import mercadopago from 'mercadopago';

const CheckoutRouter: Router = Router();
let accessToken : any = process.env.ACCESS_TOKEN; 
mercadopago.configure({
   access_token: accessToken
    ,
  });

CheckoutRouter.post('/checkout', async (req: Request<datosUsuario>, res: Response) => {
  try {
    let preference = {
        items : [
            {
                title : "El camping mas piola ",
                unit_price : 900,
                quantity : 1,
            }
        ]
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
