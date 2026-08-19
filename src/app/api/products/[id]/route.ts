import { NextRequest, NextResponse } from 'next/server';
import { productStore } from '@/lib/store';
import { validateProduct } from '@/lib/validations';
import { ProductType, ProductStatus } from '@/types/product';

type RouteContext = { params: { id: string } };

// GET /api/products/[id] — returns a single product
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const product = productStore.getById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PUT /api/products/[id] — updates a product
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const existing = productStore.getById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    const body = await request.json();
    const validation = validateProduct(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Dados inválidos.', errors: validation.errors },
        { status: 400 },
      );
    }

    const updated = productStore.update(params.id, {
      name: (body.name as string).trim(),
      type: body.type as ProductType,
      description: body.description ? (body.description as string).trim() : undefined,
      interestRate:
        body.interestRate !== undefined && body.interestRate !== ''
          ? Number(body.interestRate)
          : undefined,
      status: body.status as ProductStatus,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

// DELETE /api/products/[id] — removes a product
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const existing = productStore.getById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    productStore.remove(params.id);
    return NextResponse.json({ message: 'Produto excluído com sucesso.' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
