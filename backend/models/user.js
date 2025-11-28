"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZUserInputPartial = exports.ZUserInput = exports.ZUser = void 0;
var zod_1 = require("zod");
exports.ZUser = zod_1.default.object({
    id: zod_1.default.uuid(),
    username: zod_1.default.string().default("username"),
    full_name: zod_1.default.string().default("no name"),
    bio: zod_1.default.string().nullable(),
    job_title: zod_1.default.string().nullable(),
    avatar_url: zod_1.default.string().nullable(),
    created_at: zod_1.default.date(),
    updated_at: zod_1.default.date(),
});
exports.ZUserInput = exports.ZUser.omit({
    created_at: true,
    updated_at: true,
    id: true,
});
exports.ZUserInputPartial = exports.ZUserInput.partial();
