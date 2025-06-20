const RoomModel = require('../models/policyModel');

const getPolicies = async (req, res) => {
    try {
        const policies = await RoomModel.getPolicies();
        res.json({
            policies
        });
    } catch (error) {
        console.error('Error in getPolicies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
    getPolicies
};