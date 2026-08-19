import { NextRequest, NextResponse } from 'next/server';
import { productStore } from '@/lib/store';
import { validateProduct } from '@/lib/validations';
import { ProductType, ProductStatus } from '@/types/product';

// GET /api/products — returns all products
export async function GET() {
  try {
    const products = productStore.getAll();
    return NextResponse.json(products, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// POST /api/products — creates a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateProduct(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Dados inválidos.', errors: validation.errors },
        { status: 400 }
      );
    }

    const product = productStore.add({
      name: (body.name as string).trim(),
      type: body.type as ProductType,
      description: body.description ? (body.description as string).trim() : undefined,
      interestRate:
        body.interestRate !== undefined && body.interestRate !== ''
          ? Number(body.interestRate)
          : undefined,
      status: body.status as ProductStatus,
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
