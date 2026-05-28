const jwt = require('jsonwebtoken');
const { config } = require('../config');

module.exports = (requiredRole) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '未提供认证令牌' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // 检查角色权限
        if (requiredRole && decoded.role !== requiredRole) {
            return res.status(403).json({ error: '权限不足' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: '令牌已过期' });
        }
        return res.status(401).json({ error: '无效的令牌' });
    }
};