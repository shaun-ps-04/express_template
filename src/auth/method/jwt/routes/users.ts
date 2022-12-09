import express from "express";
const router = express.Router();

import { User as UserSchema } from "../../../schemas/user";
import { authenticateToken } from "../../../middleware/auth";
import { 
    isAdmin,
    isSuperuser, 
    isOwnerOrAdmin, 
    isOwnerOrSuperuser,
} from "../../../permissions/auth";
import { ERRORS, MSG_TYPES } from "../../../utils/logging";
import { Request } from "../types";

// middleware that is specific to this router
// router.use((req: express.Request, res, next) => {
//     console.log("Request:", req);
//     next()
// })

// ========== GET ALL USERS ==========
router.get("/", authenticateToken, async (req: Request, res: express.Response) => {
    const { user } = req;

    try {
        if (isAdmin(user)) {
            const allUsers = await UserSchema.find();
            return res.status(200).json(allUsers);
        } else {
            const allUsers = await UserSchema.find({}, "username createdAt");
            return res.status(200).json(allUsers);
        }
    } catch(e: any) {
        console.log(e)
        return res.status(500).json(e.errors);
    }
});

// ========== GET USER ==========
router.get("/:id", authenticateToken, async (req: Request, res: express.Response) => {
    const { user } = req;
    const userId = req.params.id;

    try {
        if (isOwnerOrAdmin(user, userId)) {
            const userObj = await UserSchema.findById(userId);
            return res.status(200).json(userObj);
        } else {
            const userObj = await UserSchema.findById(userId, "username createdAt");
            return res.status(200).json(userObj);
        }
    } catch(e: any) {
        console.log(e)
        return res.status(500).json(e.errors);
    }
});

// ========== UPDATE USER ==========
router.patch("/:id", authenticateToken, async (req: Request, res: express.Response) => {
    const { user, body } = req;
    const userId = req.params.id;

    if (!isOwnerOrAdmin(user, userId)) {
        return res.status(403).json({ [MSG_TYPES.ERROR]: ERRORS.NOT_ADMIN_OR_OWNER});
    }

    if (body.hasOwnProperty("role") && !isSuperuser(user)) {
        return res.status(403).json({ [MSG_TYPES.ERROR]: ERRORS.NOT_SUPERUSER});
    }

    if (body.hasOwnProperty("verified") && !isAdmin(user)) {
        return res.status(403).json({ [MSG_TYPES.ERROR]: ERRORS.NOT_ADMIN});
    }

    try {
        const userObj = await UserSchema.findOneAndUpdate(
            { username: user?.username },
            body,
            { new: true },
        );
        return res.status(200).json(userObj);
    } catch(e: any) {
        console.log(e)
        return res.status(500).json(e.errors);
    }
});

// ========== DELETE USER ==========
router.delete("/:id", authenticateToken, async (req: Request, res: express.Response) => {
    const { user } = req;
    const userId = req.params.id;

    if (!isOwnerOrAdmin(user, userId)) {
        return res.status(403).send({ [MSG_TYPES.ERROR]: ERRORS.NOT_ADMIN_OR_OWNER });
    }

    try {
        const userObj = await UserSchema.findOneAndDelete({ username: user?.username });
        if (userObj === null) {
            return res.status(400).json(
                { [MSG_TYPES.ERROR]: `The account with username ${user?.username} does not exist` }
            );
        }
        return res.status(200).json({ [MSG_TYPES.SUCCESS]: "Your account has successfully been deleted" });
    } catch(e: any) {
        console.log(e)
        return res.status(500).json(e.errors);
    }
});

export default router;