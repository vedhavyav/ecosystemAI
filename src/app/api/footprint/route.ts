import { NextResponse } from 'next/server';
import { calculateFootprint } from '@/engine/calculations';
import { generateRecommendations } from '@/engine/recommendations';
import type { UserInputs } from '@/engine/types';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const inputs: UserInputs = await request.json();

    if (!inputs) {
      return NextResponse.json({ error: 'Missing inputs' }, { status: 400 });
    }

    // Step 1: Calculate the footprint
    const result = await calculateFootprint(inputs);

    // Step 2: Generate localized recommendations
    const recommendations = await generateRecommendations(inputs, result);

    // Return combined payload
    return NextResponse.json({ result, recommendations });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
