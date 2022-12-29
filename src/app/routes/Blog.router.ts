import { Router, Request, Response } from 'express';
import { datosPost, datosComentario } from '../types/datosBlog';
import { postBlogComentario, postBlogCreate, getPostImagenes, getAllPost, getComentario, getPostPorId, updatePost, updateComentario } from '../services/Blog.service';
import { checkoutUser, /* checkoutAdmin */ } from '../services/CheckoutUser.service';

const BlogRouter: Router = Router();

BlogRouter.post('/create', checkoutUser, async (req: Request<{}, datosPost>, res: Response) => {

    try {
      res.status(200).json(await postBlogCreate(req.body))
    } catch(error: any) {
        console.log(error);
      res.status(error.error).json(error);
    }
});


BlogRouter.post('/comentario', checkoutUser, async (req: Request<{}, datosComentario>, res: Response) => {

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

BlogRouter.get('/', async (_req: Request, res: Response) => { 
  try {
    res.status(200).json(await getAllPost())
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/blog`});
  }
});

BlogRouter.get('/comentarios/:idPost', async (req: Request<{idPost: number}>, res: Response) => {
  const { idPost } = req.params;

  try {
    res.status(200).json(await getComentario(idPost))
  } catch(error) {
    console.log(error)
    res.status(404).json({error: `no se pudo en http://localhost/api/blog/comentarios/${idPost}`});
  }
});

BlogRouter.get('/:idPost', async (req: Request<{idPost: number}>, res: Response) => {
  const { idPost } = req.params;

  try {
    res.status(200).json(await getPostPorId(idPost))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/blog/${idPost}`});
  }
});

BlogRouter.put('/:idPost', async (req: Request<{idPost: number}>, res: Response) => {
  const { idPost } = req.params;

  try {
    res.status(200).json(await updatePost(req.body, idPost))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/blog/${idPost}`});
  }
});

BlogRouter.put('/comentarios/:idComentario', async (req: Request<{idComentario: number}>, res: Response) => {
  const { idComentario } = req.params;

  try {
    res.status(200).json(await updateComentario(req.body, idComentario))
  } catch {
    res.status(404).json({error: `no se pudo en http://localhost/api/blog/comentarios/${idComentario}`});
  }
});



export default BlogRouter;