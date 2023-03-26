import express, {IRouter} from "express";
import * as NoteController from "../controllers/note.controller";

const router : IRouter = express.Router();

router.get("/",NoteController.getAllNotes);
router.get("/:id",NoteController.getOneNote);
router.post("/",NoteController.addOneNote);
router.patch('/:id',NoteController.changeNote);
router.delete('/:id',NoteController.removeOneNote);
router.delete("/remove/all",NoteController.removeAllNotes)

export {router as NoteRouter};