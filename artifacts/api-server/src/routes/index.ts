import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import authRouter from "./auth";
import socialRouter from "./social";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(socialRouter);
router.use(eventsRouter);

export default router;
