const express = require("express")
const {
  getAllElections,
  getElection,
  vote,
  createElection,
  updateElection,
  deleteElection,
  addCandidate,
  deleteCandidate,
  updateCandidate,
} = require("../controller/election")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .get(protect, authorize("admin"), getAllElections)
  .post(protect, authorize("admin"), createElection)

router
  .route("/:id")
  .post(protect, authorize("admin"), addCandidate)
  .get(protect, authorize("admin"), getElection)
  .put(protect, authorize("admin"), updateElection)

router
  .route("/:id/:candidateId")
  .put(protect, authorize("admin"), updateCandidate)
  .delete(protect, authorize("admin"), deleteCandidate)

router.route("/:id/vote").post(vote)

router
  .route("/:id/:deleteQuery")
  .get(protect, authorize("admin"), deleteElection)

module.exports = router
