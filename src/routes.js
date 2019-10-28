import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanoController from './app/controllers/PlanoController';
import StudentController from './app/controllers/StudentController';
import MatriculaController from './app/controllers/MatriculaController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.post('/planos', PlanoController.store);
routes.put('/planos', PlanoController.update);
routes.get('/planos', PlanoController.index);
routes.delete('/planos/:id', PlanoController.delete);

routes.post('/matriculas', MatriculaController.store);
routes.put('/matriculas', MatriculaController.update);
routes.delete('/matriculas/:id', MatriculaController.delete);
routes.get('/matriculas', MatriculaController.index);
routes.get('/matriculas/:id', MatriculaController.indexByPk);

export default routes;
