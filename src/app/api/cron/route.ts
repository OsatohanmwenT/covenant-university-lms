import { NextRequest, NextResponse } from "next/server";
import { sendDueDateReminders, sendOverdueReminders } from "@/lib/services/notifications";
import { calculateFines } from "@/lib/services/fines";

export const maxDuration = 300; // 5-minute maximum execution time

// This API route will handle scheduled jobs for the library management system
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.CRON_SECRET;

  // Validate the request is authorized
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the job type from the request
    const { jobType } = await request.json();

    switch (jobType) {
      case 'due-date-reminders':
        const dueDateResult = await sendDueDateReminders();
        return NextResponse.json(dueDateResult);

      case 'overdue-reminders':
        const overdueResult = await sendOverdueReminders();
        return NextResponse.json(overdueResult);

      case 'calculate-fines':
        const finesResult = await calculateFines();
        return NextResponse.json(finesResult);

      case 'all':
        // Run all jobs in sequence
        await sendDueDateReminders();
        await sendOverdueReminders();
        await calculateFines();
        return NextResponse.json({ success: true, message: 'All jobs completed' });

      default:
        return NextResponse.json(
          { error: 'Invalid job type. Must be one of: due-date-reminders, overdue-reminders, calculate-fines, all' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error running scheduled job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
