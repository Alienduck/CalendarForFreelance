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
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_1 = require("@fastify/cookie");
var cors_1 = require("@fastify/cors");
var fastify_1 = require("fastify");
var fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
var db_js_1 = require("./db/db.js");
var user_js_1 = require("./models/user.js");
var mapErr_js_1 = require("./plugins/mapErr.js");
var token_js_1 = require("./plugins/token.js");
function start_web_server() {
    var _this = this;
    var web_server = (0, fastify_1.default)({
        logger: true,
    }).withTypeProvider();
    var token_manager = new token_js_1.TokenManager();
    web_server.register(cookie_1.default, {
        secret: process.env.JWT_SECRET,
        parseOptions: {},
    });
    web_server.register(cors_1.default, {
        origin: "https://localhost:1234",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    web_server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    web_server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    var repo = new db_js_1.Repository();
    web_server.get("/", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, { message: "Hello world !" }];
        });
    }); });
    web_server.addHook("preHandler", function (req) { return __awaiter(_this, void 0, void 0, function () {
        var token, claims, _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = req.cookies.access_token;
                    if (!token) {
                        req.claims = undefined;
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, token_manager.verify(token)];
                case 2:
                    claims = _a.sent();
                    req.claims = claims;
                    return [3 /*break*/, 4];
                case 3:
                    _1 = _a.sent();
                    req.claims = undefined;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    web_server.get("/claims", function (req) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!req.claims) {
                throw new Error("not authenticated");
            }
            return [2 /*return*/, req.claims];
        });
    }); });
    web_server.get("/user", function () { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, repo.getUsers()];
                case 1:
                    res = _a.sent();
                    if (!res) {
                        throw new Error("users not found");
                    }
                    return [2 /*return*/, { users: res, message: "All users:" }];
                case 2:
                    err_1 = _a.sent();
                    throw (0, mapErr_js_1.mapErr)(err_1);
                case 3: return [2 /*return*/];
            }
        });
    }); });
    web_server.post("/user", {
        schema: {
            body: user_js_1.ZUserInput,
        },
    }, function (req) { return __awaiter(_this, void 0, void 0, function () {
        var newUser, res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = req.body;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, repo.postUser(newUser)];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, { user: res, message: "New user created." }];
                case 3:
                    err_2 = _a.sent();
                    throw (0, mapErr_js_1.mapErr)(err_2);
                case 4: return [2 /*return*/];
            }
        });
    }); });
    web_server.setErrorHandler(function (error, request, reply) {
        request.log.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    });
    web_server.listen({ port: 1234, host: "0.0.0.0" }, function (err, address) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("listening on ".concat(address));
        }
    });
}
start_web_server();
