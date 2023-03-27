import { db } from "../configs/db.configs"
import logger from "../configs/Logger"

export interface INote {
    noteid? : number
    userid : number
    title: string
    note: string
    createdat: string
}

 export interface ItempNote {
    noteid: number,
    title?: string,
    note?: string,
    createdat?: string
}

export const GetAllNotes = async (userid: number) => {
    try {
        // get all Notes from db
        const foundAllNotes = await db.query('SELECT * FROM notes WHERE userid = $1;',[userid]);

        return {
            success: true,
            data: foundAllNotes.rows
        }

    } catch (err) {
        logger.error(err);
        
    }
}

export const GetNote = async (noteid: number,userid: number) => {
    try {
        // get the note from db
        const foundNote = await db.query('SELECT * FROM notes WHERE noteid = $1 AND userid = $2;',[noteid,userid]);

        if (foundNote.rowCount <= 0) {
            return {
                success: false,
                message: "Note Not Found"
            }
        }

        return {
            success: true,
            message: "Note Found",
            data: foundNote.rows[0]
        }
    } catch (err) {
        logger.error(err);
    }
}

export const AddNote = async (note: INote) => {
    try {
        // create a new note with db
        await db.query('INSERT INTO notes (userid,title,note,createdat) VALUES ($1,$2,$3,$4);',[note.userid,note.title,note.note,note.createdat]);

    } catch (err) {
        logger.error(err);
    }
}

export const ModifyNote = async (tempNote: ItempNote) => {
    try {
        // first get the note from db
        const foundNote = await db.query('SELECT * FROM notes WHERE noteid = $1;',[tempNote.noteid]);
        
        // err if note not found
        if (foundNote.rowCount <= 0) {
            return {
                success: false,
                message: "No Note Found"
            }
        }

        if (tempNote.title && tempNote.note && tempNote.createdat) {
            await db.query('UPDATE notes SET title = $1, note = $2, createdat = $3 WHERE noteid = $4;',[tempNote.title,tempNote.note,tempNote.createdat,tempNote.noteid]);
        } else {
            if (tempNote.title && tempNote.note) {
                await db.query('UPDATE notes SET title = $1, note = $2 WHERE noteid = $3;',[tempNote.title,tempNote.note,tempNote.noteid]);
            } else if (tempNote.title && tempNote.createdat) {
                await db.query('UPDATE notes SET title = $1, createdat = $3 WHERE noteid = $3;',[tempNote.title,tempNote.createdat,tempNote.noteid]);
            } else if (tempNote.note && tempNote.createdat) {
                await db.query('UPDATE notes SET note = $1, createdat = $2 WHERE noteid = $3;',[tempNote.note,tempNote.createdat,tempNote.noteid]);
            } else {
                if (tempNote.title) {
                    await db.query('UPDATE notes SET title = $1 WHERE noteid = $2;',[tempNote.title,tempNote.noteid]);
                } else if (tempNote.note) {
                    await db.query('UPDATE notes SET note = $1 WHERE noteid = $2;',[tempNote.note,tempNote.noteid]);
                } else if (tempNote.createdat) {
                    await db.query('UPDATE notes SET createdat = $1 WHERE noteid = $2;',[tempNote.createdat,tempNote.noteid]);
                }
            }
        }

        return {
            success: true,
            message: `Successfully modified note : ${tempNote.noteid}`
        }
    } catch (err) {
        logger.info("Error found");
        logger.error(err);
    }
}


export const DeleteNote = async (noteid: number) => {
    try {
        // remove the note by db
        const foundNote = await db.query('SELECT * FROM notes WHERE noteid = $1;',[noteid]);

        // note not found
        if (foundNote.rowCount <= 0) {
            return {
                success: false,
                message: "Note Not Found"
            }
        }

        await db.query('DELETE FROM notes WHERE notes.noteid = $1;',[noteid]);

        return {
            success: true,
            message: `Successfully Removed Note: ${noteid}`
        }
    } catch (err) {
        logger.error(err);
    }
}

export const DeleteAllNotes = async (userid: number) => {
    try {

        await db.query('DELETE FROM notes WHERE notes.userid = $1;',[userid]);

    } catch (err) {
        logger.error(err);
    }
}




