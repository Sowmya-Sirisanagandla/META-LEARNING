"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = require("../src/db");
describe("User API (Doctor & Patient)", () => {
    const doctorEmail = `doc${Date.now()}@example.com`;
    const patientEmail = `pat${Date.now()}@example.com`;
    const password = "password123";
    // Cleanup after tests
    afterAll(async () => {
        const users = await db_1.pool.query("SELECT id FROM users WHERE email = $1 OR email = $2", [doctorEmail, patientEmail]);
        for (const user of users.rows) {
            await db_1.pool.query("DELETE FROM doctors WHERE user_id = $1", [user.id]);
            await db_1.pool.query("DELETE FROM users WHERE id = $1", [user.id]);
        }
        await db_1.pool.end();
    }, 30000); // 30s timeout in case DB operations take time
    // Doctor signup & login
    it("should sign up and login a doctor", async () => {
        // Signup
        const signupRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/user/signup")
            .send({
            name: "Test Doctor",
            email: doctorEmail,
            password,
            role: "doctor",
            specialization: "Cardiology",
            license_number: "LIC123",
            hospital_name: "Test Hospital",
        });
        expect(signupRes.status).toBe(201);
        expect(signupRes.body.user.email).toBe(doctorEmail);
        // Login
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/user/login")
            .send({ email: doctorEmail, password });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.user.role).toBe("doctor");
        expect(loginRes.body).toHaveProperty("token");
    });
    // Patient signup & login
    it("should sign up and login a patient", async () => {
        // Signup
        const signupRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/user/signup")
            .send({
            name: "Test Patient",
            email: patientEmail,
            password,
            role: "patient",
        });
        expect(signupRes.status).toBe(201);
        expect(signupRes.body.user.email).toBe(patientEmail);
        // Login
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/user/login")
            .send({ email: patientEmail, password });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.user.role).toBe("patient");
        expect(loginRes.body).toHaveProperty("token");
    });
});
