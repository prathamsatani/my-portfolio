/**
 * Admin Audit Logging
 * Tracks all administrative actions for security and compliance
 */

import { getSupabaseServiceRoleClient } from './supabaseServer';
import type { NextRequest } from 'next/server';

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'UPLOAD' 
  | 'LOGIN' 
  | 'LOGOUT';

export type ResourceType = 
  | 'profile' 
  | 'project' 
  | 'blog' 
  | 'experience' 
  | 'file';

/**
 * Log an admin action to the audit log
 * @param userId - ID of the admin user performing the action
 * @param action - Type of action being performed
 * @param resourceType - Type of resource being acted upon
 * @param resourceId - ID of the specific resource (optional)
 * @param request - Next.js request object to extract IP and user agent
 * @param metadata - Additional context about the action
 */
export async function logAdminAction(
  userId: string,
  action: AuditAction,
  resourceType: ResourceType,
  resourceId: string | null,
  request: NextRequest,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = getSupabaseServiceRoleClient();
    
    // Extract IP address (considering various proxy headers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const ipAddress = forwardedFor?.split(',')[0].trim() || 
                      realIp || 
                      cfConnectingIp || 
                      'unknown';
    
    // Extract user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Insert audit log (using service role to bypass RLS)
    const { error } = await supabase.from('admin_audit_logs').insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: metadata || null,
    });
    
    if (error) {
      // Log error but don't throw - audit logging failure shouldn't break the main operation
      console.error('[Audit Log] Failed to log action:', {
        error: error.message,
        userId,
        action,
        resourceType,
        resourceId,
      });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error('[Audit Log] Unexpected error:', error);
  }
}

/**
 * Get audit logs for a specific user
 * @param userId - ID of the user to get logs for
 * @param limit - Maximum number of logs to retrieve
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 100
) {
  const supabase = getSupabaseServiceRoleClient();
  
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[Audit Log] Failed to retrieve user logs:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get audit logs for a specific resource
 * @param resourceType - Type of resource
 * @param resourceId - ID of the resource
 */
export async function getResourceAuditLogs(
  resourceType: ResourceType,
  resourceId: string
) {
  const supabase = getSupabaseServiceRoleClient();
  
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[Audit Log] Failed to retrieve resource logs:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get recent audit logs
 * @param limit - Maximum number of logs to retrieve
 */
export async function getRecentAuditLogs(limit: number = 50) {
  const supabase = getSupabaseServiceRoleClient();
  
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[Audit Log] Failed to retrieve recent logs:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats() {
  const supabase = getSupabaseServiceRoleClient();
  
  // Get total count
  const { count: totalCount } = await supabase
    .from('admin_audit_logs')
    .select('*', { count: 'exact', head: true });
  
  // Get counts by action
  const { data: actionCounts } = await supabase
    .from('admin_audit_logs')
    .select('action');
  
  // Get counts by resource type
  const { data: resourceCounts } = await supabase
    .from('admin_audit_logs')
    .select('resource_type');
  
  // Calculate statistics
  const actionStats: Record<string, number> = {};
  actionCounts?.forEach(log => {
    actionStats[log.action] = (actionStats[log.action] || 0) + 1;
  });
  
  const resourceStats: Record<string, number> = {};
  resourceCounts?.forEach(log => {
    resourceStats[log.resource_type] = (resourceStats[log.resource_type] || 0) + 1;
  });
  
  return {
    totalLogs: totalCount || 0,
    actionStats,
    resourceStats,
  };
}
