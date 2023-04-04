import request from "supertest";
import app from "../app";

describe("Testing the rest api is stable",() => {
    it("Should get the success body json", async () => {
        const reqBody = await request(app).get("/");
        expect(reqBody.statusCode).toBe(200);
        expect(reqBody.body.success).toBeTruthy();
    })
});




