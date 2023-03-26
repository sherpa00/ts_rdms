
import { Request,Response, NextFunction } from "express";
import logger from "../configs/Logger";
import * as NoteService from "../services/note.service";
import { StatusCodes } from "http-status-codes";

export const getAllNotes = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the auth userid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {userid} : any = req.user;
        
        const getAllNotesInfo = await NoteService.GetAllNotes(userid);

        return res.status(StatusCodes.OK).json({
            ...getAllNotesInfo
        });

    } catch (err) {
        logger.error(err);
        next(err);
        
    }
}

export const getOneNote = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the auth userid and noteid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {userid} : any = req.user;
        const noteid : number = parseInt(req.params.id);
        
        const getNoteInfo = await NoteService.GetNote(noteid,userid);

        if (getNoteInfo?.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                ...getNoteInfo
            })
        }

        return res.status(StatusCodes.OK).json({
            ...getNoteInfo
        })
    } catch (err) {
        logger.error(err);
        next(err);
        
    }
}

export const addOneNote = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the auth userid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {userid}: any = req.user;
        const authenticatedUserid : number = userid;

        const nowDate : string = new Date().toUTCString();

        const newNoteTitle : string = req.body.title;

        const newNote : string = req.body.note;

        const tempNote = {
            userid: authenticatedUserid,
            title: newNoteTitle,
            note: newNote,
            createdat: nowDate
        }

        // create new note
        await NoteService.AddNote(tempNote);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Successfully create a new note: ${newNoteTitle}`
        });

    } catch (err) {
        logger.error(err);
        next(err);
    }
}

export const changeNote = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the noteid
        const noteid : number = parseInt(req.params.id);

        const tempNote : NoteService.ItempNote = {
            noteid: noteid
        }

        if (req.body.title) {
            tempNote.title = req.body.title
        }

        if (req.body.note) {
            tempNote.note = req.body.note;
        }

        if (req.body.createdat) {
            tempNote.createdat = req.body.createdat;
        }

        const modifyNoteInfo = await NoteService.ModifyNote(tempNote);

        if (!modifyNoteInfo?.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                ...modifyNoteInfo
            })
        }

        return res.status(StatusCodes.OK).json({
            ...modifyNoteInfo
        });

    } catch (err) {
        logger.error(err);
        next(err);
    }
}

export const removeOneNote = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the noteid
        const noteid : number = parseInt(req.params.id);

        const deleteNoteInfo = await NoteService.DeleteNote(noteid);

        if (deleteNoteInfo?.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                ...deleteNoteInfo
            })
        }

        return res.status(StatusCodes.OK).json({
            ...deleteNoteInfo
        });

    } catch (err) {
        logger.error(err);
        next(err);
    }
}

export const removeAllNotes = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the auth userid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {userid} : any = req.user;

        // delete all notes
        await NoteService.DeleteAllNotes(userid);

        return res.status(StatusCodes.OK).json({
            success : true,
            message: "Successfully Removed all notes"
        });
        
    } catch (err) {
        logger.error(err);
        next(err);
    }
}