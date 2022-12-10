import { Router } from 'express';
import campingsRouter from './Campings.router';
import paisRouter from './Paises.router';
import provinciasRouter from './Provincia.route';
import localidadesRouter from './Localidades.router';
import registerRouter from './register.router';
// Importar todos los routers;

const router: Router = Router();

// 'http://localhost/api/provincias'
router.use('/paises', paisRouter);
router.use('/provincias', provinciasRouter);
router.use('/localidades', localidadesRouter);
router.use('/campings', campingsRouter);
router.use('/register', registerRouter);
// Configurar los routers

export default router;