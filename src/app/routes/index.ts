import { Router } from 'express';
import CampingsRouter from './Campings.router';
import PaisRouter from './Paises.router';
import ProvinciasRouter from './Provincia.route';
import LocalidadesRouter from './Localidades.router';
import RegisterRouter from './Register.router';
import LoginRouter from './Login.router';
import UsuariosRouter from './Usuario.router';
import ConfirmUserRouter from './ConfirmUser.router';
import ReservasRouter from './Reservas.router';
import ReviewsRouter from './Reviews.router';
import CheckoutRouter from './Checkout';
import BlogRouter from './Blog.router';
// Importar todos los routers;

const router: Router = Router();

// 'http://localhost/api/provincias'
router.use('/paises', PaisRouter);
router.use('/provincias', ProvinciasRouter);
router.use('/localidades', LocalidadesRouter);
router.use('/campings', CampingsRouter);
router.use('/register', RegisterRouter);
router.use('/login', LoginRouter);
router.use('/usuarios', UsuariosRouter);
router.use('/confirm', ConfirmUserRouter);
router.use('/reservas', ReservasRouter);
router.use('/reviews', ReviewsRouter);
router.use('/checkout', CheckoutRouter)
router.use('/blog', BlogRouter);
// Configurar los routers

export default router;