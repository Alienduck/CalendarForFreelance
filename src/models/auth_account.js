"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZAuthAccountInput = exports.ZAuthAccount = void 0;
var zod_1 = require("zod");
exports.ZAuthAccount = zod_1.default.object({
    user_id: zod_1.default.uuid(),
    email: zod_1.default.email(),
    password_hash: zod_1.default.coerce.string(),
    create_at: zod_1.default.coerce.date(),
});
exports.ZAuthAccountInput = exports.ZAuthAccount.omit({
    user_id: true,
    created_at: true,
});
