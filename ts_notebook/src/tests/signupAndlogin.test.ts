import request from "supertest";
import { db } from "../configs/db.configs";
import app from "../app";

describe("Testing users signup and login", () => {

    // assign test user
    const testData : {username: string,password: string} = {
        username: "tester",
        password: "tester"
    }

    it("should return success when registering new user",async () => {
        const reqBody = await request(app).post("/register")
                        .send(testData);
        expect(reqBody.statusCode).toBe(200);
        expect(reqBody.body.success).toBeTruthy();
    });

    it("should return success along with token for user login", async () => {
        const reqBody = await request(app).post("/login")
                        .send(testData);
                        
        expect(reqBody.statusCode).toBe(200);
        expect(reqBody.body.success).toBeTruthy();
        expect(reqBody.body.token.length).toBeGreaterThan(0);
    });

    it("should return error when using wrong username", async () => {
        const reqBody = await request(app).post("/login")
                        .send({
                            username: "wrongusername",
                            password: testData.password
                        });
        expect(reqBody.statusCode).toBe(401);
        expect(reqBody.body.success).toBeFalsy();
        expect(reqBody.body.message).toBe("No User Found")
    });

    it("should return error when using wrong password", async () => {
        const reqBody = await request(app).post("/login")
                        .send({
                            username: testData.username,
                            password: "wrongpassword"
                        });
                        
        expect(reqBody.statusCode).toBe(401);
        expect(reqBody.body.success).toBeFalsy();
        expect(reqBody.body.message).toBe("Invalid Password")
    })

    // teardown of the database
    afterAll(() => {
        db.query('DELETE FROM users WHERE username = $1',[testData.username]);
        db.end();
    });
});

