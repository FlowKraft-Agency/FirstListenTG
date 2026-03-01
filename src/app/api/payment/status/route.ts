import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ status: transaction.status });
    } catch (error) {
        console.error("Error fetching transaction status:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
