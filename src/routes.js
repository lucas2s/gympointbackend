import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import StudentController from './app/controllers/StudentController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import QuestionController from './app/controllers/QuestionController';
import AnswerController from './app/controllers/AnswerController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/help-orders', QuestionController.store);
routes.get('/students/:id/help-orders', QuestionController.indexByStudent);
routes.get('/students/:id', StudentController.indexById);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);
routes.delete('/students/:id', StudentController.delete);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.indexByPk);

routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);
routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:id', EnrollmentController.indexByPk);
routes.get('/help-orders', QuestionController.index);
routes.post('/help-orders/:id/answers', AnswerController.store);
routes.get('/help-orders/answers', AnswerController.index);

export default routes;
