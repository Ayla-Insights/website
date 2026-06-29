import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import teaserRouter from "./teaser";

const router: IRouter = Router();

router.use(healthRouter);
router.use(waitlistRouter);
router.use(teaserRouter);

export default router;
