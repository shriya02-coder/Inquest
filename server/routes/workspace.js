const express = require('express');

const router = express.Router();

const isAuth = require('../middlewares/is-auth')

const workspaceController = require('../controllers/workspace');

router.post('/createWorkspace', workspaceController.createWorkspace);
router.post('/getWorkspaces', isAuth, workspaceController.getWorkspaces);
router.post('/joinWorkspace', workspaceController.joinWorkspace);
router.post('/getWorkspace', workspaceController.getWorkspace);
router.delete('/deleteWorkspace', workspaceController.deleteWorkspace);
router.post('/createDraft', workspaceController.createDraft);
router.post('/getDrafts', workspaceController.getDrafts);
router.post('/getDraft', workspaceController.getDraft);
router.post('/getReminders', workspaceController.getReminders);
router.post('/getCollaborators', workspaceController.getCollaborators);
// router.post('/submitDraft', workspaceController.submitDraft);

module.exports = router; 