import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get recent logs and reports to generate notifications
    const [recentLogs, recentReports, recentRfps] = await Promise.all([
      db.collection('agent_logs').find({}).sort({ timestamp: -1 }).limit(5).toArray(),
      db.collection('agent_reports').find({}).sort({ timestamp: -1 }).limit(3).toArray(),
      db.collection('uploaded_rfps').find({}).sort({ uploadedAt: -1 }).limit(3).toArray(),
    ]);

    const notifications: any[] = [];

    // Add notifications for recent uploads
    recentRfps.forEach((rfp: any, index: number) => {
      const uploadTime = new Date(rfp.uploadedAt);
      const now = new Date();
      const hoursAgo = Math.floor((now.getTime() - uploadTime.getTime()) / (1000 * 60 * 60));
      
      notifications.push({
        id: `rfp-${rfp._id}`,
        title: 'New RFP Uploaded',
        message: `${rfp.title} - Ready for processing`,
        time: hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`,
        unread: index === 0,
        type: 'rfp',
        link: '/catalog',
      });
    });

    // Add notifications for recent processing
    recentReports.forEach((report: any, index: number) => {
      const processTime = new Date(report.timestamp);
      const now = new Date();
      const hoursAgo = Math.floor((now.getTime() - processTime.getTime()) / (1000 * 60 * 60));
      
      const decision = report.data?.decision || 'Unknown';
      const confidence = report.data?.confidence || 0;
      
      notifications.push({
        id: `report-${report._id}`,
        title: `${report.agent.charAt(0).toUpperCase() + report.agent.slice(1)} Agent Complete`,
        message: `${report.rfpId} - Decision: ${decision} (${confidence}% confidence)`,
        time: hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`,
        unread: index < 2,
        type: 'report',
        link: '/reports',
      });
    });

    // Add notifications for recent agent executions
    recentLogs.forEach((log: any, index: number) => {
      if (index < 2) { // Only show first 2 to avoid cluttering
        const logTime = new Date(log.timestamp);
        const now = new Date();
        const hoursAgo = Math.floor((now.getTime() - logTime.getTime()) / (1000 * 60 * 60));
        
        notifications.push({
          id: `log-${log._id}`,
          title: `${log.agent.charAt(0).toUpperCase() + log.agent.slice(1)} Agent Executed`,
          message: `${log.rfpId} - Status: ${log.data?.status || 'Success'}`,
          time: hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`,
          unread: false,
          type: 'log',
          link: '/logs',
        });
      }
    });

    // Sort by most recent first
    notifications.sort((a, b) => {
      const aTime = a.time === 'Just now' ? 0 : parseInt(a.time);
      const bTime = b.time === 'Just now' ? 0 : parseInt(b.time);
      return aTime - bTime;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    return NextResponse.json({
      notifications: notifications.slice(0, 10), // Limit to 10 most recent
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    // Return default notifications if DB fails
    return NextResponse.json({
      notifications: [
        { id: 1, title: 'Welcome to EY RFP Copilot', message: 'Your AI powered RFP management system is ready', time: 'Just now', unread: true, type: 'system', link: '/dashboard' },
      ],
      unreadCount: 1,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, action } = body;

    if (action === 'markRead') {
      // In a real app, you'd update a notifications collection
      // For now, we'll just return success
      return NextResponse.json({ success: true });
    }

    if (action === 'markAllRead') {
      // Mark all as read
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
