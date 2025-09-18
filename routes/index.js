const lockers = require("../controllers/lockers");

const router = require("express").Router();

router.get("/", lockers.checkState);
router.get("/:id", lockers.requestOpenLocker);
router.post("/:id", lockers.setPasswordAndLock);
module.exports = router;
