import db from './db'; 

//using table audit_logs
export async function logAuditEvent(userId, actionType, actionStatus, description, ipAddress) {
    try {
      const db = await getDb();
      await db.execute(`
        INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `, [
        userId, 
        actionType, 
        actionStatus, 
        description, 
        ipAddress
      ]);
    } catch (error) {
      console.error('Failed to log audit event:', {
        userId,
        actionType,
        actionStatus,
        description,
        ipAddress,
        error: error.message,
      });
    }
  }