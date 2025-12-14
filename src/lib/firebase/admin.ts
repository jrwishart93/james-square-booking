import { getApp, getApps } from "firebase-admin/app";

import "../firebase-admin";

export const adminApp = getApps()[0] ?? getApp();
