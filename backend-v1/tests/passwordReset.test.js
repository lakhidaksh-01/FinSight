import { jest } from "@jest/globals";

import request from "supertest";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import bcrypt from "bcryptjs";

// Mock email service BEFORE importing app.js
jest.unstable_mockModule(
  "../utils/emailService.js",
  () => ({
    sendPasswordResetOtp: jest.fn()
  })
);

// Import app only after the mock is registered
const { default: app } = await import(
  "../app.js"
);

const {
  sendPasswordResetOtp
} = await import(
  "../utils/emailService.js"
);

describe("Password Reset API", () => {
  const email =
    `reset${Date.now()}@example.com`;

  const oldPassword =
    "OldPassword123";

  const newPassword =
    "NewPassword123";

  beforeAll(async () => {
    await User.create({
      email,
      password: await bcrypt.hash(
        oldPassword,
        10
      )
    });
  });

  afterAll(async () => {
    await User.deleteOne({
      email
    });

    await PasswordReset.deleteMany({
      email
    });
  });

  beforeEach(() => {
    sendPasswordResetOtp.mockClear();

    return PasswordReset.deleteMany({
      email
    });
  });

  test(
    "should send password reset OTP",
    async () => {
      const response =
        await request(app)
          .post(
            "/api/auth/forgot-password"
          )
          .send({
            email
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.message
      ).toContain(
        "OTP has been sent"
      );

      expect(
        sendPasswordResetOtp
      ).toHaveBeenCalledTimes(1);

      expect(
        sendPasswordResetOtp
      ).toHaveBeenCalledWith(
        email,
        expect.any(String)
      );

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      expect(otp).toMatch(
        /^[0-9]{6}$/
      );

      const resetRequest =
        await PasswordReset.findOne({
          email
        });

      expect(
        resetRequest
      ).not.toBeNull();

      expect(
        resetRequest.otpHash
      ).not.toBe(otp);

      expect(
        resetRequest.expiresAt
      ).toBeInstanceOf(Date);

      expect(
        resetRequest.verified
      ).toBe(false);
    }
  );

  test(
    "should reject an incorrect OTP",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const response =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp: "000000"
          });

      expect(
        response.statusCode
      ).toBe(400);

      expect(
        response.body.success
      ).toBe(false);
    }
  );

  test(
    "should verify the correct OTP",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      const response =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.message
      ).toBe(
        "OTP verified successfully"
      );

      expect(
        response.body.data
      ).toHaveProperty(
        "resetToken"
      );

      expect(
        response.body.data.resetToken
      ).toBeTruthy();

      const resetRequest =
        await PasswordReset.findOne({
          email
        });

      expect(
        resetRequest
      ).not.toBeNull();

      expect(
        resetRequest.verified
      ).toBe(true);

      expect(
        resetRequest.resetTokenHash
      ).toBeTruthy();

      expect(
        resetRequest.resetTokenExpiresAt
      ).toBeInstanceOf(Date);
    }
  );

  test(
    "should reject an already used OTP",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      await request(app)
        .post(
          "/api/auth/verify-otp"
        )
        .send({
          email,
          otp
        });

      const response =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp
          });

      expect(
        response.statusCode
      ).toBe(400);

      expect(
        response.body.success
      ).toBe(false);
    }
  );

  test(
    "should reject an expired OTP",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      await PasswordReset.updateOne(
        { email },
        {
          expiresAt: new Date(
            Date.now() - 1000
          )
        }
      );

      const response =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp
          });

      expect(
        response.statusCode
      ).toBe(400);

      expect(
        response.body.success
      ).toBe(false);
    }
  );

  test(
    "should reset the password with a valid reset token",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      const verifyResponse =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp
          });

      expect(
        verifyResponse.statusCode
      ).toBe(200);

      const resetToken =
        verifyResponse.body.data
          .resetToken;

      const response =
        await request(app)
          .post(
            "/api/auth/reset-password"
          )
          .send({
            email,
            resetToken,
            newPassword
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.message
      ).toBe(
        "Password reset successfully"
      );
    }
  );

  test(
    "should reject login with the old password",
    async () => {
      const response =
        await request(app)
          .post(
            "/api/auth/login"
          )
          .send({
            email,
            password: oldPassword
          });

      expect(
        response.statusCode
      ).toBe(401);

      expect(
        response.body.success
      ).toBe(false);
    }
  );

  test(
    "should allow login with the new password",
    async () => {
      const response =
        await request(app)
          .post(
            "/api/auth/login"
          )
          .send({
            email,
            password: newPassword
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.data
      ).toHaveProperty(
        "token"
      );
    }
  );

  test(
    "should not allow the reset token to be reused",
    async () => {
      await request(app)
        .post(
          "/api/auth/forgot-password"
        )
        .send({
          email
        });

      const otp =
        sendPasswordResetOtp.mock
          .calls[0][1];

      const verifyResponse =
        await request(app)
          .post(
            "/api/auth/verify-otp"
          )
          .send({
            email,
            otp
          });

      expect(
        verifyResponse.statusCode
      ).toBe(200);

      const resetToken =
        verifyResponse.body.data
          .resetToken;

      const firstResetResponse =
        await request(app)
          .post(
            "/api/auth/reset-password"
          )
          .send({
            email,
            resetToken,
            newPassword:
              "AnotherPassword123"
          });

      expect(
        firstResetResponse.statusCode
      ).toBe(200);

      const secondResetResponse =
        await request(app)
          .post(
            "/api/auth/reset-password"
          )
          .send({
            email,
            resetToken,
            newPassword:
              "AnotherPassword456"
          });

      expect(
        secondResetResponse.statusCode
      ).toBe(400);

      expect(
        secondResetResponse.body.success
      ).toBe(false);
    }
  );

  test(
    "should not reveal whether an email exists",
    async () => {
      const response =
        await request(app)
          .post(
            "/api/auth/forgot-password"
          )
          .send({
            email:
              "doesnotexist@example.com"
          });

      expect(
        response.statusCode
      ).toBe(200);

      expect(
        response.body.success
      ).toBe(true);

      expect(
        response.body.message
      ).toContain(
        "If an account with that email exists"
      );

      expect(
        sendPasswordResetOtp
      ).not.toHaveBeenCalled();
    }
  );
});
