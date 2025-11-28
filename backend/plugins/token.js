"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TokenManager_secret;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
exports.requireRole = requireRole;
var jose_1 = require("jose");
var TokenManager = /** @class */ (function () {
    function TokenManager(secret_str) {
        var _a;
        _TokenManager_secret.set(this, void 0);
        var src = secret_str !== null && secret_str !== void 0 ? secret_str : (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_SECRET;
        if (!src) {
            throw new Error("JWT_SECRET is not set and no secret was provided on construction");
        }
        if (src instanceof Uint8Array)
            __classPrivateFieldSet(this, _TokenManager_secret, src, "f");
        else
            __classPrivateFieldSet(this, _TokenManager_secret, fromBase64url(src), "f");
    }
    TokenManager.prototype.encode = function (claims) {
        return __awaiter(this, void 0, void 0, function () {
            var sub, roles, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sub = claims.sub, roles = claims.roles;
                        return [4 /*yield*/, new jose_1.SignJWT({ roles: roles })
                                .setProtectedHeader({ alg: "HS256", typ: "JWT" })
                                .setSubject(sub)
                                .setIssuedAt()
                                .setExpirationTime("1h")
                                .sign(__classPrivateFieldGet(this, _TokenManager_secret, "f"))];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, token];
                }
            });
        });
    };
    TokenManager.prototype.verify = function (encoded_token) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, jose_1.jwtVerify)(encoded_token, __classPrivateFieldGet(this, _TokenManager_secret, "f"), {
                            algorithms: ["HS256"],
                        })];
                    case 1:
                        payload = (_a.sent()).payload;
                        payload.roles = payload.roles; // Init roles in case it's missing
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    return TokenManager;
}());
exports.TokenManager = TokenManager;
_TokenManager_secret = new WeakMap();
function fromBase64url(source) {
    var base64 = source.replace(/-/g, "+").replace(/_/g, "/");
    var padded = base64 + "===".slice((base64.length + 3) % 4);
    if (typeof Buffer !== "undefined") {
        return new Uint8Array(Buffer.from(padded, "base64"));
    }
    var bin = atob(padded);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++)
        out[i] = bin.charCodeAt(i);
    return out;
}
function requireRole(role) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!req.claims) {
                res.status(401).send({ error: "missing_or_invalid_token" });
                return [2 /*return*/];
            }
            if (!req.claims.roles.includes(role)) {
                res.status(403).send({ error: "forbidden_missing_role", required: role });
                return [2 /*return*/];
            }
            return [2 /*return*/];
        });
    }); };
}
