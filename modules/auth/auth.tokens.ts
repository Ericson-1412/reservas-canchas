import { SignJWT, jwtVerify } from "jose";

import { authConfig } from "@/lib/config/env";

import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  AUTH_AUDIENCE,
  AUTH_ISSUER,
} from "@/modules/auth/auth.config";

import type { AuthUser } from "@/modules/auth/auth.types";

const encoder = new TextEncoder();

const accessSecret = encoder.encode(
  authConfig.accessTokenSecret
);

const refreshSecret = encoder.encode(
  authConfig.refreshTokenSecret
);

export async function createAccessToken(
  user: AuthUser
): Promise<string> {
  return new SignJWT({
    role: user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(String(user.id))
    .setIssuer(AUTH_ISSUER)
    .setAudience(AUTH_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
    .sign(accessSecret);
}

export async function createRefreshToken(
  user: AuthUser
): Promise<string> {
  return new SignJWT({
    role: user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(String(user.id))
    .setIssuer(AUTH_ISSUER)
    .setAudience(AUTH_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL}s`)
    .sign(refreshSecret);
}

export async function verifyAccessToken(
  token: string
): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      accessSecret,
      {
        issuer: AUTH_ISSUER,
        audience: AUTH_AUDIENCE,
        algorithms: ["HS256"],
      }
    );

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}