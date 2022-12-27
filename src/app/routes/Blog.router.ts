import { Router, Request, Response } from 'express';
import { datosPost, datosComentario } from '../types/datosBlog';
import { postBlogComentario, postBlogCreate, getPostImagenes } from '../services/Blog.service';

const BlogRouter: Router = Router();

BlogRouter.post('/create', async (req: Request<datosPost>, res: Response) => {

    try {
      res.status(200).json(await postBlogCreate(req.body))
    } catch(error: any) {
        console.log(error);
      res.status(error.error).json(error);
    }
});


BlogRouter.post('/comentario', async (req: Request<datosComentario>, res: Response) => {

    try {
      res.status(200).json(await postBlogComentario(req.body))
    } catch(error: any) {
        console.log(error);
      res.status(error.error).json(error);
    }
});

BlogRouter.get('/imagenes/:idPost', async (req: Request<{idPost: number}>, res: Response) => {

    const { idPost } = req.params;

    try {
      res.status(200).json(await getPostImagenes(idPost))
    } catch(error: any) {
        console.log(error);
      res.status(error.error).json(error);
    }
});



export default BlogRouter;