import { NextResponse } from 'next/server';
import { 
  salaryCapRules, 
  dpRules, 
  allocationMoney, 
  u22Rules,
  austinFCCompliance,
  canSignPlayer,
  getCapSpaceWithAllocation
} from '@/data/rules';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'salary-cap') {
    return NextResponse.json(salaryCapRules);
  }

  if (type === 'dp') {
    return NextResponse.json(dpRules);
  }

  if (type === 'allocation') {
    return NextResponse.json(allocationMoney);
  }

  if (type === 'u22') {
    return NextResponse.json(u22Rules);
  }

  if (type === 'compliance') {
    return NextResponse.json({
      ...austinFCCompliance,
      totalCapSpace: getCapSpaceWithAllocation(),
    });
  }

  if (type === 'all') {
    return NextResponse.json({
      salaryCapRules,
      dpRules,
      allocationMoney,
      u22Rules,
      compliance: austinFCCompliance,
    });
  }

  return NextResponse.json({
    endpoints: [
      '/api/rules?type=salary-cap',
      '/api/rules?type=dp',
      '/api/rules?type=allocation',
      '/api/rules?type=u22',
      '/api/rules?type=compliance',
      '/api/rules?type=all',
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salary, isInternational, age, designation } = body;

    if (!salary) {
      return NextResponse.json({ error: 'Salary is required' }, { status: 400 });
    }

    const result = canSignPlayer({
      salary,
      isInternational,
      age,
      designation,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}



